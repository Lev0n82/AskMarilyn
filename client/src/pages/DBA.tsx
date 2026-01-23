import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Database, Lock, Zap } from "lucide-react";

export default function DBA() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900" />
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />
            <div className="absolute inset-0 flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                Database Admin: The Keeper of Truth
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "Data is the lifeblood of the modern world. A database administrator doesn't just store it; they protect its integrity, ensure its flow, and guard it against corruption."
            </p>
          </div>
        </section>

        {/* Introduction Letter */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Administrator's Dilemma
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                My company wants to move everything to the cloud and use "serverless" databases. They say we don't need DBAs anymore. But I see data inconsistencies, security holes, and performance bottlenecks everywhere. Am I obsolete, or are they missing something fundamental?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">T</span>he tool may change, but the principle remains. "Serverless" does not mean "logic-less." If anything, the role of the DBA has evolved from a mechanic to an architect.
              </p>
              <p className="font-sans leading-relaxed">
                We must return to first principles: <strong>ACID compliance</strong> for truth, <strong>Vector Databases</strong> for AI integration, and <strong>Security Fortresses</strong> for trust. Without these, your "cloud" is just a fog.
              </p>
            </div>
            
            {/* Course Modules */}
            <div className="grid gap-6 mt-8">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Database className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 1: ACID & The Truth</h4>
                      <p className="text-muted-foreground mb-4">
                        Why Atomicity, Consistency, Isolation, and Durability matter more than ever in distributed systems.
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
                      <Zap className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 2: Vector Databases</h4>
                      <p className="text-muted-foreground mb-4">
                        Understanding the new frontier of storing high-dimensional data for AI and semantic search.
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
                      <Lock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 3: Security Fortresses</h4>
                      <p className="text-muted-foreground mb-4">
                        Designing robust access controls, encryption, and audit trails in a zero-trust environment.
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
                <h3 className="font-serif font-bold text-lg">DBA's Toolkit</h3>
                <ul className="space-y-2 text-sm font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Transaction Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Index Optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Disaster Recovery
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
