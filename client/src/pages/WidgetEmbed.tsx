/**
 * This page renders the widget in an iframe-friendly format.
 * The actual embeddable widget.js script creates an iframe pointing to /embed/:widgetId
 */
import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import {
  MessageCircle,
  X,
  Send,
  Phone,
  Mail,
  ChevronDown,
  Accessibility,
} from "lucide-react";
import AccessibilityOverlay from "@/components/AccessibilityOverlay";
import { VoiceAssistantEye } from "@/components/VoiceAssistantEye";

interface WidgetConfig {
  id: number;
  name: string;
  theme: string;
  greeting: string;
  suggestionChips: string[];
  whatsappNumber?: string;
  phoneNumber?: string;
  emailAddress?: string;
  accessibilityEnabled?: boolean;
  voiceEnabled?: boolean;
  voiceActivationMode?: string;
  voiceIdleOpacity?: number;
  voiceActiveOpacity?: number;
  voiceScope?: string;
  voiceLanguageMode?: string;
  voiceLanguages?: string[];
  voicePosition?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type WidgetState = "pill" | "card" | "panel";

export default function WidgetEmbed() {
  const params = useParams<{ id: string }>();
  const widgetId = parseInt(params.id || "0");
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [state, setState] = useState<WidgetState>("pill");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContactBar, setShowContactBar] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [visitorId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch widget config
    fetch(`/api/widget/${widgetId}/config`)
      .then(r => r.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, [widgetId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async () => {
    if (conversationId) return conversationId;
    const res = await fetch("/api/widget/conversation/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgetId, visitorId }),
    });
    const data = await res.json();
    setConversationId(data.id);
    return data.id;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content }]);
    setLoading(true);

