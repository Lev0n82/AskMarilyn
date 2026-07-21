import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Mock the _core/llm module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    id: "test-id",
    created: Date.now(),
    model: "claude-sonnet-4-20250514",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: "Hello! I'm Hansen AI. How can I help you today?",
        },
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
  }),
}));

describe("Demo Chat API", () => {
  let app: express.Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    // Import the widget API router after mocking
    const { createWidgetApiRouter } = await import("./widgetApi");
    app.use(createWidgetApiRouter());
  });

  it("POST /api/widget/demo/chat returns AI response", async () => {
    const res = await request(app)
      .post("/api/widget/demo/chat")
      .send({ message: "Hello", history: [] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("response");
    expect(typeof res.body.response).toBe("string");
    expect(res.body.response.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("showContactBar");
    expect(res.body).toHaveProperty("contactInfo");
  });

  it("POST /api/widget/demo/chat rejects empty message", async () => {
    const res = await request(app)
      .post("/api/widget/demo/chat")
      .send({ message: "", history: [] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/widget/demo/chat rejects missing message", async () => {
    const res = await request(app)
      .post("/api/widget/demo/chat")
      .send({ history: [] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/widget/demo/chat shows contact bar when AI qualifies", async () => {
    const { invokeLLM } = await import("./_core/llm");
    (invokeLLM as any).mockResolvedValueOnce({
      id: "test-id",
      created: Date.now(),
      model: "claude-sonnet-4-20250514",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Let me connect you with our team. [QUALIFIED_FOR_HUMAN_HELP]",
          },
          finish_reason: "stop",
        },
      ],
    });

    const res = await request(app)
      .post("/api/widget/demo/chat")
      .send({ message: "I need to talk to a human", history: [] });

    expect(res.status).toBe(200);
    expect(res.body.showContactBar).toBe(true);
    expect(res.body.contactInfo).not.toBeNull();
    expect(res.body.contactInfo).toHaveProperty("whatsappNumber");
    expect(res.body.contactInfo).toHaveProperty("phoneNumber");
    expect(res.body.contactInfo).toHaveProperty("emailAddress");
    // The marker should be stripped from the response
    expect(res.body.response).not.toContain("[QUALIFIED_FOR_HUMAN_HELP]");
  });

  it("POST /api/widget/demo/chat accepts conversation history", async () => {
    const res = await request(app)
      .post("/api/widget/demo/chat")
      .send({
        message: "Tell me more",
        history: [
          { role: "user", content: "What is Hansen?" },
          { role: "assistant", content: "Hansen is an AI chat platform." },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("response");
  });
});
