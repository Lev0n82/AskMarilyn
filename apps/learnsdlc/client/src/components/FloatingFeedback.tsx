import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageCircle, Camera, X, Send, Loader2, CheckCircle2, Image } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const feedbackMutation = trpc.feedback.submit.useMutation();

  const captureScreenshot = useCallback(async () => {
    setIsCapturing(true);
    // Temporarily hide the dialog for screenshot
    const dialogOverlay = document.querySelector('[data-feedback-dialog]');
    const dialogBackdrop = document.querySelector('[data-radix-portal]');
    if (dialogOverlay) {
      (dialogOverlay as HTMLElement).style.display = 'none';
    }
    if (dialogBackdrop) {
      (dialogBackdrop as HTMLElement).style.display = 'none';
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use native browser screenshot via Canvas API
      // This avoids html2canvas OKLCH parsing issues
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');
      
      // Set canvas size to viewport
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = 0.5; // Reduce size for transmission
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
      
      // Try using the modern Screen Capture API if available
      // Fall back to a simpler approach if not
      try {
        // @ts-ignore - MediaDevices.getDisplayMedia may not be typed
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'browser' } as any,
          preferCurrentTab: true,
        } as any);
        
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();
        
        // Wait a frame for the video to render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        ctx.drawImage(video, 0, 0, width, height);
        
        // Stop all tracks
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        setScreenshot(dataUrl);
        toast.success("Screenshot captured!");
      } catch {
        // If Screen Capture API fails (user denied or not supported),
        // fall back to a DOM-based approach using SVG foreignObject
        const svgData = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml">
                <style>body { margin: 0; font-family: system-ui; }</style>
                <div style="width:${width}px;height:${height}px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
                  <p style="font-size:14px;color:#666;">Screenshot: ${window.location.pathname}</p>
                  <p style="font-size:12px;color:#999;">Viewport: ${width}x${height}</p>
                  <p style="font-size:12px;color:#999;">${new Date().toLocaleString()}</p>
                </div>
              </div>
            </foreignObject>
          </svg>`;
        
        const img = new window.Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          setScreenshot(dataUrl);
          toast.info("Basic screenshot captured (page metadata only). You can also upload a manual screenshot.");
        };
        img.onerror = () => {
          toast.error("Screenshot capture not available. Please upload a screenshot manually.");
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
      }
    } catch (err) {
      console.error("Screenshot capture failed:", err);
      toast.error("Failed to capture screenshot. You can still submit feedback without it.");
    } finally {
      if (dialogOverlay) {
        (dialogOverlay as HTMLElement).style.display = '';
      }
      if (dialogBackdrop) {
        (dialogBackdrop as HTMLElement).style.display = '';
      }
      setIsCapturing(false);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshot(reader.result as string);
      toast.success("Image attached!");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setIsSending(true);
    try {
      const feedbackContent = [
        subject ? `Subject: ${subject}` : '',
        `Page: ${window.location.pathname}`,
        `Browser: ${navigator.userAgent.slice(0, 80)}`,
        '',
        `Message:`,
        message,
        '',
        screenshot ? `[Screenshot attached - base64 data omitted for brevity]` : '',
      ].filter(Boolean).join('\n');

      await feedbackMutation.mutateAsync({
        content: feedbackContent,
      });

      setSent(true);
      setTimeout(() => {
        setIsOpen(false);
        setSent(false);
        setSubject("");
        setMessage("");
        setScreenshot(null);
      }, 2000);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSent(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
        aria-label="Send feedback"
        title="Send feedback"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Feedback dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent data-feedback-dialog className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Send Feedback
            </DialogTitle>
            <DialogDescription>
              Help us improve! Share your thoughts, report issues, or suggest features.
            </DialogDescription>
          </DialogHeader>

          {sent ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <p className="text-lg font-medium">Thank you for your feedback!</p>
              <p className="text-sm text-muted-foreground">We'll review it shortly.</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="feedback-subject">Subject (optional)</Label>
                <Input
                  id="feedback-subject"
                  placeholder="e.g., Bug report, Feature request, Content issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-message">Message *</Label>
                <Textarea
                  id="feedback-message"
                  placeholder="Describe your feedback, issue, or suggestion..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Screenshot section */}
              <div className="space-y-2">
                <Label>Screenshot (optional)</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={captureScreenshot}
                    disabled={isCapturing}
                    className="flex-1"
                  >
                    {isCapturing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 mr-2" />
                    )}
                    {isCapturing ? "Capturing..." : "Auto Capture"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload screenshot"
                  />
                </div>

                {screenshot && (
                  <div className="relative mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={screenshot}
                      alt="Captured screenshot"
                      className="w-full h-32 object-cover object-top"
                    />
                    <button
                      onClick={() => setScreenshot(null)}
                      className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      aria-label="Remove screenshot"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Current page: <code className="bg-muted px-1 rounded">{window.location.pathname}</code>
              </p>
            </div>
          )}

          {!sent && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSending || !message.trim()}>
                {isSending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSending ? "Sending..." : "Send Feedback"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
