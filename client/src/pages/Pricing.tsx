import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ArrowLeft, Server, Cpu, Database, Zap } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-800">Hansen</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
            <Link href="/register"><Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Start free. Stay free. Upgrade only when you need more power.
          <br />
          <span className="text-indigo-600 font-medium">The free tier is not a trial — it's free forever.</span>
        </p>
      </section>

      {/* Platform Tiers */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Platform Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="rounded-2xl border-2 border-green-200 bg-white p-8 relative">
            <div className="absolute -top-3 left-6">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ALWAYS FREE
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-2">Free</h3>
            <div className="mt-3">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500 text-sm">/forever</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">Everything you need to get started. No credit card. No expiry. No catch.</p>
            <Link href="/register">
              <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Start Free — Forever</Button>
            </Link>
            <ul className="mt-6 space-y-3">
              <PricingFeature>1 widget</PricingFeature>
              <PricingFeature>500 conversations/month</PricingFeature>
              <PricingFeature>5 documents in knowledge base</PricingFeature>
              <PricingFeature>All 3 themes (Liquid Glass, Warm Neutral, Aurora Soft)</PricingFeature>
              <PricingFeature>Full accessibility overlay</PricingFeature>
              <PricingFeature>Voice assistant</PricingFeature>
              <PricingFeature>Connect your own Ollama/vLLM</PricingFeature>
              <PricingFeature>Community support</PricingFeature>
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-indigo-300 bg-white p-8 relative shadow-lg">
            <div className="absolute -top-3 left-6">
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-2">Pro</h3>
            <div className="mt-3">
              <span className="text-4xl font-bold text-slate-900">$49</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">For growing businesses that need more capacity and hosted AI.</p>
            <Link href="/register">
              <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700">Start Pro</Button>
            </Link>
            <ul className="mt-6 space-y-3">
              <PricingFeature>10 widgets</PricingFeature>
              <PricingFeature>10,000 conversations/month</PricingFeature>
              <PricingFeature>100 documents per widget</PricingFeature>
              <PricingFeature>All themes + custom branding</PricingFeature>
              <PricingFeature>Full accessibility overlay</PricingFeature>
              <PricingFeature>Voice assistant</PricingFeature>
              <PricingFeature highlight><a href="#hosted-ai" className="underline hover:text-indigo-800">Hosted AI included (see plans below)</a></PricingFeature>
              <PricingFeature>Multi-channel escalation (WhatsApp, Phone, Email)</PricingFeature>
              <PricingFeature>Priority email support</PricingFeature>
              <PricingFeature>Remove "Powered by Hansen" badge</PricingFeature>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
            <div className="mt-3">
              <span className="text-4xl font-bold text-slate-900">Custom</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">For organizations needing white-label, on-premises, or dedicated infrastructure.</p>
            <Button variant="outline" className="w-full mt-6">Contact Sales</Button>
            <ul className="mt-6 space-y-3">
              <PricingFeature>Unlimited widgets</PricingFeature>
              <PricingFeature>Unlimited conversations</PricingFeature>
              <PricingFeature>Unlimited documents</PricingFeature>
              <PricingFeature>White-label (your brand, your domain)</PricingFeature>
              <PricingFeature>Reseller portal access</PricingFeature>
              <PricingFeature>On-premises deployment option</PricingFeature>
              <PricingFeature highlight><a href="#hosted-ai" className="underline hover:text-indigo-800">Dedicated hosted AI cluster</a></PricingFeature>
              <PricingFeature>Custom model fine-tuning</PricingFeature>
              <PricingFeature>SLA & dedicated support</PricingFeature>
              <PricingFeature>SSO / SAML integration</PricingFeature>
            </ul>
          </div>
        </div>
      </section>

      {/* Hosted AI Service Plans */}
      <section className="max-w-6xl mx-auto px-6 pb-16" id="hosted-ai">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Hosted AI Service Plans</h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Don't want to manage your own Ollama or vLLM instance? We'll host it for you.
            Fully managed AI with RAG pipeline included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter AI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Starter AI</h3>
                <p className="text-xs text-slate-500">Small models, fast responses</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">$29</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <PricingFeature small>Hosted Ollama (shared GPU)</PricingFeature>
              <PricingFeature small>Models: Llama 3.1 8B, Mistral 7B, Phi-3</PricingFeature>
              <PricingFeature small>RAG pipeline included</PricingFeature>
              <PricingFeature small>5,000 AI requests/month</PricingFeature>
              <PricingFeature small>Up to 50 documents</PricingFeature>
              <PricingFeature small>99.5% uptime SLA</PricingFeature>
            </ul>
          </div>

          {/* Professional AI */}
          <div className="rounded-2xl border-2 border-indigo-200 bg-white p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Server className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Professional AI</h3>
                <p className="text-xs text-slate-500">Larger models, higher throughput</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">$99</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <PricingFeature small>Hosted Ollama (dedicated GPU)</PricingFeature>
              <PricingFeature small>Models: Llama 3.1 70B, Mixtral 8x7B, CodeLlama</PricingFeature>
              <PricingFeature small>Advanced RAG with vector embeddings</PricingFeature>
              <PricingFeature small>25,000 AI requests/month</PricingFeature>
              <PricingFeature small>Up to 500 documents</PricingFeature>
              <PricingFeature small>99.9% uptime SLA</PricingFeature>
              <PricingFeature small>Priority queue</PricingFeature>
            </ul>
          </div>

          {/* Dedicated AI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Dedicated AI</h3>
                <p className="text-xs text-slate-500">Your own GPU cluster</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">$299</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <PricingFeature small>Dedicated Ollama instance (reserved GPU)</PricingFeature>
              <PricingFeature small>Any model up to 405B parameters</PricingFeature>
              <PricingFeature small>Enterprise RAG with re-ranking</PricingFeature>
              <PricingFeature small>Unlimited AI requests</PricingFeature>
              <PricingFeature small>Unlimited documents</PricingFeature>
              <PricingFeature small>99.99% uptime SLA</PricingFeature>
              <PricingFeature small>Custom model fine-tuning</PricingFeature>
              <PricingFeature small>Data residency options</PricingFeature>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            All hosted AI plans include automatic scaling, daily backups, and zero-config setup.
            <br />
            Already have your own infrastructure? Connect any Ollama, vLLM, or OpenAI-compatible endpoint for free.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-green-600">Free</th>
                <th className="text-center py-3 px-4 font-medium text-indigo-600">Pro</th>
                <th className="text-center py-3 px-4 font-medium text-slate-600">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <CompRow feature="Widgets" free="1" pro="10" enterprise="Unlimited" />
              <CompRow feature="Conversations/month" free="500" pro="10,000" enterprise="Unlimited" />
              <CompRow feature="Documents per widget" free="5" pro="100" enterprise="Unlimited" />
              <CompRow feature="All 3 themes" free="✓" pro="✓" enterprise="✓" />
              <CompRow feature="Custom branding" free="—" pro="✓" enterprise="✓" />
              <CompRow feature="Accessibility overlay" free="✓" pro="✓" enterprise="✓" />
              <CompRow feature="Voice assistant" free="✓" pro="✓" enterprise="✓" />
              <CompRow feature="Connect own AI (Ollama/vLLM)" free="✓" pro="✓" enterprise="✓" />
              <CompRow feature="Hosted AI service" free="—" pro="Add-on" enterprise="Dedicated" />
              <CompRow feature="Multi-channel escalation" free="Email only" pro="All channels" enterprise="All channels" />
              <CompRow feature="White-label" free="—" pro="—" enterprise="✓" />
              <CompRow feature="Reseller portal" free="—" pro="—" enterprise="✓" />
              <CompRow feature="On-premises deployment" free="—" pro="—" enterprise="✓" />
              <CompRow feature="Support" free="Community" pro="Priority email" enterprise="Dedicated + SLA" />
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FaqItem
            q="Is the free tier really free forever?"
            a="Yes. The free tier has no expiration date, no credit card requirement, and no hidden limitations that force you to upgrade. It's free because accessibility should be accessible to everyone — that's our mission."
          />
          <FaqItem
            q="Do I need to use your hosted AI service?"
            a="No. You can connect your own Ollama, vLLM, or any OpenAI-compatible endpoint at no cost. The hosted AI plans are optional add-ons for teams who don't want to manage their own infrastructure."
          />
          <FaqItem
            q="What happens if I exceed my conversation limit?"
            a="We'll notify you when you're approaching your limit. Conversations won't be cut off mid-conversation — we'll simply pause new conversations until the next billing cycle or until you upgrade."
          />
          <FaqItem
            q="Can I switch between plans?"
            a="Yes. You can upgrade or downgrade at any time. Changes take effect immediately, and billing is prorated."
          />
          <FaqItem
            q="What's included in the hosted AI RAG pipeline?"
            a="Document ingestion (PDF, DOCX, TXT, CSV), automatic chunking, vector embedding, semantic search, and context injection into AI prompts — all managed for you with zero configuration."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
          <p>&copy; 2026 Hansen. Removing barriers. For everyone. Everywhere.</p>
        </div>
      </footer>
    </div>
  );
}

function PricingFeature({ children, highlight, small }: { children: React.ReactNode; highlight?: boolean; small?: boolean }) {
  return (
    <li className={`flex items-start gap-2 ${small ? "text-xs" : "text-sm"} ${highlight ? "text-indigo-700 font-medium" : "text-slate-600"}`}>
      <Check className={`flex-shrink-0 mt-0.5 ${small ? "w-3 h-3" : "w-4 h-4"} text-green-500`} />
      <span>{children}</span>
    </li>
  );
}

function CompRow({ feature, free, pro, enterprise }: { feature: string; free: string; pro: string; enterprise: string }) {
  return (
    <tr>
      <td className="py-3 px-4 text-slate-700">{feature}</td>
      <td className="py-3 px-4 text-center text-slate-600">{free}</td>
      <td className="py-3 px-4 text-center text-indigo-700 font-medium">{pro}</td>
      <td className="py-3 px-4 text-center text-slate-600">{enterprise}</td>
    </tr>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-slate-200 rounded-xl p-4 bg-white">
      <summary className="font-medium text-slate-800 cursor-pointer list-none flex items-center justify-between">
        {q}
        <Zap className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
    </details>
  );
}
