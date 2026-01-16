import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Terminal, Type, Globe } from "lucide-react";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module5() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Module 5</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Language of Logic</h1>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={5} 
              totalModules={TOTAL_ABT_MODULES} 
              estimatedMinutes={MODULE_READING_TIMES[5]} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr,1.5fr] gap-8 items-start" style={{marginBottom: '0px'}}>
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
            <img 
              src="/images/module-5-language.jpg" 
              alt="Illustration of the Rosetta Stone representing interface definitions" 
              className="object-cover w-full h-full rounded-lg" style={{marginTop: '2px', marginRight: '2px', marginBottom: '2px', marginLeft: '2px'}}
            />
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">P</span>recision in language leads to precision in thought. If you have to explain what an action does, you have likely named it wrong. In ABT, we treat our test names and arguments with the same rigor as a legal contract.
            </p>
            
            <div className="space-y-6 mt-4">
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Type className="h-5 w-5 text-accent" />
                  <h3 className="font-serif font-bold text-lg">The Verb-Noun Rule</h3>
                </div>
                <p className="font-sans text-sm mb-3">
                  Actions should always be named with a verb followed by a noun. This creates a predictable, readable sentence structure.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-destructive/10 p-2 rounded border border-destructive/20">
                    <span className="font-bold text-destructive block mb-1">Incorrect</span>
                    <code className="text-xs">balance_check</code><br/>
                    <code className="text-xs">invoice_new</code>
                  </div>
                  <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                    <span className="font-bold text-green-600 block mb-1">Correct</span>
                    <code className="text-xs">check_balance</code><br/>
                    <code className="text-xs">create_invoice</code>
                  </div>
                </div>
              </div>

              <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-5 w-5 text-accent" />
                  <h3 className="font-serif font-bold text-lg">The Rosetta Stone (Interface Definitions)</h3>
                </div>
                <p className="font-sans text-sm mb-3">
                  We need a translator between human intent and machine reality. <strong>Interface Definitions</strong> map logical names to technical identifiers.
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs">
                  <span className="text-muted-foreground"># The Map</span><br/>
                  <span className="text-primary">"Submit Button"</span> = <span className="text-accent">"#btn_submit_v2"</span><br/>
                  <span className="text-primary">"User Field"</span> = <span className="text-accent">"input[name='username']"</span>
                </div>
                <p className="font-sans text-xs text-muted-foreground mt-2">
                  When the developer changes the ID to <code>#btn_submit_v3</code>, you update this map once. Your thousands of tests remain untouched.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 p-6 rounded-xl border border-border flex items-center gap-4">
          <Terminal className="h-10 w-10 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-serif font-bold text-lg">The Simplicity Principle</h3>
            <p className="font-sans text-muted-foreground">
              Keep arguments simple. Use default values to avoid clutter. If an action requires 15 arguments, it is likely doing too much (see: The "Swiss Army Knife" Anti-Pattern).
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/module-4">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Module
            </Button>
          </Link>
          <Link href="/module-6">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: Test Life-Cycle <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
