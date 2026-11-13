import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { BookOpen, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function StyleGuidelines() {
  usePageMeta({
    title: "Commenting Guide - Style Guidelines",
    description: "Educational module on commenting style guidelines. Part of GRACE Academy curriculum.",
    keywords: "commenting style education, documentation guidelines, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Art of Commenting"
      topicTitle="Comment Style Guidelines"
      topicSubtitle="Area Developer's Comments Longer Than Code; Colleagues Stage Intervention"
      duration="~5 min"
      topicNumber={3}
      totalTopics={4}
      prevPath="/commenting-guide/comment-types"
      prevLabel="Types of Comments"
      nextPath="/commenting-guide/xml-comments"
      nextLabel="XML Documentation"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/MAVcdlZvyggqZRER.jpg" 
          alt="Museum of commenting styles"
          className="w-full h-auto"
        />
      </div>

      {/* Reader's Question */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <p className="text-lg italic text-foreground">
            <strong>Dear Marilyn:</strong> How much commenting is too much? My colleague writes
            a paragraph for every line of code. I write nothing. Surely there's a middle ground?
          </p>
          <p className="text-right text-muted-foreground mt-4">— Seeking Balance in San Francisco</p>
        </CardContent>
      </Card>

      {/* Marilyn's Response */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          <strong>Dear Seeking:</strong> The golden rule is this: <strong>comments should not
          exceed the length of the code they explain by too much</strong>. If they do, it's a
          sign the code itself is too complicated and should be refactored.
        </p>
      </section>

      {/* Good, Bad, Ugly Examples */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">The Good, The Bad, and The Ugly</h3>
          
          <div className="space-y-6">
            {/* Good Example */}
            <div className="p-4 bg-teal/5 border-l-4 border-teal rounded">
              <h4 className="font-bold text-teal mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Good: Explains the "Why"
              </h4>
              <div className="bg-muted/50 p-3 rounded font-mono text-xs overflow-x-auto">
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
              <div className="bg-muted/50 p-3 rounded font-mono text-xs overflow-x-auto">
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
              <div className="bg-muted/50 p-3 rounded font-mono text-xs overflow-x-auto">
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

      {/* Best Practices Table */}
      <Card className="mb-8">
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

      {/* Quiz */}
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
    </TopicPageWrapper>
  );
}
