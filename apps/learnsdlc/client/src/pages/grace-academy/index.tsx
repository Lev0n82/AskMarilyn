import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Brain, 
  Cpu, 
  BookOpen,
  Clock,
  Award,
  CheckCircle
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const foundationModules = [
  "Introduction to Action-Based Testing",
  "The Philosophy of ABT",
  "Actions as First-Class Citizens",
  "Composable Test Design",
  "State Management in ABT",
  "Error Handling Patterns",
  "Test Data Strategies",
  "Parallel Execution Models",
  "Reporting and Observability",
  "Foundation Capstone"
];

const intermediateModules = [
  "Introduction to AI Agents",
  "The GRACE Architecture",
  "Requirement Analysis Agents",
  "Test Generation Agents",
  "Execution Orchestration",
  "Self-Healing Mechanisms",
  "Cognitive Feedback Loops",
  "Integration Patterns",
  "Performance Optimization",
  "Intermediate Capstone"
];

const advancedModules = [
  "Advanced AI Orchestration",
  "Multi-Agent Collaboration",
  "Autonomous Decision Making",
  "Ethical AI in Testing",
  "Enterprise Scale Patterns",
  "Security and Compliance",
  "Future of Quality Engineering",
  "Leadership in AI-Driven QE",
  "Building QE Centers of Excellence",
  "GRACE Mastery Capstone"
];

export default function GraceAcademyIndex() {
  usePageMeta({
    title: "GRACE Academy - ABT Foundations",
    description: "GRACE Academy Foundation certification course covering Action-Based Testing core principles. Part of GRACE Academy professional certification program.",
    keywords: "GRACE certification, ABT foundations education, quality engineering training, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section with Course Badge */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border bg-gradient-to-br from-primary/20 via-background to-purple-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-32 h-32 text-primary/20" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                GRACE Academy
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "Generative Requirement Aware Cognitive Engineering — Named after Admiral Grace Hopper, who gave machines the gift of understanding human language. Now, we give them the gift of understanding software quality."
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
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I've been hearing a lot about AI in software testing, but it all seems like science fiction. 
                Can machines really understand what we're trying to test? Can they write tests themselves? 
                And if so, how do we ensure they're testing the right things? I'm skeptical that any AI 
                system could truly grasp the nuances of software quality the way a human tester can.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">Y</span>our skepticism is well-founded, and it's precisely the kind of 
                critical thinking we need more of in this field. The truth is, most "AI testing" solutions today 
                are little more than pattern matching dressed up in fancy marketing.
              </p>
              <p className="font-sans leading-relaxed">
                But what if I told you there's a different approach? One that doesn't try to replace human 
                intelligence, but rather amplifies it? GRACE — Generative Requirement Aware Cognitive Engineering — 
                is a framework that treats AI as a collaborative partner, not a replacement.
              </p>
              <p className="font-sans leading-relaxed">
                The key insight is this: <strong>machines excel at consistency and scale, while humans excel at 
                judgment and creativity</strong>. GRACE combines both, creating a system where AI agents handle 
                the tedious, repetitive aspects of testing while humans focus on strategy, edge cases, and 
                the "what should we be testing?" questions that require genuine understanding.
              </p>
              <p className="font-sans leading-relaxed">
                In this program, you'll learn not just how to use AI in testing, but how to think about 
                the relationship between human and machine intelligence in quality engineering. By the end, 
                you'll understand why the question isn't "Can AI replace testers?" but rather "How can AI 
                make testers more effective?"
              </p>
            </div>
          </div>

          {/* Course Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Program Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-sm">30 Modules</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">20+ Hours of Content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">3 Certifications</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">Complete all tracks to earn your GRACE Diploma</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Course Outline */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            Course Outline
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Foundation Track */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-blue-500" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Foundation Track</CardTitle>
                    <CardDescription>Modules 1-10 • 4-6 hours</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {foundationModules.map((module, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Intermediate Track */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-amber-500" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Intermediate Track</CardTitle>
                    <CardDescription>Modules 11-20 • 6-8 hours</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {intermediateModules.map((module, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Advanced Track */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-purple-500" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Advanced Track</CardTitle>
                    <CardDescription>Modules 21-30 • 8-10 hours</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {advancedModules.map((module, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Start Course CTA */}
        <section className="text-center py-8 bg-muted/30 rounded-xl">
          <h2 className="font-serif text-2xl font-bold mb-4">Ready to Begin Your GRACE Journey?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start with Module 1 and progress through all three tracks. Each module builds on the last, 
            creating a comprehensive understanding of AI-powered autonomous testing.
          </p>
          <Link href="/grace-academy/module-1">
            <Button size="lg" className="gap-2">
              Start Module 1: Introduction to ABT
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
