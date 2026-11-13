import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Clock, BookOpen, Settings, CheckCircle } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function MLOps() {
  usePageMeta({
    title: "Data Science - MLOps",
    description: "Educational module on machine learning operations and deployment. Part of GRACE Academy curriculum.",
    keywords: "MLOps education, ML deployment training, data science course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/data-scientist" className="hover:text-primary">Data Scientist</Link>
          <span>/</span>
          <span className="text-foreground">Module 3: MLOps</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Settings className="w-10 h-10" />
            MLOps: Machine Learning Operations
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~15 min read
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
                My data science team builds great models in Jupyter notebooks, but when we try to deploy them to production, everything falls apart. How do the big tech companies manage to run thousands of ML models reliably?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>he gap between a working notebook and a production system is vast. MLOps bridges this gap by applying DevOps principles to machine learning. It's not just about deploying models—it's about building systems that can train, deploy, monitor, and retrain models continuously and reliably.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding MLOps
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">The ML Lifecycle</h3>
            <p className="font-sans leading-relaxed">
              Production ML isn't a one-time deployment—it's a continuous cycle of improvement.
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4">The MLOps Cycle</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-bold text-sm">Data</div>
                    <div className="text-xs text-muted-foreground">Collect & Version</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-2xl mb-2">🔬</div>
                    <div className="font-bold text-sm">Experiment</div>
                    <div className="text-xs text-muted-foreground">Train & Evaluate</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="font-bold text-sm">Deploy</div>
                    <div className="text-xs text-muted-foreground">Ship & Scale</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-bold text-sm">Monitor</div>
                    <div className="text-xs text-muted-foreground">Track & Alert</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="data-scientist"
              topicId="mlops"
              question="What is the primary goal of MLOps?"
              options={[
                "To make models more accurate",
                "To automate and standardize the ML lifecycle",
                "To reduce training time",
                "To eliminate the need for data scientists"
              ]}
              correctAnswer={1}
              explanation="MLOps aims to automate and standardize the entire ML lifecycle—from data preparation through deployment and monitoring—enabling reliable, reproducible ML systems."
              eli5Explanation="MLOps is like having a factory for making AI. Instead of hand-crafting each model, you build a system that can produce, test, and maintain models automatically!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Key MLOps Components</h3>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Version Control for ML</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track code, data, models, and experiments together.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">DVC</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">MLflow</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">Weights & Biases</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Feature Stores</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Centralized repository for feature definitions and values.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">Feast</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">Tecton</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">Databricks</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Model Registry</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Central hub for model versioning, staging, and deployment.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">MLflow Registry</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">SageMaker</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">Vertex AI</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="mlops"
              question="What is a Feature Store used for?"
              options={[
                "Storing trained models",
                "Centralizing feature definitions and serving features consistently",
                "Version controlling code",
                "Monitoring model performance"
              ]}
              correctAnswer={1}
              explanation="A Feature Store centralizes feature engineering, ensuring that the same feature definitions are used consistently across training and inference, preventing training-serving skew."
              eli5Explanation="A Feature Store is like a recipe book for ingredients. Everyone uses the same recipes, so the dish (model) tastes the same whether you're testing at home or serving in a restaurant!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Model Monitoring</h3>
            <p className="font-sans leading-relaxed">
              Models degrade over time as the world changes. Monitoring detects problems before they impact users.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Drift Type</th>
                    <th className="border border-border p-3 text-left">What Changes</th>
                    <th className="border border-border p-3 text-left">Detection Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Data Drift</td>
                    <td className="border border-border p-3">Input distribution</td>
                    <td className="border border-border p-3">Statistical tests (KS, PSI)</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Concept Drift</td>
                    <td className="border border-border p-3">Relationship between inputs and outputs</td>
                    <td className="border border-border p-3">Performance monitoring</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Label Drift</td>
                    <td className="border border-border p-3">Target distribution</td>
                    <td className="border border-border p-3">Ground truth comparison</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="data-scientist"
              topicId="mlops"
              question="What is 'concept drift' in machine learning?"
              options={[
                "When the model's code changes",
                "When the relationship between inputs and outputs changes",
                "When the input data format changes",
                "When the model is deployed to a new server"
              ]}
              correctAnswer={1}
              explanation="Concept drift occurs when the underlying relationship between inputs and outputs changes over time, making the model's learned patterns less accurate."
              eli5Explanation="Imagine learning that 'hot weather = ice cream sales.' If people suddenly prefer smoothies in hot weather, your old rule doesn't work anymore—that's concept drift!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">CI/CD for ML</h3>
            <p className="font-sans leading-relaxed">
              Continuous Integration and Deployment for ML extends traditional CI/CD with ML-specific stages.
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4">ML Pipeline Stages</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span><strong>Data Validation:</strong> Check data quality and schema</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span><strong>Model Training:</strong> Train with versioned data</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span><strong>Model Validation:</strong> Test against baseline metrics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span><strong>Shadow Deployment:</strong> Test in production without serving</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span><strong>Canary Release:</strong> Gradual rollout to users</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="data-scientist"
              topicId="mlops"
              question="What is a 'canary release' in ML deployment?"
              options={[
                "Deploying to a test environment only",
                "Gradually rolling out a new model to a small percentage of users first",
                "Running the model offline",
                "Deploying multiple models simultaneously"
              ]}
              correctAnswer={1}
              explanation="A canary release deploys the new model to a small percentage of users first, allowing you to detect problems before they affect everyone."
              eli5Explanation="Like miners used canaries to detect dangerous gas, you send your new model to a few users first. If something goes wrong, only a few people are affected!"
            />
          </div>
        </section>

        {/* Course Completion */}
        <section className="space-y-6">
          <Card className="bg-primary/5 border-primary">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">🎉 Course Complete!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed all modules in the Data Scientist course. You now understand LLMs, RAG architecture, and MLOps fundamentals.
              </p>
              <Link href="/data-scientist">
                <Button>Return to Course Overview</Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/data-scientist/rag-architecture">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: RAG Architecture
            </Button>
          </Link>
          <Link href="/data-scientist">
            <Button className="gap-2">
              Back to Course
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
