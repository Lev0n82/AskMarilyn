import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Brain, Lightbulb } from "lucide-react";
import { ModuleProgress } from "@/components/ModuleProgress";

const TOTAL_GRACE_MODULES = 30;
const MODULE_READING_TIME = 8;

export default function GraceModule1() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">GRACE Academy • Module 1</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Ghost in the Machine</h1>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={1} 
              totalModules={TOTAL_GRACE_MODULES} 
              estimatedMinutes={MODULE_READING_TIME} 
            />
          </div>
        </div>

        {/* Guest Lecturer Introduction */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-primary">Guest Lecturer: A Philosopher</p>
                <p className="text-sm text-muted-foreground italic mt-1">
                  "The question is not whether machines can think, but whether humans can think clearly enough to teach them."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reader Question */}
        <div className="bg-muted/50 p-6 rounded-xl border-l-4 border-primary">
          <p className="font-serif italic text-lg">
            "Dear Marilyn,
          </p>
          <p className="font-serif italic text-lg mt-2">
            I spend more time maintaining my automated tests than I do writing new ones. Every time the UI changes, 
            half my tests break. I feel like I'm running on a treadmill, getting nowhere. Is there a better way?
          </p>
          <p className="font-serif italic text-lg mt-2">
            — Exhausted in Edmonton"
          </p>
        </div>

        {/* Marilyn's Response */}
        <div className="prose prose-lg max-w-none">
          <h2 className="font-serif text-2xl font-bold text-primary">Marilyn Responds:</h2>
          
          <p className="font-sans leading-relaxed">
            <span className="drop-cap">Y</span>our frustration is not a personal failing; it is a symptom of a systemic disease. 
            You are not alone. Across the industry, QA engineers are trapped in the same cycle: write tests, watch them break, 
            fix them, repeat. It is a Sisyphean task, and it is entirely unnecessary.
          </p>

          <p className="font-sans leading-relaxed">
            The problem is not your tests. The problem is the <em>philosophy</em> behind your tests. You have been taught 
            to automate the <em>mechanics</em> of testing—the clicks, the keystrokes, the element IDs. But mechanics are 
            fragile. They change with every sprint.
          </p>

          <div className="quote-block my-6 p-6 bg-secondary/30 rounded-xl border-l-4 border-accent">
            <p className="font-serif text-xl italic">
              "The goal is not to automate the test. The goal is to automate the <strong>intent</strong> of the test."
            </p>
          </div>

          <p className="font-sans leading-relaxed">
            What if, instead of telling the machine <em>how</em> to test, you could tell it <em>what</em> to test? 
            What if you could write a test case in plain English—"Verify that a student can register for a course"—and 
            have the machine figure out the rest?
          </p>

          <p className="font-sans leading-relaxed">
            This is not a fantasy. This is the promise of <strong>GRACE</strong>: <strong>G</strong>enerative 
            <strong>R</strong>equirement <strong>A</strong>ware <strong>C</strong>ognitive <strong>E</strong>ngineering.
          </p>
        </div>

        {/* The Core Concept */}
        <div className="bg-secondary/30 p-8 rounded-xl border border-border space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            The Core Concept: Intent Over Mechanics
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg mb-3 text-destructive">The Old Way (Mechanics)</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
                  <p className="text-muted-foreground">// Brittle, breaks constantly</p>
                  <p>driver.findElement(By.id("txtUsername")).sendKeys("student1");</p>
                  <p>driver.findElement(By.id("txtPassword")).sendKeys("pass123");</p>
                  <p>driver.findElement(By.id("btnLogin")).click();</p>
                  <p>driver.findElement(By.xpath("//a[contains(@href,'courses')]")).click();</p>
                  <p>// ... 50 more lines of fragile code</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every element ID is a point of failure. Change one, and the test breaks.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg mb-3 text-accent">The GRACE Way (Intent)</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
                  <p className="text-muted-foreground">// Clear, resilient, human-readable</p>
                  <p className="text-primary font-bold">Test Case: Student Course Registration</p>
                  <p className="text-primary">1. Log in as a student</p>
                  <p className="text-primary">2. Navigate to the course catalog</p>
                  <p className="text-primary">3. Add "Introduction to Physics" to cart</p>
                  <p className="text-primary">4. Complete registration</p>
                  <p className="text-primary">5. Verify confirmation message</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  The AI figures out the mechanics. You focus on the business logic.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* The Challenge */}
        <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/30">
          <h3 className="font-serif font-bold text-lg mb-3 text-amber-600">The Challenge:</h3>
          <p className="text-muted-foreground">
            If the machine is doing the "thinking," how do we ensure it thinks correctly? How do we trust an AI 
            to test our software? This is the central tension we will explore throughout this course. The answer 
            lies not in blind trust, but in building systems that are transparent, auditable, and self-correcting.
          </p>
        </div>

        {/* Quiz Preview */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <h3 className="font-serif font-bold text-lg mb-4">Quick Check: Module 1</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Question:</strong> What is the primary difference between traditional test automation and the GRACE approach?
            </p>
            <div className="space-y-2 text-sm">
              <p>a) GRACE uses a different programming language.</p>
              <p>b) GRACE automates the <em>intent</em> of a test, not just the mechanics.</p>
              <p>c) GRACE eliminates the need for any human involvement.</p>
              <p>d) GRACE only works for web applications.</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              (Answer: b — The core philosophy is to express <em>what</em> to test, and let the AI determine <em>how</em>.)
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/grace-academy">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Course Overview
            </Button>
          </Link>
          <Link href="/grace-academy/module-2">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: A Compiler for Quality <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
