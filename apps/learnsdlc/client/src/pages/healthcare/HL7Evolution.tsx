import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function HL7Evolution() {
  usePageMeta({
    title: "Healthcare IT - HL7 Evolution",
    description: "Educational module on the evolution of HL7 healthcare interoperability standards. Part of GRACE Academy curriculum.",
    keywords: "HL7 education, healthcare standards training, health informatics course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Header */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/healthcare-architect">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Healthcare Architect
              </Button>
            </Link>
            <span>/</span>
            <span>Module 1</span>
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-primary">
            HL7 Evolution: From Pipes to APIs
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~15 min read
            </span>
          </div>
        </section>

        {/* Hero Image */}
        <section>
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/OSAgvdxvFyOUXfYF.jpg" 
            alt="HL7 Evolution - From pipe-delimited messages to modern APIs"
            className="w-full rounded-xl border border-border shadow-lg"
          />
        </section>

        {/* Reader's Dilemma */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Reader's Dilemma
          </h2>
          <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
            <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
            <p className="font-sans text-card-foreground leading-relaxed">
              <span className="font-bold block mb-2">Dear Marilyn,</span>
              Our hospital has been using HL7 v2 messages for decades. Now everyone is talking about FHIR and REST APIs. I'm drowning in pipe characters and segment names like MSH, PID, and OBX. How did we get here, and why should I care about the evolution?
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>he history of healthcare data exchange is a fascinating journey from chaos to order. In the 1980s, every hospital system spoke its own language. A lab system couldn't talk to a pharmacy system, which couldn't talk to the billing system. It was the Tower of Babel, but with patient lives at stake.
            </p>
          </div>
        </section>

        {/* The Spark - Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding HL7's Journey
          </h2>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">The Birth of HL7 (1987)</h3>
              <p className="leading-relaxed">
                Health Level Seven (HL7) was born from necessity. The "7" refers to the seventh layer of the OSI model—the application layer. A group of healthcare IT pioneers gathered to create a standard way for systems to exchange clinical data.
              </p>

              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <p className="text-muted-foreground mb-2"># Example HL7 v2.x Message</p>
                <pre className="whitespace-pre-wrap">
MSH|^~\&|LAB|HOSPITAL|EMR|HOSPITAL|20240115120000||ORU^R01|MSG00001|P|2.5
PID|1||12345^^^HOSP^MR||DOE^JOHN^A||19800101|M
OBR|1|12345|67890|CBC^Complete Blood Count|||20240115100000
OBX|1|NM|WBC^White Blood Cell Count||7.5|10*3/uL|4.5-11.0|N|||F
                </pre>
              </div>

              <p className="leading-relaxed">
                Look at those pipe characters (|) and carets (^). This is the language of HL7 v2.x—a format that has been the backbone of healthcare interoperability for over 35 years. Each segment (MSH, PID, OBR, OBX) tells a specific part of the story.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">The Segments Decoded</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-bold">Segment</th>
                      <th className="text-left p-2 font-bold">Name</th>
                      <th className="text-left p-2 font-bold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">MSH</td>
                      <td className="p-2">Message Header</td>
                      <td className="p-2">Identifies sender, receiver, message type, and encoding</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">PID</td>
                      <td className="p-2">Patient Identification</td>
                      <td className="p-2">Contains patient demographics (name, DOB, MRN)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">OBR</td>
                      <td className="p-2">Observation Request</td>
                      <td className="p-2">Details about the order or test being reported</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">OBX</td>
                      <td className="p-2">Observation Result</td>
                      <td className="p-2">The actual test results with values and units</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">EVN</td>
                      <td className="p-2">Event Type</td>
                      <td className="p-2">Describes the trigger event (admit, discharge, transfer)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">PV1</td>
                      <td className="p-2">Patient Visit</td>
                      <td className="p-2">Information about the patient's visit or encounter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">The Problem with v2.x</h3>
              <p className="leading-relaxed">
                Despite its success, HL7 v2.x has significant limitations:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span><strong>Optionality Hell:</strong> Most fields are optional, leading to wildly different implementations between vendors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span><strong>Z-Segments:</strong> Custom segments (Z-segments) allow vendors to add proprietary data, breaking interoperability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span><strong>Point-to-Point:</strong> Each integration requires custom mapping, creating an N×N problem.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span><strong>No Web Native:</strong> Designed for TCP/IP sockets, not modern REST APIs.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">Enter FHIR (2014)</h3>
              <p className="leading-relaxed">
                Fast Healthcare Interoperability Resources (FHIR, pronounced "fire") was designed to solve these problems. It combines the best of HL7 v2, v3, and CDA with modern web standards:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>RESTful APIs:</strong> Standard HTTP verbs (GET, POST, PUT, DELETE) for all operations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>JSON & XML:</strong> Human-readable formats that developers already know.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Resources:</strong> Well-defined building blocks (Patient, Observation, Medication) with clear structures.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Profiles:</strong> Constrain resources for specific use cases while maintaining interoperability.</span>
                </li>
              </ul>

              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <p className="text-muted-foreground mb-2">// Same data as FHIR JSON</p>
                <pre className="whitespace-pre-wrap">{`{
  "resourceType": "Observation",
  "id": "wbc-result",
  "status": "final",
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "6690-2",
      "display": "White Blood Cell Count"
    }]
  },
  "subject": {
    "reference": "Patient/12345"
  },
  "valueQuantity": {
    "value": 7.5,
    "unit": "10*3/uL",
    "system": "http://unitsofmeasure.org"
  },
  "referenceRange": [{
    "low": {"value": 4.5},
    "high": {"value": 11.0}
  }]
}`}</pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* The Gauntlet - Quiz */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Gauntlet: Test Your Knowledge
          </h2>

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="hl7-evolution"
            question="What does the '7' in HL7 refer to?"
            options={[
              "The seventh version of the standard",
              "The seventh layer of the OSI model (application layer)",
              "The seven founding hospitals",
              "The seven core message types"
            ]}
            correctAnswer={1}
            explanation="HL7 stands for Health Level Seven, referring to the seventh layer of the OSI model—the application layer where healthcare applications exchange data."
            eli5Explanation="Think of the OSI model like a 7-layer cake. The top layer (layer 7) is where apps talk to each other. HL7 works at this 'talking' layer!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="hl7-evolution"
            question="Which HL7 v2.x segment contains patient demographics like name and date of birth?"
            options={[
              "MSH (Message Header)",
              "OBX (Observation Result)",
              "PID (Patient Identification)",
              "EVN (Event Type)"
            ]}
            correctAnswer={2}
            explanation="The PID segment contains patient identification information including name, date of birth, gender, and medical record number."
            eli5Explanation="PID = Patient ID. It's like the patient's ID card inside the message, telling you WHO the message is about."
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="hl7-evolution"
            question="What is a major limitation of HL7 v2.x that FHIR addresses?"
            options={[
              "HL7 v2.x messages are too small",
              "HL7 v2.x requires too much bandwidth",
              "Excessive optionality leads to inconsistent implementations",
              "HL7 v2.x only works with JSON"
            ]}
            correctAnswer={2}
            explanation="HL7 v2.x's excessive optionality means vendors implement it differently, breaking interoperability. FHIR addresses this with well-defined resources and profiles."
            eli5Explanation="Imagine if everyone could spell words however they wanted—nobody would understand each other! HL7 v2 was like that. FHIR says 'here's the dictionary, use it!'"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="hl7-evolution"
            question="What format does FHIR use for data exchange?"
            options={[
              "Only pipe-delimited text",
              "Only XML",
              "JSON and XML",
              "Only binary"
            ]}
            correctAnswer={2}
            explanation="FHIR supports both JSON and XML formats, allowing developers to choose the format that best fits their needs and existing infrastructure."
            eli5Explanation="FHIR speaks two languages—JSON and XML. It's like being bilingual, so more systems can understand it!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="hl7-evolution"
            question="What does FHIR stand for?"
            options={[
              "Fast Health Information Repository",
              "Fast Healthcare Interoperability Resources",
              "Federal Health Integration Requirements",
              "Flexible Health Information Records"
            ]}
            correctAnswer={1}
            explanation="FHIR stands for Fast Healthcare Interoperability Resources, emphasizing speed, healthcare focus, interoperability, and the resource-based architecture."
            eli5Explanation="FHIR = Fast Healthcare Interoperability Resources. It's fast, it's for healthcare, it helps systems work together, and it uses building blocks called 'resources'!"
          />
        </section>

        {/* Navigation */}
        <section className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/healthcare-architect">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </Button>
          </Link>
          <Link href="/healthcare-architect/fhir-resources">
            <Button className="gap-2">
              Next: FHIR Resources
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
