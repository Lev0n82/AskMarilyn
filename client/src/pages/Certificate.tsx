import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { Download, Award, Printer } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { toast } from "sonner";

export default function Certificate() {
  const { progress } = useProgress();
  const { quizScore, refactoringScore, bossScore } = progress;
  const [name, setName] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);

  const totalScore = (quizScore || 0) + (refactoringScore || 0) + (bossScore || 0);
  const maxPossibleScore = 10 + 5 + 10; // Quiz + Refactoring + Boss
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  const getCertificationLevel = () => {
    if (percentage >= 90) return { title: "Master Logician", color: "text-yellow-600" };
    if (percentage >= 70) return { title: "Certified Logical Tester", color: "text-blue-600" };
    if (percentage >= 50) return { title: "ABT Practitioner", color: "text-green-600" };
    return { title: "ABT Student", color: "text-gray-600" };
  };

  const level = getCertificationLevel();
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    if (!name.trim()) {
      toast.error("Please enter your name to generate the certificate.");
      return;
    }
    window.print();
  };

  const handleDownload = () => {
    if (!name.trim()) {
      toast.error("Please enter your name to generate the certificate.");
      return;
    }
    toast.info("Use the Print dialog and select 'Save as PDF' to download your certificate.");
    window.print();
  };

  return (
    <Layout>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-container, #certificate-container * {
            visibility: visible;
          }
          #certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">Your Certificate</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif italic">
            "The reward of a thing well done is having done it."
          </p>
        </section>

        {/* Score Summary */}
        <Card className="border-border paper-shadow max-w-xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg">Your Progress</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{quizScore || 0}/10</p>
                <p className="text-xs text-muted-foreground">Quiz</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{refactoringScore || 0}/5</p>
                <p className="text-xs text-muted-foreground">Refactoring</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{bossScore || 0}/10</p>
                <p className="text-xs text-muted-foreground">Boss Level</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-center">
                <span className="text-3xl font-bold text-primary">{percentage}%</span>
                <span className="text-muted-foreground ml-2">Overall Score</span>
              </p>
              <p className={`text-center font-serif font-bold text-lg mt-2 ${level.color}`}>
                {level.title}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Name Input */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-serif">Your Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name as it should appear on the certificate"
              className="text-center font-serif"
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={handlePrint} className="flex-1 font-serif">
              <Printer className="h-4 w-4 mr-2" />
              Print Certificate
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1 font-serif">
              <Download className="h-4 w-4 mr-2" />
              Save as PDF
            </Button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div id="certificate-container" ref={certificateRef} className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 p-8 rounded-xl border-4 border-double border-amber-300 dark:border-amber-700 paper-shadow">
            <div className="text-center space-y-6 py-8">
              {/* Header */}
              <div className="space-y-2">
                <p className="text-sm tracking-[0.3em] text-amber-700 dark:text-amber-300 uppercase">Ask Marilyn</p>
                <h2 className="text-4xl font-serif font-bold text-amber-900 dark:text-amber-100">Certificate of Achievement</h2>
                <div className="w-32 h-1 bg-amber-400 mx-auto mt-4"></div>
              </div>

              {/* Body */}
              <div className="space-y-4 py-8">
                <p className="text-lg text-amber-800 dark:text-amber-200">This is to certify that</p>
                <p className="text-4xl font-serif font-bold text-amber-900 dark:text-amber-100 border-b-2 border-amber-300 dark:border-amber-600 pb-2 inline-block min-w-[300px]">
                  {name || "Your Name Here"}
                </p>
                <p className="text-lg text-amber-800 dark:text-amber-200">
                  has successfully completed the course
                </p>
                <p className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100">
                  "Action-Based Testing: A Logical Approach"
                </p>
                <p className="text-lg text-amber-800 dark:text-amber-200">
                  and has been awarded the title of
                </p>
                <p className={`text-3xl font-serif font-bold ${level.color}`}>
                  {level.title}
                </p>
                <p className="text-lg text-amber-800 dark:text-amber-200">
                  with an overall score of <span className="font-bold">{percentage}%</span>
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end pt-8 border-t border-amber-200 dark:border-amber-700">
                <div className="text-left">
                  <p className="text-sm text-amber-700 dark:text-amber-300">Date Issued</p>
                  <p className="font-serif font-bold text-amber-900 dark:text-amber-100">{currentDate}</p>
                </div>
                <div className="text-center">
                  <Award className="h-16 w-16 text-amber-500 mx-auto" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-700 dark:text-amber-300">Instructor</p>
                  <p className="font-serif font-bold italic text-amber-900 dark:text-amber-100">Marilyn vos Savant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
