import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Sparkles } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function VectorDatabases() {
  usePageMeta({
    title: "DBA Course - Vector Databases",
    description: "Educational module on vector databases and modern data storage. Part of GRACE Academy curriculum.",
    keywords: "vector databases education, modern database training, DBA course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/database-administrator" className="hover:text-primary">Database Administrator</Link>
          <span>/</span>
          <span className="text-foreground">Module 2: Vector Databases</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Sparkles className="w-10 h-10" />
            Vector Databases: The AI Memory Revolution
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~20 min read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              4 quizzes
            </span>
          </div>
        </header>

        {/* Reader's Dilemma */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Reader's Dilemma
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                Everyone's talking about vector databases for AI applications. But I don't understand why we can't just use regular databases with a "similarity" column. What makes vector databases special, and when should I actually use one?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>he key insight is that traditional databases are designed for exact matches—"find the user with ID 12345." Vector databases are designed for similarity—"find items most similar to this." This fundamental difference requires entirely different data structures and algorithms.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding Vector Databases
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">What Are Embeddings?</h3>
            <p className="font-sans leading-relaxed">
              An embedding is a numerical representation of data (text, images, audio) as a list of numbers—a vector. Similar items have similar vectors.
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-3">Example: Word Embeddings</h4>
                <div className="font-mono text-sm space-y-2">
                  <p>"king" → [0.2, 0.8, 0.1, 0.9, ...]</p>
                  <p>"queen" → [0.3, 0.7, 0.2, 0.9, ...]</p>
                  <p>"apple" → [0.9, 0.1, 0.8, 0.2, ...]</p>
                </div>
                <p className="text-sm mt-4 text-muted-foreground">
                  Notice: "king" and "queen" have similar numbers (both royalty), while "apple" is very different.
                </p>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="dba"
              topicId="vector-databases"
              question="What is the primary purpose of converting text to embeddings?"
              options={[
                "To compress the text for storage",
                "To enable mathematical similarity comparisons",
                "To encrypt the text for security",
                "To translate text between languages"
              ]}
              correctAnswer={1}
              explanation="Embeddings convert semantic meaning into numbers, allowing us to use mathematical operations (like cosine similarity) to find similar items."
              eli5Explanation="It's like giving every word a GPS coordinate. Words with similar meanings are close together on the map. 'Happy' and 'joyful' would be neighbors, while 'sad' would be far away!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Why Not Just Use SQL?</h3>
            <p className="font-sans leading-relaxed">
              Traditional databases use B-trees and hash indexes—great for exact matches, terrible for similarity search.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Aspect</th>
                    <th className="border border-border p-3 text-left">Traditional DB</th>
                    <th className="border border-border p-3 text-left">Vector DB</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">Query Type</td>
                    <td className="border border-border p-3">Exact match (WHERE id = 5)</td>
                    <td className="border border-border p-3">Similarity (find nearest neighbors)</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Index Structure</td>
                    <td className="border border-border p-3">B-tree, Hash</td>
                    <td className="border border-border p-3">HNSW, IVF, PQ</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Scaling</td>
                    <td className="border border-border p-3">Sharding by key</td>
                    <td className="border border-border p-3">Approximate nearest neighbor</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Use Case</td>
                    <td className="border border-border p-3">Transactions, reports</td>
                    <td className="border border-border p-3">Semantic search, recommendations</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="dba"
              topicId="vector-databases"
              question="Why are B-tree indexes ineffective for vector similarity search?"
              options={[
                "B-trees are too slow",
                "B-trees only work with numbers",
                "B-trees are designed for exact matches, not similarity",
                "B-trees cannot store large data"
              ]}
              correctAnswer={2}
              explanation="B-trees organize data for efficient exact lookups and range queries. Finding 'similar' vectors requires comparing distances in high-dimensional space—a fundamentally different problem."
              eli5Explanation="A B-tree is like a phone book—great for finding 'John Smith' exactly, but useless for finding 'people who look like John Smith.' You'd have to check every photo!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Vector Index Algorithms</h3>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">HNSW (Hierarchical Navigable Small World)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Creates a multi-layer graph where each layer has fewer nodes. Search starts at the top (sparse) layer and navigates down to find nearest neighbors. Very fast queries, but memory-intensive.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">IVF (Inverted File Index)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clusters vectors into groups. At query time, only searches the most relevant clusters. Good balance of speed and memory, but requires training on your data.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">PQ (Product Quantization)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Compresses vectors by splitting them into subvectors and quantizing each. Dramatically reduces memory usage at the cost of some accuracy.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="dba"
              topicId="vector-databases"
              question="Which vector index algorithm is best for minimizing memory usage?"
              options={[
                "HNSW",
                "IVF",
                "Product Quantization (PQ)",
                "Brute Force"
              ]}
              correctAnswer={2}
              explanation="Product Quantization compresses vectors by quantizing subvectors, dramatically reducing memory requirements. HNSW is memory-intensive, and brute force stores full vectors."
              eli5Explanation="PQ is like describing a person with just 'tall, brown hair, glasses' instead of a detailed photograph. You lose some detail, but it takes way less space!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Popular Vector Databases</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Database</th>
                    <th className="border border-border p-3 text-left">Type</th>
                    <th className="border border-border p-3 text-left">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Pinecone</td>
                    <td className="border border-border p-3">Managed SaaS</td>
                    <td className="border border-border p-3">Quick start, no ops overhead</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Weaviate</td>
                    <td className="border border-border p-3">Open Source</td>
                    <td className="border border-border p-3">GraphQL API, built-in ML models</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Milvus</td>
                    <td className="border border-border p-3">Open Source</td>
                    <td className="border border-border p-3">Large scale, GPU acceleration</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">pgvector</td>
                    <td className="border border-border p-3">PostgreSQL Extension</td>
                    <td className="border border-border p-3">Existing Postgres users</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Chroma</td>
                    <td className="border border-border p-3">Open Source</td>
                    <td className="border border-border p-3">Local development, prototyping</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="dba"
              topicId="vector-databases"
              question="If you already use PostgreSQL and want to add vector search without a new database, which option is best?"
              options={[
                "Pinecone",
                "Milvus",
                "pgvector",
                "Weaviate"
              ]}
              correctAnswer={2}
              explanation="pgvector is a PostgreSQL extension that adds vector similarity search directly to your existing Postgres database. No new infrastructure required."
              eli5Explanation="It's like adding a new room to your house instead of buying a second house. pgvector lets you keep everything in one place!"
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/database-administrator/acid-transactions">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: ACID Transactions
            </Button>
          </Link>
          <Link href="/database-administrator/security-fortress">
            <Button className="gap-2">
              Next: Security Fortress
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
