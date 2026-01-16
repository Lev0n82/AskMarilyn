import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, Shuffle, Search, Image, Share2, Code, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleProgress, MODULE_READING_TIMES, TOTAL_ABT_MODULES } from "@/components/ModuleProgress";

export default function Module8() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                Module 8
              </span>
            </div>
            <div className="hidden md:block">
              <ModuleProgress 
                moduleNumber={8} 
                totalModules={TOTAL_ABT_MODULES} 
                estimatedMinutes={MODULE_READING_TIMES[8]} 
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Advanced Techniques
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Once you have mastered the fundamentals, these advanced techniques will help
            you handle the edge cases that separate good test suites from great ones.
          </p>
        </header>

        {/* Hero Image */}
        <figure className="mb-12 rounded-xl overflow-hidden border border-border">
          <img
            src="/images/module-8-advanced.jpg"
            alt="Swiss Army knife with multiple tools representing advanced testing techniques"
            className="w-full h-auto"
          />
          <figcaption className="text-center text-sm text-muted-foreground py-3 bg-muted/30">
            Advanced techniques are tools in your testing toolkit—use the right one for each job
          </figcaption>
        </figure>

        {/* Opening Question */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> Our application runs on three different browsers,
                two operating systems, and has both English and Spanish versions. Do I really
                need to write separate tests for each combination?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Overwhelmed in Orlando</p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Overwhelmed:</strong> Absolutely not. What you need is not more tests,
            but smarter tests. ABT provides several techniques for handling variations without
            multiplying your test count. Let me introduce you to the Swiss Army knife of
            test automation.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Variations */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Shuffle className="w-8 h-8 text-primary" />
            Variations: One Test, Many Configurations
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            A <strong>variation</strong> is a configuration parameter that changes how a test
            runs without changing what it tests. Think of it as a dial you can turn to
            switch contexts.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Common Variation Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Browser Variations</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Chrome, Firefox, Safari, Edge</li>
                    <li>• Mobile vs. Desktop</li>
                    <li>• Different screen resolutions</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Environment Variations</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Dev, QA, Staging, Production</li>
                    <li>• Different database configurations</li>
                    <li>• Cloud regions (US, EU, APAC)</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Localization Variations</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Language (EN, ES, FR, DE)</li>
                    <li>• Currency formats</li>
                    <li>• Date/time formats</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">User Variations</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Role-based (Admin, User, Guest)</li>
                    <li>• Permission levels</li>
                    <li>• Subscription tiers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">How Variations Work</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                <p className="text-muted-foreground"># Test: Login Verification</p>
                <p className="text-muted-foreground"># Variations: Browser, Language</p>
                <p></p>
                <p>open_browser(type: [Browser])</p>
                <p>set_language(locale: [Language])</p>
                <p>navigate_to(page: "Login")</p>
                <p>enter_credentials(user: "testuser", password: "secret")</p>
                <p>click_login()</p>
                <p>check_welcome_message(expected: [Welcome_Text])</p>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Browser</th>
                      <th className="border border-border p-2 text-left">Language</th>
                      <th className="border border-border p-2 text-left">Welcome_Text</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2">Chrome</td>
                      <td className="border border-border p-2">en-US</td>
                      <td className="border border-border p-2">"Welcome back!"</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-2">Firefox</td>
                      <td className="border border-border p-2">es-ES</td>
                      <td className="border border-border p-2">"¡Bienvenido!"</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">Safari</td>
                      <td className="border border-border p-2">fr-FR</td>
                      <td className="border border-border p-2">"Bienvenue!"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed">
            One test, three rows, nine executions (3 browsers × 3 languages). Without
            variations, you would need to write nine separate tests.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Regular Expressions */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            Regular Expressions: Pattern Matching
          </h2>

          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> My test keeps failing because the order number
                changes every time. How can I verify "Order #12345 created" when the number
                is always different?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Pattern Seeker in Portland</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Pattern Seeker:</strong> You need to verify the pattern, not the
            exact value. Regular expressions let you say "I expect 'Order #' followed by
            some digits, followed by ' created'."
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Common Regex Patterns for Testing</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">Order Numbers</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">Order #\d+ created</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Matches: "Order #12345 created", "Order #1 created", "Order #999999 created"
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">Timestamps</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">\d{'{'}4{'}'}-\d{'{'}2{'}'}-\d{'{'}2{'}'}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Matches: "2024-01-15", "2025-12-31"
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">Email Addresses</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{'}2,{'}'}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Matches: "user@example.com", "test.user@company.org"
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">Currency Values</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">\$[\d,]+\.\d{'{'}2{'}'}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Matches: "$1,234.56", "$0.99", "$1,000,000.00"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Using Regex in Checks</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                <p className="text-muted-foreground"># Instead of exact match:</p>
                <p className="text-coral line-through">check_message(expected: "Order #12345 created")</p>
                <p></p>
                <p className="text-muted-foreground"># Use pattern match:</p>
                <p className="text-teal">check_message(pattern: "Order #\\d+ created")</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Graphics Testing */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Image className="w-8 h-8 text-primary" />
            Graphics & Media Testing
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Not everything can be verified by reading text. Sometimes you need to verify
            that an image looks correct, a chart displays properly, or a video plays.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Visual Verification Techniques</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal/20 flex items-center justify-center">
                      <span className="text-teal text-sm font-bold">1</span>
                    </div>
                    Screenshot Comparison
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Capture a "golden" screenshot and compare future runs against it.
                    Useful for catching unintended visual changes.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal/20 flex items-center justify-center">
                      <span className="text-teal text-sm font-bold">2</span>
                    </div>
                    Region Verification
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Check that a specific region of the screen matches expected content.
                    More resilient to layout changes than full-page comparison.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal/20 flex items-center justify-center">
                      <span className="text-teal text-sm font-bold">3</span>
                    </div>
                    OCR Verification
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Extract text from images using Optical Character Recognition.
                    Useful for verifying text in charts, graphs, or PDFs.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal/20 flex items-center justify-center">
                      <span className="text-teal text-sm font-bold">4</span>
                    </div>
                    Media Playback
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Verify that audio/video plays, reaches expected duration,
                    and does not error out during playback.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Example: Chart Verification</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                <p className="text-muted-foreground"># Verify sales chart displays correctly</p>
                <p>navigate_to(page: "Sales Dashboard")</p>
                <p>wait_for_chart_load(chart_id: "monthly_sales")</p>
                <p></p>
                <p className="text-muted-foreground"># Visual verification</p>
                <p>check_picture(region: "sales_chart", baseline: "expected_chart.png", tolerance: 5%)</p>
                <p></p>
                <p className="text-muted-foreground"># Data verification via OCR</p>
                <p>check_chart_label(chart_id: "monthly_sales", label: "January", value_pattern: "\\$[\\d,]+")</p>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-display text-2xl font-bold mb-6">Check Picture: Deep Dive</h3>

          <p className="text-lg leading-relaxed mb-6">
            The <code>check_picture</code> action is more sophisticated than a simple screenshot
            comparison. Understanding its options will help you create robust visual tests.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h4 className="font-display text-lg font-bold mb-4">Absolute vs. Relative Checks</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-teal/30 rounded-lg bg-teal/5">
                  <h5 className="font-bold text-teal mb-2">Absolute Checks</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Baseline images are stored in a central <strong>"Picture Checks"</strong> folder.
                    Use for images that should be consistent across all tests.
                  </p>
                  <div className="bg-muted/50 p-2 rounded font-mono text-xs">
                    check_picture(baseline: "company_logo.png")
                  </div>
                </div>
                <div className="p-4 border-2 border-coral/30 rounded-lg bg-coral/5">
                  <h5 className="font-bold text-coral mb-2">Relative Checks</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Baseline images are stored <strong>within the test module</strong>.
                    Use for context-specific images that vary by test.
                  </p>
                  <div className="bg-muted/50 p-2 rounded font-mono text-xs">
                    check_picture(baseline: "./expected_state.png")
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h4 className="font-display text-lg font-bold mb-4">Tolerance Settings</h4>
              <p className="text-muted-foreground mb-4">
                Real-world images rarely match pixel-for-pixel. Tolerance settings let you
                define acceptable differences.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Parameter</th>
                      <th className="border border-border p-3 text-left">Description</th>
                      <th className="border border-border p-3 text-left">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-mono">tolerance</td>
                      <td className="border border-border p-3">Percentage of pixels that can differ</td>
                      <td className="border border-border p-3 font-mono">tolerance: 5%</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3 font-mono">color_threshold</td>
                      <td className="border border-border p-3">How different a pixel color can be (0-255)</td>
                      <td className="border border-border p-3 font-mono">color_threshold: 10</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-mono">ignore_regions</td>
                      <td className="border border-border p-3">Areas to exclude from comparison</td>
                      <td className="border border-border p-3 font-mono">ignore: ["timestamp", "ads"]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/30 mb-6">
            <CardContent className="pt-6">
              <h4 className="font-bold mb-2">Factors That Can "Spoil" Picture Checks</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Dynamic test data (timestamps, IDs)</li>
                  <li>• Environment differences (fonts, rendering)</li>
                  <li>• Random elements (ads, recommendations)</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Animation states (loading spinners)</li>
                  <li>• Anti-aliasing differences</li>
                  <li>• Screen resolution variations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Project Subscription */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Share2 className="w-8 h-8 text-primary" />
            Project Subscription: Reuse Across Projects
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            When multiple projects share common functionality, you do not want to
            duplicate test modules. <strong>Project Subscription</strong> lets you
            create a "library" of reusable test assets.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">How Subscription Works</h3>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <Code className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-bold">Core Library</h4>
                  <p className="text-sm text-muted-foreground">
                    login_actions<br />
                    navigation_actions<br />
                    common_checks
                  </p>
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div className="flex flex-col gap-2">
                  <div className="p-3 bg-teal/10 rounded-lg text-center">
                    <h4 className="font-bold text-sm">Project A</h4>
                    <p className="text-xs text-muted-foreground">Subscribes to Core</p>
                  </div>
                  <div className="p-3 bg-coral/10 rounded-lg text-center">
                    <h4 className="font-bold text-sm">Project B</h4>
                    <p className="text-xs text-muted-foreground">Subscribes to Core</p>
                  </div>
                  <div className="p-3 bg-navy/10 rounded-lg text-center">
                    <h4 className="font-bold text-sm">Project C</h4>
                    <p className="text-xs text-muted-foreground">Subscribes to Core</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-teal/30 bg-teal/5">
              <CardContent className="pt-4">
                <h4 className="font-bold text-teal mb-2">Good Candidates for Sharing</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Authentication actions (login, logout, password reset)</li>
                  <li>• Navigation actions (menu, breadcrumb, search)</li>
                  <li>• Common UI checks (error messages, notifications)</li>
                  <li>• Data setup utilities (create test user, seed data)</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-coral/30 bg-coral/5">
              <CardContent className="pt-4">
                <h4 className="font-bold text-coral mb-2">Keep Project-Specific</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Business-specific workflows</li>
                  <li>• Custom UI components</li>
                  <li>• Project-specific data formats</li>
                  <li>• Unique validation rules</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Test Suites */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <Shuffle className="w-8 h-8 text-primary" />
            Test Suites: Organizing Execution
          </h2>

          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> We have hundreds of test modules. How do we
                decide which tests to run for a nightly build versus a full regression?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Selecting in Seattle</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Selecting:</strong> You need <strong>Test Suites</strong>—logical
            groupings of test modules that can be executed together. There are two approaches
            to creating suites, and most teams use both.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-teal/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center mb-4">
                  <span className="text-teal font-bold text-xl">1</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Predefined Suites</h3>
                <p className="text-muted-foreground mb-4">
                  Manually curated lists of test modules. You explicitly add or remove
                  tests from the suite.
                </p>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs space-y-1">
                  <p className="text-muted-foreground"># Smoke Test Suite</p>
                  <p>• Login_Tests</p>
                  <p>• Dashboard_Load</p>
                  <p>• Critical_Workflow</p>
                  <p>• Logout_Tests</p>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-teal font-bold">Best for:</span>
                  <span className="text-muted-foreground"> Smoke tests, critical path, release validation</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-coral/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center mb-4">
                  <span className="text-coral font-bold text-xl">2</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Query-Based Suites</h3>
                <p className="text-muted-foreground mb-4">
                  Dynamic selection based on criteria. Tests are included if they match
                  the query conditions.
                </p>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs space-y-1">
                  <p className="text-muted-foreground"># All Invoice Tests</p>
                  <p>WHERE module_name LIKE "Invoice%"</p>
                  <p>AND priority = "High"</p>
                  <p>AND last_modified {">"}= "2024-01-01"</p>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-coral font-bold">Best for:</span>
                  <span className="text-muted-foreground"> Regression, feature-specific, recent changes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Common Suite Strategies</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Suite Type</th>
                      <th className="border border-border p-3 text-left">When to Run</th>
                      <th className="border border-border p-3 text-left">Selection Method</th>
                      <th className="border border-border p-3 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">Smoke</td>
                      <td className="border border-border p-3">Every commit</td>
                      <td className="border border-border p-3">Predefined (10-20 critical tests)</td>
                      <td className="border border-border p-3">5-15 minutes</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3 font-medium">Nightly</td>
                      <td className="border border-border p-3">Daily overnight</td>
                      <td className="border border-border p-3">Query (all high + medium priority)</td>
                      <td className="border border-border p-3">2-4 hours</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Full Regression</td>
                      <td className="border border-border p-3">Weekly / Pre-release</td>
                      <td className="border border-border p-3">Query (all active tests)</td>
                      <td className="border border-border p-3">8+ hours</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3 font-medium">Feature-Specific</td>
                      <td className="border border-border p-3">After feature changes</td>
                      <td className="border border-border p-3">Query (by module/tag)</td>
                      <td className="border border-border p-3">Variable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-teal/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-display text-2xl font-bold mb-4">Module Summary</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Variations</strong> let you run one test across multiple configurations (browsers, languages, environments).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Regular expressions</strong> enable pattern-based verification for dynamic content.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Graphics testing</strong> handles visual verification through screenshots, regions, and OCR. Use <strong>absolute</strong> checks for shared images and <strong>relative</strong> checks for context-specific ones.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Project subscription</strong> enables reuse of common test assets across multiple projects.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Test Suites</strong> organize execution: use <strong>predefined</strong> suites for critical paths and <strong>query-based</strong> suites for dynamic selection.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/module-7">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous: Building Test Modules
            </Button>
          </Link>
          <Link href="/module-9">
            <Button className="gap-2">
              Next: Anti-Pattern Gallery
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
