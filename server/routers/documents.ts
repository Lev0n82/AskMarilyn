import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { documents, documentChunks, widgets } from "../../drizzle/schema";
import { storagePut } from "../storage";

// Simple text chunking function
function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

export const documentRouter = router({
  list: protectedProcedure
    .input(z.object({ widgetId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];
      // Verify widget ownership
      const widget = await db.select().from(widgets).where(eq(widgets.id, input.widgetId)).limit(1);
      if (!widget[0] || widget[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Widget not found" });
      }
      return db.select().from(documents).where(eq(documents.widgetId, input.widgetId)).orderBy(desc(documents.createdAt));
    }),

  upload: protectedProcedure
    .input(z.object({
      widgetId: z.number(),
      filename: z.string(),
      mimeType: z.string(),
      content: z.string(), // base64 encoded
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify widget ownership
      const widget = await db.select().from(widgets).where(eq(widgets.id, input.widgetId)).limit(1);
      if (!widget[0] || widget[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Widget not found" });
      }

      // Upload file to storage
      const buffer = Buffer.from(input.content, "base64");
      const fileKey = `docs/${ctx.user.id}/${input.widgetId}/${Date.now()}-${input.filename}`;
      const { key, url } = await storagePut(fileKey, buffer, input.mimeType);

      // Insert document record
      await db.insert(documents).values({
        userId: ctx.user.id,
        widgetId: input.widgetId,
        filename: input.filename,
        mimeType: input.mimeType,
        fileKey: key,
        fileUrl: url,
        sizeBytes: buffer.length,
        status: "processing",
      });

      const docResult = await db.select().from(documents).where(eq(documents.fileKey, key)).limit(1);
      const doc = docResult[0];

      // Extract text content (simplified - in production would use proper parsers)
      let textContent = "";
      if (input.mimeType === "text/plain" || input.mimeType === "text/csv") {
        textContent = buffer.toString("utf-8");
      } else {
        // For PDF/DOCX, store as-is and mark for async processing
        textContent = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
      }

      if (textContent.trim().length > 0) {
        // Chunk the text
        const chunks = chunkText(textContent);

        // Store chunks
        for (let i = 0; i < chunks.length; i++) {
          await db.insert(documentChunks).values({
            documentId: doc.id,
            widgetId: input.widgetId,
            content: chunks[i],
            chunkIndex: i,
            metadata: { filename: input.filename, chunkIndex: String(i) },
          });
        }

        // Update document status
        await db.update(documents).set({
          status: "ready",
          chunkCount: chunks.length,
        }).where(eq(documents.id, doc.id));
      } else {
        await db.update(documents).set({ status: "ready", chunkCount: 0 }).where(eq(documents.id, doc.id));
      }

      return { id: doc.id, filename: doc.filename, status: "ready" };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const doc = await db.select().from(documents).where(eq(documents.id, input.id)).limit(1);
      if (!doc[0] || doc[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }

      // Delete chunks first
      await db.delete(documentChunks).where(eq(documentChunks.documentId, input.id));
      // Delete document
      await db.delete(documents).where(eq(documents.id, input.id));

      return { success: true };
    }),

  // Search chunks for RAG retrieval (simple keyword matching for MVP)
  search: protectedProcedure
    .input(z.object({
      widgetId: z.number(),
      query: z.string(),
      limit: z.number().default(5),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const allChunks = await db.select().from(documentChunks).where(eq(documentChunks.widgetId, input.widgetId));

      // Simple keyword relevance scoring for MVP
      const queryWords = input.query.toLowerCase().split(/\s+/);
      const scored = allChunks.map(chunk => {
        const content = chunk.content.toLowerCase();
        const score = queryWords.reduce((acc, word) => {
          return acc + (content.includes(word) ? 1 : 0);
        }, 0);
        return { ...chunk, score };
      });

      return scored
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, input.limit)
        .map(c => ({ id: c.id, content: c.content, score: c.score, metadata: c.metadata }));
    }),
});
