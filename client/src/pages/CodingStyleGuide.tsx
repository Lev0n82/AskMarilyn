import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, FileCode, Indent, Type, Braces, Space, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MicroQuiz } from "@/components/MicroQuiz";
import { CheatSheetDownload } from "@/components/CheatSheetDownload";

export default function CodingStyleGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="bg-coral/10 text-coral px-3 py-1 rounded-full font-medium">
              Bonus Course
            </span>
            <span>•</span>
            <span>25 min read</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            The C# Coding Style Guide
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed italic">
            "Local Developer's Code 'Works Fine'; Colleagues Disagree on Definition of 'Fine'"
          </p>
        </header>

        {/* Opening Letter */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> My code works perfectly, but my team lead says it's
                "unreadable." I say if it compiles, it's readable enough. Who's right?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Frustrated in Fresno</p>
            </CardContent>
          </Card>
        </section>

        {/* Hero Graphic */}
        <div className="mb-12 rounded-xl overflow-hidden border border-border paper-shadow">
          <img 
            src="/images/coding-style-chaos.jpg" 
            alt="Illustration of file organization chaos vs order - a frazzled developer searching through disorganized files while a pristine filing cabinet glows in the corner"
            className="w-full h-auto"
          />
        </div>

        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Frustrated:</strong> Let me put this as gently as possible: you are
            spectacularly wrong. The fact that code compiles tells us only that a computer can
            understand it—and computers, bless their silicon hearts, will happily execute the most
            horrifying spaghetti code without complaint.
          </p>
          <p className="text-lg leading-relaxed">
            The question isn't whether your code works. The question is whether a human being—perhaps
            your future self at 3 AM during a production emergency—can understand it quickly enough
            to fix it before the company loses money.
          </p>
          <p className="text-lg leading-relaxed">
            What follows is a guide to writing code that humans can actually read. Consider it an
            investment in your future sanity.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Topic 1: File Organization */}
        <section className="mb-12" id="file-organization">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <FileCode className="w-8 h-8 text-primary" />
            File Organization
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Developer Spends 45 Minutes Searching for Method; It Was in a File Named 'Stuff.cs'"
          </p>

          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> Does it really matter how I organize my files? The
                compiler doesn't care.
              </p>
              <p className="text-right text-muted-foreground mt-4">— Chaotic in Chicago</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Chaotic:</strong> The compiler also doesn't care if you name all your
            variables <code>x1</code>, <code>x2</code>, and <code>x3</code>. That doesn't make it
            a good idea. File organization is about <em>human</em> navigation, not machine parsing.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Sacred Order of File Contents</h3>
              <p className="text-muted-foreground mb-4">
                Every C# file should follow this structure, in this exact order:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                <ol className="space-y-2">
                  <li><span className="text-teal">1.</span> Using directives (external namespaces)</li>
                  <li><span className="text-teal">2.</span> Namespace declaration</li>
                  <li><span className="text-teal">3.</span> Class/Interface declaration</li>
                  <li className="pl-4"><span className="text-coral">3.1</span> Constants and static fields</li>
                  <li className="pl-4"><span className="text-coral">3.2</span> Private fields</li>
                  <li className="pl-4"><span className="text-coral">3.3</span> Constructors</li>
                  <li className="pl-4"><span className="text-coral">3.4</span> Properties</li>
                  <li className="pl-4"><span className="text-coral">3.5</span> Public methods</li>
                  <li className="pl-4"><span className="text-coral">3.6</span> Private methods</li>
                </ol>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Why this order?</strong> Because when someone opens your file, they want to
                understand the "what" (fields, properties) before the "how" (methods). It's like
                reading a recipe: ingredients first, then instructions.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 border-coral/30 bg-coral/5">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4 text-coral">The One Class, One File Rule</h3>
              <p className="text-muted-foreground mb-4">
                Each source file should contain exactly one class, and the filename should match
                the class name exactly.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-bold text-teal mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Correct
                  </h4>
                  <code className="text-sm">CustomerService.cs</code>
                  <p className="text-xs text-muted-foreground mt-1">Contains: class CustomerService</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-bold text-coral mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Wrong
                  </h4>
                  <code className="text-sm">Utilities.cs</code>
                  <p className="text-xs text-muted-foreground mt-1">Contains: 47 unrelated classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="coding-style"
            topicId="file-organization"
            question="You have a class called 'OrderProcessor'. What should the file be named?"
            options={[
              "order_processor.cs",
              "OrderProcessor.cs",
              "Orders.cs",
              "Processor.cs"
            ]}
            correctAnswer={1}
            explanation="The filename should exactly match the class name, including capitalization. OrderProcessor.cs makes it immediately clear what class is inside without opening the file."
            eli5Explanation="Imagine you have a toy box labeled 'LEGOS' but it actually has dinosaurs inside. That's confusing, right? Your file name is like the label on the box—it should tell you exactly what's inside. If your class is called OrderProcessor, the file should be called OrderProcessor.cs!"
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 2: Indentation */}
        <section className="mb-12" id="indentation">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <Indent className="w-8 h-8 text-primary" />
            Indentation
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Tabs vs. Spaces Debate Ends Marriage; Divorce Papers Cite 'Irreconcilable Differences'"
          </p>

          {/* Indentation Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/coding-style-indentation.jpg" 
              alt="Illustration comparing proper indentation as a staircase to success vs chaotic indentation leading to a pit of confusion"
              className="w-full h-auto"
            />
          </div>

          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> Tabs or spaces? I need to know before I can continue
                living my life.
              </p>
              <p className="text-right text-muted-foreground mt-4">— Existentially Confused in Seattle</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Existentially:</strong> The answer is: <strong>tabs</strong>. But more
            importantly, the answer is: <strong>consistency</strong>. A codebase that mixes tabs
            and spaces is like a book that randomly switches between English and Klingon mid-sentence.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Rules of Indentation</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Rule 1: Use tabs, not spaces</h4>
                  <p className="text-sm text-muted-foreground">
                    Tabs allow each developer to set their preferred visual width. Spaces force
                    everyone to see exactly what you see, whether they like it or not.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Rule 2: One level of indentation per block</h4>
                  <p className="text-sm text-muted-foreground">
                    Every time you open a brace, indent. Every time you close a brace, un-indent.
                    This is not negotiable.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Rule 3: Align continuation lines</h4>
                  <p className="text-sm text-muted-foreground">
                    When a statement spans multiple lines, align the continuation with the opening
                    element.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Visual Examples</h3>
              <div className="grid gap-4">
                <div className="p-4 bg-teal/5 border-l-4 border-teal rounded">
                  <h4 className="font-bold text-teal mb-2">Correct Indentation</h4>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                    <pre>{`public void ProcessOrder(Order order)
{
    if (order.IsValid)
    {
        foreach (var item in order.Items)
        {
            ProcessItem(item);
        }
    }
}`}</pre>
                  </div>
                </div>
                <div className="p-4 bg-coral/5 border-l-4 border-coral rounded">
                  <h4 className="font-bold text-coral mb-2">Incorrect Indentation</h4>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                    <pre>{`public void ProcessOrder(Order order)
{
if (order.IsValid)
{
foreach (var item in order.Items)
{
ProcessItem(item);
}
}
}`}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Without indentation, the code structure is invisible. Good luck debugging this at 2 AM.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="coding-style"
            topicId="indentation"
            question="Why is consistent indentation important in code?"
            options={[
              "It makes the code run faster",
              "It's required by the C# compiler",
              "It visually shows the logical structure of the code",
              "It reduces file size"
            ]}
            correctAnswer={2}
            explanation="Indentation has no effect on how code runs or compiles—it's purely for human readers. Proper indentation visually represents the logical nesting of code blocks, making it much easier to understand the flow of execution."
            eli5Explanation="Think of indentation like the chapters and paragraphs in a book. The book would still have the same words without them, but it would be really hard to read! Indentation is like putting spaces between ideas so your brain can see where one thing ends and another begins."
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 3: Naming Conventions */}
        <section className="mb-12" id="naming-conventions">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <Type className="w-8 h-8 text-primary" />
            Naming Conventions
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Variable Named 'x' Causes Three-Day Debugging Session; Developer Claims 'It Made Sense at the Time'"
          </p>

          {/* Naming Conventions Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/coding-style-naming.jpg" 
              alt="Illustration of a naming convention museum with exhibits showing good vs bad variable names, with visitors reacting in horror to 'temp47' and 'x'"
              className="w-full h-auto"
            />
          </div>

          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> I named my variable 'temp' because it's temporary.
                Now I have 47 variables named 'temp' and I can't tell them apart. Help.
              </p>
              <p className="text-right text-muted-foreground mt-4">— Temporarily Confused in Tampa</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Temporarily:</strong> You have discovered, through painful experience,
            the First Law of Naming: <em>A name should describe what something IS, not what it
            ISN'T.</em> "Temporary" describes what it isn't (permanent). What IS it? A customer?
            An order? A database connection? Name it that.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The C# Naming Conventions</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Element</th>
                      <th className="border border-border p-3 text-left">Convention</th>
                      <th className="border border-border p-3 text-left">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Classes</td>
                      <td className="border border-border p-3">PascalCase</td>
                      <td className="border border-border p-3 font-mono">CustomerService</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Interfaces</td>
                      <td className="border border-border p-3">IPascalCase</td>
                      <td className="border border-border p-3 font-mono">IOrderRepository</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Methods</td>
                      <td className="border border-border p-3">PascalCase</td>
                      <td className="border border-border p-3 font-mono">CalculateTotal()</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Properties</td>
                      <td className="border border-border p-3">PascalCase</td>
                      <td className="border border-border p-3 font-mono">FirstName</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Local Variables</td>
                      <td className="border border-border p-3">camelCase</td>
                      <td className="border border-border p-3 font-mono">orderTotal</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Private Fields</td>
                      <td className="border border-border p-3">_camelCase</td>
                      <td className="border border-border p-3 font-mono">_customerRepository</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Constants</td>
                      <td className="border border-border p-3">PascalCase</td>
                      <td className="border border-border p-3 font-mono">MaxRetryCount</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Parameters</td>
                      <td className="border border-border p-3">camelCase</td>
                      <td className="border border-border p-3 font-mono">customerId</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Names to Avoid
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-coral mb-2">Never Use:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><code>temp</code>, <code>tmp</code>, <code>data</code></li>
                    <li><code>x</code>, <code>y</code>, <code>z</code> (except in math)</li>
                    <li><code>foo</code>, <code>bar</code>, <code>baz</code></li>
                    <li><code>thing</code>, <code>stuff</code>, <code>item</code></li>
                    <li><code>myVariable</code>, <code>theObject</code></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-teal mb-2">Instead Use:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><code>pendingOrder</code>, <code>cachedResult</code></li>
                    <li><code>xCoordinate</code>, <code>yPosition</code></li>
                    <li><code>testCustomer</code>, <code>mockRepository</code></li>
                    <li><code>orderLineItem</code>, <code>configurationSetting</code></li>
                    <li><code>currentUser</code>, <code>selectedProduct</code></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="coding-style"
            topicId="naming-conventions"
            question="What is the correct naming convention for a private field in C#?"
            options={[
              "CustomerRepository",
              "customerRepository",
              "_customerRepository",
              "CUSTOMER_REPOSITORY"
            ]}
            correctAnswer={2}
            explanation="Private fields in C# use camelCase with a leading underscore (_customerRepository). This distinguishes them from local variables (camelCase without underscore) and properties (PascalCase)."
            eli5Explanation="Private fields are like your secret diary—they start with an underscore (_) to show they're private! It's like putting a 'DO NOT READ' sticker on them. When you see _something, you know it's a private field that belongs to the class and shouldn't be touched from outside."
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 4: Statements and Braces */}
        <section className="mb-12" id="statements">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <Braces className="w-8 h-8 text-primary" />
            Statements and Braces
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Missing Brace Causes Production Outage; Developer Insists 'It Looked Fine to Me'"
          </p>

          <p className="text-lg leading-relaxed mb-6">
            The humble curly brace is the unsung hero of code structure. Use it wisely, use it
            consistently, and it will never betray you. Omit it "to save space," and it will
            destroy your weekend.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Brace Placement Rules</h3>
              <div className="space-y-4">
                <div className="p-4 bg-teal/5 border-l-4 border-teal rounded">
                  <h4 className="font-bold text-teal mb-2">Rule: Opening brace on its own line</h4>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                    <pre>{`if (condition)
{
    DoSomething();
}`}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is the C# standard. The brace aligns with the statement it belongs to.
                  </p>
                </div>
                <div className="p-4 bg-coral/5 border-l-4 border-coral rounded">
                  <h4 className="font-bold text-coral mb-2">Never: Omit braces for single statements</h4>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                    <pre>{`// DANGEROUS - Don't do this!
if (condition)
    DoSomething();
    DoSomethingElse(); // This ALWAYS runs!`}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is how bugs are born. The second line looks indented, but it's not part
                    of the if statement. Always use braces.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Statement Guidelines</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span><strong>One statement per line.</strong> Never chain multiple statements on one line.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span><strong>One declaration per line.</strong> Don't declare multiple variables together.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span><strong>Blank line between logical sections.</strong> Group related code visually.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="coding-style"
            topicId="statements"
            question="Why should you always use braces even for single-line if statements?"
            options={[
              "It makes the code run faster",
              "It prevents bugs when someone adds a second line later",
              "The C# compiler requires it",
              "It uses less memory"
            ]}
            correctAnswer={1}
            explanation="When braces are omitted, adding a second line to an if statement is a common source of bugs. The new line looks like it's part of the if block due to indentation, but it actually runs unconditionally. Always using braces prevents this entire class of bugs."
            eli5Explanation="Imagine you have a fence around your yard. Without the fence (braces), anyone could accidentally walk into your yard thinking it's part of the sidewalk. With the fence, it's super clear where your yard starts and ends. Braces are like a fence for your code—they show exactly what belongs together!"
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 5: White Space */}
        <section className="mb-12" id="white-space">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <Space className="w-8 h-8 text-primary" />
            White Space
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Developer Removes All Whitespace to 'Save Bytes'; Code Review Takes 6 Hours"
          </p>

          {/* White Space Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/coding-style-whitespace.jpg" 
              alt="Illustration comparing code with proper whitespace as a well-organized garden vs code without whitespace as an overgrown jungle"
              className="w-full h-auto"
            />
          </div>

          <p className="text-lg leading-relaxed mb-6">
            White space is not wasted space. It's breathing room for your code. Just as paragraphs
            make text readable, strategic blank lines and spaces make code scannable.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">White Space Rules</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Spaces around operators</h4>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-teal text-sm font-medium">Good:</span>
                      <code className="block mt-1 text-sm">x = y + z;</code>
                    </div>
                    <div>
                      <span className="text-coral text-sm font-medium">Bad:</span>
                      <code className="block mt-1 text-sm">x=y+z;</code>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Space after commas</h4>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-teal text-sm font-medium">Good:</span>
                      <code className="block mt-1 text-sm">Method(a, b, c)</code>
                    </div>
                    <div>
                      <span className="text-coral text-sm font-medium">Bad:</span>
                      <code className="block mt-1 text-sm">Method(a,b,c)</code>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">Blank lines between methods</h4>
                  <p className="text-sm text-muted-foreground">
                    Separate methods with exactly one blank line. No more, no less.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">No trailing whitespace</h4>
                  <p className="text-sm text-muted-foreground">
                    Lines should not end with spaces or tabs. Configure your editor to remove them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="coding-style"
            topicId="white-space"
            question="What is the purpose of blank lines between methods in a class?"
            options={[
              "To make the file larger",
              "To visually separate logical units and improve readability",
              "To make the code compile faster",
              "They serve no purpose and should be removed"
            ]}
            correctAnswer={1}
            explanation="Blank lines between methods act as visual separators, making it easier to scan the code and identify where one method ends and another begins. They improve readability without affecting how the code runs."
            eli5Explanation="Think about reading a book with no spaces between paragraphs—it would be really hard to see where one idea ends and another starts! Blank lines in code are like the spaces between paragraphs. They help your eyes take a little break and see 'okay, this part is done, now here's a new part.'"
          />
        </section>

        <Separator className="my-12" />

        {/* Summary */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-coral/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-display text-2xl font-bold mb-4">Course Summary</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>File Organization:</strong> One class per file, named to match the class.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Indentation:</strong> Use tabs consistently, one level per block.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Naming:</strong> PascalCase for public, camelCase for private, descriptive always.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Braces:</strong> Always use them, even for single statements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>White Space:</strong> Use it strategically to improve readability.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Cheat Sheet Download */}
        <section className="mb-12">
          <CheatSheetDownload courseId="coding-style" courseName="C# Coding Style Guide" />
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/courses">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to All Courses
            </Button>
          </Link>
          <Link href="/commenting-guide">
            <Button className="gap-2">
              Next: The Art of Commenting
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
