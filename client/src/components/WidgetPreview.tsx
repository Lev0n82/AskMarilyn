import { MessageCircle, X, Send, ChevronDown, Phone, Mail } from "lucide-react";
import { useState } from "react";

interface WidgetPreviewProps {
  theme: string;
  name: string;
  greeting: string;
  chips: string[];
  whatsapp?: string;
  phone?: string;
  email?: string;
}

type PreviewState = "pill" | "card" | "panel";

export function WidgetPreview({ theme, name, greeting, chips, whatsapp, phone, email }: WidgetPreviewProps) {
  const [state, setState] = useState<PreviewState>("pill");
  const tc = getPreviewThemeClasses(theme);

  return (
    <div className="relative w-full h-[420px] rounded-xl border border-slate-200 overflow-hidden">
      {/* Mock background */}
      <div className={`absolute inset-0 ${theme === "Aurora Soft" ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}>
        <div className="p-4 space-y-2">
          <div className={`h-4 w-32 rounded ${theme === "Aurora Soft" ? "bg-slate-700" : "bg-slate-200"}`} />
          <div className={`h-3 w-full rounded ${theme === "Aurora Soft" ? "bg-slate-800" : "bg-slate-100"}`} />
          <div className={`h-3 w-3/4 rounded ${theme === "Aurora Soft" ? "bg-slate-800" : "bg-slate-100"}`} />
          <div className="h-4" />
          <div className={`h-20 w-full rounded-lg ${theme === "Aurora Soft" ? "bg-slate-800" : "bg-slate-100"}`} />
        </div>
      </div>

      {/* Widget */}
      <div className="absolute bottom-3 right-3 z-10">
        {state === "pill" && (
          <button
            onClick={() => setState("card")}
            className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-xs transition-all hover:scale-105 ${tc.pill}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">Need help?</span>
          </button>
        )}

        {state === "card" && (
          <div className={`w-[220px] rounded-xl shadow-xl overflow-hidden ${tc.card}`}>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tc.avatar}`}>
                    <MessageCircle className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-semibold truncate max-w-[120px]">{name || "Widget"}</span>
                </div>
                <button onClick={() => setState("pill")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className={`text-xs mb-2 ${theme === "Aurora Soft" ? "text-slate-300" : "text-slate-600"}`}>
                {greeting || "Hi! How can I help?"}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {(chips || []).slice(0, 3).map((chip, i) => (
                  <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border ${tc.chip}`}>
                    {chip}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setState("panel")}
                className={`w-full text-left text-xs px-2 py-1.5 rounded-md border ${tc.input}`}
              >
                Type a message...
              </button>
            </div>
          </div>
        )}

        {state === "panel" && (
          <div className={`w-[260px] h-[340px] rounded-xl shadow-2xl overflow-hidden flex flex-col ${tc.panel}`}>
            <div className={`px-3 py-2 flex items-center justify-between border-b ${tc.header}`}>
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tc.avatar}`}>
                  <MessageCircle className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-xs font-semibold truncate max-w-[120px]">{name || "Widget"}</p>
                  <p className="text-[10px] text-slate-500">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setState("card")} className="p-0.5 text-slate-400 hover:text-slate-600">
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button onClick={() => setState("pill")} className="p-0.5 text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="text-center py-4">
                <p className={`text-xs ${theme === "Aurora Soft" ? "text-slate-400" : "text-slate-500"}`}>
                  {greeting || "Hi! How can I help?"}
                </p>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {(chips || []).slice(0, 3).map((chip, i) => (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border ${tc.chip}`}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              {/* Demo messages */}
              <div className="flex justify-end">
                <div className={`max-w-[80%] px-2 py-1 rounded-xl text-[10px] ${tc.userBubble}`}>
                  What can you help me with?
                </div>
              </div>
              <div className="flex justify-start">
                <div className={`max-w-[80%] px-2 py-1 rounded-xl text-[10px] ${tc.assistantBubble}`}>
                  I can answer questions about our products, help with support, or connect you with a team member!
                </div>
              </div>
            </div>

            {/* Contact bar preview */}
            {(whatsapp || phone || email) && (
              <div className="px-3 py-1.5 border-t bg-slate-50 flex items-center justify-center gap-2">
                {whatsapp && (
                  <span className="flex items-center gap-0.5 text-[9px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                    WA
                  </span>
                )}
                {phone && (
                  <span className="flex items-center gap-0.5 text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full">
                    <Phone className="w-2.5 h-2.5" /> Call
                  </span>
                )}
                {email && (
                  <span className="flex items-center gap-0.5 text-[9px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full">
                    <Mail className="w-2.5 h-2.5" /> Email
                  </span>
                )}
              </div>
            )}

            <div className="px-3 py-2 border-t">
              <div className="flex items-center gap-1.5">
                <div className={`flex-1 text-[10px] px-2 py-1.5 rounded-md border ${tc.input}`}>
                  Type your message...
                </div>
                <div className={`p-1.5 rounded-md ${tc.sendBtn}`}>
                  <Send className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getPreviewThemeClasses(theme: string) {
  switch (theme) {
    case "Liquid Glass":
      return {
        pill: "bg-white/80 backdrop-blur-xl border border-white/50 text-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        card: "bg-white/90 backdrop-blur-xl border border-white/60",
        panel: "bg-white/95 backdrop-blur-xl border border-white/60",
        header: "bg-white/60 backdrop-blur-sm border-slate-100",
        avatar: "bg-indigo-100/80 text-indigo-600",
        chip: "border-indigo-200/60 text-indigo-700 bg-indigo-50/50",
        input: "border-slate-200/60 bg-white/50 text-slate-400",
        userBubble: "bg-indigo-600 text-white",
        assistantBubble: "bg-slate-100/80 text-slate-800",
        sendBtn: "bg-indigo-600 text-white",
      };
    case "Aurora Soft":
      return {
        pill: "bg-slate-900 text-slate-100 border border-slate-700",
        card: "bg-slate-900 border border-slate-700 text-slate-100",
        panel: "bg-slate-900 border border-slate-700 text-slate-100",
        header: "bg-slate-800 border-slate-700",
        avatar: "bg-purple-900/50 text-purple-300",
        chip: "border-slate-600 text-slate-300 bg-slate-800",
        input: "border-slate-600 bg-slate-800 text-slate-400",
        userBubble: "bg-purple-600 text-white",
        assistantBubble: "bg-slate-800 text-slate-200",
        sendBtn: "bg-purple-600 text-white",
      };
    case "Warm Neutral":
    default:
      return {
        pill: "bg-white text-slate-700 border border-slate-200",
        card: "bg-white border border-slate-200",
        panel: "bg-white border border-slate-200",
        header: "bg-slate-50 border-slate-100",
        avatar: "bg-amber-100 text-amber-700",
        chip: "border-slate-200 text-slate-600 bg-slate-50",
        input: "border-slate-200 bg-slate-50 text-slate-400",
        userBubble: "bg-slate-800 text-white",
        assistantBubble: "bg-slate-100 text-slate-800",
        sendBtn: "bg-slate-800 text-white",
      };
  }
}
