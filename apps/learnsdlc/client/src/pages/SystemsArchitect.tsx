import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Server, ShieldCheck, Cpu, Lock, Construction } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function SystemsArchitect() {
  usePageMeta({
    title: "Systems Architecture Course - Introduction",
    description: "Educational course on modern systems architecture for professional development. Part of GRACE Academy curriculum.",
    keywords: "systems architecture education, software architecture training, enterprise architecture course, GRACE Academy"
  });

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");

  const handleStartModule = (moduleName: string) => {
    setSelectedModule(moduleName);
    setShowComingSoon(true);
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Coming Soon Dialog */}
        <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Construction className="w-5 h-5 text-amber-500" />
                {selectedModule} - Coming Soon!
              </DialogTitle>
              <DialogDescription className="pt-2">
                This module is currently under development. Our team is working hard to bring you high-quality content. Check back soon!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowComingSoon(false)}>
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hero Section with Ask Marilyn Style Image */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border">
            <img 
              src="https://private-us-east-1.manuscdn.com/sessionFile/RxwaLFayIQR6GE8u9S69uF/sandbox/x0V79wguIvf70RcKZIWAdw-img-1_1770154332000_na1fn_c3lzdGVtcy1hcmNoaXRlY3QtaGVybw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUnh3YUxGYXlJUVI2R0U4dTlTNjl1Ri9zYW5kYm94L3gwVjc5d2d1SXZmNzBSY0taSVdBZHctaW1nLTFfMTc3MDE1NDMzMjAwMF9uYTFmbl9jM2x6ZEdWdGN5MWhjbU5vYVhSbFkzUXRhR1Z5YncuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=u8791AexVT5EVrRD453s0Adavy8xelIYNkVr8YRilJ~IDbQ1YNxYDQKMmyDLL6HDZaGSmxLYxen5vFoRKuZX24x4a6fPzC6kAA~zpUGDXZfmMQfVuNl8xYssB-hfdqlZ~tVbbxsH0lkp82BtjNBy2kmBVzB4Ag9kNiTSwWfdN6h2STVyDv1DndztdjkQ9ATejYUHlEfVhoMWhyeO8OydIxou3xgvQQzar4OUu8yRKHN3PCbWileeoIpDNH8A4zGg5Cll~QHGwojWgiIa0713iVVl~GHJOgML6skNTsbPeUgOffopWvGUOASHumWWsVUeCAIKJCMsARRPIQ3OzWe-ug__" 
              alt="The Blueprint of Logic - A vintage illustration showing an architect designing a complex system with interconnected components"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                Systems Architect: The Blueprint of Logic
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "A skyscraper isn't built by stacking bricks at random. It requires a blueprint that accounts for gravity, wind, and human behavior. Software is no different."
            </p>
          </div>
        </section>

        {/* Introduction Letter */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Architect's Query
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I'm overwhelmed by the sheer number of choices in modern system design. Microservices or monoliths? SQL or NoSQL? Event-driven or REST? Everyone has an opinion, but nobody seems to have a consistent logic. How do I choose the right architecture without guessing?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">C</span>hoice paralysis is the enemy of good design. The mistake is thinking these are just "preferences." They are tools, and every tool has a specific purpose.
              </p>
              <p className="font-sans leading-relaxed">
                A Systems Architect doesn't guess; they analyze trade-offs. We will explore <strong>Agentic AI patterns</strong>, <strong>Platform Engineering</strong>, and <strong>Green Computing</strong> not as buzzwords, but as logical solutions to specific constraints.
              </p>
            </div>
            
            {/* Course Modules with Images */}
            <div className="grid gap-6 mt-8">
              {/* Module 1: Agentic AI Patterns */}
              <Card className="border-l-4 border-l-primary overflow-hidden">
                <div className="grid md:grid-cols-[200px,1fr]">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/RxwaLFayIQR6GE8u9S69uF/sandbox/x0V79wguIvf70RcKZIWAdw-img-2_1770154328000_na1fn_c3lzdGVtcy1hcmNoaXRlY3QtYWdlbnRpYy1haQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUnh3YUxGYXlJUVI2R0U4dTlTNjl1Ri9zYW5kYm94L3gwVjc5d2d1SXZmNzBSY0taSVdBZHctaW1nLTJfMTc3MDE1NDMyODAwMF9uYTFmbl9jM2x6ZEdWdGN5MWhjbU5vYVhSbFkzUXRZV2RsYm5ScFl5MWhhUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=MzgbhczwrP8g6-4NKYFKg3wcKRB-xt-14JDpne2VJPyvDLJkz~KGSOBiJzn8UHC8YBXLJ8kwNMIdKkJKl9U6ztHKfrYop2u6eHsOna7ym1UP8F557VkGqIxJ8M~dgRR5nQ2fIRLoeMDdVtzNH-7xEY2usuan9H5NZ2qgpPjG8mDkoojqEPwWIzHLdzrbzlEjeZ7F2s5ot-bLla21piG5dpBawZaa0xTWDxLJw3x1NmdgifjtJkZCGnFUpIrLz0b1b8jgq08DKUr-SS-38FBWyyTDueXZF6yooTo8LQlfXQsJ2ugkeVHmx~RrLTid0tjZkr5DS6SBpkbhYfqdLTp4uQ__" 
                    alt="Agentic AI - Autonomous agents planning and executing complex workflows"
                    className="w-full h-40 md:h-full object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Cpu className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Module 1: Agentic AI Patterns</h4>
                        <p className="text-muted-foreground mb-4">
                          Moving beyond simple chatbots to autonomous agents that can plan, reason, and execute complex workflows.
                        </p>
                        <Link href="/systems-architect/agentic-ai">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Start Module
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Module 2: Platform Engineering */}
              <Card className="border-l-4 border-l-secondary overflow-hidden">
                <div className="grid md:grid-cols-[200px,1fr]">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/RxwaLFayIQR6GE8u9S69uF/sandbox/x0V79wguIvf70RcKZIWAdw-img-3_1770154331000_na1fn_c3lzdGVtcy1hcmNoaXRlY3QtcGxhdGZvcm0tZW5naW5lZXJpbmc.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUnh3YUxGYXlJUVI2R0U4dTlTNjl1Ri9zYW5kYm94L3gwVjc5d2d1SXZmNzBSY0taSVdBZHctaW1nLTNfMTc3MDE1NDMzMTAwMF9uYTFmbl9jM2x6ZEdWdGN5MWhjbU5vYVhSbFkzUXRjR3hoZEdadmNtMHRaVzVuYVc1bFpYSnBibWMuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=baVXV1U~E50JIk~dmfBe6f8bU20u1dagDsv3Fg3zvfyhlQbvS29KTqmvQrvrtO321B7gOYAsMw4ZpmGGPuJM4b~rmoz5cXpvv-bgZMEfq9c8LF~xxOoHfIoMLy~4~IKPlHAssTnJhB2XgVWa7w-PVcnJf6qShkjpV18zVNKZdr5ocx~bHaUVPnfIm0mgm-0PsyFyT5lVELQ3JzPJIuouW8-BmhFy3NhytHcTSfmerZfVWDniN4TuJAYbRJirMIjGd7RnlkIiWHmI6K~3xy7fDYoZZ~KGoI10F1cUXaIc9FbaF6ZuO~VEc3roEr0WE4TDcZ5EKC9swDHVGJfLWiQfqg__" 
                    alt="Platform Engineering - Building internal developer platforms"
                    className="w-full h-40 md:h-full object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <Server className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Module 2: Platform Engineering</h4>
                        <p className="text-muted-foreground mb-4">
                          Building the "Internal Developer Platform" (IDP) to reduce cognitive load and standardize deployments.
                        </p>
                        <Link href="/systems-architect/platform-engineering">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Start Module
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Module 3: Green Computing */}
              <Card className="border-l-4 border-l-accent overflow-hidden">
                <div className="grid md:grid-cols-[200px,1fr]">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/RxwaLFayIQR6GE8u9S69uF/sandbox/x0V79wguIvf70RcKZIWAdw-img-4_1770154332000_na1fn_c3lzdGVtcy1hcmNoaXRlY3QtZ3JlZW4tY29tcHV0aW5n.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUnh3YUxGYXlJUVI2R0U4dTlTNjl1Ri9zYW5kYm94L3gwVjc5d2d1SXZmNzBSY0taSVdBZHctaW1nLTRfMTc3MDE1NDMzMjAwMF9uYTFmbl9jM2x6ZEdWdGN5MWhjbU5vYVhSbFkzUXRaM0psWlc0dFkyOXRjSFYwYVc1bi5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=g3he8VEM5otrLCzHCIEJeRLF~-1CgMU9ipqm4G0uAjE8R1sv0Xo7Shew878C9~6ZRv05xbjnY3YF6qoergHJ2ztQyfJSP36KVnv~pyG4Stsbcsybo1g~LBAqy9TV8QZ729R3jWbJvsNmn7PqLB5AjeXqHlmu1ogAz00r~7wSTVIti62VYHv7kTjJQ9VR~T3AFvKGMm4pUGv0IcXV9r5L~qnrs0JMh1MgUv6dKgKuxNpOqnMBeHMkFQBGEDDw1H3kY3NjQpENnO~hhfbF1BbAzL6OYEBDIuu7dpY0YjWmbNpdjUTjPXZYHT3pLXDAN~OXSGC3RULSz6Axng1rXmFL8Q__" 
                    alt="Green Computing - Energy efficient architecture design"
                    className="w-full h-40 md:h-full object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Module 3: Green Computing</h4>
                        <p className="text-muted-foreground mb-4">
                          Optimizing architecture not just for speed, but for energy efficiency and carbon footprint reduction.
                        </p>
                        <Link href="/systems-architect/green-computing">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Start Module
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg">Architect's Toolkit</h3>
                <ul className="space-y-2 text-sm font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Trade-off Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Scalability Patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Security by Design
                  </li>
                </ul>
                <div className="pt-4 border-t border-border/50">
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="w-full">
                      &larr; Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
