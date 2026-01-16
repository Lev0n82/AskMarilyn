import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, MessageSquareText, FileText, AlertTriangle, BookOpen, Code, Lightbulb, CheckCircle, XCircle, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MicroQuiz } from "@/components/MicroQuiz";
import { CheatSheetDownload } from "@/components/CheatSheetDownload";

export default function CommentingGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="bg-teal/10 text-teal px-3 py-1 rounded-full font-medium">
              Bonus Course
            </span>
            <span>•</span>
            <span>30 min read</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Fine Art of Commenting
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed italic">
            "Local Developer Claims Code Is 'Self-Documenting'; Code Respectfully Disagrees"
          </p>
        </header>

        {/* Opening Letter */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> My colleague says "good code doesn't need comments."
                I say that's what people say right before they quit and leave us with 50,000 lines
                of mystery. Who's right?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Commenting Crusader in Cleveland</p>
            </CardContent>
          </Card>
        </section>

        {/* Hero Graphic */}
        <div className="mb-12 rounded-xl overflow-hidden border border-border paper-shadow">
          <img 
            src="/images/commenting-graveyard.jpg" 
            alt="Illustration of a code graveyard where uncommented code goes to die - tombstones with cryptic variable names and developers mourning lost knowledge"
            className="w-full h-auto"
          />
        </div>

        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Crusader:</strong> Your colleague is half right—in the same way that
            saying "good drivers don't need seatbelts" is half right. Yes, good code should be
            readable. No, that doesn't mean you shouldn't also explain <em>why</em> it exists.
          </p>
          <p className="text-lg leading-relaxed">
            The truth is that code tells you <strong>what</strong> is happening. Comments tell you
            <strong> why</strong> it's happening. These are different questions, and both deserve answers.
            What follows is a guide to commenting that will save your future self—and your
            unfortunate successors—countless hours of archaeological excavation.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Topic 1: The Case Against NOT Commenting */}
        <section className="mb-12" id="case-against">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-coral" />
            The Case Against NOT Commenting
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Programmer's Hubris Leads to 6-Month Delay as Team Attempts to Understand 'Obvious' Algorithm"
          </p>

          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> I understand my code perfectly. Why should I waste
                time writing comments for myself?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Confident Coder in Chicago</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Confident:</strong> Do you also remember what you had for lunch three
            Tuesdays ago? The human brain has a remarkable capacity for forgetting things it once
            knew intimately. In six months, your "perfectly clear" code will look like ancient
            hieroglyphics—and you'll be the archaeologist trying to decode your own tomb.
          </p>

          <Card className="mb-6 border-coral/30 bg-coral/5">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Three Excuses (And Why They're Wrong)</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-bold text-coral mb-2">Excuse #1: "I Can Understand My Code"</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Reality:</strong> You can understand it <em>now</em>. In a year, after
                    working on twelve other projects, you will stare at it like a stranger.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Also:</strong> You are not the only person who will ever read this code.
                    Unless you plan to maintain it forever (you don't), someone else will inherit
                    your masterpiece.
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-bold text-coral mb-2">Excuse #2: "I Don't Have Time"</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Reality:</strong> Every minute "saved" by not commenting will cost you
                    ten minutes later when debugging. This is not speculation—it is mathematical
                    certainty.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>The Truth:</strong> If you have time to write the code, you have time
                    to explain it. The two activities should be inseparable.
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-bold text-coral mb-2">Excuse #3: "Good Code Is Self-Documenting"</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Reality:</strong> Good code tells you WHAT it does. Comments tell you
                    WHY it does it, WHEN it was written, and WHO to blame.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> <code>x = x + 1</code> is self-documenting. But WHY
                    are we incrementing x? Is it a counter? An index? A workaround for a bug in
                    a third-party library? The code cannot tell you this.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Exhibit A: The Perl Horror Show</h3>
              <p className="text-muted-foreground mb-4">
                Consider this real code implementing the Solitaire encryption algorithm:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs overflow-x-auto mb-4">
                <pre>{`#!/usr/bin/perl -s
$f=$d?-1:1;$D=pack('C*',33..86);$p=shift;
$p=~y/a-z/A-Z/;$U='$D=~s/(.*)U$/U$1/;
$D=~s/U(.)/$1U/;';($V=$U)=~s/U/V/g;
$p=~s/[A-Z]/$k=ord($&)-64,&e/eg;$k=0;`}</pre>
              </div>
              <p className="text-muted-foreground mb-4">
                Can you understand what this does? Neither can anyone else. Now imagine maintaining it.
              </p>
              <p className="text-sm text-teal font-medium">
                The same algorithm with comments is perfectly comprehensible. Comments transform
                "job security through obscurity" into "code that humans can actually work with."
              </p>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="commenting"
            topicId="case-against"
            question="Why is 'good code is self-documenting' an incomplete philosophy?"
            options={[
              "Because all code needs comments to compile",
              "Because code shows WHAT happens, but comments explain WHY",
              "Because managers require a certain comment-to-code ratio",
              "Because self-documenting code is a myth"
            ]}
            correctAnswer={1}
            explanation="Code can show what operations are performed, but it cannot explain the reasoning, business logic, or historical context behind those operations. Comments bridge this gap by documenting intent, not just implementation."
            eli5Explanation="Imagine you see someone put on a raincoat. You can SEE they're putting on a raincoat (that's the code). But you don't know WHY—maybe it's raining, maybe they're going to wash the car, maybe it's a costume! Comments are like asking 'why are you wearing that?' and getting the answer."
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 2: Types of Comments */}
        <section className="mb-12" id="comment-types">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <MessageSquareText className="w-8 h-8 text-primary" />
            The Three Types of Comments
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Developer Discovers Comments Have Categories; Mind Blown"
          </p>

          {/* Comment Types Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/commenting-storyteller.jpg" 
              alt="Illustration of a 1950s storyteller at a campfire, with three types of stories represented: Documentary (a passport), Functional (a blueprint), and Clarifying (a lightbulb)"
              className="w-full h-auto"
            />
          </div>

          <p className="text-lg leading-relaxed mb-6">
            Not all comments are created equal. Understanding the different purposes of comments
            will help you write the right kind at the right time.
          </p>

          <div className="grid gap-6 mb-6">
            {/* Documentary Comments */}
            <Card className="border-2 border-teal/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold mb-2 text-teal">1. Documentary Comments</h3>
                    <p className="text-muted-foreground mb-4">
                      The "passport" of your code. These comments document the file's identity,
                      history, and purpose.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs">
                      <pre>{`/**
 * File: CustomerService.cs
 * Author: Jane Developer
 * Created: 2024-01-15
 * Last Modified: 2024-03-22
 * 
 * Purpose: Handles all customer-related 
 * business logic including registration,
 * authentication, and profile management.
 * 
 * Dependencies: Database, EmailService
 * 
 * Change History:
 * - 2024-03-22: Added email verification
 * - 2024-02-10: Fixed timezone bug
 */`}</pre>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Include:</strong> Filename, author, dates, purpose, dependencies, change history
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Functional Comments */}
            <Card className="border-2 border-coral/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6 text-coral" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold mb-2 text-coral">2. Functional Comments</h3>
                    <p className="text-muted-foreground mb-4">
                      The "to-do list" of your code. These mark work in progress, known issues,
                      and areas needing attention.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs space-y-2">
                      <p><span className="text-coral">// TODO:</span> Implement caching for performance</p>
                      <p><span className="text-coral">// FIXME:</span> This breaks with Unicode input</p>
                      <p><span className="text-coral">// HACK:</span> Workaround for vendor bug #1234</p>
                      <p><span className="text-coral">// XXX:</span> Needs security review before release</p>
                      <p><span className="text-coral">// DEBUG:</span> Remove before production</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Pro tip:</strong> Most IDEs can search for these markers. Use them consistently.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Explanatory Comments */}
            <Card className="border-2 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold mb-2 text-primary">3. Explanatory Comments</h3>
                    <p className="text-muted-foreground mb-4">
                      The "why" of your code. These explain reasoning, business logic, and
                      non-obvious decisions.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs">
                      <pre>{`// We use a 30-second timeout because the 
// payment gateway occasionally takes 25+ 
// seconds during peak hours. See incident 
// report INC-2024-0142 for details.
var timeout = TimeSpan.FromSeconds(30);

// Intentionally using >= instead of > here.
// Business rule: orders of exactly $100 
// qualify for free shipping (per PM decision
// in meeting 2024-02-15).
if (orderTotal >= 100) {
    ApplyFreeShipping();
}`}</pre>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Rule of thumb:</strong> If you had to think about it, write a comment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <MicroQuiz
            courseId="commenting"
            topicId="comment-types"
            question="You discover a bug that you can't fix right now due to time constraints. Which comment marker should you use?"
            options={[
              "// TODO: Fix this bug",
              "// FIXME: This has a known bug",
              "// HACK: Bug workaround",
              "// NOTE: There's a bug here"
            ]}
            correctAnswer={1}
            explanation="FIXME is specifically for marking known bugs or broken code that needs to be fixed. TODO is for features to add, HACK is for intentional workarounds, and NOTE is for general information."
            eli5Explanation="Think of it like putting stickers on your toys. A 'TODO' sticker means 'I want to add something new.' A 'FIXME' sticker means 'this is broken and needs repair.' A 'HACK' sticker means 'I used tape to fix it for now.' Use the right sticker so you remember what each thing needs!"
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 3: Comment Style Guidelines */}
        <section className="mb-12" id="style-guidelines">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Comment Style Guidelines
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Area Developer's Comments Longer Than Code; Colleagues Stage Intervention"
          </p>

          {/* Style Guidelines Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/commenting-museum.jpg" 
              alt="Illustration of a museum of commenting styles - exhibits showing 'The Over-Commenter' with walls of text, 'The Silent Type' with blank spaces, and 'The Goldilocks Zone' with just-right comments"
              className="w-full h-auto"
            />
          </div>

          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> How much commenting is too much? My colleague writes
                a paragraph for every line of code. I write nothing. Surely there's a middle ground?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Seeking Balance in San Francisco</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Seeking:</strong> The golden rule is this: <strong>comments should not
            exceed the length of the code they explain by too much</strong>. If they do, it's a
            sign the code itself is too complicated and should be refactored.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Good, The Bad, and The Ugly</h3>
              
              <div className="space-y-6">
                {/* Good Example */}
                <div className="p-4 bg-teal/5 border-l-4 border-teal rounded">
                  <h4 className="font-bold text-teal mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Good: Explains the "Why"
                  </h4>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                    <pre>{`// Retry up to 3 times because the API 
// occasionally returns 503 during deployments
for (int i = 0; i < 3; i++) {
    var result = await api.Call();
    if (result.Success) break;
    await Task.Delay(1000);
}`}</pre>
                  </div>
                </div>

                {/* Bad Example */}
                <div className="p-4 bg-coral/5 border-l-4 border-coral rounded">
                  <h4 className="font-bold text-coral mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Bad: States the Obvious
                  </h4>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                    <pre>{`// Increment i by 1
i++;

// Check if user is null
if (user == null) {
    // Return null
    return null;
}`}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These comments add no value. The code already says exactly what they say.
                  </p>
                </div>

                {/* Ugly Example */}
                <div className="p-4 bg-amber-500/5 border-l-4 border-amber-500 rounded">
                  <h4 className="font-bold text-amber-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Ugly: Lies
                  </h4>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                    <pre>{`// Calculate the user's age
var discount = price * 0.15;`}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    A wrong comment is worse than no comment. When code changes, update the comments!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Comment Formatting Best Practices</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Practice</th>
                      <th className="border border-border p-3 text-left">Example</th>
                      <th className="border border-border p-3 text-left">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Use complete sentences</td>
                      <td className="border border-border p-3 font-mono text-xs">// This validates the input format.</td>
                      <td className="border border-border p-3">Clarity and professionalism</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Start with capital letter</td>
                      <td className="border border-border p-3 font-mono text-xs">// Calculate tax after discount</td>
                      <td className="border border-border p-3">Consistency and readability</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Match indentation</td>
                      <td className="border border-border p-3 font-mono text-xs">    // Comment at same level as code</td>
                      <td className="border border-border p-3">Visual association with code</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Keep line length reasonable</td>
                      <td className="border border-border p-3 font-mono text-xs">// Max ~80 characters per line</td>
                      <td className="border border-border p-3">Readability without scrolling</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Update when code changes</td>
                      <td className="border border-border p-3 font-mono text-xs">// [Updated 2024-03-22]</td>
                      <td className="border border-border p-3">Prevent misleading information</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="commenting"
            topicId="style-guidelines"
            question="Which of these comments provides the most value?"
            options={[
              "// Set x to 5",
              "// x = 5",
              "// Using 5 because that's the max retry count per SLA agreement",
              "// Variable assignment"
            ]}
            correctAnswer={2}
            explanation="The third option explains WHY the value is 5, referencing a business requirement (SLA agreement). The other options merely restate what the code already shows, adding no new information."
            eli5Explanation="Imagine you're explaining why you have 5 cookies. 'I have 5 cookies' doesn't help—we can see that! But 'I have 5 cookies because that's how many fit in my lunchbox' tells us something new and useful. Good comments explain the 'because' part!"
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 4: XML Documentation Comments */}
        <section className="mb-12" id="xml-comments">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <Code className="w-8 h-8 text-primary" />
            XML Documentation Comments
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Developer Discovers Triple-Slash Comments; Suddenly Looks Like a Professional"
          </p>

          {/* XML Documentation Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/commenting-before-after.jpg" 
              alt="Before and after illustration showing code transformation from amateur to professional with XML documentation - left side shows messy undocumented code, right side shows pristine documented API"
              className="w-full h-auto"
            />
          </div>

          <p className="text-lg leading-relaxed mb-6">
            In C# and .NET, XML documentation comments are special comments that can be automatically
            extracted to generate documentation. They're the difference between "some code I wrote"
            and "a professional API that others can actually use."
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Essential XML Tags</h3>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                <pre>{`/// <summary>
/// Calculates the total price including tax and discounts.
/// </summary>
/// <param name="basePrice">The original price before modifications</param>
/// <param name="taxRate">Tax rate as a decimal (e.g., 0.08 for 8%)</param>
/// <param name="discountCode">Optional discount code to apply</param>
/// <returns>The final calculated price</returns>
/// <exception cref="ArgumentException">
/// Thrown when basePrice is negative
/// </exception>
/// <example>
/// <code>
/// var total = CalculateTotal(100.00m, 0.08m, "SAVE10");
/// // Returns 97.20 (100 - 10% + 8% tax)
/// </code>
/// </example>
/// <remarks>
/// Discount is applied before tax calculation.
/// </remarks>
public decimal CalculateTotal(
    decimal basePrice, 
    decimal taxRate, 
    string discountCode = null)
{
    // Implementation
}`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Common XML Tags Reference</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;summary&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Brief description of the member</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;param&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Describes a method parameter</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;returns&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Describes the return value</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;exception&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Documents possible exceptions</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;example&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Shows usage examples</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;remarks&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Additional information</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;see cref="..."&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Cross-reference to other members</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <code className="text-teal">&lt;code&gt;</code>
                    <p className="text-xs text-muted-foreground mt-1">Inline code formatting</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="commenting"
            topicId="xml-comments"
            question="What is the primary benefit of using XML documentation comments?"
            options={[
              "They make the code run faster",
              "They can be automatically extracted to generate documentation",
              "They are required by the C# compiler",
              "They use less disk space than regular comments"
            ]}
            correctAnswer={1}
            explanation="XML documentation comments can be processed by tools to automatically generate API documentation, IntelliSense tooltips, and help files. This makes your code self-documenting in a way that benefits both developers and end-users."
            eli5Explanation="Regular comments are like notes you write for yourself. XML comments are like filling out a special form that a robot can read. The robot then makes a beautiful instruction manual for everyone! So you write once, and the robot helps share it with everyone automatically."
          />
        </section>

        <Separator className="my-12" />

        {/* Summary */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-teal/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-display text-2xl font-bold mb-4">Course Summary</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Comments are essential:</strong> Code shows WHAT, comments explain WHY.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Three types:</strong> Documentary (identity), Functional (TODO/FIXME), Explanatory (reasoning).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Quality over quantity:</strong> Don't state the obvious; explain the non-obvious.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Keep them updated:</strong> A wrong comment is worse than no comment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Use XML docs:</strong> For public APIs, use /// comments for auto-generated documentation.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Cheat Sheet Download */}
        <section className="mb-12">
          <CheatSheetDownload courseId="commenting" courseName="The Fine Art of Commenting" />
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/coding-style-guide">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Coding Style Guide
            </Button>
          </Link>
          <Link href="/technical-writing-guide">
            <Button className="gap-2">
              Next: Technical Writing
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
