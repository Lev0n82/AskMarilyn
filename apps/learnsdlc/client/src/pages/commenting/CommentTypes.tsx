import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { FileText, Code, Lightbulb } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function CommentTypes() {
  usePageMeta({
    title: "Commenting Guide - Comment Types",
    description: "Educational module on different types of code comments and their proper usage. Part of GRACE Academy curriculum.",
    keywords: "comment types education, code documentation, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Art of Commenting"
      topicTitle="The Three Types of Comments"
      topicSubtitle="Developer Discovers Comments Have Categories; Mind Blown"
      duration="~5 min"
      topicNumber={2}
      totalTopics={4}
      prevPath="/commenting-guide/case-against"
      prevLabel="The Case Against"
      nextPath="/commenting-guide/style-guidelines"
      nextLabel="Style Guidelines"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/RjKjnPRXTWMwHWgA.jpg" 
          alt="Illustration of a 1950s storyteller with three types of stories"
          className="w-full h-auto"
        />
      </div>

      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          Not all comments are created equal. Understanding the different purposes of comments
          will help you write the right kind at the right time.
        </p>
      </section>

      {/* Documentary Comments */}
      <Card className="mb-6 border-2 border-teal/30">
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
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
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
      <Card className="mb-6 border-2 border-coral/30">
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
      <Card className="mb-8 border-2 border-primary/30">
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
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
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

      {/* Quiz */}
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
    </TopicPageWrapper>
  );
}
