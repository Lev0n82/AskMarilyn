import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Brain, 
  Cpu, 
  Shield, 
  Zap, 
  Trophy,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  BarChart3,
  Settings
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const tracks = [
  {
    id: "foundation",
    title: "Foundation Track",
    subtitle: "Modules 1-10",
    description: "Master the fundamentals of GRACE: the philosophy, the five-layer architecture, and the core components that make autonomous testing possible.",
    modules: 10,
    duration: "4-6 hours",
    color: "bg-blue-500",
    icon: <BookOpen className="w-6 h-6" />,
    href: "/grace-academy/module-1"
  },
  {
    id: "intermediate",
    title: "Intermediate Track",
    subtitle: "Modules 11-20",
    description: "Dive deep into distributed execution, the AI Model Arena, chaos engineering, and security testing. Learn to build systems that compete, evolve, and defend.",
    modules: 10,
    duration: "6-8 hours",
    color: "bg-amber-500",
    icon: <Cpu className="w-6 h-6" />,
    href: "/grace-academy/module-11"
  },
  {
    id: "advanced",
    title: "Advanced Track",
    subtitle: "Modules 21-30",
    description: "Explore the cutting edge: the Semantic Kernel, prompt engineering, ethical AI, and the future of autonomous quality. Become a master architect.",
    modules: 10,
    duration: "8-10 hours",
    color: "bg-purple-500",
    icon: <Brain className="w-6 h-6" />,
    href: "/grace-academy/module-21"
  }
];

export default function GraceAcademyIndex() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-background to-amber-500/10">
          <div className="relative max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              GRACE Academy
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Generative Requirement Aware
              <span className="text-primary"> Cognitive Engineering</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Named after Admiral Grace Hopper, who gave machines the gift of understanding human language.
              Now, we give them the gift of understanding software quality.
            </p>
            <blockquote className="italic text-lg text-muted-foreground border-l-4 border-primary pl-4 max-w-xl mx-auto">
              "The most dangerous phrase in the language is, 'We've always done it this way.'"
              <footer className="text-sm mt-2">— Admiral Grace Hopper</footer>
            </blockquote>
          </div>
        </section>

        {/* Course Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-3xl font-bold">30</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <div className="text-3xl font-bold">90+</div>
              <div className="text-sm text-muted-foreground">Quiz Questions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm text-muted-foreground">Hours of Content</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </CardContent>
          </Card>
        </section>

        {/* Learning Tracks */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">Learning Tracks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <Card key={track.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className={`h-2 ${track.color}`} />
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-full ${track.color} text-white flex items-center justify-center`}>
                      {track.icon}
                    </div>
                    <div>
                      <CardTitle className="font-display">{track.title}</CardTitle>
                      <CardDescription>{track.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{track.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {track.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {track.duration}
                    </span>
                  </div>
                  <Link href={track.href}>
                    <Button className="w-full gap-2 group-hover:bg-primary/90">
                      Start Track
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Capabilities */}
        <section className="bg-muted/30 p-8 rounded-xl">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">What You'll Master</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto text-primary mb-3" />
              <h3 className="font-bold mb-2">AI-Powered Testing</h3>
              <p className="text-sm text-muted-foreground">NLP engines, LLM integration, and autonomous test generation</p>
            </div>
            <div className="text-center">
              <Cpu className="w-12 h-12 mx-auto text-amber-500 mb-3" />
              <h3 className="font-bold mb-2">Distributed Execution</h3>
              <p className="text-sm text-muted-foreground">Job queues, load balancing, and scalable test infrastructure</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto text-red-500 mb-3" />
              <h3 className="font-bold mb-2">Security Testing</h3>
              <p className="text-sm text-muted-foreground">SQL injection, OWASP Top 10, and penetration testing</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto text-blue-500 mb-3" />
              <h3 className="font-bold mb-2">Performance Monitoring</h3>
              <p className="text-sm text-muted-foreground">Core Web Vitals, regression detection, and optimization</p>
            </div>
          </div>
        </section>

        {/* User Actions */}
        {isAuthenticated && (
          <section className="flex flex-wrap justify-center gap-4">
            <Link href="/grace-academy/dashboard">
              <Button variant="outline" size="lg" className="gap-2">
                <BarChart3 className="w-5 h-5" />
                My Progress
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/grace-academy/admin">
                <Button variant="outline" size="lg" className="gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="font-display text-2xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start with the Foundation Track and progress through to Advanced certification.
            Each module builds on the last, creating a comprehensive understanding of autonomous testing.
          </p>
          <Link href="/grace-academy/module-1">
            <Button size="lg" className="gap-2">
              Start Module 1: The Ghost in the Machine
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
