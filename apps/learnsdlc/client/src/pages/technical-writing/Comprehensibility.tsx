import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { Brain } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Comprehensibility() {
  usePageMeta({
    title: "Technical Writing - Comprehensibility",
    description: "Educational module on comprehensibility in technical writing. Part of GRACE Academy curriculum.",
    keywords: "comprehensibility education, clear writing, professional documentation course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Technical Writing"
      topicTitle="Comprehensibility: Building Understanding"
      topicSubtitle="Documentation Assumes Reader Already Knows Everything; Reader Does Not"
      duration="~5 min"
      topicNumber={3}
      totalTopics={5}
      prevPath="/technical-writing-guide/readability"
      prevLabel="Readability"
      nextPath="/technical-writing-guide/style"
      nextLabel="Matters of Style"
    >
      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          A comprehensible technical document follows a logical structure. Every topic builds on
          preceding topics. If a new concept is needed, it must be introduced <em>before</em>
          using it. This applies at every level—from the document structure down to individual
          sentences.
        </p>
      </section>

      {/* The Four Steps */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">The Four Steps of Explanation</h3>
          <p className="text-muted-foreground mb-4">
            Every concept you explain should follow this pattern:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold">Definition</h4>
                <p className="text-sm text-muted-foreground">
                  What is the thing? Give a clear, concise definition. Don't assume the reader
                  knows what you're talking about.
                </p>
                <p className="text-sm text-teal mt-2 italic">
                  Example: "A variable is a named storage location in memory."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold">Assumption/Theorem</h4>
                <p className="text-sm text-muted-foreground">
                  What can we do with it? What are its properties? State the key facts or
                  capabilities.
                </p>
                <p className="text-sm text-teal mt-2 italic">
                  Example: "Variables can store different types of data and can be modified
                  during program execution."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold">Explanation/Proof</h4>
                <p className="text-sm text-muted-foreground">
                  Show how it works. Provide examples, demonstrate the concept in action,
                  prove your assertions.
                </p>
                <p className="text-sm text-teal mt-2 italic">
                  Example: "Here's how to declare and use a variable: int count = 0; count = count + 1;"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold">Conclusion</h4>
                <p className="text-sm text-muted-foreground">
                  Summarize and reinforce. The human mind needs repetition to commit to memory.
                  Unlike computers, we need to be told several times.
                </p>
                <p className="text-sm text-teal mt-2 italic">
                  Example: "In summary, variables are named storage locations that hold data
                  you can read and modify throughout your program."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Golden Rule */}
      <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">The Golden Rule</h3>
          <blockquote className="border-l-4 border-amber-500 pl-4 italic text-lg">
            "Repeat the central message of what you write several times. The human mind is
            not at ease when confronted with a 'fire and forget' type of message."
          </blockquote>
          <p className="text-sm text-muted-foreground mt-4">
            This isn't redundancy—it's pedagogy. Tell them what you're going to tell them,
            tell them, then tell them what you told them.
          </p>
        </CardContent>
      </Card>

      {/* Quiz */}
      <MicroQuiz
        courseId="technical-writing"
        topicId="comprehensibility"
        question="What is the correct order for explaining a new concept?"
        options={[
          "Example → Definition → Conclusion → Theorem",
          "Definition → Assumption/Theorem → Explanation/Proof → Conclusion",
          "Conclusion → Definition → Example → Summary",
          "Introduction → Body → Conclusion"
        ]}
        correctAnswer={1}
        explanation="The four-step pattern is: Definition (what is it?), Assumption/Theorem (what can it do?), Explanation/Proof (show how it works), and Conclusion (summarize and reinforce). This builds understanding progressively."
        eli5Explanation="It's like showing someone a new toy! First, tell them what it is ('This is a yo-yo'). Then tell them what it does ('It goes up and down on a string'). Then show them how ('Watch me do it!'). Finally, remind them ('So that's a yo-yo—it goes up and down!'). Easy!"
      />
    </TopicPageWrapper>
  );
}
