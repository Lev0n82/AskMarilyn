import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { Trophy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function CommentingQuiz() {
  usePageMeta({
    title: "Commenting Guide - Assessment",
    description: "Educational assessment for the Commenting Guide course. Part of GRACE Academy curriculum.",
    keywords: "commenting assessment, educational quiz, software engineering evaluation, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Art of Commenting"
      topicTitle="Final Assessment"
      topicSubtitle="Test your mastery of commenting best practices"
      duration="~10 min"
      prevPath="/commenting-guide/xml-comments"
      prevLabel="XML Documentation"
    >
      {/* Introduction */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h3 className="font-display text-xl font-bold">Commenting Mastery Quiz</h3>
          </div>
          <p className="text-muted-foreground">
            You've learned about the case for commenting, the three types of comments, style guidelines,
            and XML documentation. Now it's time to test your knowledge!
          </p>
        </CardContent>
      </Card>

      {/* Quiz Questions */}
      <div className="space-y-8">
        <MicroQuiz
          courseId="commenting"
          topicId="quiz-1"
          question="What is the main argument against the 'good code is self-documenting' claim?"
          options={[
            "Self-documenting code is impossible to write",
            "Code tells you WHAT, but comments tell you WHY",
            "Comments are always faster to read than code",
            "The compiler requires comments"
          ]}
          correctAnswer={1}
          explanation="While good code should be readable and show what it does, comments explain the reasoning, business logic, and context behind decisions—the 'why' that code cannot express."
          eli5Explanation="It's like showing someone a picture of you wearing a raincoat. They can see WHAT you're wearing, but they don't know WHY—is it raining? Are you going to wash the car? Comments tell the 'why' story!"
        />

        <MicroQuiz
          courseId="commenting"
          topicId="quiz-2"
          question="Which comment marker indicates a temporary workaround for a known issue?"
          options={[
            "// TODO:",
            "// FIXME:",
            "// HACK:",
            "// NOTE:"
          ]}
          correctAnswer={2}
          explanation="HACK is used to mark intentional workarounds or temporary solutions. TODO is for features to add, FIXME is for bugs to fix, and NOTE is for general information."
          eli5Explanation="HACK is like putting tape on a broken toy until you can get it properly fixed. It works for now, but everyone knows it's not the real solution!"
        />

        <MicroQuiz
          courseId="commenting"
          topicId="quiz-3"
          question="What is worse than having no comment at all?"
          options={[
            "A comment that's too long",
            "A comment that states the obvious",
            "A comment that's outdated and wrong",
            "A comment in a different language"
          ]}
          correctAnswer={2}
          explanation="An outdated or incorrect comment actively misleads developers and can cause bugs. It's better to have no comment than one that lies about what the code does."
          eli5Explanation="Imagine a sign that says 'Ice Cream Shop' but it's actually a dentist! A wrong sign is worse than no sign because it tricks you. Wrong comments trick programmers!"
        />

        <MicroQuiz
          courseId="commenting"
          topicId="quiz-4"
          question="Which XML tag is used to document what a method returns?"
          options={[
            "<output>",
            "<result>",
            "<returns>",
            "<value>"
          ]}
          correctAnswer={2}
          explanation="The <returns> tag is the standard XML documentation tag for describing what a method returns. It appears in IntelliSense and generated documentation."
          eli5Explanation="Just like a recipe tells you what you'll get at the end ('makes 12 cookies'), the <returns> tag tells programmers what they'll get back from the method!"
        />

        <MicroQuiz
          courseId="commenting"
          topicId="quiz-5"
          question="When should you update a comment?"
          options={[
            "Only when the project manager asks",
            "Every time you open the file",
            "When the code it describes changes",
            "Comments should never be changed"
          ]}
          correctAnswer={2}
          explanation="Comments must be updated whenever the code they describe changes. Stale comments that don't match the code are misleading and harmful."
          eli5Explanation="If you change your pet hamster's name from 'Fluffy' to 'Speedy', you'd update the name tag on the cage, right? Same with comments—when the code changes, the comment needs to match!"
        />
      </div>

      {/* Completion Card */}
      <Card className="mt-12 bg-gradient-to-br from-teal/10 to-primary/10 border-teal/30">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-muted-foreground mb-6">
            You've completed The Fine Art of Commenting. Your code will now speak volumes
            (in a good way).
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/technical-writing-guide">
              <Button variant="outline">Next: Technical Writing</Button>
            </Link>
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </TopicPageWrapper>
  );
}
