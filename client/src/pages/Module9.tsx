import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

const antiPatterns = [
  {
    id: 1,
    name: "Hardcoded",
    icon: "🔒",
    description: "Test data and element identifiers are embedded directly in the test code.",
    problem: "Any change to the UI or data requires modifying the test itself.",
    example: {
      bad: 'click(element: "#btn_submit_v2")\nenter_text(field: "txtUsername", value: "john.doe@acme.com")',
      good: 'click(element: [Submit_Button])\nenter_text(field: [Username_Field], value: [Test_User])'
    },
    fix: "Use interface definitions for elements and data sets for test data."
  },
  {
    id: 2,
    name: "Spaghetti",
    icon: "🍝",
    description: "Actions call other actions in a tangled web of dependencies.",
    problem: "Impossible to understand the flow. Changes break unexpected tests.",
    example: {
      bad: 'action: process_order\n  calls: validate_customer\n    calls: check_credit\n      calls: get_balance\n        calls: validate_customer (circular!)',
      good: 'action: process_order\n  step: validate_customer()\n  step: check_credit()\n  step: create_shipment()'
    },
    fix: "Keep action hierarchies shallow. Actions should call down, never sideways or up."
  },
  {
    id: 3,
    name: "Klunky",
    icon: "🔧",
    description: "High-level tests contain low-level implementation details.",
    problem: "Business users cannot read the tests. Maintenance is difficult.",
    example: {
      bad: 'click(element: "#nav-menu")\nwait(ms: 500)\nclick(element: "#menu-item-3")\nwait(ms: 300)\nclick(element: "#submenu-2")',
      good: 'navigate_to(page: "Invoice Management")'
    },
    fix: "Encapsulate low-level steps in mid-level actions. Keep high-level tests readable."
  },
  {
    id: 4,
    name: "Lifeless",
    icon: "💀",
    description: "Tests do not cover the complete lifecycle of a business object.",
    problem: "Missing coverage for create, update, delete, or state transitions.",
    example: {
      bad: 'Test Module: Invoice\n  - create_invoice ✓\n  - view_invoice ✓\n  - (no edit, delete, approve, reject tests)',
      good: 'Test Module: Invoice\n  - create_invoice ✓\n  - edit_invoice ✓\n  - delete_invoice ✓\n  - approve_invoice ✓\n  - reject_invoice ✓'
    },
    fix: "Use the CRUD + State Transitions checklist for every business object."
  },
  {
    id: 5,
    name: "Lame",
    icon: "🦿",
    description: "Tests lack depth—only happy path, no edge cases or error conditions.",
    problem: "Bugs hide in the corners that are never tested.",
    example: {
      bad: 'Test: Create Invoice\n  - Valid data → Success ✓\n  (no negative tests)',
      good: 'Test: Create Invoice\n  - Valid data → Success ✓\n  - Empty customer → Error ✓\n  - Negative amount → Error ✓\n  - Future date → Warning ✓'
    },
    fix: "For every positive test, add at least 2-3 negative tests."
  },
  {
    id: 6,
    name: "Clueless",
    icon: "❓",
    description: "Tests have no clear scope or objective—they test 'everything' and 'nothing'.",
    problem: "No one knows what the test is supposed to verify.",
    example: {
      bad: 'Test: General System Test\n  Objective: "Test the system"',
      good: 'Test: Invoice Calculation Accuracy\n  Objective: "Verify that invoice totals are calculated correctly including tax, discounts, and multi-currency conversion"'
    },
    fix: "Every test module must have a specific, measurable objective."
  },
  {
    id: 7,
    name: "Sneaky Checking",
    icon: "🥷",
    description: "Verification logic is hidden inside actions instead of explicit check actions.",
    problem: "Failures are hard to diagnose. Checks cannot be reused or skipped.",
    example: {
      bad: 'action: create_invoice\n  (internally verifies total)\n  (internally checks status)\n  (throws if wrong)',
      good: 'create_invoice()\ncheck_invoice_total(expected: "$100")\ncheck_invoice_status(expected: "Draft")'
    },
    fix: "Make all checks explicit. Actions do things; checks verify things."
  },
  {
    id: 8,
    name: "Action Explosion",
    icon: "💥",
    description: "Hundreds of actions with minimal reuse—each test has its own actions.",
    problem: "Maintenance nightmare. No consistency across tests.",
    example: {
      bad: 'Actions: 500+\n  - create_invoice_for_acme\n  - create_invoice_for_globex\n  - create_invoice_for_initech\n  (each slightly different)',
      good: 'Actions: 50\n  - create_invoice(customer, amount)\n  (parameterized, reusable)'
    },
    fix: "Parameterize actions. One action with arguments beats ten specialized actions."
  },
  {
    id: 9,
    name: "Techno",
    icon: "🤖",
    description: "Action names use technical jargon instead of business language.",
    problem: "Business users cannot understand or validate the tests.",
    example: {
      bad: 'execute_sql_insert_tbl_inv\npost_http_api_v2_orders\ntrigger_onclick_btn_submit',
      good: 'create_invoice\nsubmit_order\nclick_submit_button'
    },
    fix: "Use verb_noun naming with business terminology. No SQL, HTTP, or DOM references."
  },
  {
    id: 10,
    name: "Endless",
    icon: "♾️",
    description: "Test cases are extremely long with dozens or hundreds of steps.",
    problem: "Hard to debug. First failure masks all subsequent issues.",
    example: {
      bad: 'Test Case: Complete Order Flow\n  Steps: 1-150\n  (login → browse → cart → checkout → payment → shipping → confirmation → ...)',
      good: 'Test Case: Add to Cart (10 steps)\nTest Case: Checkout (12 steps)\nTest Case: Payment (8 steps)'
    },
    fix: "Break long tests into focused scenarios. Each test should verify one thing well."
  },
  {
    id: 11,
    name: "Swiss Army Knife",
    icon: "🔪",
    description: "A single action tries to do too many things based on parameters.",
    problem: "Complex, fragile, and impossible to understand.",
    example: {
      bad: 'process_entity(\n  type: "invoice|order|customer",\n  operation: "create|update|delete|view",\n  validate: true|false,\n  notify: true|false\n)',
      good: 'create_invoice()\nupdate_order()\ndelete_customer()'
    },
    fix: "One action, one purpose. Split multi-purpose actions into focused ones."
  },
  {
    id: 12,
    name: "Over-Checking",
    icon: "🔍",
    description: "Every single step has verification, creating noise and brittleness.",
    problem: "Tests fail on irrelevant changes. Signal lost in noise.",
    example: {
      bad: 'click_menu()\ncheck_menu_expanded()\nclick_item()\ncheck_item_highlighted()\ncheck_page_loading()\ncheck_page_loaded()\ncheck_title()\ncheck_breadcrumb()',
      good: 'navigate_to(page: "Invoices")\ncheck_page_title(expected: "Invoice Management")'
    },
    fix: "Check outcomes, not intermediate states. Verify what matters to the business."
  },
  {
    id: 13,
    name: "Fragile Locators",
    icon: "🧊",
    description: "Element identification relies on brittle attributes that change frequently.",
    problem: "Tests break with every UI update, even cosmetic ones.",
    example: {
      bad: 'click(element: "div.container > form > div:nth-child(3) > button.btn-primary")',
      good: 'click(element: [Submit_Button])\n\n# Interface Definition:\nSubmit_Button = "#btn-submit" OR "button[data-testid=submit]"'
    },
    fix: "Use stable identifiers (data-testid, IDs). Abstract locators into interface definitions."
  }
];

