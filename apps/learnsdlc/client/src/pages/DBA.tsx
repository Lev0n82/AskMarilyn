import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Database, Lock, Zap, Construction } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function DBA() {
  usePageMeta({
    title: "Database Administration Course - Introduction",
    description: "Educational course on database administration fundamentals for professional development. Part of GRACE Academy curriculum.",
    keywords: "database administration education, DBA training, database management course, GRACE Academy"
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
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/jioTehxdwPyaUsfk.jpg" 
              alt="The Keeper of Truth - A vintage illustration showing a guardian protecting the sacred vault of data"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                Database Admin: The Keeper of Truth
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "Data is the lifeblood of the modern world. A database administrator doesn't just store it; they protect its integrity, ensure its flow, and guard it against corruption."
            </p>
          </div>
        </section>

        {/* Introduction Letter */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Administrator's Dilemma
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                My company wants to move everything to the cloud and use "serverless" databases. They say we don't need DBAs anymore. But I see data inconsistencies, security holes, and performance bottlenecks everywhere. Am I obsolete, or are they missing something fundamental?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">T</span>he tool may change, but the principle remains. "Serverless" does not mean "logic-less." If anything, the role of the DBA has evolved from a mechanic to an architect.
              </p>
              <p className="font-sans leading-relaxed">
                We must return to first principles: <strong>ACID compliance</strong> for truth, <strong>Vector Databases</strong> for AI integration, and <strong>Security Fortresses</strong> for trust. Without these, your "cloud" is just a fog.
              </p>
            </div>
            
            {/* Course Modules with Images */}
            <div className="grid gap-6 mt-8">
              {/* Module 1: ACID & The Truth */}
              <Card className="border-l-4 border-l-primary overflow-hidden">
                <div className="grid md:grid-cols-[200px,1fr]">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/cjVLPgMyNnMhGkHW.jpg" 
                    alt="ACID Properties - The four pillars of database integrity"
                    className="w-full h-40 md:h-full object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Database className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Module 1: ACID & The Truth</h4>
                        <p className="text-muted-foreground mb-4">
                          Why Atomicity, Consistency, Isolation, and Durability matter more than ever in distributed systems.
                        </p>
                        <Link href="/database-administrator/acid-transactions">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
                            Start Module
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Module 2: Vector Databases */}
              <Card className="border-l-4 border-l-secondary overflow-hidden">
                <div className="grid md:grid-cols-[200px,1fr]">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/iShkbvzhHHzdMVad.jpg" 
                    alt="Vector Databases - High-dimensional data storage for AI"
                    className="w-full h-40 md:h-full object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <Zap className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Module 2: Vector Databases</h4>
                        <p className="text-muted-foreground mb-4">
                          Understanding the new frontier of storing high-dimensional data for AI and semantic search.
                        </p>
                        <Link href="/database-administrator/vector-databases">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
                            Start Module
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Module 3: Security Fortresses */}
              <Card className="border-l-4 border-l-accent overflow-hidden">
                <div className="grid md:grid-cols-[200px,1fr]">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/VWDbalHVgjgWQeKi.jpg" 
                    alt="Security Fortresses - Zero-trust database security"
                    className="w-full h-40 md:h-full object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Lock className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Module 3: Security Fortresses</h4>
                        <p className="text-muted-foreground mb-4">
                          Designing robust access controls, encryption, and audit trails in a zero-trust environment.
                        </p>
                        <Link href="/database-administrator/security-fortress">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
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
                <h3 className="font-serif font-bold text-lg">DBA's Toolkit</h3>
                <ul className="space-y-2 text-sm font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Transaction Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Index Optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Disaster Recovery
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
