import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module2() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Module 2</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Three Layers of Logic</h1>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={2} 
              totalModules={TOTAL_ABT_MODULES} 
              estimatedMinutes={MODULE_READING_TIMES[2]} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr,1.5fr] gap-8 items-start">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
            <img 
              src="/images/module-2-layers.jpg" 
              alt="Visual representation of the three layers" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>o bring order to chaos, we must organize our actions into a hierarchy. Think of it as a government: you have local officials, state representatives, and federal leaders. Each handles problems at their appropriate level.
            </p>
            <p className="font-sans leading-relaxed">
              In Action-Based Testing, we use three distinct layers to separate the "what" from the "how".
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <h3 className="font-serif font-bold text-primary text-lg">1. High-Level Actions</h3>
                <p className="text-sm text-muted-foreground mb-2">The "Business Goal"</p>
                <p className="font-sans text-sm">
                  These describe broad business processes. They are composed of mid-level actions.
                  <br/>
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded mt-1 inline-block">purchase_product("Laptop")</span>
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border shadow-sm ml-4 border-l-4 border-l-accent">
                <h3 className="font-serif font-bold text-primary text-lg">2. Mid-Level Actions</h3>
                <p className="text-sm text-muted-foreground mb-2">The "Functional Steps"</p>
                <p className="font-sans text-sm">
                  Specific tasks that make up a process. They hide the UI details.
                  <br/>
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded mt-1 inline-block">login(), add_to_cart(), checkout()</span>
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border shadow-sm ml-8">
                <h3 className="font-serif font-bold text-primary text-lg">3. Low-Level Actions</h3>
                <p className="text-sm text-muted-foreground mb-2">The "Mechanics"</p>
                <p className="font-sans text-sm">
                  Basic interactions with the interface. The only place where UI maps exist.
                  <br/>
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded mt-1 inline-block">click("submit_btn"), type("user_field", "bob")</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 p-6 rounded-xl border border-border">
          <h3 className="font-serif font-bold text-lg mb-2">Why this matters</h3>
          <p className="font-sans text-muted-foreground">
            This layered approach allows you to separate the <strong>business logic</strong> (what you are testing) from the <strong>automation implementation</strong> (how the tool interacts with the app). When the UI changes, you only fix the Low-Level Actions. Your business tests remain untouched.
          </p>
        </div>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/module-1">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Module
            </Button>
          </Link>
          <Link href="/module-3">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: Anti-Patterns <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
