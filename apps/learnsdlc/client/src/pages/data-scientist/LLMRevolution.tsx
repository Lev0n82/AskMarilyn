import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Brain } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function LLMRevolution() {
  usePageMeta({
    title: "Data Science - LLM Revolution",
    description: "Educational module on large language models and their applications. Part of GRACE Academy curriculum.",
    keywords: "LLM education, AI training, machine learning course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/data-scientist" className="hover:text-primary">Data Scientist</Link>
          <span>/</span>
          <span className="text-foreground">Module 1: The LLM Revolution</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Brain className="w-10 h-10" />
            The LLM Revolution: Understanding Large Language Models
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
                Everyone keeps talking about LLMs and GPT, but I'm confused about what makes them different from the machine learning models I learned about in school. Are they just bigger neural networks, or is there something fundamentally different?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>he revolution isn't just about size—it's about emergent capabilities. When you scale neural networks to billions of parameters and train them on vast text corpora, something magical happens: they develop abilities nobody explicitly programmed. Let me explain why this changes everything.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding LLMs
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">What Makes LLMs Different?</h3>
            <p className="font-sans leading-relaxed">
              Traditional ML models are trained for specific tasks—spam detection, image classification, sentiment analysis. LLMs are trained on a single task: predict the next word. But this simple objective, at scale, produces remarkable generalization.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Aspect</th>
                    <th className="border border-border p-3 text-left">Traditional ML</th>
                    <th className="border border-border p-3 text-left">Large Language Models</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">Training Objective</td>
                    <td className="border border-border p-3">Task-specific (classification, regression)</td>
                    <td className="border border-border p-3">Next token prediction</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Capabilities</td>
                    <td className="border border-border p-3">Single task</td>
                    <td className="border border-border p-3">Multi-task, emergent abilities</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Adaptation</td>
                    <td className="border border-border p-3">Requires retraining</td>
                    <td className="border border-border p-3">In-context learning (prompting)</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Parameters</td>
                    <td className="border border-border p-3">Thousands to millions</td>
                    <td className="border border-border p-3">Billions to trillions</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="llm-revolution"
              question="What is the primary training objective of Large Language Models?"
              options={[
                "Image classification",
                "Next token prediction",
                "Sentiment analysis",
                "Named entity recognition"
              ]}
              correctAnswer={1}
              explanation="LLMs are trained to predict the next token in a sequence. This simple objective, when applied at massive scale, enables the model to learn patterns that generalize to many tasks."
              eli5Explanation="It's like learning to finish sentences. If you read millions of books and practice finishing sentences, you eventually understand how language works—not just one specific task!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">The Transformer Architecture</h3>
            <p className="font-sans leading-relaxed">
              The breakthrough enabling LLMs was the Transformer architecture, introduced in the 2017 paper "Attention Is All You Need." The key innovation: self-attention.
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-3">Self-Attention Explained</h4>
                <p className="text-sm mb-4">
                  Self-attention allows each word to "look at" every other word in the input and decide how much to pay attention to it.
                </p>
                <div className="bg-background p-4 rounded font-mono text-sm">
                  <p>"The cat sat on the mat because it was tired."</p>
                  <p className="text-muted-foreground mt-2">
                    Self-attention helps the model understand that "it" refers to "cat," not "mat."
                  </p>
                </div>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="data-scientist"
              topicId="llm-revolution"
              question="What problem does self-attention solve in language understanding?"
              options={[
                "Reducing model size",
                "Understanding relationships between distant words",
                "Faster training time",
                "Reducing memory usage"
              ]}
              correctAnswer={1}
              explanation="Self-attention allows the model to understand relationships between words regardless of their distance in the text, solving the long-range dependency problem that plagued earlier architectures like RNNs."
              eli5Explanation="Imagine reading a story where a character is introduced on page 1 and does something important on page 100. Self-attention lets the model remember and connect those pages!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Emergent Capabilities</h3>
            <p className="font-sans leading-relaxed">
              Perhaps the most fascinating aspect of LLMs is emergent capabilities—abilities that appear suddenly at certain scales without being explicitly trained.
            </p>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">In-Context Learning</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    LLMs can learn new tasks from just a few examples in the prompt, without any weight updates. This wasn't programmed—it emerged.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Chain-of-Thought Reasoning</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    When prompted to "think step by step," LLMs can solve complex reasoning problems they otherwise couldn't. This capability emerged at around 100B parameters.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Code Generation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Models trained on text that included code learned to write functional programs, even though coding wasn't a specific training objective.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="llm-revolution"
              question="What is 'in-context learning' in LLMs?"
              options={[
                "Training the model on new data",
                "Learning from examples provided in the prompt without weight updates",
                "Fine-tuning the model for specific tasks",
                "Updating model parameters during inference"
              ]}
              correctAnswer={1}
              explanation="In-context learning is the ability to learn from examples provided in the prompt without any changes to the model's weights. The model 'learns' the task pattern from the examples and applies it."
              eli5Explanation="It's like showing someone three examples of how to solve a puzzle, and they immediately understand how to solve similar puzzles—without any studying or practice!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Key LLM Families</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Model Family</th>
                    <th className="border border-border p-3 text-left">Creator</th>
                    <th className="border border-border p-3 text-left">Key Features</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">GPT-4</td>
                    <td className="border border-border p-3">OpenAI</td>
                    <td className="border border-border p-3">Multimodal, strong reasoning</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Claude</td>
                    <td className="border border-border p-3">Anthropic</td>
                    <td className="border border-border p-3">Constitutional AI, long context</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Llama</td>
                    <td className="border border-border p-3">Meta</td>
                    <td className="border border-border p-3">Open weights, efficient</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Gemini</td>
                    <td className="border border-border p-3">Google</td>
                    <td className="border border-border p-3">Native multimodal</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Mistral</td>
                    <td className="border border-border p-3">Mistral AI</td>
                    <td className="border border-border p-3">Efficient, open source</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="llm-revolution"
              question="Which LLM family is known for being open-weights and developed by Meta?"
              options={[
                "GPT-4",
                "Claude",
                "Llama",
                "Gemini"
              ]}
              correctAnswer={2}
              explanation="Llama (Large Language Model Meta AI) is Meta's open-weights model family, allowing researchers and developers to use and modify the model weights."
              eli5Explanation="Meta shared their recipe (the model weights) with everyone, so anyone can bake the same cake. Other companies keep their recipes secret!"
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/data-scientist">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </Button>
          </Link>
          <Link href="/data-scientist/rag-architecture">
            <Button className="gap-2">
              Next: RAG Architecture
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
