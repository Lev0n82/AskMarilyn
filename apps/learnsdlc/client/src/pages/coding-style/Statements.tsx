import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { CheckCircle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Statements() {
  usePageMeta({
    title: "Coding Style - Statements",
    description: "Educational module on statement formatting and structure. Part of GRACE Academy curriculum.",
    keywords: "code statements education, programming structure, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Coding Style Guide"
      topicTitle="Statements and Braces"
      topicSubtitle="Missing Brace Causes Production Outage; Developer Insists 'It Looked Fine to Me'"
      duration="~5 min"
      topicNumber={4}
      totalTopics={5}
      prevPath="/coding-style-guide/naming-conventions"
      prevLabel="Naming Conventions"
      nextPath="/coding-style-guide/white-space"
      nextLabel="White Space"
    >
      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          The humble curly brace is the unsung hero of code structure. Use it wisely, use it
          consistently, and it will never betray you. Omit it "to save space," and it will
          destroy your weekend.
        </p>
      </section>

      {/* Brace Placement Rules */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">The Brace Placement Rules</h3>
          <div className="space-y-4">
            <div className="p-4 bg-teal/5 border-l-4 border-teal rounded">
              <h4 className="font-bold text-teal mb-2">Rule: Opening brace on its own line</h4>
              <div className="bg-muted/50 p-3 rounded font-mono text-xs overflow-x-auto">
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
              <div className="bg-muted/50 p-3 rounded font-mono text-xs overflow-x-auto">
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

      {/* Statement Guidelines */}
      <Card className="mb-8">
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

      {/* Quiz */}
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
    </TopicPageWrapper>
  );
}
