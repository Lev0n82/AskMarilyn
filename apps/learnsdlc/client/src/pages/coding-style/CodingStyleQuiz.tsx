import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { Trophy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function CodingStyleQuiz() {
  usePageMeta({
    title: "Coding Style - Assessment",
    description: "Educational assessment for the Coding Style Guide course. Part of GRACE Academy curriculum.",
    keywords: "coding style assessment, educational quiz, software engineering evaluation, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Coding Style Guide"
      topicTitle="Final Assessment"
      topicSubtitle="Test your mastery of C# coding style conventions"
      duration="~10 min"
      prevPath="/coding-style-guide/white-space"
      prevLabel="White Space"
    >
      {/* Introduction */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h3 className="font-display text-xl font-bold">Coding Style Mastery Quiz</h3>
          </div>
          <p className="text-muted-foreground">
            You've learned about file organization, indentation, naming conventions, statements,
            and white space. Now it's time to test your knowledge with this comprehensive quiz.
          </p>
        </CardContent>
      </Card>

      {/* Quiz Questions */}
      <div className="space-y-8">
        <MicroQuiz
          courseId="coding-style"
          topicId="quiz-1"
          question="A class named 'PaymentProcessor' should be in a file named:"
          options={[
            "payment_processor.cs",
            "PaymentProcessor.cs",
            "Payments.cs",
            "ProcessPayment.cs"
          ]}
          correctAnswer={1}
          explanation="File names should exactly match the class name, including PascalCase capitalization."
          eli5Explanation="It's like labeling your toy box! If your toys are dinosaurs, you write 'Dinosaurs' on the box, not 'Stuff'. PaymentProcessor.cs tells everyone exactly what's inside!"
        />

        <MicroQuiz
          courseId="coding-style"
          topicId="quiz-2"
          question="Which is the correct order of elements in a C# class file?"
          options={[
            "Methods → Properties → Fields → Constructor",
            "Fields → Constructor → Properties → Methods",
            "Constructor → Fields → Methods → Properties",
            "Properties → Methods → Fields → Constructor"
          ]}
          correctAnswer={1}
          explanation="The standard order is: Fields → Constructor → Properties → Methods. This shows 'what' (data) before 'how' (behavior)."
          eli5Explanation="It's like a recipe! First you list the ingredients (fields), then how to prepare them (constructor), then what they look like (properties), and finally the cooking steps (methods)!"
        />

        <MicroQuiz
          courseId="coding-style"
          topicId="quiz-3"
          question="What naming convention should be used for a private field storing a customer ID?"
          options={[
            "CustomerId",
            "customerId",
            "_customerId",
            "CUSTOMER_ID"
          ]}
          correctAnswer={2}
          explanation="Private fields use camelCase with a leading underscore (_customerId) to distinguish them from local variables and properties."
          eli5Explanation="The underscore is like a 'Private - Do Not Touch' sign on your secret diary. When you see _something, you know it's the class's private stuff!"
        />

        <MicroQuiz
          courseId="coding-style"
          topicId="quiz-4"
          question="Why is this code dangerous? if (x > 0) DoA(); DoB();"
          options={[
            "It won't compile",
            "DoB() always runs regardless of the condition",
            "It's too slow",
            "The variable names are bad"
          ]}
          correctAnswer={1}
          explanation="Without braces, only DoA() is part of the if statement. DoB() runs unconditionally, which is a common source of bugs."
          eli5Explanation="Imagine saying 'If it's raining, wear a raincoat. Wear boots.' Without the fence (braces), the boots part isn't connected to the rain check—you'd wear boots even on sunny days!"
        />

        <MicroQuiz
          courseId="coding-style"
          topicId="quiz-5"
          question="Which is correctly formatted?"
          options={[
            "x=y+z;",
            "x = y+z;",
            "x = y + z;",
            "x= y +z;"
          ]}
          correctAnswer={2}
          explanation="Operators should have spaces on both sides for readability: x = y + z;"
          eli5Explanation="It's like writing words! 'Ilikecats' is hard to read, but 'I like cats' is easy. Spaces help your eyes see each part clearly!"
        />
      </div>

      {/* Completion Card */}
      <Card className="mt-12 bg-gradient-to-br from-teal/10 to-primary/10 border-teal/30">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-muted-foreground mb-6">
            You've completed the C# Coding Style Guide. Your code will now be a joy to read
            (and debug at 3 AM).
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/commenting-guide">
              <Button variant="outline">Next: Art of Commenting</Button>
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
