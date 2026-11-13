import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { BookOpen, Eye, FileText, Brain, AlertTriangle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ThreePillars() {
  usePageMeta({
    title: "Technical Writing - The Three Pillars",
    description: "Educational module on the three pillars of effective technical writing. Part of GRACE Academy curriculum.",
    keywords: "technical writing pillars, documentation education, professional writing course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Technical Writing"
      topicTitle="The Three Pillars of Technical Writing"
      topicSubtitle="Study Reveals Most Technical Documents Fail at Least Two of Three Basic Requirements"
      duration="~5 min"
      topicNumber={1}
      totalTopics={5}
      prevPath="/technical-writing-guide"
      prevLabel="Introduction"
      nextPath="/technical-writing-guide/readability"
      nextLabel="Readability"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/iekLLJbpaEErzXcu.jpg" 
          alt="Three Greek columns representing the pillars of technical writing"
          className="w-full h-auto"
        />
      </div>

      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          Understanding written text depends on three distinct components. Master these, and
          your documentation will actually be useful. Ignore them, and you might as well not
          write anything at all.
        </p>
      </section>

      {/* The Three Pillars */}
      <div className="grid gap-6 mb-6">
        {/* Legibility */}
        <Card className="border-2 border-muted">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-2">1. Legibility</h3>
                <p className="text-muted-foreground">
                  Can the reader physically see and decode the characters? This is about fonts,
                  layout, and typography—usually handled by designers and typesetters, not writers.
                </p>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  (We won't cover this—it's not your job. But don't use Comic Sans.)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Readability */}
        <Card className="border-2 border-teal/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-teal" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-2 text-teal">2. Readability</h3>
                <p className="text-muted-foreground">
                  Can the reader process the text smoothly? This is about sentence structure,
                  word choice, and flow. If a text is unreadable, the reader will assume the
                  product is equally poor quality.
                </p>
                <p className="text-sm font-medium text-teal mt-2">
                  Think of it as "tokenizing" your text—making it easy to parse.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensibility */}
        <Card className="border-2 border-coral/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-coral" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-2 text-coral">3. Comprehensibility</h3>
                <p className="text-muted-foreground">
                  Can the reader actually understand the meaning? This is about logical structure,
                  building on prior knowledge, and clear explanations. This is where most
                  technical writing fails.
                </p>
                <p className="text-sm font-medium text-coral mt-2">
                  Think of it as "parsing" your text—extracting meaning from tokens.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* The Brutal Truth */}
      <Card className="mb-8 bg-amber-500/5 border-amber-500/30">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            The Brutal Truth
          </h3>
          <p className="text-muted-foreground">
            If your technical text is unreadable, readers will assume your <em>product</em> is
            also of inferior quality. Code is a language, just as documentation is. Not writing
            well in documentation implies faults in coding style. Fair or not, this is how
            humans judge quality.
          </p>
        </CardContent>
      </Card>

      {/* Quiz */}
      <MicroQuiz
        courseId="technical-writing"
        topicId="three-pillars"
        question="Which pillar of technical writing is most often neglected by programmers?"
        options={[
          "Legibility - choosing good fonts",
          "Readability - sentence structure and flow",
          "Comprehensibility - logical structure and clear explanations",
          "All three are equally neglected"
        ]}
        correctAnswer={2}
        explanation="While readability issues are common, comprehensibility is where most technical writing fails. Programmers often assume readers have the same background knowledge they do, skip logical steps, and fail to build concepts progressively."
        eli5Explanation="Imagine explaining how to build a LEGO castle. Legibility is making sure your instructions aren't blurry. Readability is using simple words. Comprehensibility is making sure you explain step 1 before step 2, and don't skip any pieces! Most people forget to explain things in order."
      />
    </TopicPageWrapper>
  );
}
