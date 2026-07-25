import { useState } from "react";
import { Link } from "wouter";
import {
  Accessibility,
  CheckCircle2,
  Shield,
  Eye,
  Keyboard,
  Volume2,
  Mic,
  BookOpen,
  ArrowLeft,
  Send,
  ExternalLink,
} from "lucide-react";

export default function AccessibilityPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100" role="banner">
        <nav className="container max-w-5xl mx-auto px-6 py-4 flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Hansen Accessibility</span>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white" aria-labelledby="a11y-hero-title">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 id="a11y-hero-title" className="text-4xl font-bold text-gray-900 mb-4">
            Accessibility Statement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hansen is committed to ensuring digital accessibility for people with disabilities.
            We are continually improving the user experience for everyone and applying the relevant
            accessibility standards to guarantee we provide equal access to all users.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">WCAG 2.2 Level AAA Conformance Target</span>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-16" aria-labelledby="standards-title">
        <div className="container max-w-4xl mx-auto px-6">
          <h2 id="standards-title" className="text-2xl font-bold text-gray-900 mb-8">Conformance Standards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <StandardCard
              title="WCAG 2.2 Level AAA"
              description="We target the highest level of Web Content Accessibility Guidelines conformance, going beyond the minimum requirements to provide the best possible experience."
              badge="Target"
            />
            <StandardCard
              title="Section 508"
              description="Our platform meets the requirements of Section 508 of the Rehabilitation Act, ensuring accessibility for federal agencies and their users."
              badge="Compliant"
            />
            <StandardCard
              title="ADA Compliance"
              description="Hansen is designed to meet the accessibility requirements under the Americans with Disabilities Act for digital services."
              badge="Compliant"
            />
            <StandardCard
              title="EN 301 549"
              description="We conform to the European accessibility standard for ICT products and services, supporting international accessibility requirements."
              badge="Conformant"
            />
          </div>
        </div>
      </section>

      {/* Built-in Features */}
      <section className="py-16 bg-gray-50" aria-labelledby="features-title">
        <div className="container max-w-4xl mx-auto px-6">
          <h2 id="features-title" className="text-2xl font-bold text-gray-900 mb-3">Built-in Accessibility Features</h2>
          <p className="text-gray-600 mb-8">
            Every Hansen deployment includes these accessibility features at no additional cost.
            They are available to all visitors via the ♿ button in the bottom-left corner of every page.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Eye className="w-5 h-5 text-blue-600" />}
              title="Visual Adjustments"
              features={[
                "Font size scaling (-25% to +50%)",
                "Line spacing control (+25% to +75%)",
                "High contrast mode",
                "OpenDyslexic typeface",
                "Large cursor option",
              ]}
            />
            <FeatureCard
              icon={<Keyboard className="w-5 h-5 text-purple-600" />}
              title="Navigation Aids"
              features={[
                "Full keyboard navigation",
                "Visible focus indicators",
                "Skip-to-content links",
                "Stop all animations",
                "ARIA landmarks on every page",
              ]}
            />
            <FeatureCard
              icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
              title="Content Assistance"
              features={[
                "Screen reader / TTS support",
                "Reading guide overlay",
                "Link highlighting",
                "Semantic HTML structure",
                "Alt text for all images",
              ]}
            />
            <FeatureCard
              icon={<Mic className="w-5 h-5 text-amber-600" />}
              title="Voice & Advanced"
              features={[
                "Voice command control",
                "Speech-to-text input",
                "Text-to-speech responses",
                "prefers-reduced-motion respected",
                "Settings persist across visits",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16" aria-labelledby="technical-title">
        <div className="container max-w-4xl mx-auto px-6">
          <h2 id="technical-title" className="text-2xl font-bold text-gray-900 mb-8">Technical Implementation</h2>
          <div className="space-y-4">
            <DetailRow label="Minimum touch target size" value="44x44px (WCAG 2.5.8 AAA)" />
            <DetailRow label="Color contrast ratio" value="≥ 7:1 for normal text, ≥ 4.5:1 for large text (Level AAA)" />
            <DetailRow label="Focus indicators" value="3px solid outline with 2px offset on all interactive elements" />
            <DetailRow label="Keyboard accessibility" value="All functionality operable via keyboard without timing constraints" />
            <DetailRow label="Screen reader support" value="ARIA roles, labels, and live regions throughout" />
            <DetailRow label="Motion sensitivity" value="Respects prefers-reduced-motion; manual stop-animations toggle" />
            <DetailRow label="Text resizing" value="Content remains functional up to 200% zoom (WCAG 1.4.4)" />
            <DetailRow label="Language" value="Page language declared; voice assistant supports multi-language" />
            <DetailRow label="Settings persistence" value="localStorage-based; restored automatically on return visits" />
          </div>
        </div>
      </section>

      {/* Compatibility */}
      <section className="py-16 bg-gray-50" aria-labelledby="compat-title">
        <div className="container max-w-4xl mx-auto px-6">
          <h2 id="compat-title" className="text-2xl font-bold text-gray-900 mb-6">Compatibility</h2>
          <p className="text-gray-600 mb-6">
            Hansen is designed to be compatible with the following assistive technologies:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <CompatCard title="Screen Readers" items={["NVDA", "JAWS", "VoiceOver (macOS/iOS)", "TalkBack (Android)"]} />
            <CompatCard title="Browsers" items={["Chrome 90+", "Firefox 90+", "Safari 15+", "Edge 90+"]} />
            <CompatCard title="Input Methods" items={["Keyboard only", "Voice control", "Switch access", "Eye tracking"]} />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16" aria-labelledby="contact-title">
        <div className="container max-w-2xl mx-auto px-6">
          <h2 id="contact-title" className="text-2xl font-bold text-gray-900 mb-3">Report an Accessibility Issue</h2>
          <p className="text-gray-600 mb-8">
            We welcome your feedback on the accessibility of Hansen. If you encounter any barriers
            or have suggestions for improvement, please let us know.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you for your feedback</h3>
              <p className="text-green-600">We will review your report and respond within 2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="a11y-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="a11y-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  style={{ minHeight: "44px" }}
                />
              </div>
              <div>
                <label htmlFor="a11y-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="a11y-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  style={{ minHeight: "44px" }}
                />
              </div>
              <div>
                <label htmlFor="a11y-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe the accessibility issue or suggestion
                </label>
                <textarea
                  id="a11y-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-y"
                  placeholder="Please describe what you were trying to do, what happened, and what assistive technology you were using..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300"
                style={{ minHeight: "44px" }}
              >
                <Send className="w-4 h-4" />
                Submit Report
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100" role="contentinfo">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            This accessibility statement was last updated on July 2026.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For more information about web accessibility standards, visit the{" "}
            <a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
              W3C Web Accessibility Initiative <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function StandardCard({ title, description, badge }: { title: string; description: string; badge: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{badge}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, features }: { icon: React.ReactNode; title: string; features: string[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">{icon}</div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-700 sm:w-48 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-600">{value}</span>
    </div>
  );
}

function CompatCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
            <Volume2 className="w-3 h-3 text-gray-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
