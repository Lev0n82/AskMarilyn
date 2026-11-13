import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { AlertTriangle, XCircle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function CaseAgainst() {
  usePageMeta({
    title: "Commenting Guide - The Case Against Comments",
    description: "Educational module examining when comments are unnecessary. Part of GRACE Academy curriculum.",
    keywords: "clean code education, self-documenting code, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Art of Commenting"
      topicTitle="The Case Against NOT Commenting"
      topicSubtitle="Programmer's Hubris Leads to 6-Month Delay as Team Attempts to Understand 'Obvious' Algorithm"
      duration="~5 min"
      topicNumber={1}
      totalTopics={4}
      prevPath="/commenting-guide"
      prevLabel="Introduction"
      nextPath="/commenting-guide/comment-types"
      nextLabel="Types of Comments"
    >
      {/* Reader's Question */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <p className="text-lg italic text-foreground">
            <strong>Dear Marilyn:</strong> I understand my code perfectly. Why should I waste
            time writing comments for myself?
          </p>
          <p className="text-right text-muted-foreground mt-4">— Confident Coder in Chicago</p>
        </CardContent>
      </Card>

      {/* Marilyn's Response */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          <strong>Dear Confident:</strong> Do you also remember what you had for lunch three
          Tuesdays ago? The human brain has a remarkable capacity for forgetting things it once
          knew intimately. In six months, your "perfectly clear" code will look like ancient
          hieroglyphics—and you'll be the archaeologist trying to decode your own tomb.
        </p>
      </section>

      {/* The Three Excuses */}
      <Card className="mb-6 border-coral/30 bg-coral/5">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-coral" />
            The Three Excuses (And Why They're Wrong)
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-bold text-coral mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> "Good code is self-documenting"
              </h4>
              <p className="text-sm text-muted-foreground">
                Good code tells you WHAT it does. Comments tell you WHY it does it.
                These are different questions. A well-named function called
                <code className="mx-1">calculateTaxWithSpecialRules()</code> tells you what
                happens, but not why those special rules exist or what business requirement
                demanded them.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-bold text-coral mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> "Comments get out of sync with code"
              </h4>
              <p className="text-sm text-muted-foreground">
                This is like saying "I don't maintain my car because maintenance is hard."
                Yes, comments require maintenance. So does everything else worth having.
                The solution is to update comments when you update code, not to abandon
                them entirely.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-bold text-coral mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> "I'll remember what this does"
              </h4>
              <p className="text-sm text-muted-foreground">
                No, you won't. And even if you do, your colleagues won't. And your
                replacement definitely won't. Code is written once but read hundreds
                of times. Optimize for the readers, not the writer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Real Cost */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">The Real Cost of Not Commenting</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
              <span className="text-2xl font-bold text-coral">10x</span>
              <span className="text-sm">More time spent understanding uncommented code vs. commented code</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
              <span className="text-2xl font-bold text-coral">60%</span>
              <span className="text-sm">Of developer time is spent reading code, not writing it</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
              <span className="text-2xl font-bold text-coral">$$$</span>
              <span className="text-sm">Lost productivity when new team members can't understand the codebase</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz */}
      <MicroQuiz
        courseId="commenting"
        topicId="case-against"
        question="What is the main difference between what code tells you and what comments tell you?"
        options={[
          "Code is faster to read than comments",
          "Code tells you WHAT, comments tell you WHY",
          "Comments are optional, code is required",
          "Code is for computers, comments are for humans"
        ]}
        correctAnswer={1}
        explanation="Code shows what is happening (the mechanics), while comments explain why it's happening (the reasoning, business logic, and context). Both are necessary for complete understanding."
        eli5Explanation="Imagine you see someone putting on a raincoat. The 'what' is obvious—they're putting on a raincoat. But the 'why' could be many things: it's raining, they're going to wash the car, or they just like raincoats! Comments are like asking 'why are you doing that?' and getting the answer."
      />
    </TopicPageWrapper>
  );
}
