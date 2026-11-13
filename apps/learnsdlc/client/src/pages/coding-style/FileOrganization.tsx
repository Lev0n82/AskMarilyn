import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { FileCode, CheckCircle, XCircle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function FileOrganization() {
  usePageMeta({
    title: "Coding Style - File Organization",
    description: "Educational module on file organization best practices. Part of GRACE Academy curriculum.",
    keywords: "file organization education, project structure, software engineering course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Coding Style Guide"
      topicTitle="File Organization"
      topicSubtitle="Developer Spends 45 Minutes Searching for Method; It Was in a File Named 'Stuff.cs'"
      duration="~5 min"
      topicNumber={1}
      totalTopics={5}
      prevPath="/coding-style-guide"
      prevLabel="Introduction"
      nextPath="/coding-style-guide/indentation"
      nextLabel="Indentation"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/YqxOSmLuIZxCuGDc.jpg" 
          alt="Illustration of file organization chaos vs order"
          className="w-full h-auto"
        />
      </div>

      {/* Reader's Question */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <p className="text-lg italic text-foreground">
            <strong>Dear Marilyn:</strong> Does it really matter how I organize my files? The
            compiler doesn't care.
          </p>
          <p className="text-right text-muted-foreground mt-4">— Chaotic in Chicago</p>
        </CardContent>
      </Card>

      {/* Marilyn's Response */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          <strong>Dear Chaotic:</strong> The compiler also doesn't care if you name all your
          variables <code>x1</code>, <code>x2</code>, and <code>x3</code>. That doesn't make it
          a good idea. File organization is about <em>human</em> navigation, not machine parsing.
        </p>
      </section>

      {/* The Sacred Order */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            The Sacred Order of File Contents
          </h3>
          <p className="text-muted-foreground mb-4">
            Every C# file should follow this structure, in this exact order:
          </p>
          <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
            <ol className="space-y-2">
              <li><span className="text-teal">1.</span> Using directives (external namespaces)</li>
              <li><span className="text-teal">2.</span> Namespace declaration</li>
              <li><span className="text-teal">3.</span> Class/Interface declaration</li>
              <li className="pl-4"><span className="text-coral">3.1</span> Constants and static fields</li>
              <li className="pl-4"><span className="text-coral">3.2</span> Private fields</li>
              <li className="pl-4"><span className="text-coral">3.3</span> Constructors</li>
              <li className="pl-4"><span className="text-coral">3.4</span> Properties</li>
              <li className="pl-4"><span className="text-coral">3.5</span> Public methods</li>
              <li className="pl-4"><span className="text-coral">3.6</span> Private methods</li>
            </ol>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Why this order?</strong> Because when someone opens your file, they want to
            understand the "what" (fields, properties) before the "how" (methods). It's like
            reading a recipe: ingredients first, then instructions.
          </p>
        </CardContent>
      </Card>

      {/* One Class One File Rule */}
      <Card className="mb-8 border-coral/30 bg-coral/5">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4 text-coral">The One Class, One File Rule</h3>
          <p className="text-muted-foreground mb-4">
            Each source file should contain exactly one class, and the filename should match
            the class name exactly.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-bold text-teal mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Correct
              </h4>
              <code className="text-sm">CustomerService.cs</code>
              <p className="text-xs text-muted-foreground mt-1">Contains: class CustomerService</p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-bold text-coral mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Wrong
              </h4>
              <code className="text-sm">Utilities.cs</code>
              <p className="text-xs text-muted-foreground mt-1">Contains: 47 unrelated classes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz */}
      <MicroQuiz
        courseId="coding-style"
        topicId="file-organization"
        question="You have a class called 'OrderProcessor'. What should the file be named?"
        options={[
          "order_processor.cs",
          "OrderProcessor.cs",
          "Orders.cs",
          "Processor.cs"
        ]}
        correctAnswer={1}
        explanation="The filename should exactly match the class name, including capitalization. OrderProcessor.cs makes it immediately clear what class is inside without opening the file."
        eli5Explanation="Imagine you have a toy box labeled 'LEGOS' but it actually has dinosaurs inside. That's confusing, right? Your file name is like the label on the box—it should tell you exactly what's inside. If your class is called OrderProcessor, the file should be called OrderProcessor.cs!"
      />
    </TopicPageWrapper>
  );
}
