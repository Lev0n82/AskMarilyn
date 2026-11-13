import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, Mail, Phone, FileText, Eye, Ear, Hand, Brain, Globe, Keyboard, Monitor } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { usePageMeta } from "@/hooks/usePageMeta";

interface AccessibilityFeature {
  name: string;
  status: "compliant" | "partial" | "planned";
  description: string;
  wcagCriteria: string;
}

const accessibilityFeatures: AccessibilityFeature[] = [
  {
    name: "Keyboard Navigation",
    status: "compliant",
    description: "All interactive elements are accessible via keyboard. Skip links allow users to bypass navigation.",
    wcagCriteria: "2.1.1, 2.1.2, 2.4.1"
  },
  {
    name: "Screen Reader Support",
    status: "compliant",
    description: "Proper ARIA labels, landmarks, and semantic HTML ensure compatibility with assistive technologies.",
    wcagCriteria: "1.3.1, 4.1.2"
  },
  {
    name: "Color Contrast",
    status: "compliant",
    description: "Text and interactive elements meet WCAG AAA contrast ratios (7:1 for normal text, 4.5:1 for large text).",
    wcagCriteria: "1.4.6"
  },
  {
    name: "Focus Indicators",
    status: "compliant",
    description: "Visible focus indicators on all interactive elements help users track their position.",
    wcagCriteria: "2.4.7, 2.4.13"
  },
  {
    name: "Text Resizing",
    status: "compliant",
    description: "Content remains readable and functional when text is resized up to 200%.",
    wcagCriteria: "1.4.4"
  },
  {
    name: "Motion Preferences",
    status: "compliant",
    description: "Animations respect the user's reduced motion preferences.",
    wcagCriteria: "2.3.3"
  },
  {
    name: "Alternative Text",
    status: "compliant",
    description: "All images have descriptive alternative text for screen reader users.",
    wcagCriteria: "1.1.1"
  },
  {
    name: "Form Accessibility",
    status: "compliant",
    description: "All form inputs have associated labels, error messages, and clear instructions.",
    wcagCriteria: "1.3.5, 3.3.2"
  },
  {
    name: "Target Size",
    status: "compliant",
    description: "Interactive elements have a minimum target size of 44x44 pixels.",
    wcagCriteria: "2.5.8"
  },
  {
    name: "Consistent Navigation",
    status: "compliant",
    description: "Navigation is consistent across pages with clear page structure.",
    wcagCriteria: "3.2.3, 3.2.4"
  }
];

const alternateFormats = [
  { value: "large-print", label: "Large Print (18pt or larger)" },
  { value: "audio", label: "Audio Format" },
  { value: "braille", label: "Braille" },
  { value: "plain-text", label: "Plain Text" },
  { value: "easy-read", label: "Easy Read Format" },
  { value: "sign-language", label: "Sign Language Video" },
  { value: "other", label: "Other (please specify)" }
];

