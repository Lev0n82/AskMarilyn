import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module1() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Module 1</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Testing Paradox</h1>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={1} 
              totalModules={TOTAL_ABT_MODULES} 
              estimatedMinutes={MODULE_READING_TIMES[1]} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="prose prose-lg max-w-none">
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">I</span>magine you are tasked with organizing a library. If you simply pile books on the floor as they arrive, you might save time initially. But finding a specific book later becomes impossible.
            </p>
            <p className="font-sans leading-relaxed">
              Software testing often suffers from the same entropy. We write scripts that are "technically accurate" but logically disorganized.
            </p>
            <div className="quote-block my-6">
              "The more we test, the more complicated things get."
            </div>
            <p className="font-sans leading-relaxed">
              This is the paradox. Quality assurance efforts, when unstructured, can actually decrease the maintainability of the software. The solution is not <em>more</em> testing, but <em>smarter</em> testing.
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
            <img 
              src="/images/module-1-paradox.jpg" 
              alt="Visual representation of the testing paradox" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>

        <div className="bg-secondary/30 p-8 rounded-xl border border-border space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary">The Traditional vs. Logical Approach</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg mb-3 text-destructive">The Traditional Way</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
                  <p className="text-muted-foreground">// Hard to read, hard to change</p>
                  <p>navigate_to("https://site.com/login");</p>
                  <p>find("#user").type("admin");</p>
                  <p>find("#pass").type("1234");</p>
                  <p>find("#btn").click();</p>
                  <p>wait_for_load();</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Brittle. If the login ID changes, you must fix every single test script.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg mb-3 text-accent">The Action-Based Way</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
                  <p className="text-muted-foreground">// Clear, reusable, logical</p>
                  <p className="text-primary font-bold">login("admin", "1234")</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Robust. If the login mechanism changes, you update the definition of 'login' once.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Introduction
            </Button>
          </Link>
          <Link href="/module-2">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: The Three Layers <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
