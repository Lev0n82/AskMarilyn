import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Indentation() {
  usePageMeta({
    title: "Coding Style - Indentation",
    description: "Educational module on code indentation best practices. Part of GRACE Academy curriculum.",
    keywords: "code indentation education, formatting standards, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Coding Style Guide"
      topicTitle="Indentation"
      topicSubtitle="Tabs vs. Spaces Debate Ends Marriage; Divorce Papers Cite 'Irreconcilable Differences'"
      duration="~5 min"
      topicNumber={2}
      totalTopics={5}
      prevPath="/coding-style-guide/file-organization"
      prevLabel="File Organization"
      nextPath="/coding-style-guide/naming-conventions"
      nextLabel="Naming Conventions"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/hGHcplaXGPqgLQdZ.jpg" 
          alt="Illustration comparing proper indentation as a staircase to success vs chaotic indentation"
          className="w-full h-auto"
        />
      </div>

      {/* Reader's Question */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <p className="text-lg italic text-foreground">
            <strong>Dear Marilyn:</strong> Tabs or spaces? I need to know before I can continue
            living my life.
          </p>
          <p className="text-right text-muted-foreground mt-4">— Existentially Confused in Seattle</p>
        </CardContent>
      </Card>

      {/* Marilyn's Response */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          <strong>Dear Existentially:</strong> The answer is: <strong>tabs</strong>. But more
          importantly, the answer is: <strong>consistency</strong>. A codebase that mixes tabs
          and spaces is like a book that randomly switches between English and Klingon mid-sentence.
        </p>
      </section>

      {/* Rules of Indentation */}
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

      {/* Visual Examples */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">Visual Examples</h3>
          <div className="grid gap-4">
            <div className="p-4 bg-teal/5 border-l-4 border-teal rounded">
              <h4 className="font-bold text-teal mb-2">Correct Indentation</h4>
              <div className="bg-muted/50 p-3 rounded font-mono text-xs overflow-x-auto">
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
              <div className="bg-muted/50 p-3 rounded font-mono text-xs overflow-x-auto">
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

      {/* Quiz */}
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
    </TopicPageWrapper>
  );
}
