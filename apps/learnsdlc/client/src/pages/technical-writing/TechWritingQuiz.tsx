import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { Trophy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function TechWritingQuiz() {
  usePageMeta({
    title: "Technical Writing - Assessment",
    description: "Educational assessment for the Technical Writing Guide course. Part of GRACE Academy curriculum.",
    keywords: "technical writing assessment, educational quiz, professional writing evaluation, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Technical Writing"
      topicTitle="Final Assessment"
      topicSubtitle="Test your mastery of technical writing best practices"
      duration="~10 min"
      prevPath="/technical-writing-guide/structure"
      prevLabel="Document Structure"
    >
      {/* Introduction */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h3 className="font-display text-xl font-bold">Technical Writing Mastery Quiz</h3>
          </div>
          <p className="text-muted-foreground">
            You've learned about the three pillars, readability, comprehensibility, style, and
            document structure. Now it's time to test your knowledge!
          </p>
        </CardContent>
      </Card>

      {/* Quiz Questions */}
      <div className="space-y-8">
        <MicroQuiz
          courseId="technical-writing"
          topicId="quiz-1"
          question="What is the recommended sentence length for technical writing?"
          options={[
            "As short as possible (5 words or less)",
            "10-15 words, never exceeding 20",
            "25-30 words for comprehensive explanations",
            "No limit as long as grammar is correct"
          ]}
          correctAnswer={1}
          explanation="Technical writing guidelines recommend 10-15 words per sentence with an absolute maximum of 20 words. This keeps sentences digestible while allowing enough complexity for technical concepts."
          eli5Explanation="Your brain is like a small cup. If I pour too many words in at once, they overflow! 10-15 words fit perfectly in the cup. More than 20 and you'll forget the beginning before I finish!"
        />

        <MicroQuiz
          courseId="technical-writing"
          topicId="quiz-2"
          question="Which word should you use instead of 'utilize'?"
          options={[
            "Employ",
            "Use",
            "Leverage",
            "Implement"
          ]}
          correctAnswer={1}
          explanation="'Use' is the simple, clear alternative to 'utilize.' Technical writing favors simple words over complex ones. 'Utilize' adds no meaning that 'use' doesn't already convey."
          eli5Explanation="Why say 'utilize' when 'use' means the same thing but is easier? It's like saying 'I shall consume this delicious frozen dairy confection' instead of 'I'll eat this ice cream.' Just keep it simple!"
        />

        <MicroQuiz
          courseId="technical-writing"
          topicId="quiz-3"
          question="When explaining a new concept, what should come first?"
          options={[
            "Examples showing how it works",
            "A clear definition of what it is",
            "A summary of key points",
            "References to related concepts"
          ]}
          correctAnswer={1}
          explanation="The four-step pattern starts with Definition (what is it?), then Assumption/Theorem (what can it do?), Explanation/Proof (examples), and finally Conclusion (summary)."
          eli5Explanation="It's like showing someone a new toy! First say what it is ('This is a yo-yo'), then what it does ('It goes up and down'), then show them ('Watch!'), then remind them ('So that's a yo-yo!'). Definition comes first!"
        />

        <MicroQuiz
          courseId="technical-writing"
          topicId="quiz-4"
          question="Why should you avoid using 'I' in technical writing?"
          options={[
            "It makes sentences longer",
            "Technical writing should be objective, not opinion-based",
            "It's grammatically incorrect",
            "Readers don't care about the author"
          ]}
          correctAnswer={1}
          explanation="Technical writing deals with objective facts, not personal opinions. Using 'I think' or 'I believe' undermines the authority of the documentation and shifts focus from facts to opinions."
          eli5Explanation="When you read instructions for building a LEGO set, you don't want to know what the writer thinks—you want to know how to build it! 'I think you should connect these pieces' is less helpful than 'Connect these pieces.'"
        />

        <MicroQuiz
          courseId="technical-writing"
          topicId="quiz-5"
          question="Which is correct: 'an HTTP request' or 'a HTTP request'?"
          options={[
            "'A HTTP request' because H is a consonant",
            "'An HTTP request' because H sounds like 'aitch'",
            "Both are acceptable",
            "Neither - you should write 'an HyperText request'"
          ]}
          correctAnswer={1}
          explanation="The a/an rule is about sound, not spelling. 'HTTP' is pronounced 'aitch-tee-tee-pee,' starting with a vowel sound, so it takes 'an.' Similarly, 'an SQL query' (ess-cue-ell) but 'a URL' (yoo-are-ell)."
          eli5Explanation="Say 'HTTP' out loud: 'aitch-tee-tee-pee.' It starts with an 'ay' sound! That's a vowel sound, so we use 'an.' It's not about the letter, it's about how it sounds when you say it!"
        />
      </div>

      {/* Completion Card */}
      <Card className="mt-12 bg-gradient-to-br from-teal/10 to-primary/10 border-teal/30">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-muted-foreground mb-6">
            You've completed Technical Writing Made Easier. Your documentation will now be
            readable, comprehensible, and actually useful!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/grace-academy">
              <Button variant="outline">Explore GRACE Academy</Button>
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
