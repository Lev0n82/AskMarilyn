import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Printer } from "lucide-react";

interface CheatSheetDownloadProps {
  courseId: string;
  courseName: string;
}

const cheatSheets: Record<string, { pdf: string; description: string }> = {
  "abt-fundamentals": {
    pdf: "/cheatsheets/abt-fundamentals.pdf",
    description: "Three-layer architecture, anti-patterns, test life-cycle, and decision tables"
  },
  "coding-style": {
    pdf: "/cheatsheets/coding-style.pdf",
    description: "File organization, naming conventions, indentation rules, and statement guidelines"
  },
  "commenting": {
    pdf: "/cheatsheets/commenting.pdf",
    description: "When to comment, XML documentation, comment types, and maintenance tips"
  },
  "technical-writing": {
    pdf: "/cheatsheets/technical-writing.pdf",
    description: "Three pillars, sentence guidelines, word choice, and document structure"
  }
};

export function CheatSheetDownload({ courseId, courseName }: CheatSheetDownloadProps) {
  const cheatSheet = cheatSheets[courseId];
  
  if (!cheatSheet) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cheatSheet.pdf;
    link.download = `${courseId}-cheatsheet.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open(cheatSheet.pdf, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-amber-500/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Download Cheat Sheet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {cheatSheet.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