    try {
      const convId = await startConversation();
      const res = await fetch("/api/widget/conversation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, widgetId, content }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      if (data.showContactBar) {
        setShowContactBar(true);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    setState("panel");
    sendMessage(chip);
  };

  if (!config) return null;

  const themeClasses = getThemeClasses(config.theme);
  const showAccessibility = config.accessibilityEnabled !== false;

  const handleVoiceMessage = async (text: string): Promise<string> => {
    try {
      const convId = await startConversation();
      const res = await fetch("/api/widget/conversation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, widgetId, content: text }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: data.response }]);
      if (data.showContactBar) setShowContactBar(true);
      return data.response;
    } catch {
      return "Sorry, I couldn't process that. Please try again.";
    }
  };

  const handleAccessibilityCommand = (command: string) => {
    // Dispatch custom event that the AccessibilityOverlay listens to
    window.dispatchEvent(new CustomEvent("hansen-accessibility-command", { detail: { command } }));
  };

  return (
    <>
    {showAccessibility && <AccessibilityOverlay />}
    {config.voiceEnabled && (
      <VoiceAssistantEye
        config={{
          enabled: true,
          activationMode: (config.voiceActivationMode as any) || "always_visible",
          idleOpacity: config.voiceIdleOpacity || 20,
          activeOpacity: config.voiceActiveOpacity || 90,
          scope: (config.voiceScope as any) || "both",
          languageMode: (config.voiceLanguageMode as any) || "auto_detect",
          languages: config.voiceLanguages || ["en", "fr", "es", "de"],
          position: (config.voicePosition as any) || "bottom_left",
          onMessage: handleVoiceMessage,
          onAccessibilityCommand: handleAccessibilityCommand,
        }}
      />
    )}
    <div className="fixed bottom-4 right-4 z-[99999] font-sans">
      {/* State 1: Pill */}
      {state === "pill" && (
        <button
          onClick={() => setState("card")}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${themeClasses.pill}`}
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Need help?</span>
        </button>
      )}

      {/* State 2: Card */}
      {state === "card" && (
        <div className={`w-[280px] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${themeClasses.card}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.avatar}`}>
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">{config.name}</span>
              </div>
              <button onClick={() => setState("pill")} className="text-slate-400 hover:text-slate-600" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-3">{config.greeting}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(config.suggestionChips || []).slice(0, 3).map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(chip)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${themeClasses.chip}`}
                >
                  {chip}
                </button>
              ))}
            </div>
            <button
              onClick={() => setState("panel")}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg border ${themeClasses.input}`}
            >
              Type your message...
            </button>
          </div>
        </div>
      )}

      {/* State 3: Full Panel */}
      {state === "panel" && (
        <div className={`w-[380px] h-[520px] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${themeClasses.panel}`}>
          {/* Header */}
          <div className={`px-4 py-3 flex items-center justify-between border-b ${themeClasses.header}`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.avatar}`}>
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{config.name}</p>
                <p className="text-xs text-slate-500">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setState("card")} className="p-1 text-slate-400 hover:text-slate-600" aria-label="Minimize">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button onClick={() => setState("pill")} className="p-1 text-slate-400 hover:text-slate-600" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">{config.greeting}</p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {(config.suggestionChips || []).map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${themeClasses.chip}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.role === "user" ? themeClasses.userBubble : themeClasses.assistantBubble
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`px-3 py-2 rounded-2xl text-sm ${themeClasses.assistantBubble}`}>
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Bar - only shown when qualified */}
          {showContactBar && (config.whatsappNumber || config.phoneNumber || config.emailAddress) && (
            <div className="px-4 py-2 border-t bg-slate-50 flex items-center justify-center gap-3">
              {config.whatsappNumber && (
                <a
                  href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full hover:bg-green-100"
                  aria-label="WhatsApp"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
              )}
              {config.phoneNumber && (
                <a
                  href={`tel:${config.phoneNumber}`}
                  className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100"
                  aria-label="Call"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              )}
              {config.emailAddress && (
                <a
                  href={`mailto:${config.emailAddress}`}
                  className="flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-full hover:bg-purple-100"
                  aria-label="Email"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </a>
              )}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
                aria-label="Chat message input"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-2 rounded-lg transition-colors ${themeClasses.sendBtn}`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

function getThemeClasses(theme: string) {
  switch (theme) {
    case "Liquid Glass":
      return {
        pill: "bg-white/80 backdrop-blur-xl border border-white/50 text-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        card: "bg-white/90 backdrop-blur-xl border border-white/60",
        panel: "bg-white/95 backdrop-blur-xl border border-white/60",
        header: "bg-white/60 backdrop-blur-sm border-slate-100",
        avatar: "bg-indigo-100/80 text-indigo-600",
        chip: "border-indigo-200/60 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/60",
        input: "border-slate-200/60 bg-white/50 text-slate-400",
        userBubble: "bg-indigo-600 text-white",
        assistantBubble: "bg-slate-100/80 text-slate-800",
        sendBtn: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50",
      };
    case "Aurora Soft":
      return {
        pill: "bg-slate-900 text-slate-100 border border-slate-700",
        card: "bg-slate-900 border border-slate-700 text-slate-100",
        panel: "bg-slate-900 border border-slate-700 text-slate-100",
        header: "bg-slate-800 border-slate-700",
        avatar: "bg-purple-900/50 text-purple-300",
        chip: "border-slate-600 text-slate-300 bg-slate-800 hover:bg-slate-700",
        input: "border-slate-600 bg-slate-800 text-slate-400",
        userBubble: "bg-purple-600 text-white",
        assistantBubble: "bg-slate-800 text-slate-200",
        sendBtn: "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50",
      };
    case "Warm Neutral":
    default:
      return {
        pill: "bg-white text-slate-700 border border-slate-200",
        card: "bg-white border border-slate-200",
        panel: "bg-white border border-slate-200",
        header: "bg-slate-50 border-slate-100",
        avatar: "bg-amber-100 text-amber-700",
        chip: "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100",
        input: "border-slate-200 bg-slate-50 text-slate-400",
        userBubble: "bg-slate-800 text-white",
        assistantBubble: "bg-slate-100 text-slate-800",
        sendBtn: "bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50",
      };
  }
}
