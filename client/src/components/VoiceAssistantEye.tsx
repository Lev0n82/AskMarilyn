import { useState, useEffect, useRef, useCallback } from "react";

interface VoiceAssistantConfig {
  enabled: boolean;
  activationMode: "with_overlay" | "separate_toggle" | "always_visible";
  idleOpacity: number;
  activeOpacity: number;
  scope: "accessibility" | "chat" | "both";
  languageMode: "auto_detect" | "pre_selected" | "user_chosen";
  languages: string[];
  position: "top_left" | "top_right" | "bottom_left" | "bottom_right" | "center";
  onMessage?: (text: string) => Promise<string>;
  onAccessibilityCommand?: (command: string) => void;
}

type VoiceState = "idle" | "listening" | "processing" | "speaking";

export function VoiceAssistantEye({ config }: { config: VoiceAssistantConfig }) {
  const [state, setState] = useState<VoiceState>("idle");
  const [isVisible, setIsVisible] = useState(config.activationMode === "always_visible");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [selectedLang, setSelectedLang] = useState(config.languages[0] || "en");
  const [showLangPicker, setShowLangPicker] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Show/hide based on activation mode
  useEffect(() => {
    if (config.activationMode === "always_visible") {
      setIsVisible(true);
    }
  }, [config.activationMode]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponse("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = config.languageMode === "auto_detect" ? "" : selectedLang;

    recognition.onstart = () => setState("listening");
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      setTranscript(result[0].transcript);
    };
    recognition.onend = () => {
      setState("processing");
      handleVoiceInput(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("[Voice] Recognition error:", event.error);
      setState("idle");
      setTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setTranscript("");
    setResponse("");
  }, [selectedLang, config.languageMode, transcript]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) {
      setState("idle");
      return;
    }

    // Check for accessibility commands first
    const accessibilityCommands = parseAccessibilityCommand(text);
    if (accessibilityCommands && (config.scope === "accessibility" || config.scope === "both")) {
      config.onAccessibilityCommand?.(accessibilityCommands);
      const ackMessage = getAccessibilityAck(accessibilityCommands);
      setResponse(ackMessage);
      speak(ackMessage);
      return;
    }

    // Route to AI chat if scope allows
    if (config.scope === "chat" || config.scope === "both") {
      if (config.onMessage) {
        try {
          const aiResponse = await config.onMessage(text);
          setResponse(aiResponse);
          speak(aiResponse);
        } catch {
          const errMsg = "I'm sorry, I couldn't process that. Please try again.";
          setResponse(errMsg);
          speak(errMsg);
        }
      }
    } else {
      const msg = "I can only help with accessibility commands. Try saying 'make text bigger' or 'read the page'.";
      setResponse(msg);
      speak(msg);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    setState("speaking");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.9;
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    synthRef.current.speak(utterance);
  };

  const parseAccessibilityCommand = (text: string): string | null => {
    const lower = text.toLowerCase();
    if (lower.includes("bigger") || lower.includes("larger") || lower.includes("increase font") || lower.includes("enlarge text")) return "font_increase";
    if (lower.includes("smaller") || lower.includes("decrease font") || lower.includes("reduce text")) return "font_decrease";
    if (lower.includes("contrast") || lower.includes("high contrast")) return "contrast";
    if (lower.includes("dyslexia") || lower.includes("dyslexic")) return "dyslexia_font";
    if (lower.includes("stop animation") || lower.includes("no animation") || lower.includes("stop blinking")) return "stop_animations";
    if (lower.includes("read") || lower.includes("screen reader") || lower.includes("read aloud") || lower.includes("read the page")) return "screen_reader";
    if (lower.includes("highlight link") || lower.includes("show link")) return "highlight_links";
    if (lower.includes("reading guide") || lower.includes("line guide")) return "reading_guide";
    if (lower.includes("keyboard") || lower.includes("tab navigation")) return "keyboard_nav";
    if (lower.includes("reset") || lower.includes("normal") || lower.includes("default")) return "reset";
    return null;
  };

  const getAccessibilityAck = (command: string): string => {
    const acks: Record<string, string> = {
      font_increase: "I've made the text larger for you.",
      font_decrease: "I've made the text smaller.",
      contrast: "High contrast mode is now active.",
      dyslexia_font: "I've switched to a dyslexia-friendly font.",
      stop_animations: "All animations have been stopped.",
      screen_reader: "Starting screen reader mode.",
      highlight_links: "All links are now highlighted.",
      reading_guide: "Reading guide is now active.",
      keyboard_nav: "Keyboard navigation is enhanced.",
      reset: "All accessibility settings have been reset to default.",
    };
    return acks[command] || "Done.";
  };

  // Toggle visibility (for external triggers)
  const toggle = () => setIsVisible(!isVisible);

  if (!config.enabled || !isVisible) return null;

  const positionClasses: Record<string, string> = {
    top_left: "top-4 left-4",
    top_right: "top-4 right-4",
    bottom_left: "bottom-20 left-4",
    bottom_right: "bottom-20 right-4",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const currentOpacity = state === "idle" ? config.idleOpacity / 100 : config.activeOpacity / 100;

  return (
    <div
      className={`fixed ${positionClasses[config.position]} z-[99998] transition-all duration-500`}
      style={{ opacity: currentOpacity }}
    >
      {/* Eye Container */}
      <div className="relative">
        {/* Main Eye Button */}
        <button
          onClick={() => {
            if (state === "idle") startListening();
            else if (state === "listening") stopListening();
          }}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-300 cursor-pointer
            ${state === "idle" ? "bg-slate-900/80 hover:bg-slate-900/90 scale-100" : ""}
            ${state === "listening" ? "bg-indigo-600 scale-110 animate-pulse" : ""}
            ${state === "processing" ? "bg-amber-500 scale-105" : ""}
            ${state === "speaking" ? "bg-green-600 scale-105" : ""}
            shadow-2xl backdrop-blur-sm
          `}
          aria-label={state === "idle" ? "Activate voice assistant" : state === "listening" ? "Stop listening" : "Voice assistant active"}
        >
          {/* Eye SVG */}
          <svg viewBox="0 0 64 64" className="w-10 h-10">
            {/* Eye outline */}
            <path
              d="M8 32 C8 32 20 16 32 16 C44 16 56 32 56 32 C56 32 44 48 32 48 C20 48 8 32 8 32Z"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              className={state === "listening" ? "animate-pulse" : ""}
            />
            {/* Iris */}
            <circle
              cx="32"
              cy="32"
              r="8"
              fill="white"
              className={`transition-all duration-300 ${state === "listening" ? "r-[10]" : ""}`}
            />
            {/* Pupil */}
            <circle
              cx="32"
              cy="32"
              r="4"
              fill={state === "idle" ? "#1e1b4b" : state === "listening" ? "#4f46e5" : state === "speaking" ? "#059669" : "#d97706"}
              className="transition-all duration-300"
            />
            {/* Listening indicator - sound waves */}
            {state === "listening" && (
              <>
                <circle cx="32" cy="32" r="14" fill="none" stroke="white" strokeWidth="1" opacity="0.5" className="animate-ping" />
                <circle cx="32" cy="32" r="18" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" className="animate-ping" style={{ animationDelay: "0.5s" }} />
              </>
            )}
          </svg>
        </button>

        {/* Status indicator */}
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
          ${state === "idle" ? "bg-slate-400" : ""}
          ${state === "listening" ? "bg-red-500 animate-pulse" : ""}
          ${state === "processing" ? "bg-amber-400 animate-spin" : ""}
          ${state === "speaking" ? "bg-green-500" : ""}
        `} />

        {/* Transcript/Response bubble */}
        {(transcript || response) && state !== "idle" && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl p-3 text-sm">
            {state === "listening" && transcript && (
              <p className="text-slate-600 italic">"{transcript}"</p>
            )}
            {(state === "processing") && (
              <p className="text-amber-600 flex items-center gap-2">
                <span className="animate-spin">⟳</span> Processing...
              </p>
            )}
            {state === "speaking" && response && (
              <p className="text-slate-800">{response}</p>
            )}
          </div>
        )}

        {/* Language picker (for user_chosen mode) */}
        {config.languageMode === "user_chosen" && (
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-white shadow text-xs font-bold text-slate-700 flex items-center justify-center"
            aria-label="Change language"
          >
            {selectedLang.toUpperCase().slice(0, 2)}
          </button>
        )}

        {showLangPicker && (
          <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl p-2 min-w-[120px]">
            {config.languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setSelectedLang(lang); setShowLangPicker(false); }}
                className={`block w-full text-left px-3 py-1.5 text-sm rounded ${selectedLang === lang ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Export toggle function for external control
export function useVoiceAssistantToggle() {
  const [visible, setVisible] = useState(false);
  return { visible, toggle: () => setVisible(!visible), show: () => setVisible(true), hide: () => setVisible(false) };
}
