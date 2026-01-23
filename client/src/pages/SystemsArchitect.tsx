import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Server, ShieldCheck, Cpu } from "lucide-react";

export default function SystemsArchitect() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />
            <div className="absolute inset-0 flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                Systems Architect: The Blueprint of Logic
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "A skyscraper isn't built by stacking bricks at random. It requires a blueprint that accounts for gravity, wind, and human behavior. Software is no different."
            </p>
          </div>
        </section>

        {/* Introduction Letter */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Architect's Query
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I'm overwhelmed by the sheer number of choices in modern system design. Microservices or monoliths? SQL or NoSQL? Event-driven or REST? Everyone has an opinion, but nobody seems to have a consistent logic. How do I choose the right architecture without guessing?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">C</span>hoice paralysis is the enemy of good design. The mistake is thinking these are just "preferences." They are tools, and every tool has a specific purpose.
              </p>
              <p className="font-sans leading-relaxed">
                A Systems Architect doesn't guess; they analyze trade-offs. We will explore <strong>Agentic AI patterns</strong>, <strong>Platform Engineering</strong>, and <strong>Green Computing</strong> not as buzzwords, but as logical solutions to specific constraints.
              </p>
            </div>
            
            {/* Course Modules */}
            <div className="grid gap-6 mt-8">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Cpu className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 1: Agentic AI Patterns</h4>
                      <p className="text-muted-foreground mb-4">
                        Moving beyond simple chatbots to autonomous agents that can plan, reason, and execute complex workflows.
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
                      <Server className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 2: Platform Engineering</h4>
                      <p className="text-muted-foreground mb-4">
                        Building the "Internal Developer Platform" (IDP) to reduce cognitive load and standardize deployments.
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
                      <ShieldCheck className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 3: Green Computing</h4>
                      <p className="text-muted-foreground mb-4">
                        Optimizing architecture not just for speed, but for energy efficiency and carbon footprint reduction.
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
                <h3 className="font-serif font-bold text-lg">Architect's Toolkit</h3>
                <ul className="space-y-2 text-sm font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Trade-off Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Scalability Patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Security by Design
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
