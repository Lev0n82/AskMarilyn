import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

interface TopicPageWrapperProps {
  children: React.ReactNode;
  courseTitle: string;
  topicTitle: string;
  topicSubtitle?: string;
  duration?: string;
  prevPath?: string;
  prevLabel?: string;
  nextPath?: string;
  nextLabel?: string;
  topicNumber?: number;
  totalTopics?: number;
}

export function TopicPageWrapper({
  children,
  courseTitle,
  topicTitle,
  topicSubtitle,
  duration,
  prevPath,
  prevLabel,
  nextPath,
  nextLabel,
  topicNumber,
  totalTopics,
}: TopicPageWrapperProps) {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="bg-coral/10 text-coral px-3 py-1 rounded-full font-medium">
              {courseTitle}
            </span>
            {topicNumber && totalTopics && (
              <>
                <span>•</span>
                <span>Topic {topicNumber} of {totalTopics}</span>
              </>
            )}
            {duration && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {duration}
                </span>
              </>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            {topicTitle}
          </h1>
          {topicSubtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              {topicSubtitle}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="mb-12">
          {children}
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-between pt-8 border-t border-border">
          {prevPath ? (
            <Link href={prevPath}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{prevLabel || "Previous"}</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}
          
          {nextPath && (
            <Link href={nextPath}>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <span>{nextLabel || "Next Topic"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </nav>
      </article>
    </Layout>
  );
}
