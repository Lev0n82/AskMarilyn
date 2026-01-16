import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Folder, FileSpreadsheet, GitBranch } from "lucide-react";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module4() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Module 4</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Architecture of Organization</h1>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={4} 
              totalModules={TOTAL_ABT_MODULES} 
              estimatedMinutes={MODULE_READING_TIMES[4]} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-[1.5fr,1fr] gap-8 items-start">
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">W</span>e have learned about the "bricks" of our testing house—the Actions. Now, we must discuss the blueprints. You wouldn't store your silverware in the garage, nor would you file your tax returns in the refrigerator.
            </p>
            <p className="font-sans leading-relaxed">
              Just as a library needs the Dewey Decimal System, your tests need a logical home based on what they <em>are</em>, not just what they <em>do</em>. In Action-Based Testing, we organize our work into <strong>Test Modules</strong>.
            </p>
            
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm mt-6">
              <h3 className="font-serif font-bold text-primary text-xl mb-4">The Two Types of Modules</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent">
                    <FileSpreadsheet className="h-5 w-5" />
                    <h4 className="font-bold font-sans">Business Objects</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tests focused on a specific entity, like "Invoices" or "Customers". These modules verify that the object itself behaves correctly (CRUD operations).
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent">
                    <GitBranch className="h-5 w-5" />
                    <h4 className="font-bold font-sans">Business Flows</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tests that span multiple objects to achieve a goal, like "Order Fulfillment" (which involves Customers, Orders, and Inventory).
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square w-full rounded-xl overflow-hidden paper-shadow border border-border bg-card p-2">
            <img 
              src="/images/module-4-architecture.jpg" 
              alt="Illustration of organizing tests into logical structures" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>

        <div className="bg-secondary/30 p-8 rounded-xl border border-border space-y-4">
          <div className="flex items-start gap-4">
            <Folder className="h-8 w-8 text-primary mt-1" />
            <div>
              <h3 className="font-serif font-bold text-lg">Marilyn's Rule of Order</h3>
              <p className="font-sans text-muted-foreground italic mt-2">
                "If you cannot find a test within 30 seconds, it is not lost—it is misplaced. A well-architected system requires no memory to navigate, only logic."
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/module-3">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Module
            </Button>
          </Link>
          <Link href="/module-5">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: The Language of Logic <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
