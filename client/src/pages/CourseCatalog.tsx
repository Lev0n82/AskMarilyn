import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  MessageSquare, 
  FileText,
  ArrowRight,
  Clock,
  Target,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { QuickStartWalkthrough } from "@/components/QuickStartWalkthrough";
import { ResumeLearning } from "@/components/ResumeLearning";

interface CourseCardProps {
  title: string;
  subtitle: string;
  description: string;
  fact: string;
  whyImportant: string;
  image: string;
  href: string;
  modules: number;
  quizzes: number;
  duration: string;
  category: "core" | "bonus";
  icon: React.ReactNode;
}

function CourseCard({ 
  title, 
  subtitle, 
  description, 
  fact, 
  whyImportant, 
  image, 
  href, 
  modules, 
  quizzes, 
  duration, 
  category,
  icon 
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <Badge 
          variant={category === "core" ? "default" : "secondary"}
          className="absolute top-4 right-4"
        >
          {category === "core" ? "Core Curriculum" : "Bonus Course"}
        </Badge>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="pt-6 space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
          <p className="text-sm font-medium flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span><strong>Did you know?</strong> {fact}</span>
          </p>
        </div>
        
        <div className="p-4 bg-amber-500/5 rounded-lg">
          <p className="text-sm flex items-start gap-2">
            <Target className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Why take this course?</strong> {whyImportant}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {modules} modules
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            {quizzes} quizzes
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {duration}
          </span>
        </div>
        
        <Link href={href}>
          <Button className="w-full gap-2 group-hover:bg-primary/90">
            Start Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function CourseCatalog() {
  const courses: CourseCardProps[] = [
    {
      title: "Action Based Testing",
      subtitle: "ABT Fundamentals",
      description: "Master the revolutionary three-layer architecture that separates test logic from implementation. Learn to build maintainable, reusable test modules that survive UI changes.",
      fact: "Organizations using ABT report up to 80% reduction in test maintenance costs. The three-layer architecture means a single UI change requires updating only one place, not hundreds of test cases.",
      whyImportant: "In an industry where 60% of testing effort goes to maintenance, ABT transforms testing from a cost center into a strategic asset. Your tests become living documentation that actually stays current.",
      image: "/images/courses/abt-fundamentals.png",
      href: "/module-1",
      modules: 10,
      quizzes: 30,
      duration: "4-6 hours",
      category: "core",
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      title: "C# Coding Style",
      subtitle: "Clean Code Principles",
      description: "Transform your code from 'it works' to 'it's a pleasure to read.' Learn file organization, naming conventions, indentation rules, and the subtle art of making code self-documenting.",
      fact: "Studies show developers spend 10x more time reading code than writing it. A consistent coding style reduces cognitive load by up to 30%, letting your brain focus on logic instead of deciphering formatting.",
      whyImportant: "Code is read far more often than it's written. Clean, consistent style isn't vanity—it's velocity. Teams with enforced style guides ship faster because code reviews focus on logic, not formatting debates.",
      image: "/images/courses/coding-style.png",
      href: "/coding-style-guide",
      modules: 5,
      quizzes: 5,
      duration: "1-2 hours",
      category: "bonus",
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "The Fine Art of Commenting",
      subtitle: "Documentation That Helps",
      description: "Learn when NOT to comment (most of the time) and when comments are essential. Master XML documentation, avoid the 'comment smell,' and write comments that future-you will thank you for.",
      fact: "The best comment is often no comment at all. Research shows that 62% of comments in production code are either redundant, outdated, or misleading. Good code explains itself; comments explain why.",
      whyImportant: "Bad comments are worse than no comments—they actively mislead. This course teaches you to write comments that add value, not noise. Your future self (debugging at 2 AM) will be grateful.",
      image: "/images/courses/commenting.png",
      href: "/commenting-guide",
      modules: 4,
      quizzes: 4,
      duration: "1 hour",
      category: "bonus",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      title: "Technical Writing",
      subtitle: "Made Easier",
      description: "Master the three pillars of technical writing: legibility, readability, and comprehensibility. Learn sentence structure, style rules, and the editor's pet peeves that will make or break your documentation.",
      fact: "The average technical document is read for only 2-3 minutes before the reader decides to continue or abandon it. Clear writing isn't just nice—it's the difference between documentation that's used and documentation that's ignored.",
      whyImportant: "Every developer writes documentation, but few write it well. Poor documentation costs the industry billions in wasted time. This course gives you the tools to write docs people actually want to read.",
      image: "/images/courses/technical-writing.png",
      href: "/technical-writing-guide",
      modules: 6,
      quizzes: 6,
      duration: "2-3 hours",
      category: "bonus",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-amber-500/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="w-3 h-3 mr-1" />
            Professional Development
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Master the Craft of
            <span className="text-primary"> Quality Software</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From test architecture to technical writing, these courses transform good developers 
            into exceptional ones. Written with wit, backed by research, and designed to stick.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              4 Comprehensive Courses
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              45+ Interactive Quizzes
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Certificates Available
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Community Learning
            </span>
          </div>
        </div>
      </section>

      {/* Resume Learning Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ResumeLearning />
        </div>
      </section>

      {/* Quick Start Walkthrough */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">See How It Works</h2>
          <QuickStartWalkthrough />
        </div>
      </section>

      <Separator />

      {/* Course Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold mb-2">Available Courses</h2>
            <p className="text-muted-foreground">
              Each course features the signature Marilyn vos Savant meets The Onion style—
              intellectually rigorous content delivered with satirical wit.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.href} {...course} />
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Learning Path Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Recommended Learning Path</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Start with ABT Fundamentals</h3>
                <p className="text-sm text-muted-foreground">
                  Build the foundation. Understand test architecture before diving into code quality.
                </p>
              </div>
              <Link href="/module-1">
                <Button variant="outline" size="sm">Begin</Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
              <div className="w-10 h-10 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Level Up with Coding Style</h3>
                <p className="text-sm text-muted-foreground">
                  Write code that others (and future-you) can actually read and maintain.
                </p>
              </div>
              <Link href="/coding-style-guide">
                <Button variant="outline" size="sm">Begin</Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
              <div className="w-10 h-10 rounded-full bg-primary/60 text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Master Commenting</h3>
                <p className="text-sm text-muted-foreground">
                  Learn the art of saying more by writing less. Comments that actually help.
                </p>
              </div>
              <Link href="/commenting-guide">
                <Button variant="outline" size="sm">Begin</Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
              <div className="w-10 h-10 rounded-full bg-primary/40 text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Complete with Technical Writing</h3>
                <p className="text-sm text-muted-foreground">
                  Document your work so well that people actually read it. Revolutionary concept.
                </p>
              </div>
              <Link href="/technical-writing-guide">
                <Button variant="outline" size="sm">Begin</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Transform Your Skills?</h2>
          <p className="text-muted-foreground mb-8">
            Track your progress, earn certificates, and compare your performance with the community.
            Your journey to exceptional software craftsmanship starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/module-1">
              <Button size="lg" className="gap-2">
                Start with ABT Fundamentals
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/learning-progress">
              <Button size="lg" variant="outline" className="gap-2">
                View Your Progress
                <TrendingUp className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
