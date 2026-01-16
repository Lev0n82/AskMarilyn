import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, Target, Layers, CheckSquare, Database, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module7() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                Module 7
              </span>
            </div>
            <div className="hidden md:block">
              <ModuleProgress 
                moduleNumber={7} 
                totalModules={TOTAL_ABT_MODULES} 
                estimatedMinutes={MODULE_READING_TIMES[7]} 
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Building Test Modules
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A test module is not just a container for tests—it is a living document that
            captures your understanding of the system. Let us build one from scratch,
            step by logical step.
          </p>
        </header>

        {/* Hero Image */}
        <figure className="mb-12 rounded-xl overflow-hidden border border-border">
          <img
            src="/images/module-7-building.jpg"
            alt="Blueprint-style diagram showing the construction of a test module"
            className="w-full h-auto"
          />
          <figcaption className="text-center text-sm text-muted-foreground py-3 bg-muted/30">
            A test module is built in layers: objectives, actions, checks, and data
          </figcaption>
        </figure>

        {/* Opening Question */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> I understand the theory of ABT, but when I sit
                down to create a test module, I do not know where to start. What goes first?
                The actions? The test cases? The data?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Blank Page in Boston</p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Blank Page:</strong> The blank page is intimidating only because
            you are thinking of all the pieces at once. A test module is built like a
            house: foundation first, then walls, then roof. Let me walk you through the
            construction process.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Step 1: Define the Objective */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Step 1: Define the Test Objective
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Before writing a single action, answer this question: <strong>What are we trying
            to verify?</strong> The test objective is the "why" behind your test module.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Example: Invoice Test Module</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                <p className="text-muted-foreground mb-2"># Test Objective</p>
                <p>Verify that the Invoice Management system correctly handles</p>
                <p>the complete invoice lifecycle: creation, modification,</p>
                <p>approval, and archival. Ensure calculations are accurate</p>
                <p>and audit trails are maintained.</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-teal/30 bg-teal/5">
              <CardContent className="pt-4">
                <h4 className="font-bold text-teal mb-2">Good Objectives</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Specific and measurable</li>
                  <li>• Focused on business value</li>
                  <li>• Scoped to one business object</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-coral/30 bg-coral/5">
              <CardContent className="pt-4">
                <h4 className="font-bold text-coral mb-2">Bad Objectives</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• "Test everything"</li>
                  <li>• "Make sure it works"</li>
                  <li>• Too broad or vague</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Step 2: Identify Actions */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Step 2: Identify the Actions
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Now ask: <strong>What operations can a user perform on this business object?</strong>
            List them without worrying about implementation. These become your high-level actions.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Invoice Actions Inventory</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2 text-sm text-muted-foreground">CRUD Operations</h4>
                  <ul className="space-y-1 font-mono text-sm">
                    <li className="bg-muted/50 px-3 py-1 rounded">create_invoice</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">view_invoice</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">edit_invoice</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">delete_invoice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-sm text-muted-foreground">Business Operations</h4>
                  <ul className="space-y-1 font-mono text-sm">
                    <li className="bg-muted/50 px-3 py-1 rounded">submit_for_approval</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">approve_invoice</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">reject_invoice</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">archive_invoice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-sm text-muted-foreground">Line Item Operations</h4>
                  <ul className="space-y-1 font-mono text-sm">
                    <li className="bg-muted/50 px-3 py-1 rounded">add_line_item</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">remove_line_item</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">update_line_quantity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-sm text-muted-foreground">Verification Actions</h4>
                  <ul className="space-y-1 font-mono text-sm">
                    <li className="bg-muted/50 px-3 py-1 rounded">check_invoice_total</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">check_invoice_status</li>
                    <li className="bg-muted/50 px-3 py-1 rounded">check_audit_trail</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Naming Convention Reminder</h4>
                  <p className="text-muted-foreground">
                    Always use <strong>verb_noun</strong> format: <code>create_invoice</code>,
                    not <code>invoice_create</code>. The action should read like a command.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Step 3: Define Checks */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-primary" />
            Step 3: Define the Checks
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Checks are the verification points in your test. They answer: <strong>How do we
            know the action succeeded?</strong> In ABT, checks are explicit actions, not hidden
            assertions buried in code.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Types of Checks</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Value Checks</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Verify that a field contains an expected value.
                    </p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      check_invoice_total(expected: "$1,250.00")
                    </code>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold">State Checks</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Verify that the system is in an expected state.
                    </p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      check_invoice_status(expected: "Pending Approval")
                    </code>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Existence Checks</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Verify that something exists (or does not exist).
                    </p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      check_invoice_exists(invoice_id: "INV-2024-001")
                    </code>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Error Checks</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Verify that an expected error message appears.
                    </p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      check_error_message(expected: "Invoice total cannot be negative")
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Step 4: Design Data Sets */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Step 4: Design the Data Sets
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Data-driven testing separates the "what" from the "with what." Instead of
            writing ten tests that differ only in input values, write one test and
            feed it ten data rows.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Invoice Test Data Set</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Scenario</th>
                      <th className="border border-border p-2 text-left">Customer</th>
                      <th className="border border-border p-2 text-left">Amount</th>
                      <th className="border border-border p-2 text-left">Tax Rate</th>
                      <th className="border border-border p-2 text-left">Expected Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2">Standard</td>
                      <td className="border border-border p-2">Acme Corp</td>
                      <td className="border border-border p-2">$1,000.00</td>
                      <td className="border border-border p-2">10%</td>
                      <td className="border border-border p-2">$1,100.00</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-2">Tax Exempt</td>
                      <td className="border border-border p-2">Government Agency</td>
                      <td className="border border-border p-2">$5,000.00</td>
                      <td className="border border-border p-2">0%</td>
                      <td className="border border-border p-2">$5,000.00</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">High Value</td>
                      <td className="border border-border p-2">Enterprise Inc</td>
                      <td className="border border-border p-2">$100,000.00</td>
                      <td className="border border-border p-2">8.5%</td>
                      <td className="border border-border p-2">$108,500.00</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-2">Minimum</td>
                      <td className="border border-border p-2">Small Biz LLC</td>
                      <td className="border border-border p-2">$0.01</td>
                      <td className="border border-border p-2">10%</td>
                      <td className="border border-border p-2">$0.01</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed">
            Notice how each row represents a different <strong>scenario</strong>, not just
            random data. Good test data is designed to exercise specific conditions:
            boundary values, special cases, and business rules.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Step 5: Write Test Cases */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Step 5: Write the Test Cases
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Now we assemble the pieces. A test case is a sequence of actions that tells
            a story: setup, action, verification.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Test Case: Create and Approve Invoice</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                <p className="text-muted-foreground"># Test Case: TC-INV-001</p>
                <p className="text-muted-foreground"># Objective: Verify complete invoice workflow</p>
                <p className="text-muted-foreground"># Data Set: Row 1 (Standard)</p>
                <p></p>
                <p className="text-teal"># Setup</p>
                <p>login_as_user(role: "Invoice Clerk")</p>
                <p>navigate_to(page: "Invoice Management")</p>
                <p></p>
                <p className="text-teal"># Create Invoice</p>
                <p>create_invoice(customer: [Customer], amount: [Amount])</p>
                <p>add_line_item(description: "Consulting Services", quantity: 1, price: [Amount])</p>
                <p>check_invoice_total(expected: [Expected Total])</p>
                <p></p>
                <p className="text-teal"># Submit for Approval</p>
                <p>submit_for_approval()</p>
                <p>check_invoice_status(expected: "Pending Approval")</p>
                <p></p>
                <p className="text-teal"># Approve (as Manager)</p>
                <p>login_as_user(role: "Manager")</p>
                <p>approve_invoice()</p>
                <p>check_invoice_status(expected: "Approved")</p>
                <p>check_audit_trail(contains: "Approved by Manager")</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-teal/5 border-teal/30">
            <CardContent className="pt-6">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal" />
                Notice the Pattern
              </h4>
              <p className="text-muted-foreground">
                The test reads like a user story. Anyone can understand what it does
                without knowing the implementation details. The <code>[brackets]</code>
                indicate data-driven values that will be substituted from the data set.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Decision Tables */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Advanced: Decision Tables
          </h2>

          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> My business rules have many conditions that
                interact with each other. How do I organize tests when "if A and B but not C,
                then do X unless D" is the norm?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Conditional in California</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Conditional:</strong> You need a <strong>Decision Table</strong>.
            This technique maps all possible combinations of conditions to their expected
            outcomes. It ensures you do not miss any combination—and it makes the logic
            visible to everyone.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Example: Order Processing Decision Table</h3>
              <p className="text-muted-foreground mb-4">
                Consider an order system where the action depends on: Is the dialog data correct?
                Is it a large order? Is the customer an online customer?
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-display">Conditions</th>
                      <th className="border border-border p-3 text-center">Case 1</th>
                      <th className="border border-border p-3 text-center">Case 2</th>
                      <th className="border border-border p-3 text-center">Case 3</th>
                      <th className="border border-border p-3 text-center">Case 4</th>
                      <th className="border border-border p-3 text-center">Case 5</th>
                      <th className="border border-border p-3 text-center">Case 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium bg-muted/30">Dialog data correct?</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-coral font-bold">N</td>
                      <td className="border border-border p-3 text-center text-coral font-bold">N</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium bg-muted/30">Large order?</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-coral font-bold">N</td>
                      <td className="border border-border p-3 text-center text-coral font-bold">N</td>
                      <td className="border border-border p-3 text-center text-muted-foreground">—</td>
                      <td className="border border-border p-3 text-center text-muted-foreground">—</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium bg-muted/30">Online customer?</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-coral font-bold">N</td>
                      <td className="border border-border p-3 text-center text-teal font-bold">Y</td>
                      <td className="border border-border p-3 text-center text-coral font-bold">N</td>
                      <td className="border border-border p-3 text-center text-muted-foreground">—</td>
                      <td className="border border-border p-3 text-center text-muted-foreground">—</td>
                    </tr>
                    <tr className="bg-primary/5">
                      <td className="border border-border p-3 font-bold">Expected Action</td>
                      <td className="border border-border p-3 text-center text-sm">Priority<br/>Processing</td>
                      <td className="border border-border p-3 text-center text-sm">Manager<br/>Review</td>
                      <td className="border border-border p-3 text-center text-sm">Auto<br/>Process</td>
                      <td className="border border-border p-3 text-center text-sm">Standard<br/>Process</td>
                      <td className="border border-border p-3 text-center text-sm">Show<br/>Error</td>
                      <td className="border border-border p-3 text-center text-sm">Show<br/>Error</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-teal/30 bg-teal/5">
              <CardContent className="pt-6">
                <h4 className="font-bold text-teal mb-3">Benefits of Decision Tables</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>Forces complete coverage of all condition combinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>Makes business logic visible and reviewable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>Each column becomes a test case</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>Easy to spot missing or contradictory rules</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-6">
                <h4 className="font-bold text-amber-600 mb-3">When to Use Decision Tables</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Multiple conditions affect the outcome</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Business rules are complex or frequently change</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>You need to verify all edge cases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Stakeholders need to review test coverage</span>
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
                  <span>Start with a clear test objective that defines what you are verifying.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Identify all actions (CRUD + business operations) before writing tests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Make checks explicit—they are actions, not hidden assertions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Design data sets around scenarios, not random values.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Test cases should read like user stories: setup, action, verification.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Decision Tables</strong> map condition combinations to outcomes for complex business rules.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/module-6">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous: Test Life-Cycle
            </Button>
          </Link>
          <Link href="/module-8">
            <Button className="gap-2">
              Next: Advanced Techniques
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
