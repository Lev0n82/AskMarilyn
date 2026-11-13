import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Crown, 
  BookOpen,
  Clock,
  Award,
  Cpu,
  Building2,
  Users,
  Brain,
  Scale,
  Rocket,
  Shield,
  Target,
  Lightbulb,
  GraduationCap
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const advancedModules = [
  { name: "Advanced AI Orchestration", icon: Cpu },
  { name: "Multi-Agent Collaboration", icon: Users },
  { name: "Autonomous Decision Making", icon: Brain },
  { name: "Ethical AI in Testing", icon: Scale },
  { name: "Enterprise Scale Patterns", icon: Building2 },
  { name: "Security and Compliance", icon: Shield },
  { name: "Future of Quality Engineering", icon: Rocket },
  { name: "Leadership in AI-Driven QE", icon: Crown },
  { name: "Building QE Centers of Excellence", icon: Target },
  { name: "GRACE Mastery Capstone", icon: GraduationCap }
];

export default function AdvancedIntro() {
  usePageMeta({
    title: "GRACE Academy - Enterprise Leadership",
    description: "GRACE Academy Advanced certification course covering enterprise patterns and QE leadership. Part of professional certification program.",
    keywords: "GRACE certification, enterprise leadership education, quality engineering training, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border bg-gradient-to-br from-purple-500/20 via-background to-violet-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className="w-32 h-32 text-purple-500/20" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                Enterprise Leadership
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "The advanced track prepares you to lead AI-driven quality engineering initiatives at enterprise scale — from ethical considerations to building centers of excellence."
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
              <div className="absolute -left-3 top-6 w-6 h-6 bg-purple-500 rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I've mastered the technical aspects of AI agents and the GRACE architecture. 
                But now I'm being asked to lead our organization's AI testing transformation. 
                How do I scale these practices across an enterprise? What about ethics, security, 
                and building a sustainable quality engineering culture?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">Y</span>ou've arrived at the most challenging — and most 
                rewarding — phase of your GRACE journey. Technical excellence is necessary, but 
                not sufficient, for enterprise transformation. Leadership requires a different 
                set of skills entirely.
              </p>
              <p className="font-sans leading-relaxed">
                In this track, you'll grapple with questions that have no easy answers: 
                <strong>How do we ensure AI testing systems are fair and unbiased?</strong> 
                <strong>How do we maintain security and compliance at scale?</strong> 
                <strong>How do we build teams that can sustain and evolve these systems?</strong>
              </p>
              <p className="font-sans leading-relaxed">
                You'll learn about <strong>Enterprise Scale Patterns</strong> — architectural 
                approaches that work across thousands of tests and hundreds of team members. 
                You'll explore the <strong>Future of Quality Engineering</strong> and how to 
                position your organization for what's coming next. And you'll discover how to 
                build <strong>QE Centers of Excellence</strong> that become engines of innovation.
              </p>
              <p className="font-sans leading-relaxed">
                By the end of this track, you won't just be a practitioner — you'll be a leader 
                capable of transforming how your organization thinks about quality.
              </p>
            </div>
          </div>

          {/* Track Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Track Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">10 Modules</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">8-10 Hours of Content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-700" />
                    <span className="text-sm">Enterprise Leadership Certificate</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-purple-500/30">
                  <p className="text-xs text-muted-foreground">Prerequisite: AI Agent Mastery Track</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-6 h-6 text-purple-500" />
                  <span className="font-serif font-bold">GRACE Diploma</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete all three tracks to earn your full GRACE Diploma — 
                  recognition of mastery in AI-powered autonomous testing.
                </p>
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
            <div className="h-2 bg-purple-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Enterprise Leadership</CardTitle>
                  <CardDescription>Modules 21-30 • Lead AI-driven quality transformation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {advancedModules.map((module, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <module.icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Module {index + 21}:</span>
                    <span>{module.name}</span>
                    <span className="ml-auto text-muted-foreground text-xs">~15 min</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Start Course CTA */}
        <section className="text-center py-8 bg-purple-500/10 rounded-xl">
          <h2 className="font-serif text-2xl font-bold mb-4">Ready to Lead the Transformation?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start with Module 21 and begin your journey to enterprise leadership.
            Each module prepares you to drive AI-powered quality initiatives at scale.
          </p>
          <Link href="/grace-academy/module-21">
            <Button size="lg" className="gap-2 bg-purple-500 hover:bg-purple-600">
              Start Module 21: Advanced AI Orchestration
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
