import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, BookOpen, FlaskConical, GitBranch, ShieldCheck,
  Layers, Target, Brain, Cpu, ExternalLink, ChevronRight, BarChart3,
} from "lucide-react";

const ABT_PRINCIPLES = [
  {
    icon: Target,
    title: "Atomic",
    colour: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    description:
      "Each test condition addresses exactly one observable behaviour. Atomic conditions eliminate ambiguity, prevent overlapping coverage, and make root-cause analysis deterministic. A failing atomic condition points to exactly one defect.",
  },
  {
    icon: GitBranch,
    title: "Behaviour-Driven",
    colour: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    description:
      "Conditions are derived from observable system behaviours described in acceptance criteria, not from implementation details. This decouples the test suite from the codebase, making it resilient to refactoring and meaningful to non-technical stakeholders.",
  },
  {
    icon: Layers,
    title: "Traceable",
    colour: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
    description:
      "Every condition carries a bidirectional traceability link: upstream to the work item and acceptance criterion that motivated it, downstream to the test step sequence and execution result. Traceability is the foundation of release confidence.",
  },
];

const DDD_COLUMNS = [
  { num: "1", name: "TESTCASENAME", desc: "Unique identifier for the test case" },
  { num: "2", name: "TESTSTEPDESCRIPTION", desc: "Human-readable step description" },
  { num: "3", name: "STEPNUM", desc: "Step sequence number (supports GOTO branching)" },
  { num: "4", name: "ACTIONONOBJECT", desc: "Action type (35 types: Login, Click, Verify, etc.)" },
  { num: "5", name: "OBJECT", desc: "Target element — HTML ID, XPath, or inner text" },
  { num: "6", name: "VALUE", desc: "Input or expected value; ## prefix = credential lookup" },
  { num: "7", name: "COMMENTS", desc: "Locator strategy hint (html id, xpath, innerhtml)" },
  { num: "8", name: "RELEASE", desc: "Release version float" },
  { num: "9", name: "COLLECTION", desc: "Application context (e.g. PFAAM, EDCS)" },
];

const PIPELINE_STAGES = [
  {
    step: "1",
    label: "Intake",
    detail: "Paste a release dashboard or ADO work item. GRACE parses it into structured work items with metadata.",
    icon: BookOpen,
    href: "/grace/release",
    linkLabel: "Release Intake",
  },
  {
    step: "2",
    label: "Derive",
    detail: "The ABT Intelligence Engine reads acceptance criteria and generates DDD v5.1 compliant test conditions — atomic, behaviour-driven, and fully traced.",
    icon: Brain,
    href: "/grace/abt",
    linkLabel: "ABT Workbench",
  },
  {
    step: "3",
    label: "Execute",
    detail: "Upload the generated XLSX. GRACE dispatches each step to a Playwright-controlled browser of your choice, in the environment of your choice.",
    icon: Cpu,
    href: "/grace/xls",
    linkLabel: "XLSX Runner",
  },
  {
    step: "4",
    label: "Publish",
    detail: "Results are written back to the XLSX and published to Azure DevOps as a completed test run — pass/fail per condition, with screenshots for failures.",
    icon: ShieldCheck,
    href: "/grace/hitl",
    linkLabel: "HITL Queue",
  },
  {
    step: "5",
    label: "Analyse",
    detail: "Dashboards surface pass/fail trends, condition coverage, defect density, and execution velocity across releases — turning raw run data into quality intelligence.",
    icon: BarChart3,
    href: "/grace/dashboard",
    linkLabel: "GRACE Dashboard",
  },
];

export default function GraceHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-blue-600 text-white text-xs px-3 py-1">CSC-GRACE-AI</Badge>
            <Badge variant="outline" className="border-white/30 text-white/70 text-xs px-3 py-1">HITL</Badge>
            <Badge variant="outline" className="border-white/30 text-white/70 text-xs px-3 py-1">DDD v5.1</Badge>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Community Services Cluster<br />
            <span className="text-blue-400">Generative Requirements Aware</span><br />
            Cognitive Engineering AI
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mb-8">
            GRACE automates the full quality engineering lifecycle — from release dashboard to executed test run — using Atomic Behaviour Testing (ABT) as its foundational methodology.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={() => { window.location.href = "/grace/dashboard"; }}
            >
              Open GRACE Portal <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 gap-2"
              onClick={() => window.open("https://learnsdlc.org", "_blank", "noopener,noreferrer")}
            >
              ABT Course on learnsdlc.org <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ABT Fundamentals */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Methodology</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">What is Atomic Behaviour Testing?</h2>
          <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
            Atomic Behaviour Testing (ABT) is a structured test design methodology developed for the Ontario Public Service SDLC. It derives test conditions directly from acceptance criteria, decomposes them into the smallest independently verifiable unit of behaviour, and organises them into a dependency graph that drives execution order. ABT is the standard mandated by the CSCDDSB Design and Development Document (DDD) v5.1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {ABT_PRINCIPLES.map((p) => (
            <div key={p.title} className={`rounded-xl p-6 ${p.bg}`}>
              <div className={`flex items-center gap-2 mb-3 ${p.colour}`}>
                <p.icon className="h-5 w-5" />
                <span className="font-bold text-lg">{p.title}</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* DDD v5.1 9-Column Format */}
        <div className="mb-14">
          <h3 className="text-xl font-bold mb-2">DDD v5.1 — The 9-Column Test Script Format</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
            All GRACE-generated and GRACE-executed test scripts conform to the DDD v5.1 Excel format. Each row is one test step. The nine columns carry the full execution contract — from the human-readable description to the machine-executable action, locator, and value.
          </p>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm" aria-label="GRACE workflow steps">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-56">Column</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {DDD_COLUMNS.map((col, i) => (
                  <tr key={col.num} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{col.num}</td>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">{col.name}</td>
                    <td className="px-4 py-2.5 text-foreground/80">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRACE Pipeline */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">The GRACE Pipeline</span>
          </div>
          <h3 className="text-xl font-bold mb-2">From Release Dashboard to ADO Test Run</h3>
          <p className="text-muted-foreground text-sm mb-8 max-w-2xl">
            GRACE implements the full ABT lifecycle as a five-stage pipeline. Each stage is a distinct GRACE Portal page, and each stage produces a structured artefact that feeds the next.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.step} className="border border-border rounded-xl p-5 hover:border-blue-400 transition-colors group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {stage.step}
                  </span>
                  <span className="font-bold text-base">{stage.label}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{stage.detail}</p>
                <Link href={stage.href}>
                  <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                    {stage.linkLabel} <ChevronRight className="h-3 w-3" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Learn More CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Learn ABT on learnsdlc.org</h3>
            <p className="text-white/80 max-w-lg">
              The full ABT course — covering the DDD v5.1 standard, condition decomposition, dependency graphs, credential management, and the GRACE execution model — is available on the SDLC Learning Portal.
            </p>
          </div>
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold gap-2 px-6 py-3 text-base flex-shrink-0"
            onClick={() => window.open("https://learnsdlc.org", "_blank", "noopener,noreferrer")}
          >
            Go to ABT Course <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        CSC-GRACE-AI — Community Services Cluster Generative Requirements Aware Cognitive Engineering AI — HITL &nbsp;|&nbsp; DDD v5.1 &nbsp;|&nbsp; CSCDDSB
      </footer>
    </div>
  );
}