export default function Accessibility() {
  usePageMeta({
    title: "Accessibility Statement",
    description: "GRACE Academy accessibility commitment and WCAG compliance information.",
    keywords: "accessibility, WCAG compliance, inclusive education, GRACE Academy"
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    format: "",
    content: "",
    additionalInfo: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifyOwner = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await notifyOwner.mutateAsync({
        title: `Accessibility Support Request: ${formData.format}`,
        content: `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Requested Format: ${formData.format}
Content Requested: ${formData.content}
Additional Information: ${formData.additionalInfo || "None"}
        `.trim()
      });
      setSubmitted(true);
    } catch (err) {
      setError("There was an error submitting your request. Please try again or contact us directly.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusIcon = (status: AccessibilityFeature["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />;
      case "partial":
        return <AlertCircle className="h-5 w-5 text-yellow-600" aria-hidden="true" />;
      case "planned":
        return <AlertCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />;
    }
  };

  const getStatusText = (status: AccessibilityFeature["status"]) => {
    switch (status) {
      case "compliant":
        return "Fully Compliant";
      case "partial":
        return "Partially Compliant";
      case "planned":
        return "Planned";
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary">Accessibility Statement</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ask Marilyn is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant 
            accessibility standards.
          </p>
        </header>

        {/* Commitment Section */}
        <section aria-labelledby="commitment-heading">
          <Card>
            <CardHeader>
              <CardTitle id="commitment-heading" className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We believe that the internet should be accessible to everyone, regardless of ability. 
                Our goal is to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AAA</strong>, 
                the highest level of accessibility compliance.
              </p>
              <p>
                This website has been designed and developed with accessibility in mind from the ground up. 
                We regularly test our content with assistive technologies and welcome feedback from users 
                about how we can improve.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Accessibility Features */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-serif font-bold mb-6">
            Accessibility Features
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {accessibilityFeatures.map((feature) => (
              <Card key={feature.name}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(feature.status)}
                    <div className="space-y-1">
                      <h3 className="font-semibold">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">WCAG Criteria:</span> {feature.wcagCriteria}
                      </p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded ${
                        feature.status === "compliant" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : feature.status === "partial"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {getStatusText(feature.status)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Assistive Technology Support */}
        <section aria-labelledby="assistive-tech-heading">
          <Card>
            <CardHeader>
              <CardTitle id="assistive-tech-heading">Assistive Technology Support</CardTitle>
              <CardDescription>
                This website is designed to be compatible with the following assistive technologies:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Screen readers (JAWS, NVDA, VoiceOver)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Keyboard className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Keyboard-only navigation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Screen magnification software</span>
                </div>
                <div className="flex items-center gap-3">
                  <Hand className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Voice recognition software</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Reading assistance tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ear className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Text-to-speech software</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Request Alternate Format */}
        <section aria-labelledby="alternate-format-heading">
          <Card>
            <CardHeader>
              <CardTitle id="alternate-format-heading" className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                Request Alternate Format
              </CardTitle>
              <CardDescription>
                If you need any content from this website in an alternate format, please complete the form below. 
                We will do our best to accommodate your request within 5 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8 space-y-4" role="status" aria-live="polite">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" aria-hidden="true" />
                  <h3 className="text-xl font-semibold">Request Submitted Successfully</h3>
                  <p className="text-muted-foreground">
                    Thank you for your request. We will review it and respond within 5 business days.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-md" role="alert">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-destructive" aria-hidden="true">*</span>
                        <span className="sr-only">(required)</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        aria-required="true"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-destructive" aria-hidden="true">*</span>
                        <span className="sr-only">(required)</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        aria-required="true"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="format">
                        Preferred Format <span className="text-destructive" aria-hidden="true">*</span>
                        <span className="sr-only">(required)</span>
                      </Label>
                      <Select
                        value={formData.format}
                        onValueChange={(value) => handleInputChange("format", value)}
                        required
                      >
                        <SelectTrigger id="format" aria-required="true">
                          <SelectValue placeholder="Select a format" />
                        </SelectTrigger>
                        <SelectContent>
                          {alternateFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Content Requested <span className="text-destructive" aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </Label>
                    <Textarea
                      id="content"
                      required
                      aria-required="true"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="Please describe the specific content you need in an alternate format (e.g., 'Module 3: Anti-Patterns course material')"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      placeholder="Any additional requirements or preferences we should know about"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto" disabled={notifyOwner.isPending}>
                    {notifyOwner.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section aria-labelledby="contact-heading">
          <Card>
            <CardHeader>
              <CardTitle id="contact-heading">Contact Us About Accessibility</CardTitle>
              <CardDescription>
                We welcome your feedback on the accessibility of this website. If you encounter any 
                accessibility barriers or have suggestions for improvement, please let us know.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                <a href="mailto:accessibility@askmarilyn.com" className="hover:underline">
                  accessibility@askmarilyn.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                We try to respond to accessibility feedback within 2 business days.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Technical Specifications */}
        <section aria-labelledby="technical-heading">
          <Card>
            <CardHeader>
              <CardTitle id="technical-heading">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This website relies on the following technologies to work with the particular 
                combination of web browser and any assistive technologies or plugins installed 
                on your computer:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>HTML5</li>
                <li>WAI-ARIA</li>
                <li>CSS</li>
                <li>JavaScript</li>
              </ul>
              <p>
                These technologies are relied upon for conformance with the accessibility standards used.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Last Updated */}
        <footer className="text-center text-sm text-muted-foreground py-8 border-t border-border">
          <p>This accessibility statement was last updated on January 24, 2026.</p>
          <p className="mt-2">
            Conformance status: <strong>WCAG 2.2 Level AAA</strong>
          </p>
        </footer>
      </div>
    </Layout>
  );
}
