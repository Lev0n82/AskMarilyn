import { Card, CardContent } from "@/components/ui/card";
import { Flame, Clock, BookOpen } from "lucide-react";

interface TheSparkProps {
  title: string;
  content: string;
  keyInsight: string;
  readingTime?: number;
}

export function TheSpark({ title, content, keyInsight, readingTime = 3 }: TheSparkProps) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Flame className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">The Spark</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{readingTime}-minute read</span>
            <span className="mx-1">•</span>
            <BookOpen className="h-4 w-4" />
            <span>Core Concepts</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <h3 className="text-xl font-serif font-bold text-foreground">{title}</h3>
        <div 
          className="font-sans leading-relaxed text-foreground/90"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Key Insight Card */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            <div>
              <h4 className="font-serif font-bold text-amber-900 mb-2">Marilyn's Key Insight</h4>
              <p className="font-serif italic text-amber-800 leading-relaxed">
                "{keyInsight}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
