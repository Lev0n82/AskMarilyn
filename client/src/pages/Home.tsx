import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Sparkles, MessageSquare, Shield, Accessibility, Globe, Zap } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-800">Hansen</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => setLocation("/dashboard")} className="bg-indigo-600 hover:bg-indigo-700">
                Dashboard
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">
          Removing Barriers.
          <br />
          <span className="text-indigo-600">For Everyone. Everywhere.</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          AI-powered conversations and accessibility tools for every website.
          Always free. Not a trial. Named in honor of Rick Hansen's mission to create a world without barriers.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 px-8">
              Start Free — Forever
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6 text-indigo-600" />}
            title="RAG-Powered Chat"
            description="Upload your documents and let AI answer questions using your knowledge base with retrieval-augmented generation."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-indigo-600" />}
            title="Your Models, Your Data"
            description="Connect to Ollama or any compatible endpoint. Your data stays on your infrastructure — no third-party dependencies."
          />
          <FeatureCard
            icon={<Accessibility className="w-6 h-6 text-indigo-600" />}
            title="Built-in Accessibility"
            description="Every widget ships with a full accessibility overlay — font controls, contrast, screen reader, keyboard navigation, and more."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-indigo-600" />}
            title="White-Label Ready"
            description="Rebrand the entire platform for your clients. Custom domains, logos, colors — sell it as your own product."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-indigo-600" />}
            title="One-Line Embed"
            description="Generate a single JavaScript snippet and paste it into any website. The widget loads asynchronously with zero impact on performance."
          />
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6 text-indigo-600" />}
            title="Multi-Channel Escalation"
            description="When AI qualifies a visitor, surface WhatsApp, phone, and email options — connecting humans when it matters most."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
          <p>&copy; 2026 Hansen. Removing barriers. For everyone. Everywhere.</p>
          <p className="mt-1 text-xs text-slate-400">Named in honor of Rick Hansen's mission to create a world without barriers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
