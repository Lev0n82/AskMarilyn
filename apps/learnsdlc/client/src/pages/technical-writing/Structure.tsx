import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { List } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Structure() {
  usePageMeta({
    title: "Technical Writing - Structure",
    description: "Educational module on document structure in technical writing. Part of GRACE Academy curriculum.",
    keywords: "document structure education, technical writing organization, professional writing course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Technical Writing"
      topicTitle="Document Structure"
      topicSubtitle="Documentation Has No Table of Contents; Readers Wander Aimlessly for Hours"
      duration="~5 min"
      topicNumber={5}
      totalTopics={5}
      prevPath="/technical-writing-guide/style"
      prevLabel="Matters of Style"
      nextPath="/technical-writing-guide/quiz"
      nextLabel="Final Assessment"
    >
      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          A well-structured document is like a well-organized codebase. You should be able to
          find what you need without reading everything. Here's how to structure your documents
          for maximum usability.
        </p>
      </section>

      {/* The Anatomy of a Technical Document */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">The Anatomy of a Technical Document</h3>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">1. Title</h4>
              <p className="text-sm text-muted-foreground">
                Clear, descriptive, and specific. "API Documentation" is bad. "REST API
                Reference for User Authentication Service v2.0" is good.
              </p>
            </div>

            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">2. Table of Contents</h4>
              <p className="text-sm text-muted-foreground">
                For any document over 3 pages. Readers should be able to jump to what they need.
              </p>
            </div>

            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">3. Introduction/Overview</h4>
              <p className="text-sm text-muted-foreground">
                What is this document about? Who is it for? What will the reader learn?
                Set expectations upfront.
              </p>
            </div>

            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">4. Prerequisites</h4>
              <p className="text-sm text-muted-foreground">
                What does the reader need to know before reading? What software/tools are required?
                Don't make them discover this halfway through.
              </p>
            </div>

            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">5. Main Content (Sections)</h4>
              <p className="text-sm text-muted-foreground">
                Organized logically, building from simple to complex. Each section should be
                self-contained enough to be useful on its own.
              </p>
            </div>

            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">6. Examples</h4>
              <p className="text-sm text-muted-foreground">
                Real, working examples. Not pseudo-code. Not "exercise left to reader."
                Copy-paste-able code that actually works.
              </p>
            </div>

            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">7. Troubleshooting/FAQ</h4>
              <p className="text-sm text-muted-foreground">
                Common problems and solutions. This section will save you from answering the
                same questions repeatedly.
              </p>
            </div>

            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <h4 className="font-bold">8. References/Further Reading</h4>
              <p className="text-sm text-muted-foreground">
                Links to related documentation, specifications, or resources for readers who
                want to go deeper.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz */}
      <MicroQuiz
        courseId="technical-writing"
        topicId="structure"
        question="What should come BEFORE the main content in a technical document?"
        options={[
          "Examples and code samples",
          "Troubleshooting section",
          "Prerequisites and introduction",
          "References and further reading"
        ]}
        correctAnswer={2}
        explanation="Prerequisites and introduction should come before main content so readers know what they need before starting and understand what the document covers. Examples support the main content, and troubleshooting/references come at the end."
        eli5Explanation="Before you start building with LEGOs, you need to know what pieces you need (prerequisites) and what you're building (introduction). You don't start with 'what to do if it breaks' (troubleshooting)—that comes after you've tried to build it!"
      />
    </TopicPageWrapper>
  );
}
