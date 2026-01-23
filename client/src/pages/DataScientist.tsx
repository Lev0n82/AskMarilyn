import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Brain, Database, GitBranch } from "lucide-react";

export default function DataScientist() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900" />
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />
            <div className="absolute inset-0 flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                Data Scientist: The Architect of Intelligence
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "Data without context is noise. Intelligence without architecture is chaos. The modern Data Scientist must master both."
            </p>
          </div>
        </section>

        {/* Introduction Letter */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Scientist's Query
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I spent years mastering statistics and scikit-learn. Now everyone just wants me to "call an API" for an LLM. Is my deep knowledge of algorithms useless? Or is there a way to combine classical data science with this new wave of AI?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">Y</span>our foundation is your greatest asset. An API can generate text, but it cannot understand truth.
              </p>
              <p className="font-sans leading-relaxed">
                The future belongs to those who can bridge the gap. We will explore the <strong>LLM Revolution</strong> not as users, but as engineers. We will build <strong>RAG Pipelines</strong> to ground AI in reality, and master <strong>MLOps</strong> to turn experiments into production systems.
              </p>
            </div>
            
            {/* Course Modules */}
            <div className="grid gap-6 mt-8">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 1: The LLM Revolution</h4>
                      <p className="text-muted-foreground mb-4">
                        Understanding the architecture of Transformers and how to fine-tune them for specific domains.
                      </p>
                      <Button variant="outline" size="sm">Start Module</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Database className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 2: RAG Architecture</h4>
                      <p className="text-muted-foreground mb-4">
                        Retrieval-Augmented Generation: Connecting your private data to Large Language Models securely.
                      </p>
                      <Button variant="outline" size="sm">Start Module</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <GitBranch className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 3: MLOps Mastery</h4>
                      <p className="text-muted-foreground mb-4">
                        Moving from Jupyter Notebooks to production pipelines with automated testing and monitoring.
                      </p>
                      <Button variant="outline" size="sm">Start Module</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Scientist's Toolkit</h3>
                <ul className="space-y-2 text-sm font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Prompt Engineering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Vector Embeddings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Model Evaluation
                  </li>
                </ul>
                <div className="pt-4 border-t border-border/50">
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="w-full">
                      &larr; Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
