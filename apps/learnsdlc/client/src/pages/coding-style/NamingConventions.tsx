import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { AlertTriangle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NamingConventions() {
  usePageMeta({
    title: "Coding Style - Naming Conventions",
    description: "Educational module on professional naming conventions in software development. Part of GRACE Academy curriculum.",
    keywords: "naming conventions education, coding standards, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Coding Style Guide"
      topicTitle="Naming Conventions"
      topicSubtitle="Variable Named 'x' Causes Three-Day Debugging Session; Developer Claims 'It Made Sense at the Time'"
      duration="~5 min"
      topicNumber={3}
      totalTopics={5}
      prevPath="/coding-style-guide/indentation"
      prevLabel="Indentation"
      nextPath="/coding-style-guide/statements"
      nextLabel="Statements & Braces"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/LFXcjwOfkHfaabwy.jpg" 
          alt="Illustration of a naming convention museum with exhibits showing good vs bad variable names"
          className="w-full h-auto"
        />
      </div>

      {/* Reader's Question */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <p className="text-lg italic text-foreground">
            <strong>Dear Marilyn:</strong> I named my variable 'temp' because it's temporary.
            Now I have 47 variables named 'temp' and I can't tell them apart. Help.
          </p>
          <p className="text-right text-muted-foreground mt-4">— Temporarily Confused in Tampa</p>
        </CardContent>
      </Card>

      {/* Marilyn's Response */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          <strong>Dear Temporarily:</strong> You have discovered, through painful experience,
          the First Law of Naming: <em>A name should describe what something IS, not what it
          ISN'T.</em> "Temporary" describes what it isn't (permanent). What IS it? A customer?
          An order? A database connection? Name it that.
        </p>
      </section>

      {/* Naming Conventions Table */}
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

      {/* Names to Avoid */}
      <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
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

      {/* Quiz */}
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
    </TopicPageWrapper>
  );
}