export default function Module9() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                Module 9
              </span>
            </div>
            <div className="hidden md:block">
              <ModuleProgress 
                moduleNumber={9} 
                totalModules={TOTAL_ABT_MODULES} 
                estimatedMinutes={MODULE_READING_TIMES[9]} 
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Complete Anti-Pattern Gallery
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A museum of testing mistakes. Study these exhibits carefully—recognizing
            what not to do is just as important as knowing what to do.
          </p>
        </header>

        {/* Hero Image */}
        <figure className="mb-12 rounded-xl overflow-hidden border border-border">
          <img
            src="/images/module-9-antipatterns.jpg"
            alt="Museum gallery displaying framed anti-pattern warning signs"
            className="w-full h-auto"
          />
          <figcaption className="text-center text-sm text-muted-foreground py-3 bg-muted/30">
            The Hall of Testing Shame: 13 patterns to avoid
          </figcaption>
        </figure>

        {/* Opening */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> I inherited a test suite that everyone says
                is "unmaintainable." How do I know what is wrong with it?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Inheritor in Indianapolis</p>
            </CardContent>
          </Card>
        </section>

        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Inheritor:</strong> Walk through this gallery with me. I will show
            you the 13 most common anti-patterns in test automation. By the time we finish,
            you will be able to diagnose your test suite like a doctor reading an X-ray.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Anti-Pattern Gallery */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-coral" />
            The 13 Anti-Patterns
          </h2>

          <div className="space-y-8">
            {antiPatterns.map((pattern) => (
              <Card key={pattern.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {pattern.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">#{pattern.id}</span>
                        {pattern.name}
                      </h3>
                      <p className="text-muted-foreground">{pattern.description}</p>
                    </div>
                  </div>

                  <div className="bg-coral/5 border border-coral/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-coral" />
                      <span className="font-bold text-coral">The Problem</span>
                    </div>
                    <p className="text-sm">{pattern.problem}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-coral/5 rounded-lg p-3">
                      <div className="text-xs font-bold text-coral mb-2 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> BAD
                      </div>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground">
                        {pattern.example.bad}
                      </pre>
                    </div>
                    <div className="bg-teal/5 rounded-lg p-3">
                      <div className="text-xs font-bold text-teal mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> GOOD
                      </div>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground">
                        {pattern.example.good}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-teal" />
                      <span className="font-bold text-teal">The Fix</span>
                    </div>
                    <p className="text-sm">{pattern.fix}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Quick Reference */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8">Quick Diagnostic Checklist</h2>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Use this checklist to quickly assess a test suite for anti-patterns:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Are element IDs hardcoded in tests?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Do actions call other actions circularly?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Can a business user read the high-level tests?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Is CRUD coverage complete for each object?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Are there negative/error test cases?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Does each test module have a clear objective?</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Are checks explicit (not hidden in actions)?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Is the action count reasonable (not exploding)?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Do action names use business language?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Are test cases under 20 steps each?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Does each action have a single purpose?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Are locators abstracted into definitions?</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-coral/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-display text-2xl font-bold mb-4">Module Summary</h3>
              <p className="mb-4">
                The 13 anti-patterns fall into three categories:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-background/50 rounded-lg">
                  <h4 className="font-bold mb-2">Structure Problems</h4>
                  <p className="text-sm text-muted-foreground">
                    Hardcoded, Spaghetti, Klunky, Fragile Locators
                  </p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <h4 className="font-bold mb-2">Coverage Problems</h4>
                  <p className="text-sm text-muted-foreground">
                    Lifeless, Lame, Clueless, Over-Checking
                  </p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <h4 className="font-bold mb-2">Design Problems</h4>
                  <p className="text-sm text-muted-foreground">
                    Sneaky Checking, Action Explosion, Techno, Endless, Swiss Army Knife
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/module-8">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous: Advanced Techniques
            </Button>
          </Link>
          <Link href="/module-10">
            <Button className="gap-2">
              Next: Test Design Template
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
