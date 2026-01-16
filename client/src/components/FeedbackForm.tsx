import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const submitFeedback = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFeedback("");
      toast.success("Thank you for your feedback!");
    },
    onError: (error: unknown) => {
      toast.error("Failed to submit feedback. Please try again.");
      console.error("Feedback error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      submitFeedback.mutate({ content: feedback });
    }
  };

  if (submitted) {
    return (
      <Card className="border-border paper-shadow">
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif font-bold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">
            Your feedback has been received. We appreciate your thoughts!
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSubmitted(false)}
          >
            Send More Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border paper-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <MessageSquare className="h-5 w-5" /> Your Thoughts Matter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Did you find a logical fallacy? Or perhaps a moment of clarity? 
            Let us know how we can improve the course.
          </p>
          <Textarea
            placeholder="Share your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] font-sans"
          />
          <Button 
            type="submit" 
            disabled={!feedback.trim() || submitFeedback.isPending} 
            className="w-full sm:w-auto"
          >
            {submitFeedback.isPending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Send Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
