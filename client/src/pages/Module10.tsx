import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, FileText, CheckCircle, Layers, Database, Workflow, Settings, Globe, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheatSheetDownload } from "@/components/CheatSheetDownload";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

const testCategories = [
  {
    id: 1,
    name: "Business Objects",
    icon: Database,
    description: "Tests organized around the core entities of your system",
    examples: ["Customer", "Invoice", "Order", "Product", "Account"],
    coverage: [
      "Create (with valid data)",
      "Create (with invalid data)",
      "Read/View (single item)",
      "Read/List (multiple items)",
      "Update (all fields)",
      "Update (partial fields)",
      "Delete (soft delete)",
      "Delete (hard delete)",
      "State transitions",
      "Relationships (parent/child)"
    ]
  },
  {
    id: 2,
    name: "Business Flows",
    icon: Workflow,
    description: "End-to-end processes that span multiple business objects",
    examples: ["Order-to-Cash", "Procure-to-Pay", "Hire-to-Retire", "Quote-to-Order"],
    coverage: [
      "Happy path (complete flow)",
      "Alternate paths (branches)",
      "Exception handling",
      "Cancellation at each stage",
      "Timeout/expiration",
      "Concurrent access",
      "Rollback scenarios"
    ]
  },
  {
    id: 3,
    name: "Features",
    icon: Settings,
    description: "Specific functionality that cuts across objects",
    examples: ["Search", "Export", "Import", "Reporting", "Notifications"],
    coverage: [
      "Basic functionality",
      "Advanced options",
      "Edge cases (empty, max)",
      "Error handling",
      "Performance under load"
    ]
  },
  {
    id: 4,
    name: "Interoperability",
    icon: Globe,
    description: "Integration with external systems and APIs",
    examples: ["Payment Gateway", "Email Service", "CRM Integration", "ERP Sync"],
    coverage: [
      "Connection establishment",
      "Data exchange (send)",
      "Data exchange (receive)",
      "Error handling (timeout)",
      "Error handling (invalid data)",
      "Retry logic",
      "Idempotency"
    ]
  },
  {
    id: 5,
    name: "Data Handling",
    icon: Database,
    description: "Data integrity, validation, and transformation",
    examples: ["Data Migration", "Bulk Import", "Data Cleanup", "Archive/Restore"],
    coverage: [
      "Valid data acceptance",
      "Invalid data rejection",
      "Boundary values",
      "Special characters",
      "Unicode/internationalization",
      "Large data volumes",
      "Data consistency"
    ]
  },
  {
    id: 6,
    name: "Non-Functional",
    icon: Zap,
    description: "Performance, security, and reliability requirements",
    examples: ["Load Testing", "Stress Testing", "Security Testing", "Accessibility"],
    coverage: [
      "Response time (normal load)",
      "Response time (peak load)",
      "Concurrent users",
      "Memory usage",
      "Authentication/Authorization",
      "Input validation (XSS, SQL injection)",
      "Accessibility compliance"
    ]
  },
  {
    id: 7,
    name: "User Interface",
    icon: Layers,
    description: "Visual and interaction testing",
    examples: ["Forms", "Navigation", "Responsive Design", "Accessibility"],
    coverage: [
      "Layout correctness",
      "Cross-browser compatibility",
      "Mobile responsiveness",
      "Keyboard navigation",
      "Screen reader compatibility",
      "Color contrast",
      "Error message display"
    ]
  },
  {
    id: 8,
    name: "Security",
    icon: Shield,
    description: "Authentication, authorization, and data protection",
    examples: ["Login", "Role-Based Access", "Data Encryption", "Audit Trail"],
    coverage: [
      "Valid credentials",
      "Invalid credentials",
      "Account lockout",
      "Password policies",
      "Session management",
      "Role permissions",
      "Data masking"
    ]
  }
];

