import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Activity, FileText, Smartphone } from "lucide-react";

export default function HealthcareArchitect() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 to-blue-900" />
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />
            <div className="absolute inset-0 flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                Healthcare Architect: The Guardian of Life
              </h1>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-serif italic text-muted-foreground leading-relaxed">
              "In healthcare, a system failure isn't just an inconvenience; it's a matter of life and death. The logic here must be flawless."
            </p>
          </div>
        </section>

        {/* Introduction Letter */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
              The Architect's Dilemma
            </h2>
            <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
              <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                I'm trying to modernize a hospital's IT system, but it's a nightmare of legacy protocols. HL7 v2, FHIR, DICOM... nothing talks to anything else. Doctors are frustrated, and patients are at risk. Is there a logical way to untangle this mess without breaking everything?
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
              <p className="font-sans leading-relaxed">
                <span className="drop-cap">C</span>omplexity in healthcare is inevitable, but chaos is not. The key is interoperability—the ability of different systems to speak a common language.
              </p>
              <p className="font-sans leading-relaxed">
                We will dissect the evolution from <strong>HL7 v2 to FHIR</strong>, explore the structure of <strong>FHIR Resources</strong>, and learn how <strong>SMART on FHIR</strong> enables modern apps to run safely on top of electronic health records.
              </p>
            </div>
            
            {/* Course Modules */}
            <div className="grid gap-6 mt-8">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 1: HL7 Evolution</h4>
                      <p className="text-muted-foreground mb-4">
                        Tracing the history from the pipe-delimited messages of HL7 v2 to the modern, API-driven world of FHIR.
                      </p>
                      <Button variant="outline" size="sm">Start Module</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <FileText className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 2: FHIR Resources</h4>
                      <p className="text-muted-foreground mb-4">
                        Deep dive into the building blocks of healthcare data: Patient, Observation, Encounter, and MedicationRequest.
                      </p>
                      <Button variant="outline" size="sm">Start Module</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Smartphone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Module 3: SMART on FHIR</h4>
                      <p className="text-muted-foreground mb-4">
                        How to build secure, launchable apps that integrate seamlessly with major EHR platforms like Epic and Cerner.
                      </p>
                      <Button variant="outline" size="sm">Start Module</Button>
                    </div>
                  </div>
                </CardContent>
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
                    Interoperability Standards
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Clinical Data Modeling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    HIPAA Compliance
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
