import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border">
            <img 
              src="/images/hero-marilyn-style.jpg" 
              alt="Marilyn vos Savant style illustration" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                A Logical Approach to Testing
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "Imagine you're building a complex machine. Would you re-engineer every single screw and bolt each time you wanted to test a new component? Of course not."
            </p>
          </div>
        </section>

        {/* Introduction Letter */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Reader's Dilemma
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I work in software development, and our testing process is a mess. It feels like we're constantly writing tests that are brittle, hard to understand, and a nightmare to maintain. It seems the more we test, the more complicated things get. Is there a more logical way to approach software testing?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">I</span>t sounds like you've stumbled upon a common paradox in the world of software development. Many intelligent people, in their quest for quality, create a testing system so convoluted that it collapses under its own weight.
              </p>
              <p className="font-sans leading-relaxed">
                The problem you're facing is often one of unstructured thinking. The solution is a structured approach called <strong>Action-Based Testing (ABT)</strong>. It’s a method that, when you grasp its core principles, will seem as obvious as the answer to a riddle you've just solved.
              </p>
            </div>
            
            <div className="pt-4">
              <Link href="/module-1">
                <Button size="lg" className="font-serif text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start the Course <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Course Overview</h3>
                <p className="text-xs text-muted-foreground mb-3">10 Modules + Interactive Challenges</p>
                <ul className="space-y-2 text-sm font-sans">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    1. The Testing Paradox
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    2. The Three Layers
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    3. Common Anti-Patterns
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    4. Architecture
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    5. Language of Logic
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    6. Test Life-Cycle
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    7. Building Test Modules
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    8. Advanced Techniques
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    9. Anti-Pattern Gallery
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    10. Test Design Template
                  </li>
                </ul>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">Estimated time: 2-3 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