export default function Module10() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                Module 10
              </span>
            </div>
            <div className="hidden md:block">
              <ModuleProgress 
                moduleNumber={10} 
                totalModules={TOTAL_ABT_MODULES} 
                estimatedMinutes={MODULE_READING_TIMES[10]} 
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Test Design Template
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A comprehensive taxonomy for organizing your test suite. Use this template
            to ensure complete coverage and logical structure.
          </p>
        </header>

        {/* Hero Image */}
        <figure className="mb-12 rounded-xl overflow-hidden border border-border">
          <img
            src="/images/module-10-template.jpg"
            alt="Blueprint-style template with organized test categories"
            className="w-full h-auto"
          />
          <figcaption className="text-center text-sm text-muted-foreground py-3 bg-muted/30">
            The master blueprint for test organization
          </figcaption>
        </figure>

        {/* Opening Question */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> I have been asked to create a test plan
                for a new application. Where do I even begin? There are so many things
                to test that I feel paralyzed.
              </p>
              <p className="text-right text-muted-foreground mt-4">— Paralyzed in Phoenix</p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Paralyzed:</strong> The secret to comprehensive test coverage
            is not to think of everything at once, but to think systematically. I will
            give you a template that organizes tests into eight categories. Work through
            each category methodically, and you will have complete coverage without
            the paralysis.
          </p>
        </section>

        <Separator className="my-12" />

        {/* The Eight Categories */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            The Eight Test Categories
          </h2>

          <div className="space-y-8">
            {testCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">#{category.id}</span>
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <h4 className="font-bold text-sm mb-2">Example Test Modules</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.examples.map((example) => (
                            <span
                              key={example}
                              className="px-2 py-1 bg-background rounded text-xs"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
                        <h4 className="font-bold text-sm mb-2 text-teal">Coverage Checklist</h4>
                        <ul className="text-xs space-y-1">
                          {category.coverage.slice(0, 5).map((item) => (
                            <li key={item} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-teal flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {category.coverage.length > 5 && (
                            <li className="text-muted-foreground">
                              +{category.coverage.length - 5} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Separator className="my-12" />

        {/* High-Level Test Design Process */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8">The Test Design Process</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="font-display text-lg font-bold mb-2">Inventory Business Objects</h3>
                <p className="text-sm text-muted-foreground">
                  List every entity in your system: Customer, Order, Invoice, Product, etc.
                  Each becomes a test module with CRUD coverage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="font-display text-lg font-bold mb-2">Map Business Flows</h3>
                <p className="text-sm text-muted-foreground">
                  Identify end-to-end processes that span multiple objects. These become
                  integration test modules.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <h3 className="font-display text-lg font-bold mb-2">Catalog Features</h3>
                <p className="text-sm text-muted-foreground">
                  List cross-cutting features: search, export, notifications, etc.
                  Each feature gets its own test module.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  4
                </div>
                <h3 className="font-display text-lg font-bold mb-2">Identify Integrations</h3>
                <p className="text-sm text-muted-foreground">
                  Document all external system connections. Each integration point
                  needs send, receive, and error handling tests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  5
                </div>
                <h3 className="font-display text-lg font-bold mb-2">Define Non-Functional Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  Specify performance, security, and accessibility requirements.
                  Create dedicated test modules for each.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  6
                </div>
                <h3 className="font-display text-lg font-bold mb-2">Apply Coverage Checklists</h3>
                <p className="text-sm text-muted-foreground">
                  For each test module, apply the relevant coverage checklist to ensure
                  no scenarios are missed.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Example Test Plan Structure */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8">Example: E-Commerce Test Plan</h2>

          <Card>
            <CardContent className="pt-6">
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                <p className="text-primary font-bold">E-Commerce Test Suite</p>
                <p className="text-muted-foreground">├── Business Objects/</p>
                <p className="text-muted-foreground">│   ├── Customer (CRUD, profile, preferences)</p>
                <p className="text-muted-foreground">│   ├── Product (CRUD, inventory, pricing)</p>
                <p className="text-muted-foreground">│   ├── Order (CRUD, status transitions)</p>
                <p className="text-muted-foreground">│   ├── Cart (add, remove, update quantity)</p>
                <p className="text-muted-foreground">│   └── Payment (methods, processing, refunds)</p>
                <p className="text-muted-foreground">├── Business Flows/</p>
                <p className="text-muted-foreground">│   ├── Browse-to-Buy (complete purchase)</p>
                <p className="text-muted-foreground">│   ├── Return-and-Refund (full cycle)</p>
                <p className="text-muted-foreground">│   └── Subscription-Renewal (recurring)</p>
                <p className="text-muted-foreground">├── Features/</p>
                <p className="text-muted-foreground">│   ├── Search (basic, advanced, filters)</p>
                <p className="text-muted-foreground">│   ├── Recommendations (personalized)</p>
                <p className="text-muted-foreground">│   └── Reviews (create, moderate, display)</p>
                <p className="text-muted-foreground">├── Integrations/</p>
                <p className="text-muted-foreground">│   ├── Payment-Gateway (Stripe, PayPal)</p>
                <p className="text-muted-foreground">│   ├── Shipping-Provider (FedEx, UPS)</p>
                <p className="text-muted-foreground">│   └── Email-Service (transactional)</p>
                <p className="text-muted-foreground">├── Non-Functional/</p>
                <p className="text-muted-foreground">│   ├── Performance (load, stress)</p>
                <p className="text-muted-foreground">│   ├── Security (auth, data protection)</p>
                <p className="text-muted-foreground">│   └── Accessibility (WCAG compliance)</p>
                <p className="text-muted-foreground">└── UI/</p>
                <p className="text-muted-foreground">    ├── Responsive (mobile, tablet, desktop)</p>
                <p className="text-muted-foreground">    └── Cross-Browser (Chrome, Firefox, Safari)</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Lead Deputy Feature */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Workflow className="w-8 h-8 text-primary" />
            Concurrency Testing: The Lead Deputy Pattern
          </h2>

          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> Our application is used by multiple people
                simultaneously. How do we test what happens when two users try to edit the
                same record at the same time?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Racing in Raleigh</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Racing:</strong> You have identified one of the trickiest areas
            of testing: <strong>concurrency</strong>. When multiple users (or processes)
            work on the same data simultaneously, race conditions can cause data loss,
            corruption, or unexpected behavior.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            ABT supports a feature called <strong>"Lead Deputy"</strong> that allows testers
            to design tests simulating two or more users working concurrently. Since such
            tests require multiple machines (physical or virtual), it is best to dedicate
            separate test modules specifically for concurrency testing.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Race Condition Problem</h3>
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-2">Classic scenario:</p>
                <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-3 bg-teal/10 rounded">
                    <p className="font-bold text-teal mb-2">User A</p>
                    <p>1. Opens form (balance: $100)</p>
                    <p>2. Changes field</p>
                    <p>3. Saves form</p>
                    <p className="text-teal">→ Balance: $150</p>
                  </div>
                  <div className="p-3 bg-coral/10 rounded">
                    <p className="font-bold text-coral mb-2">User B</p>
                    <p>1. Opens form (balance: $100)</p>
                    <p>2. Changes different field</p>
                    <p>3. Saves form</p>
                    <p className="text-coral">→ Balance: $100 (overwrites A!)</p>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                User B's save overwrote User A's changes because B still had the old
                version of the record. This is called a <strong>"lost update"</strong> problem.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Lead Deputy Test Structure</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                <p className="text-muted-foreground"># Test Module: Concurrent_Invoice_Edit</p>
                <p className="text-muted-foreground"># Requires: 2 machines (Lead + Deputy)</p>
                <p></p>
                <p className="text-teal"># LEAD actions (Machine 1)</p>
                <p>login_as_user(user: "clerk_a")</p>
                <p>open_invoice(id: "INV-001")</p>
                <p>edit_amount(value: "$500")</p>
                <p className="text-coral font-bold">signal_deputy(checkpoint: "ready_to_save")</p>
                <p className="text-coral font-bold">wait_for_deputy(checkpoint: "deputy_saved")</p>
                <p>click_save()</p>
                <p>check_conflict_warning(expected: true)</p>
                <p></p>
                <p className="text-teal"># DEPUTY actions (Machine 2)</p>
                <p className="text-coral font-bold">wait_for_lead(checkpoint: "ready_to_save")</p>
                <p>login_as_user(user: "clerk_b")</p>
                <p>open_invoice(id: "INV-001")</p>
                <p>edit_notes(value: "Updated by B")</p>
                <p>click_save()</p>
                <p className="text-coral font-bold">signal_lead(checkpoint: "deputy_saved")</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-teal/30 bg-teal/5">
              <CardContent className="pt-6">
                <h4 className="font-bold text-teal mb-3">Common Concurrency Tests</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>Simultaneous edits to same record</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>One user deletes while another edits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>Multiple users creating same unique item</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>Inventory updates during checkout</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-6">
                <h4 className="font-bold text-amber-600 mb-3">Infrastructure Requirements</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Two or more test machines (physical or virtual)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Network connectivity between machines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Synchronized clocks for timing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Dedicated test modules for concurrency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-teal/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-display text-2xl font-bold mb-4">Module Summary</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Organize tests into <strong>8 categories</strong>: Business Objects, Business Flows, Features, Interoperability, Data Handling, Non-Functional, UI, and Security.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Use <strong>coverage checklists</strong> to ensure no scenarios are missed within each category.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Follow the <strong>6-step process</strong>: inventory objects, map flows, catalog features, identify integrations, define NFRs, apply checklists.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Use the <strong>Lead Deputy pattern</strong> to test concurrency scenarios with multiple users or processes working simultaneously.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>The template provides <strong>structure without rigidity</strong>—adapt it to your specific application.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Course Completion */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-teal/20 to-primary/20 border-teal/30">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-teal text-white flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-muted-foreground mb-6">
                You have completed all 10 modules of the ABT course. You now have a
                comprehensive understanding of Action-Based Testing methodology.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/quiz">
                  <Button className="gap-2">
                    Take the Final Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/certificate">
                  <Button variant="outline" className="gap-2">
                    Get Your Certificate
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cheat Sheet Download */}
        <section className="mb-12">
          <CheatSheetDownload courseId="abt-fundamentals" courseName="ABT Fundamentals" />
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/module-9">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous: Anti-Pattern Gallery
            </Button>
          </Link>
          <Link href="/refactoring-challenge">
            <Button className="gap-2">
              Next: Refactoring Game
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
