import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { CheckCircle } from "lucide-react";
import { CheatSheetDownload } from "@/components/CheatSheetDownload";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function WhiteSpace() {
  usePageMeta({
    title: "Coding Style - White Space",
    description: "Educational module on white space usage in professional code. Part of GRACE Academy curriculum.",
    keywords: "white space education, code formatting, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Coding Style Guide"
      topicTitle="White Space"
      topicSubtitle="Developer Removes All Whitespace to 'Save Bytes'; Code Review Takes 6 Hours"
      duration="~5 min"
      topicNumber={5}
      totalTopics={5}
      prevPath="/coding-style-guide/statements"
      prevLabel="Statements & Braces"
      nextPath="/coding-style-guide/quiz"
      nextLabel="Take the Quiz"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/ZRgDfArtsOphWYHl.jpg" 
          alt="Illustration comparing code with proper whitespace as a well-organized garden vs code without whitespace as an overgrown jungle"
          className="w-full h-auto"
        />
      </div>

      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          White space is not wasted space. It's breathing room for your code. Just as paragraphs
          make text readable, strategic blank lines and spaces make code scannable.
        </p>
      </section>

      {/* White Space Rules */}
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

      {/* Quiz */}
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

      {/* Course Summary */}
      <Card className="mt-8 bg-gradient-to-br from-primary/10 to-coral/10 border-primary/20">
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

      {/* Cheat Sheet Download */}
      <div className="mt-8">
        <CheatSheetDownload courseId="coding-style" courseName="C# Coding Style Guide" />
      </div>
    </TopicPageWrapper>
  );
}
