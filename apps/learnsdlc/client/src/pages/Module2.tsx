import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Module2() {
  usePageMeta({
    title: "ABT Module 2 - The ABT Philosophy",
    description: "Educational module on Action-Based Testing philosophy and principles. Part of GRACE Academy SDLC curriculum.",
    keywords: "ABT philosophy, testing principles education, software quality course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Module 2</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Philosophy of ABT</h1>
            <p className="text-muted-foreground mt-1">Understanding the foundational principles</p>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={2} 
              totalModules={TOTAL_ABT_MODULES} 
              estimatedMinutes={MODULE_READING_TIMES[2]} 
            />
          </div>
        </div>

        {/* Overview Section */}
        <section className="grid md:grid-cols-[1fr,1.5fr] gap-8 items-start">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/NpWYtuOIZlotUZqV.jpg" 
              alt="Overview of ABT Philosophy - Marilyn style illustration showing the interconnected principles" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>he philosophy of Action-Based Testing rests on a simple truth: the best tests are those that describe <em>what</em> you're testing, not <em>how</em> you're testing it. This separation of concerns is the key to maintainable, scalable test automation.
            </p>
            <p className="font-sans leading-relaxed">
              Like any sound philosophy, ABT is built on interconnected principles that reinforce each other. Master these, and your tests will be as elegant as a mathematical proof.
            </p>
          </div>
        </section>

        {/* The Three Layers Section */}
        <section className="space-y-6">
          <div className="grid md:grid-cols-[1.5fr,1fr] gap-8 items-center">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2 mb-4">The Three Layers of Logic</h2>
              <p className="font-sans leading-relaxed mb-4">
                To bring order to chaos, we must organize our actions into a hierarchy. Think of it as a government: you have local officials, state representatives, and federal leaders. Each handles problems at their appropriate level.
              </p>
              
              <div className="space-y-4">
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
            
            <div className="relative aspect-square w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/GsKRyFibNTcmsYiB.jpg" 
                alt="The Three Layers of ABT - High, Mid, and Low level actions visualized" 
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Abstraction Section */}
        <section className="space-y-6">
          <div className="grid md:grid-cols-[1fr,1.5fr] gap-8 items-center">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/GNHbcjvlrRWiywVb.jpg" 
                alt="Abstraction in ABT - Hiding complexity behind simple interfaces" 
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2 mb-4">The Power of Abstraction</h2>
              <p className="font-sans leading-relaxed mb-4">
                Abstraction is the art of hiding complexity. When you drive a car, you don't think about the combustion cycles in the engine—you simply press the accelerator. ABT applies this same principle to testing.
              </p>
              <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                <p className="font-sans text-sm italic">
                  "The purpose of abstraction is not to be vague, but to create a new semantic level in which one can be absolutely precise."
                </p>
                <p className="text-xs text-muted-foreground mt-2">— Edsger W. Dijkstra</p>
              </div>
              <p className="font-sans leading-relaxed mt-4">
                Each layer of abstraction should completely hide the implementation details of the layer below it. A business analyst reading your high-level tests shouldn't need to understand XPath selectors.
              </p>
            </div>
          </div>
        </section>

        {/* Reusability Section */}
        <section className="space-y-6">
          <div className="grid md:grid-cols-[1.5fr,1fr] gap-8 items-center">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2 mb-4">Reusability: Write Once, Use Everywhere</h2>
              <p className="font-sans leading-relaxed mb-4">
                The greatest efficiency in test automation comes from reuse. When you create an action like <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">login()</code>, it should work in every test that needs authentication—without modification.
              </p>
              <ul className="space-y-2 font-sans text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span><strong>Actions</strong> are reusable building blocks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span><strong>Test modules</strong> combine actions into workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span><strong>Test suites</strong> orchestrate modules for complete coverage</span>
                </li>
              </ul>
              <p className="font-sans leading-relaxed mt-4 text-muted-foreground">
                A well-designed action library becomes an asset that grows more valuable over time, not a liability that requires constant maintenance.
              </p>
            </div>
            
            <div className="relative aspect-square w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/SlSSZtvPkvjfheiT.jpg" 
                alt="Reusability in ABT - Building blocks that work everywhere" 
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Maintainability Section */}
        <section className="space-y-6">
          <div className="grid md:grid-cols-[1fr,1.5fr] gap-8 items-center">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/PjOBEaxjpLIXGJxA.jpg" 
                alt="Maintainability in ABT - Sustainable test automation" 
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2 mb-4">Maintainability: The Long Game</h2>
              <p className="font-sans leading-relaxed mb-4">
                The true cost of test automation isn't in writing tests—it's in maintaining them. A test suite that breaks with every UI change is worse than no automation at all.
              </p>
              <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <h3 className="font-serif font-bold text-primary">The Maintenance Principle</h3>
                <p className="font-sans text-sm mt-2">
                  When the UI changes, you should only need to update the <strong>low-level actions</strong>. Your business tests—the ones that describe what you're actually testing—should remain untouched.
                </p>
              </div>
              <p className="font-sans leading-relaxed mt-4">
                This is the ultimate test of good ABT architecture: a button moves, a form field is renamed, and your test suite continues to run with a single, localized fix.
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <div className="bg-secondary/30 p-6 rounded-xl border border-border">
          <h3 className="font-serif font-bold text-lg mb-2">The ABT Philosophy in Summary</h3>
          <p className="font-sans text-muted-foreground">
            Action-Based Testing is more than a technique—it's a mindset. By embracing <strong>layered architecture</strong>, <strong>abstraction</strong>, <strong>reusability</strong>, and <strong>maintainability</strong>, you create test automation that scales with your application and stands the test of time. In the following modules, we'll see how these principles translate into practice.
          </p>
        </div>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/module-1">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous: The Testing Paradox
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
