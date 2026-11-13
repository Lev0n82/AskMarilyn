import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { Code } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function XmlDocumentation() {
  usePageMeta({
    title: "Commenting Guide - XML Documentation",
    description: "Educational module on XML documentation comments. Part of GRACE Academy curriculum.",
    keywords: "XML documentation education, API documentation, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Art of Commenting"
      topicTitle="XML Documentation Comments"
      topicSubtitle="Developer Discovers Triple-Slash Comments; Suddenly Looks Like a Professional"
      duration="~5 min"
      topicNumber={4}
      totalTopics={4}
      prevPath="/commenting-guide/style-guidelines"
      prevLabel="Style Guidelines"
      nextPath="/commenting-guide/quiz"
      nextLabel="Final Assessment"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/uibbAJpXOJVoScgW.jpg" 
          alt="Before and after illustration showing code transformation"
          className="w-full h-auto"
        />
      </div>

      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          In C# and .NET, XML documentation comments are special comments that can be automatically
          extracted to generate documentation. They're the difference between "some code I wrote"
          and "a professional API that others can actually use."
        </p>
      </section>

      {/* Essential XML Tags */}
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

      {/* Common XML Tags Reference */}
      <Card className="mb-8">
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

      {/* When to Use XML Comments */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            When to Use XML Documentation
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-teal font-bold">✓</span>
              <span className="text-sm">Public APIs and libraries that others will consume</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal font-bold">✓</span>
              <span className="text-sm">Complex methods with multiple parameters</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal font-bold">✓</span>
              <span className="text-sm">Methods that throw exceptions under certain conditions</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal font-bold">✓</span>
              <span className="text-sm">Any code that will be maintained by a team</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz */}
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
        explanation="XML documentation comments can be processed by tools to automatically generate documentation websites, IntelliSense tooltips, and API reference guides. This saves time and ensures documentation stays in sync with code."
        eli5Explanation="Imagine if your toy instructions could magically turn into a picture book! XML comments are like special labels that a computer can read and turn into a beautiful instruction manual automatically. You write the labels once, and the computer makes the book for you!"
      />
    </TopicPageWrapper>
  );
}
