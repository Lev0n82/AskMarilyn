import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Database } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function RAGArchitecture() {
  usePageMeta({
    title: "Data Science - RAG Architecture",
    description: "Educational module on Retrieval-Augmented Generation architecture. Part of GRACE Academy curriculum.",
    keywords: "RAG architecture education, AI systems training, data science course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/data-scientist" className="hover:text-primary">Data Scientist</Link>
          <span>/</span>
          <span className="text-foreground">Module 2: RAG Architecture</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Database className="w-10 h-10" />
            RAG Architecture: Retrieval-Augmented Generation
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~18 min read
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
                I've built an LLM application, but it keeps making up facts that aren't true. My users are losing trust. How do I make my AI give accurate, up-to-date information without constantly retraining the model?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">Y</span>ou've discovered the fundamental limitation of LLMs: they only know what they learned during training. The solution isn't to retrain—it's to give your model access to external knowledge at query time. This is called Retrieval-Augmented Generation, and it's transforming how we build AI applications.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding RAG
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Why RAG?</h3>
            <p className="font-sans leading-relaxed">
              LLMs have a knowledge cutoff date and can hallucinate facts. RAG solves both problems by retrieving relevant documents before generating responses.
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-3">The RAG Pipeline</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                    <span><strong>Query:</strong> User asks a question</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                    <span><strong>Retrieve:</strong> Find relevant documents from knowledge base</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                    <span><strong>Augment:</strong> Add retrieved context to the prompt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">4</span>
                    <span><strong>Generate:</strong> LLM produces grounded response</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="data-scientist"
              topicId="rag-architecture"
              question="What is the primary purpose of RAG (Retrieval-Augmented Generation)?"
              options={[
                "To make LLMs faster",
                "To reduce model size",
                "To ground LLM responses in external knowledge",
                "To train models more efficiently"
              ]}
              correctAnswer={2}
              explanation="RAG grounds LLM responses in external knowledge by retrieving relevant documents before generation, reducing hallucinations and enabling access to current information."
              eli5Explanation="It's like giving the AI a library card. Instead of guessing answers from memory, it can look up the facts first!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Vector Embeddings: The Foundation</h3>
            <p className="font-sans leading-relaxed">
              RAG relies on vector embeddings—numerical representations of text that capture semantic meaning. Similar concepts have similar vectors.
            </p>

            <div className="bg-background p-4 rounded border border-border font-mono text-sm">
              <p className="text-muted-foreground"># Conceptual example</p>
              <p>"king" - "man" + "woman" ≈ "queen"</p>
              <p className="text-muted-foreground mt-2"># Vectors capture relationships!</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Embedding Model</th>
                    <th className="border border-border p-3 text-left">Dimensions</th>
                    <th className="border border-border p-3 text-left">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">OpenAI text-embedding-3-large</td>
                    <td className="border border-border p-3">3072</td>
                    <td className="border border-border p-3">High accuracy retrieval</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Cohere embed-v3</td>
                    <td className="border border-border p-3">1024</td>
                    <td className="border border-border p-3">Multilingual support</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">BGE-large-en</td>
                    <td className="border border-border p-3">1024</td>
                    <td className="border border-border p-3">Open source, self-hosted</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="rag-architecture"
              question="What do vector embeddings capture about text?"
              options={[
                "Only the exact words used",
                "Semantic meaning and relationships",
                "Grammar rules",
                "Document length"
              ]}
              correctAnswer={1}
              explanation="Vector embeddings capture semantic meaning, allowing similar concepts to have similar vector representations even if they use different words."
              eli5Explanation="Embeddings turn words into coordinates on a map. Words that mean similar things are placed close together on the map!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Chunking Strategies</h3>
            <p className="font-sans leading-relaxed">
              Before embedding, documents must be split into chunks. The chunking strategy significantly impacts retrieval quality.
            </p>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Fixed-Size Chunking</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Split by character/token count. Simple but may break mid-sentence.
                  </p>
                  <p className="text-xs mt-2 font-mono bg-muted p-2 rounded">chunk_size=512, overlap=50</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Semantic Chunking</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Split by meaning boundaries (paragraphs, sections). Preserves context.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Recursive Chunking</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try multiple separators in order: sections → paragraphs → sentences → characters.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="rag-architecture"
              question="Why is chunk overlap important in RAG systems?"
              options={[
                "It makes the database smaller",
                "It ensures context isn't lost at chunk boundaries",
                "It speeds up retrieval",
                "It reduces embedding costs"
              ]}
              correctAnswer={1}
              explanation="Overlap ensures that important context that spans chunk boundaries isn't lost. Without overlap, relevant information might be split across chunks and missed during retrieval."
              eli5Explanation="Imagine cutting a book into pieces. If you cut right through a sentence, you lose meaning. Overlap is like making sure each piece includes a bit of the previous page!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Advanced RAG Patterns</h3>

            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-bold">Hybrid Search</h4>
                  <p className="text-sm mt-2">
                    Combine vector similarity with keyword search (BM25) for better results.
                  </p>
                  <p className="text-xs font-mono bg-background p-2 rounded mt-2">
                    final_score = α × vector_score + (1-α) × keyword_score
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-bold">Re-ranking</h4>
                  <p className="text-sm mt-2">
                    Use a cross-encoder to re-score retrieved documents for better precision.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-bold">Query Expansion</h4>
                  <p className="text-sm mt-2">
                    Generate multiple query variations to improve recall.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="rag-architecture"
              question="What is the benefit of hybrid search in RAG?"
              options={[
                "It's faster than vector search alone",
                "It combines semantic understanding with exact keyword matching",
                "It requires less storage",
                "It eliminates the need for embeddings"
              ]}
              correctAnswer={1}
              explanation="Hybrid search combines the semantic understanding of vector search with the precision of keyword matching, improving results for queries that benefit from both approaches."
              eli5Explanation="It's like having two librarians help you—one who understands what you mean, and one who knows exactly where specific words appear!"
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/data-scientist/llm-revolution">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: LLM Revolution
            </Button>
          </Link>
          <Link href="/data-scientist/mlops">
            <Button className="gap-2">
              Next: MLOps
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
