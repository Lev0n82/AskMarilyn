import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Layers, Wrench, Sparkles, Activity, Database, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
            Ask Marilyn Academy of Arts, and Neural Science
          </h1>
          <p className="text-xl text-muted-foreground font-serif italic">
            "Logic is the beginning of wisdom, not the end."
          </p>
          <p className="text-lg text-foreground/80 font-sans max-w-2xl mx-auto leading-relaxed">
            Welcome to the premier destination for advanced software engineering, architectural reasoning, and neural science. Choose your path below to begin your journey.
          </p>
        </section>

        {/* Course Gallery Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Software Quality ABT */}
          <Card className="flex flex-col hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-600">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="font-serif text-xl">Software Quality ABT</CardTitle>
              <CardDescription>The Foundation of Logical Testing</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                A comprehensive 10-module curriculum on Action-Based Testing. Learn to dismantle the "Testing Paradox," master the three layers of architecture, and apply the language of logic to build resilient test modules.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/module-1">
                <Button className="w-full group">
                  Start Curriculum <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Systems Architect */}
          <Card className="flex flex-col hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-600">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="font-serif text-xl">Systems Architect</CardTitle>
              <CardDescription>Master Agentic AI & Platform Engineering</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Design the future of computing. Dive deep into Agentic AI workflows, Platform Engineering principles, and Green Computing strategies to build sustainable, scalable systems.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/systems-architect">
                <Button variant="outline" className="w-full group">
                  View Course <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Database Administrator */}
          <Card className="flex flex-col hover:shadow-lg transition-all duration-300 border-t-4 border-t-amber-600">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="font-serif text-xl">Database Administrator</CardTitle>
              <CardDescription>ACID, Vector DBs & Security Fortresses</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Go beyond basic SQL. Explore the depths of ACID compliance, modern Vector Databases for AI, and constructing impenetrable Security Fortresses for your data.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dba">
                <Button variant="outline" className="w-full group">
                  View Course <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Data Scientist */}
          <Card className="flex flex-col hover:shadow-lg transition-all duration-300 border-t-4 border-t-emerald-600">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle className="font-serif text-xl">Data Scientist</CardTitle>
              <CardDescription>The Architect of Intelligence</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Become an architect of intelligence. Master Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and MLOps pipelines.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/data-scientist">
                <Button variant="outline" className="w-full group">
                  View Course <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Healthcare Architect */}
          <Card className="flex flex-col hover:shadow-lg transition-all duration-300 border-t-4 border-t-rose-600">
            <CardHeader>
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-rose-600" />
              </div>
              <CardTitle className="font-serif text-xl">Healthcare Architect</CardTitle>
              <CardDescription>The Digital Healer</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bridge the gap between technology and patient care. Learn HL7 standards, FHIR interoperability, and how to build SMART on FHIR applications.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/healthcare-architect">
                <Button variant="outline" className="w-full group">
                  View Course <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* NEW: SQL Injection Course */}
          <Card className="flex flex-col hover:shadow-lg transition-all duration-300 border-t-4 border-t-red-600 bg-red-50/30">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="font-serif text-xl">SQL Injection Masterclass</CardTitle>
              <CardDescription>Offensive Security & Defense</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>New!</strong> Learn to think like an attacker to better defend your systems. Master intelligent injection design, schema inference, and advanced exploitation tools in a safe, simulated environment.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/sql-injection">
                <Button className="w-full group bg-red-600 hover:bg-red-700 text-white">
                  Start Hacking <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

        </section>

        {/* Guides & Resources */}
        <section className="pt-12 border-t border-border">
          <h2 className="text-2xl font-serif font-bold text-primary mb-6">Essential Guides & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/technical-writing-guide">
              <div className="group p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Technical Writing</h3>
                <p className="text-sm text-muted-foreground">Master the art of clear, concise technical documentation.</p>
              </div>
            </Link>
            <Link href="/commenting-guide">
              <div className="group p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Art of Commenting</h3>
                <p className="text-sm text-muted-foreground">Learn when, why, and how to write meaningful code comments.</p>
              </div>
            </Link>
            <Link href="/coding-style-guide">
              <div className="group p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Coding Style Guide</h3>
                <p className="text-sm text-muted-foreground">Adopt industry-standard practices for clean, readable code.</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
