import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, Clock, Users, Repeat, Calendar, GitBranch, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module6() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                Module 6
              </span>
            </div>
            <div className="hidden md:block">
              <ModuleProgress 
                moduleNumber={6} 
                totalModules={TOTAL_ABT_MODULES} 
                estimatedMinutes={MODULE_READING_TIMES[6]} 
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Test Life-Cycle
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            When should you write tests? When should you automate them? And who owns what?
            These questions have plagued testing teams since the dawn of Agile. Let us apply
            some logical clarity to the chaos.
          </p>
        </header>

        {/* Hero Image */}
        <figure className="mb-12 rounded-xl overflow-hidden border border-border">
          <img
            src="/images/module-6-lifecycle.jpg"
            alt="Three interlocking gears representing System, Test, and Automation life-cycles"
            className="w-full h-auto"
          />
          <figcaption className="text-center text-sm text-muted-foreground py-3 bg-muted/30">
            The three parallel life-cycles that must be synchronized for testing success
          </figcaption>
        </figure>

        {/* Opening Question */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> Our development team uses Agile sprints, but our
                test automation is always two sprints behind. By the time we automate a test,
                the feature has already changed. How do we catch up?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Frustrated in Phoenix</p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Frustrated:</strong> You are not behind—you are simply running
            the wrong race. The problem is not speed; it is synchronization. You have
            three parallel life-cycles that must move together, and you are treating
            them as if they were sequential.
          </p>

          <p className="text-lg leading-relaxed">
            Think of it this way: A symphony orchestra does not wait for the violins
            to finish before the cellos begin. They play together, each following
            the same score. Your System Development, Test Development, and Automation
            Development must do the same.
          </p>
        </section>

        <Separator className="my-12" />

        {/* The Three Life-Cycles */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Repeat className="w-8 h-8 text-primary" />
            The Three Parallel Life-Cycles
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-coral/30 bg-coral/5">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center mb-4">
                  <GitBranch className="w-6 h-6 text-coral" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">System Development</h3>
                <p className="text-muted-foreground">
                  The product team builds features. Each sprint delivers working functionality
                  that users can interact with.
                </p>
                <div className="mt-4 text-sm">
                  <strong>Owner:</strong> Development Team
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal/30 bg-teal/5">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-teal" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Test Development</h3>
                <p className="text-muted-foreground">
                  The test team designs test cases using high-level actions. These are
                  human-readable specifications of what to verify.
                </p>
                <div className="mt-4 text-sm">
                  <strong>Owner:</strong> Test Designer / Business Analyst
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-navy/30 bg-navy/5">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-navy/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-navy" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Automation Development</h3>
                <p className="text-muted-foreground">
                  The automation team implements the low-level actions that make the
                  tests executable against the actual system.
                </p>
                <div className="mt-4 text-sm">
                  <strong>Owner:</strong> Automation Engineer
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-lg">
                <strong>The Key Insight:</strong> In ABT, the Test Designer can write complete,
                meaningful tests using high-level actions <em>before</em> the automation is ready.
                The tests are not "waiting" for automation—they are valid specifications that
                can be reviewed, refined, and approved while the automation catches up.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Agile Integration */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Agile Integration: The Sprint Timeline
          </h2>

          <p className="text-lg leading-relaxed mb-8">
            Here is how the three life-cycles align within a typical two-week sprint:
          </p>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">1-2</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Days 1-2: Sprint Planning</h3>
                    <p className="text-muted-foreground mb-2">
                      <strong>System:</strong> Stories are selected and refined.
                    </p>
                    <p className="text-muted-foreground mb-2">
                      <strong>Test:</strong> Test Designer identifies which Test Modules will be affected.
                      Creates placeholder high-level actions for new functionality.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Automation:</strong> Reviews upcoming actions, estimates implementation effort.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">3-8</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Days 3-8: Development</h3>
                    <p className="text-muted-foreground mb-2">
                      <strong>System:</strong> Features are built and unit tested.
                    </p>
                    <p className="text-muted-foreground mb-2">
                      <strong>Test:</strong> Test Designer writes complete test cases using high-level
                      actions. Tests are reviewed with Product Owner for correctness.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Automation:</strong> Implements low-level actions as features become available.
                      Updates interface definitions as UI elements are finalized.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">9-10</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Days 9-10: Integration & Testing</h3>
                    <p className="text-muted-foreground mb-2">
                      <strong>System:</strong> Features are integrated and deployed to test environment.
                    </p>
                    <p className="text-muted-foreground mb-2">
                      <strong>Test:</strong> Automated tests are executed. Manual exploratory testing
                      fills gaps where automation is not yet ready.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Automation:</strong> Fixes any automation issues discovered during execution.
                      Completes any remaining action implementations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Cross-over Test Modules */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-primary" />
            Cross-over Test Modules
          </h2>

          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> Our sprint is building a new "Quick Order" feature,
                but it needs to work with the existing inventory and customer systems. How do we
                test these connections without duplicating tests?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Connecting in Connecticut</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Connecting:</strong> You have discovered the need for what I call
            <strong> Cross-over Test Modules</strong>. These are tests that verify the
            relationships between the new sprint items and the existing application.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Think of your application as a city. Each sprint builds a new neighborhood.
            Cross-over tests verify that the roads connecting the new neighborhood to the
            existing city are properly paved and the traffic flows correctly.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-teal/30">
              <CardContent className="pt-6">
                <h3 className="font-display text-lg font-bold mb-2 text-teal">Main Level Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Test the new feature in isolation. "Quick Order" creates orders correctly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-coral/30">
              <CardContent className="pt-6">
                <h3 className="font-display text-lg font-bold mb-2 text-coral">Interaction Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Test the UI elements. Buttons, forms, and navigation work as expected.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-navy/30">
              <CardContent className="pt-6">
                <h3 className="font-display text-lg font-bold mb-2 text-navy">Cross-over Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Test the connections. "Quick Order" correctly updates inventory and customer records.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">When to Create Cross-over Tests</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>New feature uses data from existing modules (orders use customer data)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>New feature modifies shared resources (inventory levels, account balances)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>New feature triggers workflows in other modules (notifications, approvals)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>New feature must coexist with existing features (same screen, shared navigation)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Ownership Model */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            The Ownership Model
          </h2>

          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> Our company wants to outsource test automation
                to a vendor. Will ABT still work?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Considering in Chicago</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-8">
            <strong>Dear Considering:</strong> ABT was designed precisely for this scenario.
            The three-layer architecture creates natural boundaries for ownership:
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-4 text-left font-display">Layer</th>
                  <th className="border border-border p-4 text-left font-display">Typical Owner</th>
                  <th className="border border-border p-4 text-left font-display">Skills Required</th>
                  <th className="border border-border p-4 text-left font-display">Can Outsource?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-4 font-medium">High-Level Actions</td>
                  <td className="border border-border p-4">Business Analyst / Test Designer</td>
                  <td className="border border-border p-4">Domain knowledge, test design</td>
                  <td className="border border-border p-4 text-coral">Rarely (requires business context)</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-4 font-medium">Mid-Level Actions</td>
                  <td className="border border-border p-4">Senior Test Engineer</td>
                  <td className="border border-border p-4">Test architecture, abstraction</td>
                  <td className="border border-border p-4 text-amber-600">Sometimes (with good documentation)</td>
                </tr>
                <tr>
                  <td className="border border-border p-4 font-medium">Low-Level Actions</td>
                  <td className="border border-border p-4">Automation Engineer</td>
                  <td className="border border-border p-4">Programming, tool expertise</td>
                  <td className="border border-border p-4 text-teal">Often (technical, well-defined)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-lg leading-relaxed mb-8">
            The beauty of this model is that the vendor implementing low-level actions
            does not need to understand your business. They only need to know: "When
            someone calls <code>click_button</code> with argument 'Submit', find the
            element with ID 'btn_submit' and click it." The business logic remains
            safely in-house.
          </p>

          <h3 className="font-display text-2xl font-bold mb-6">Three Outsourcing Models</h3>

          <p className="text-lg leading-relaxed mb-6">
            Depending on your organization's needs, ABT supports three distinct outsourcing
            arrangements:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-coral/30">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center mb-3">
                  <span className="text-coral font-bold">1</span>
                </div>
                <h4 className="font-display text-lg font-bold mb-2">Fully Outsourced</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  A complete external team handles system development, test development,
                  and automation. They work as an independent unit.
                </p>
                <div className="text-xs bg-coral/10 p-2 rounded">
                  <strong>Best for:</strong> Complete product development, offshore teams
                  with full ownership
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal/30">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center mb-3">
                  <span className="text-teal font-bold">2</span>
                </div>
                <h4 className="font-display text-lg font-bold mb-2">Fully Integrated</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Outsourced team members participate directly in your sprints. They work
                  in your timezone (or overlap hours) and attend daily standups.
                </p>
                <div className="text-xs bg-teal/10 p-2 rounded">
                  <strong>Best for:</strong> Staff augmentation, when you need extra hands
                  but want full control
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-navy/30">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-navy/20 flex items-center justify-center mb-3">
                  <span className="text-navy font-bold">3</span>
                </div>
                <h4 className="font-display text-lg font-bold mb-2">Second Unit</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Your onshore team sends work items directly to an offshore team.
                  They complete automation tasks overnight, ready for review next morning.
                </p>
                <div className="text-xs bg-navy/10 p-2 rounded">
                  <strong>Best for:</strong> "Follow the sun" development, maximizing
                  24-hour productivity
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Key Principles */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-primary" />
            Key Principles for Life-Cycle Success
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-bold mb-3">1. Tests Before Code</h3>
                <p className="text-muted-foreground">
                  High-level test cases can (and should) be written before the feature
                  is implemented. They serve as executable specifications that clarify
                  requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-bold mb-3">2. Automation Follows Design</h3>
                <p className="text-muted-foreground">
                  Never automate before the test design is stable. Automating a poorly
                  designed test just makes a bad test run faster.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-bold mb-3">3. Interface Definitions Last</h3>
                <p className="text-muted-foreground">
                  Wait until the UI is stable before finalizing interface definitions.
                  This is the most volatile part of the system and should be the last
                  thing you lock down.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-bold mb-3">4. Run What You Can</h3>
                <p className="text-muted-foreground">
                  If only 60% of your tests are automated, run that 60% automatically
                  and the other 40% manually. Partial automation is better than no
                  automation.
                </p>
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
                  <span>Three parallel life-cycles (System, Test, Automation) must be synchronized, not sequential.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Test design can proceed independently of automation using high-level actions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Cross-over Test Modules</strong> verify connections between new sprint features and existing application components.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>The three-layer architecture enables clear ownership boundaries and three outsourcing models: Fully Outsourced, Fully Integrated, and Second Unit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>In Agile, test design happens during development, not after.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/module-5">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous: Language of Logic
            </Button>
          </Link>
          <Link href="/module-7">
            <Button className="gap-2">
              Next: Building Test Modules
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
