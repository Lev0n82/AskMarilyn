import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Cpu, 
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  Building2,
  Users,
  Brain,
  Zap,
  Settings,
  BarChart3,
  Target,
  Layers
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const intermediateModules = [
  { name: "Introduction to AI Agents", icon: Cpu },
  { name: "The GRACE Architecture", icon: Building2 },
  { name: "Requirement Analysis Agents", icon: Target },
  { name: "Test Generation Agents", icon: Zap },
  { name: "Execution Orchestration", icon: Settings },
  { name: "Self-Healing Mechanisms", icon: Layers },
  { name: "Cognitive Feedback Loops", icon: Brain },
  { name: "Integration Patterns", icon: Users },
  { name: "Performance Optimization", icon: BarChart3 },
  { name: "Intermediate Capstone", icon: Award }
];

export default function IntermediateIntro() {
  usePageMeta({
    title: "GRACE Academy - AI Agent Mastery",
    description: "GRACE Academy Intermediate certification course covering AI agents and GRACE architecture. Part of professional certification program.",
    keywords: "GRACE certification, AI agent education, quality engineering training, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border bg-gradient-to-br from-amber-500/20 via-background to-orange-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-32 h-32 text-amber-500/20" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                AI Agent Mastery
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "The intermediate track dives deep into the world of AI agents — autonomous systems that can analyze requirements, generate tests, and even heal themselves when things go wrong."
            </p>
          </div>
        </section>

        {/* Reader's Dilemma */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Reader's Dilemma
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-amber-500 rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I've completed the foundation track and understand Action-Based Testing principles. 
                But now I'm hearing about AI agents that can supposedly write and maintain tests 
                autonomously. How do these agents actually work? And how do I ensure they're 
                generating quality tests rather than just quantity?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">E</span>xcellent question! You've touched on the heart of 
                what makes GRACE different from other AI testing approaches. The key is understanding 
                that AI agents in GRACE aren't trying to replace human judgment — they're amplifying it.
              </p>
              <p className="font-sans leading-relaxed">
                In this track, you'll learn about the <strong>GRACE Architecture</strong> — a system 
                of specialized agents that work together like a well-coordinated team. Each agent has 
                a specific role: analyzing requirements, generating test cases, orchestrating execution, 
                and even detecting and fixing broken tests automatically.
              </p>
              <p className="font-sans leading-relaxed">
                The magic happens in the <strong>Cognitive Feedback Loops</strong> — mechanisms that 
                allow agents to learn from their mistakes and improve over time. By the end of this 
                track, you'll understand not just how to use these agents, but how to configure them 
                for your specific testing needs.
              </p>
            </div>
          </div>

          {/* Track Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Track Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">10 Modules</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">6-8 Hours of Content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-amber-700" />
                    <span className="text-sm">AI Agent Mastery Certificate</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-amber-500/30">
                  <p className="text-xs text-muted-foreground">Prerequisite: ABT Foundations Track</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Module List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            Track Modules
          </h2>
          
          <Card className="overflow-hidden">
            <div className="h-2 bg-amber-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Agent Mastery</CardTitle>
                  <CardDescription>Modules 11-20 • Deep dive into AI agents and GRACE architecture</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {intermediateModules.map((module, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <module.icon className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium">Module {index + 11}:</span>
                    <span>{module.name}</span>
                    <span className="ml-auto text-muted-foreground text-xs">~15 min</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Start Course CTA */}
        <section className="text-center py-8 bg-amber-500/10 rounded-xl">
          <h2 className="font-serif text-2xl font-bold mb-4">Ready to Master AI Agents?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start with Module 11 and discover how AI agents can transform your testing practice.
            Each module builds on the last, creating a comprehensive understanding of the GRACE system.
          </p>
          <Link href="/grace-academy/module-11">
            <Button size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600">
              Start Module 11: Introduction to AI Agents
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
