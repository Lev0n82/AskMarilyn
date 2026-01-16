import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module3() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Module 3</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">Logical Fallacies (Anti-Patterns)</h1>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={3} 
              totalModules={TOTAL_ABT_MODULES} 
              estimatedMinutes={MODULE_READING_TIMES[3]} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">E</span>ven with the best intentions, it is easy to fall into logical traps. In software testing, we call these "anti-patterns." They are approaches that seem sensible at first glance but ultimately lead to confusion and inefficiency.
            </p>
            <p className="font-sans leading-relaxed">
              Recognizing these fallacies is the first step toward avoiding them.
            </p>
          </div>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
            <img 
              src="/images/module-3-anti-patterns.jpg" 
              alt="Illustration of a Rube Goldberg machine representing anti-patterns" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Anti-Pattern 1 */}
          <div className="bg-card border border-border rounded-xl p-6 paper-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">The "Enter, Enter, Click" Fallacy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Documenting every single keystroke and mouse click.
            </p>
            <div className="bg-muted p-3 rounded text-xs font-mono mb-3">
              click("username_field")<br/>
              type("admin")<br/>
              press_key("TAB")
            </div>
            <p className="text-xs font-sans">
              <strong>The Flaw:</strong> Too much detail creates brittle tests. Focus on the <em>intent</em> (e.g., "login"), not the mechanics.
            </p>
          </div>

          {/* Anti-Pattern 2 */}
          <div className="bg-card border border-border rounded-xl p-6 paper-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">The "Clueless" Test</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wandering through the app without a clear goal.
            </p>
            <div className="bg-muted p-3 rounded text-xs font-mono mb-3">
              login()<br/>
              check_header()<br/>
              click_random_link()<br/>
              logout()
            </div>
            <p className="text-xs font-sans">
              <strong>The Flaw:</strong> If you can't state the purpose of a test in one sentence, it's likely a "clueless" test.
            </p>
          </div>

          {/* Anti-Pattern 3 */}
          <div className="bg-card border border-border rounded-xl p-6 paper-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">The "Swiss Army Knife"</h3>
            <p className="text-sm text-muted-foreground mb-4">
              An action that tries to do too many things at once.
            </p>
            <div className="bg-muted p-3 rounded text-xs font-mono mb-3">
              login_and_buy_and_logout_if_tuesday(user, item, date)
            </div>
            <p className="text-xs font-sans">
              <strong>The Flaw:</strong> Hard to maintain and debug. Each action should have a single, well-defined purpose.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/module-2">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Module
            </Button>
          </Link>
          <Link href="/module-4">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: Architecture <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
