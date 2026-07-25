import { useState, useEffect, useCallback, useRef } from "react";
import {
  Accessibility,
  X,
  Type,
  ZoomIn,
  ZoomOut,
  Contrast,
  Pause,
  Keyboard,
  BookOpen,
  Link2,
  Volume2,
  Eye,
  MousePointer,
  ArrowUpDown,
  Mic,
  RotateCcw,
  ChevronRight,
  Moon,
  Sun,
  ImageOff,
  Palette,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  Layers,
  Info,
  CreditCard,
  Navigation,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   ACCESSIBILITY STATE
   ═══════════════════════════════════════════════════════════════ */

interface AccessibilityState {
  fontSize: number;
  lineSpacing: number;
  letterSpacing: number;
  wordSpacing: number;
  highContrast: boolean;
  dyslexiaFont: boolean;
  stopAnimations: boolean;
  keyboardNav: boolean;
  readingGuide: boolean;
  linkHighlight: boolean;
  screenReader: boolean;
  largePointer: boolean;
  focusIndicators: boolean;
  voiceCommands: boolean;
  // New competitive features
  darkMode: boolean;
  saturation: number; // 0=normal, -1=grayscale, 1=high
  colorBlindMode: string; // "none"|"protanopia"|"deuteranopia"|"tritanopia"
  hideImages: boolean;
  tooltipsOnHover: boolean;
  readingMask: boolean;
  pageStructure: boolean;
  contentMagnifier: boolean;
  dictionary: boolean;
}

const DEFAULT_STATE: AccessibilityState = {
  fontSize: 0,
  lineSpacing: 0,
  letterSpacing: 0,
  wordSpacing: 0,
  highContrast: false,
  dyslexiaFont: false,
  stopAnimations: false,
  keyboardNav: false,
  readingGuide: false,
  linkHighlight: false,
  screenReader: false,
  largePointer: false,
  focusIndicators: false,
  voiceCommands: false,
  darkMode: false,
  saturation: 0,
  colorBlindMode: "none",
  hideImages: false,
  tooltipsOnHover: false,
  readingMask: false,
  pageStructure: false,
  contentMagnifier: false,
  dictionary: false,
};

const STORAGE_KEY = "hansen-accessibility-settings";

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AccessibilityOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"accessibility" | "product">("accessibility");
  const [state, setState] = useState<AccessibilityState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Apply accessibility effects to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    const scale = 1 + state.fontSize * 0.125;
    root.style.fontSize = `${scale * 100}%`;

    // Line spacing
    body.style.lineHeight = state.lineSpacing > 0 ? `${1.5 + state.lineSpacing * 0.25}` : "";

    // Letter spacing
    body.style.letterSpacing = state.letterSpacing > 0 ? `${state.letterSpacing * 0.05}em` : "";

    // Word spacing
    body.style.wordSpacing = state.wordSpacing > 0 ? `${state.wordSpacing * 0.1}em` : "";

    // High contrast
    root.classList.toggle("hansen-high-contrast", state.highContrast);
    // Dyslexia font
    root.classList.toggle("hansen-dyslexia-font", state.dyslexiaFont);
    // Stop animations
    root.classList.toggle("hansen-stop-animations", state.stopAnimations);
    // Keyboard nav
    root.classList.toggle("hansen-keyboard-nav", state.keyboardNav);
    root.classList.toggle("hansen-focus-indicators", state.focusIndicators);
    // Link highlighting
    root.classList.toggle("hansen-link-highlight", state.linkHighlight);
    // Large pointer
    root.classList.toggle("hansen-large-pointer", state.largePointer);
    // Dark mode
    root.classList.toggle("hansen-dark-mode", state.darkMode);
    // Hide images
    root.classList.toggle("hansen-hide-images", state.hideImages);
    // Tooltips
    root.classList.toggle("hansen-tooltips", state.tooltipsOnHover);
    // Content magnifier
    root.classList.toggle("hansen-magnifier", state.contentMagnifier);

    // Saturation filter
    if (state.saturation === -1) {
      body.style.filter = state.darkMode ? "invert(1) hue-rotate(180deg) grayscale(1)" : "grayscale(1)";
    } else if (state.saturation === 1) {
      body.style.filter = state.darkMode ? "invert(1) hue-rotate(180deg) saturate(2)" : "saturate(2)";
    } else {
      body.style.filter = state.darkMode ? "invert(1) hue-rotate(180deg)" : "";
    }

    // Color blind mode via SVG filter
    if (state.colorBlindMode !== "none") {
      body.style.filter = `url(#hansen-${state.colorBlindMode})` + (state.darkMode ? " invert(1) hue-rotate(180deg)" : "");
    }

    return () => {
      root.style.fontSize = "";
      body.style.lineHeight = "";
      body.style.letterSpacing = "";
      body.style.wordSpacing = "";
      body.style.filter = "";
    };
  }, [state]);

  // Listen for voice assistant accessibility commands
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const { command, value } = detail;
      if (command === "fontSize") updateState("fontSize", value);
      if (command === "highContrast") updateState("highContrast", value);
      if (command === "dyslexiaFont") updateState("dyslexiaFont", value);
      if (command === "stopAnimations") updateState("stopAnimations", value);
      if (command === "readingGuide") updateState("readingGuide", value);
      if (command === "font_increase") updateState("fontSize", Math.min(4, state.fontSize + 1));
      if (command === "font_decrease") updateState("fontSize", Math.max(-2, state.fontSize - 1));
      if (command === "contrast") updateState("highContrast", !state.highContrast);
      if (command === "dyslexia_font") updateState("dyslexiaFont", !state.dyslexiaFont);
      if (command === "stop_animations") updateState("stopAnimations", !state.stopAnimations);
      if (command === "screen_reader") updateState("screenReader", !state.screenReader);
      if (command === "highlight_links") updateState("linkHighlight", !state.linkHighlight);
      if (command === "reading_guide") updateState("readingGuide", !state.readingGuide);
      if (command === "keyboard_nav") updateState("keyboardNav", !state.keyboardNav);
      if (command === "dark_mode") updateState("darkMode", !state.darkMode);
      if (command === "hide_images") updateState("hideImages", !state.hideImages);
      if (command === "reset") resetAll();
    };
    window.addEventListener("hansen-accessibility-command", handler);
    return () => window.removeEventListener("hansen-accessibility-command", handler);
  }, [state]);

  // Voice commands
  useEffect(() => {
    if (!state.voiceCommands) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const t = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      if (t.includes("increase font") || t.includes("bigger text") || t.includes("make text bigger")) updateState("fontSize", Math.min(4, state.fontSize + 1));
      else if (t.includes("decrease font") || t.includes("smaller text")) updateState("fontSize", Math.max(-2, state.fontSize - 1));
      else if (t.includes("high contrast") || t.includes("contrast mode")) updateState("highContrast", !state.highContrast);
      else if (t.includes("dyslexia")) updateState("dyslexiaFont", !state.dyslexiaFont);
      else if (t.includes("stop animation") || t.includes("reduce motion")) updateState("stopAnimations", !state.stopAnimations);
      else if (t.includes("reading guide")) updateState("readingGuide", !state.readingGuide);
      else if (t.includes("highlight link")) updateState("linkHighlight", !state.linkHighlight);
      else if (t.includes("dark mode") || t.includes("night mode")) updateState("darkMode", !state.darkMode);
      else if (t.includes("hide image")) updateState("hideImages", !state.hideImages);
      else if (t.includes("read the page") || t.includes("screen reader")) updateState("screenReader", !state.screenReader);
      else if (t.includes("reset")) resetAll();
    };
    recognition.onerror = () => {};
    try { recognition.start(); } catch {}
    return () => { try { recognition.stop(); } catch {} };
  }, [state.voiceCommands, state]);

  // Screen reader announcer
  useEffect(() => {
    if (!state.screenReader) return;
    if (!document.getElementById("hansen-sr-announcer")) {
      const el = document.createElement("div");
      el.id = "hansen-sr-announcer";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      el.className = "sr-only";
      document.body.appendChild(el);
    }
    return () => { document.getElementById("hansen-sr-announcer")?.remove(); };
  }, [state.screenReader]);

  // Dictionary lookup (double-click word)
  useEffect(() => {
    if (!state.dictionary) return;
    const handler = () => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selection.split(" ").length === 1) {
        window.open(`https://en.wiktionary.org/wiki/${encodeURIComponent(selection)}`, "_blank", "width=600,height=400");
      }
    };
    document.addEventListener("dblclick", handler);
    return () => document.removeEventListener("dblclick", handler);
  }, [state.dictionary]);

  const updateState = useCallback(<K extends keyof AccessibilityState>(key: K, value: AccessibilityState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => { setState(DEFAULT_STATE); }, []);

  const activeCount = Object.entries(state).filter(([key, val]) => {
    if (key === "fontSize" || key === "lineSpacing" || key === "letterSpacing" || key === "wordSpacing") return val !== 0;
    if (key === "saturation") return val !== 0;
    if (key === "colorBlindMode") return val !== "none";
    return val === true;
  }).length;

  return (
    <>
      {/* SVG Filters for Color Blindness */}
      <ColorBlindFilters />

      {/* Trigger Button — Liquid Glass Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[2147483646] w-14 h-14 rounded-2xl flex items-center justify-center group transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
          backdropFilter: "blur(20px) saturate(1.8)",
          WebkitBackdropFilter: "blur(20px) saturate(1.8)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(99,102,241,0.1)",
        }}
        aria-label={`Accessibility settings${activeCount > 0 ? ` (${activeCount} active)` : ""}`}
        aria-expanded={isOpen}
      >
        <Accessibility className="w-6 h-6 text-indigo-600 drop-shadow-sm" />
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #6366F1, #EC4899)", boxShadow: "0 2px 8px rgba(99,102,241,0.4)" }}>
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[2147483646] transition-opacity duration-300"
          style={{ background: "rgba(15,23,42,0.2)", backdropFilter: "blur(2px)" }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Panel — Liquid Glass */}
      <div
        className={`fixed top-0 right-0 z-[2147483647] h-full w-full md:w-[380px] transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.92) 100%)",
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          borderLeft: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "-20px 0 80px rgba(99,102,241,0.08), -4px 0 20px rgba(0,0,0,0.05)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility & Product Panel"
      >
        {/* Header — Glass */}
        <div className="p-5" style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}>
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Hansen</h2>
                <p className="text-[11px] text-slate-500">Accessibility & Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}
              aria-label="Close panel"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Tab Switcher — Glass pills */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.08)" }}>
            <button
              onClick={() => setActiveTab("accessibility")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${activeTab === "accessibility" ? "text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              style={activeTab === "accessibility" ? { background: "rgba(255,255,255,0.9)", border: "1px solid rgba(99,102,241,0.15)" } : {}}
            >
              <Accessibility className="w-3.5 h-3.5 inline mr-1.5" />Accessibility
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${activeTab === "product" ? "text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              style={activeTab === "product" ? { background: "rgba(255,255,255,0.9)", border: "1px solid rgba(99,102,241,0.15)" } : {}}
            >
              <Info className="w-3.5 h-3.5 inline mr-1.5" />Product & Contact
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-160px)] p-5 space-y-4">
          {activeTab === "accessibility" ? (
            <AccessibilityControls state={state} updateState={updateState} resetAll={resetAll} />
          ) : (
            <ProductContactPanel />
          )}
        </div>
      </div>

      {/* Overlays */}
      {state.readingGuide && <ReadingGuide />}
      {state.readingMask && <ReadingMask />}
      {state.pageStructure && <PageStructureNav onClose={() => updateState("pageStructure", false)} />}
      <AccessibilityStyles />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACCESSIBILITY CONTROLS TAB
   ═══════════════════════════════════════════════════════════════ */

function AccessibilityControls({ state, updateState, resetAll }: {
  state: AccessibilityState;
  updateState: <K extends keyof AccessibilityState>(key: K, value: AccessibilityState[K]) => void;
  resetAll: () => void;
}) {
  return (
    <>
      {/* GROUP 1: Visual */}
      <GlassGroup title="Visual" icon={<Eye className="w-4 h-4 text-indigo-500" />}>
        {/* Font Size */}
        <SliderControl
          icon={<Type className="w-4 h-4 text-slate-500" />}
          label="Font Size"
          value={state.fontSize}
          min={-2} max={4}
          display={state.fontSize > 0 ? `+${state.fontSize * 12.5}%` : state.fontSize < 0 ? `${state.fontSize * 12.5}%` : "Default"}
          onDecrease={() => updateState("fontSize", Math.max(-2, state.fontSize - 1))}
          onIncrease={() => updateState("fontSize", Math.min(4, state.fontSize + 1))}
        />
        {/* Line Spacing */}
        <SliderControl
          icon={<ArrowUpDown className="w-4 h-4 text-slate-500" />}
          label="Line Spacing"
          value={state.lineSpacing}
          min={0} max={3}
          display={state.lineSpacing === 0 ? "Default" : `+${state.lineSpacing * 25}%`}
          onDecrease={() => updateState("lineSpacing", Math.max(0, state.lineSpacing - 1))}
          onIncrease={() => updateState("lineSpacing", Math.min(3, state.lineSpacing + 1))}
        />
        {/* Letter Spacing */}
        <SliderControl
          icon={<Type className="w-4 h-4 text-slate-500" />}
          label="Letter Spacing"
          value={state.letterSpacing}
          min={0} max={4}
          display={state.letterSpacing === 0 ? "Default" : `+${state.letterSpacing}`}
          onDecrease={() => updateState("letterSpacing", Math.max(0, state.letterSpacing - 1))}
          onIncrease={() => updateState("letterSpacing", Math.min(4, state.letterSpacing + 1))}
        />
        {/* Word Spacing */}
        <SliderControl
          icon={<Type className="w-4 h-4 text-slate-500" />}
          label="Word Spacing"
          value={state.wordSpacing}
          min={0} max={4}
          display={state.wordSpacing === 0 ? "Default" : `+${state.wordSpacing}`}
          onDecrease={() => updateState("wordSpacing", Math.max(0, state.wordSpacing - 1))}
          onIncrease={() => updateState("wordSpacing", Math.min(4, state.wordSpacing + 1))}
        />
        <GlassToggle icon={<Contrast className="w-4 h-4" />} label="High Contrast" desc="Increase text & UI contrast" checked={state.highContrast} onChange={(v) => updateState("highContrast", v)} />
        <GlassToggle icon={<Moon className="w-4 h-4" />} label="Dark Mode" desc="Invert colors for dark viewing" checked={state.darkMode} onChange={(v) => updateState("darkMode", v)} />
        <GlassToggle icon={<Type className="w-4 h-4" />} label="Dyslexia Font" desc="OpenDyslexic typeface" checked={state.dyslexiaFont} onChange={(v) => updateState("dyslexiaFont", v)} />
        <GlassToggle icon={<ImageOff className="w-4 h-4" />} label="Hide Images" desc="Remove visual distractions" checked={state.hideImages} onChange={(v) => updateState("hideImages", v)} />

        {/* Saturation Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-700">Saturation</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-600 px-2 py-0.5 rounded-md" style={{ background: "rgba(99,102,241,0.06)" }}>
              {state.saturation === -1 ? "Grayscale" : state.saturation === 0 ? "Normal" : `+${state.saturation * 50}%`}
            </span>
          </div>
          <input
            type="range"
            min="-1"
            max="2"
            step="1"
            value={state.saturation}
            onChange={(e) => updateState("saturation", parseInt(e.target.value) as any)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(90deg, #94a3b8, #6366F1 ${((state.saturation + 1) / 3) * 100}%, rgba(0,0,0,0.06) ${((state.saturation + 1) / 3) * 100}%)` }}
            aria-label="Saturation level"
          />
        </div>

        {/* Color Blind Mode */}
        <div className="pt-1">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-700">Color Vision</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { v: "none", l: "Normal" },
              { v: "protanopia", l: "Protanopia" },
              { v: "deuteranopia", l: "Deuteranopia" },
              { v: "tritanopia", l: "Tritanopia" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => updateState("colorBlindMode", opt.v)}
                className={`text-[10px] px-2 py-1.5 rounded-lg transition-all ${state.colorBlindMode === opt.v ? "text-indigo-700 font-semibold" : "text-slate-500 hover:text-slate-700"}`}
                style={state.colorBlindMode === opt.v ? { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" } : { background: "rgba(0,0,0,0.03)", border: "1px solid transparent" }}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      </GlassGroup>

      {/* GROUP 2: Navigation */}
      <GlassGroup title="Navigation" icon={<Keyboard className="w-4 h-4 text-indigo-500" />}>
        <GlassToggle icon={<Keyboard className="w-4 h-4" />} label="Keyboard Navigation" desc="Enhanced keyboard controls" checked={state.keyboardNav} onChange={(v) => updateState("keyboardNav", v)} />
        <GlassToggle icon={<MousePointer className="w-4 h-4" />} label="Focus Indicators" desc="Visible focus rings on all elements" checked={state.focusIndicators} onChange={(v) => updateState("focusIndicators", v)} />
        <GlassToggle icon={<MousePointer className="w-4 h-4" />} label="Large Pointer" desc="Increase cursor visibility" checked={state.largePointer} onChange={(v) => updateState("largePointer", v)} />
        <GlassToggle icon={<Pause className="w-4 h-4" />} label="Stop Animations" desc="Disable all motion" checked={state.stopAnimations} onChange={(v) => updateState("stopAnimations", v)} />
        <GlassToggle icon={<Layers className="w-4 h-4" />} label="Page Structure" desc="View headings & landmarks outline" checked={state.pageStructure} onChange={(v) => updateState("pageStructure", v)} />
        <GlassToggle icon={<Navigation className="w-4 h-4" />} label="Tooltips on Hover" desc="Show element descriptions" checked={state.tooltipsOnHover} onChange={(v) => updateState("tooltipsOnHover", v)} />
      </GlassGroup>

      {/* GROUP 3: Reading & Content */}
      <GlassGroup title="Reading & Content" icon={<BookOpen className="w-4 h-4 text-indigo-500" />}>
        <GlassToggle icon={<Volume2 className="w-4 h-4" />} label="Screen Reader / TTS" desc="Text-to-speech for page content" checked={state.screenReader} onChange={(v) => updateState("screenReader", v)} />
        <GlassToggle icon={<BookOpen className="w-4 h-4" />} label="Reading Guide" desc="Highlight current reading line" checked={state.readingGuide} onChange={(v) => updateState("readingGuide", v)} />
        <GlassToggle icon={<Eye className="w-4 h-4" />} label="Reading Mask" desc="Focus on one paragraph at a time" checked={state.readingMask} onChange={(v) => updateState("readingMask", v)} />
        <GlassToggle icon={<Link2 className="w-4 h-4" />} label="Highlight Links" desc="Make all links visually distinct" checked={state.linkHighlight} onChange={(v) => updateState("linkHighlight", v)} />
        <GlassToggle icon={<Search className="w-4 h-4" />} label="Dictionary Lookup" desc="Double-click any word for definition" checked={state.dictionary} onChange={(v) => updateState("dictionary", v)} />
        <GlassToggle icon={<ZoomIn className="w-4 h-4" />} label="Content Magnifier" desc="Enlarge text on hover" checked={state.contentMagnifier} onChange={(v) => updateState("contentMagnifier", v)} />
      </GlassGroup>

      {/* GROUP 4: Voice & Advanced */}
      <GlassGroup title="Voice & Advanced" icon={<Mic className="w-4 h-4 text-indigo-500" />}>
        <GlassToggle icon={<Mic className="w-4 h-4" />} label="Voice Commands" desc="Control with your voice" checked={state.voiceCommands} onChange={(v) => updateState("voiceCommands", v)} />
        {state.voiceCommands && (
          <div className="rounded-lg p-3 mt-1" style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)" }}>
            <p className="text-[10px] text-indigo-700 font-medium mb-1.5">Available voice commands:</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] text-indigo-600">
              <span>"Bigger text"</span>
              <span>"Smaller text"</span>
              <span>"High contrast"</span>
              <span>"Dark mode"</span>
              <span>"Dyslexia font"</span>
              <span>"Stop animations"</span>
              <span>"Reading guide"</span>
              <span>"Hide images"</span>
              <span>"Highlight links"</span>
              <span>"Read the page"</span>
              <span>"Reset all"</span>
            </div>
          </div>
        )}
      </GlassGroup>

      {/* Reset */}
      <button
        onClick={resetAll}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-all hover:scale-[0.98] active:scale-95"
        style={{
          color: "#DC2626",
          background: "rgba(220,38,38,0.04)",
          border: "1px solid rgba(220,38,38,0.15)",
        }}
      >
        <RotateCcw className="w-4 h-4" />
        Reset All Settings
      </button>

      {/* Accessibility Statement Link */}
      <a
        href="/accessibility"
        className="block text-center text-xs text-indigo-600 hover:text-indigo-700 py-2 rounded-lg transition-colors"
        style={{ background: "rgba(99,102,241,0.03)" }}
      >
        View our WCAG 2.2 AAA Accessibility Statement →
      </a>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT & CONTACT TAB
   ═══════════════════════════════════════════════════════════════ */

function ProductContactPanel() {
  return (
    <>
      {/* Product Tour */}
      <GlassGroup title="Product Tour" icon={<Sparkles className="w-4 h-4 text-indigo-500" />} defaultOpen>
        <div className="space-y-2">
          {[
            { icon: <MessageCircle className="w-4 h-4" />, title: "AI Chat Widget", desc: "RAG-powered conversations embedded anywhere", href: "/demo" },
            { icon: <Accessibility className="w-4 h-4" />, title: "Accessibility Overlay", desc: "WCAG 2.2 AAA compliance for every visitor", href: "/accessibility" },
            { icon: <Mic className="w-4 h-4" />, title: "Voice Assistant", desc: "Hands-free navigation and voice commands", href: "/demo" },
            { icon: <Eye className="w-4 h-4" />, title: "Color Vision Support", desc: "Protanopia, Deuteranopia & Tritanopia modes", href: "#" },
            { icon: <Layers className="w-4 h-4" />, title: "White-Label Themes", desc: "Liquid Glass, Warm Neutral, Aurora Soft", href: "/demo" },
          ].map((item, i) => (
            <a key={i} href={item.href} className="flex items-start gap-3 p-2.5 rounded-xl transition-all hover:scale-[0.99]" style={{ background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.06)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-600" style={{ background: "rgba(99,102,241,0.08)" }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </GlassGroup>

      {/* Pricing Plans */}
      <GlassGroup title="Pricing Plans" icon={<CreditCard className="w-4 h-4 text-indigo-500" />} defaultOpen>
        <div className="space-y-2">
          <div className="p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-700">Free — Forever</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">$0/mo</span>
            </div>
            <p className="text-[10px] text-slate-600">1 widget, 500 conversations/mo, full accessibility overlay</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-700">Pro</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">$29/mo</span>
            </div>
            <p className="text-[10px] text-slate-600">Unlimited widgets, 10K conversations, voice assistant, analytics</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.12)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-purple-700">Enterprise</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">Custom</span>
            </div>
            <p className="text-[10px] text-slate-600">On-premise hosting, custom AI models, SLA, dedicated support</p>
          </div>
          <a href="/pricing" className="block text-center text-[11px] text-indigo-600 hover:text-indigo-700 font-medium pt-1">
            View full pricing comparison →
          </a>
        </div>
      </GlassGroup>

      {/* Contact Us */}
      <GlassGroup title="Contact Us" icon={<MessageCircle className="w-4 h-4 text-indigo-500" />} defaultOpen>
        <div className="space-y-2">
          <a href="https://wa.me/447700000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[0.99]" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)" }}>
              <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700">WhatsApp</p>
              <p className="text-[10px] text-slate-500">Chat with our team instantly</p>
            </div>
          </a>
          <a href="tel:+442071234567" className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[0.99]" style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
              <Phone className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-700">Call Us</p>
              <p className="text-[10px] text-slate-500">+44 207 123 4567 • Mon–Fri, 9am–5pm GMT</p>
            </div>
          </a>
          <a href="mailto:support@askmarilyn.ai" className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[0.99]" style={{ background: "rgba(236,72,153,0.04)", border: "1px solid rgba(236,72,153,0.12)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(236,72,153,0.1)" }}>
              <Mail className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-pink-700">Email</p>
              <p className="text-[10px] text-slate-500">support@askmarilyn.ai</p>
            </div>
          </a>
        </div>
      </GlassGroup>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GLASS UI COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function GlassGroup({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(99,102,241,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 transition-colors"
        aria-expanded={expanded}
        style={{ minHeight: "44px" }}
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="text-sm font-semibold text-slate-800">{title}</span>
        </div>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
      </button>
      {expanded && <div className="px-3.5 pb-3.5 space-y-3">{children}</div>}
    </div>
  );
}

function GlassToggle({ icon, label, desc, checked, onChange }: { icon: React.ReactNode; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span className="text-slate-500">{icon}</span>
        <div className="min-w-0">
          <span className="text-xs font-medium text-slate-700 block">{label}</span>
          <span className="text-[10px] text-slate-400 block truncate">{desc}</span>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
        style={{
          background: checked
            ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
            : "rgba(0,0,0,0.08)",
          boxShadow: checked ? "0 2px 8px rgba(99,102,241,0.3)" : "inset 0 1px 2px rgba(0,0,0,0.1)",
        }}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SliderControl({ icon, label, value, min, max, display, onDecrease, onIncrease }: {
  icon: React.ReactNode; label: string; value: number; min: number; max: number; display: string; onDecrease: () => void; onIncrease: () => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-indigo-600 px-2 py-0.5 rounded-md" style={{ background: "rgba(99,102,241,0.06)" }}>
          {display}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDecrease} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }} aria-label={`Decrease ${label}`}>
          <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
        </button>
        <div className="flex-1 h-1.5 rounded-full relative" style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="absolute top-0 left-0 h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #6366F1, #8B5CF6)" }} />
        </div>
        <button onClick={onIncrease} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }} aria-label={`Increase ${label}`}>
          <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE STRUCTURE NAVIGATOR
   ═══════════════════════════════════════════════════════════════ */

function PageStructureNav({ onClose }: { onClose: () => void }) {
  const [headings, setHeadings] = useState<{ level: number; text: string; el: HTMLElement }[]>([]);

  useEffect(() => {
    const els = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const items: { level: number; text: string; el: HTMLElement }[] = [];
    els.forEach((el) => {
      const level = parseInt(el.tagName[1]);
      const text = el.textContent?.trim() || "";
      if (text && !el.closest("[role='dialog']")) {
        items.push({ level, text, el: el as HTMLElement });
      }
    });
    setHeadings(items);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-[2147483645] w-72 max-h-[60vh] overflow-y-auto rounded-2xl p-4 shadow-xl"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,0.15)",
      }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-800">Page Structure</h3>
        <button onClick={onClose} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-100">
          <X className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
      <div className="space-y-0.5">
        {headings.length === 0 && <p className="text-[10px] text-slate-400">No headings found on this page.</p>}
        {headings.map((h, i) => (
          <button
            key={i}
            onClick={() => h.el.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="w-full text-left text-[11px] py-1.5 px-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors truncate"
            style={{ paddingLeft: `${(h.level - 1) * 12 + 8}px` }}
          >
            <span className="text-[9px] font-mono text-indigo-400 mr-1.5">H{h.level}</span>
            {h.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   READING OVERLAYS
   ═══════════════════════════════════════════════════════════════ */

function ReadingGuide() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = (e: MouseEvent) => setY(e.clientY);
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);
  return (
    <div className="fixed inset-0 z-[2147483645] pointer-events-none" aria-hidden="true"
      style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.4) ${y - 24}px, transparent ${y - 24}px, transparent ${y + 24}px, rgba(0,0,0,0.4) ${y + 24}px)` }} />
  );
}

function ReadingMask() {
  const [rect, setRect] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const p = el.closest("p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote, span");
        if (p) {
          const r = p.getBoundingClientRect();
          setRect({ top: r.top, height: r.height });
        }
      }
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  if (!rect) return null;
  return (
    <div className="fixed inset-0 z-[2147483645] pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
      <div className="absolute left-0 right-0" style={{ top: `${rect.top - 4}px`, height: `${rect.height + 8}px`, background: "transparent", boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLOR BLIND SVG FILTERS
   ═══════════════════════════════════════════════════════════════ */

function ColorBlindFilters() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter id="hansen-protanopia">
          <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
        </filter>
        <filter id="hansen-deuteranopia">
          <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
        </filter>
        <filter id="hansen-tritanopia">
          <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
        </filter>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GLOBAL ACCESSIBILITY STYLES
   ═══════════════════════════════════════════════════════════════ */

function AccessibilityStyles() {
  return (
    <style>{`
      .hansen-high-contrast * { border-color: #000 !important; }
      .hansen-high-contrast body { background: #fff !important; color: #000 !important; }
      .hansen-high-contrast p, .hansen-high-contrast span, .hansen-high-contrast h1, .hansen-high-contrast h2, .hansen-high-contrast h3, .hansen-high-contrast h4, .hansen-high-contrast h5, .hansen-high-contrast h6, .hansen-high-contrast li, .hansen-high-contrast td, .hansen-high-contrast th, .hansen-high-contrast label { color: #000 !important; }
      .hansen-high-contrast a { color: #0000EE !important; text-decoration: underline !important; }
      .hansen-high-contrast button, .hansen-high-contrast [role="button"] { border: 2px solid #000 !important; }

      @font-face { font-family: 'OpenDyslexic'; src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff'); font-weight: normal; }
      @font-face { font-family: 'OpenDyslexic'; src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Bold.woff') format('woff'); font-weight: bold; }
      .hansen-dyslexia-font * { font-family: 'OpenDyslexic', sans-serif !important; letter-spacing: 0.05em !important; word-spacing: 0.1em !important; }

      .hansen-stop-animations *, .hansen-stop-animations *::before, .hansen-stop-animations *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; transition-delay: 0s !important; scroll-behavior: auto !important; }

      .hansen-keyboard-nav *:focus { outline: 3px solid #6366F1 !important; outline-offset: 2px !important; }
      .hansen-focus-indicators *:focus-visible { outline: 3px solid #6366F1 !important; outline-offset: 3px !important; box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.2) !important; }

      .hansen-link-highlight a { background-color: #fef08a !important; color: #1e40af !important; text-decoration: underline !important; padding: 2px 4px !important; border-radius: 2px !important; }

      .hansen-large-pointer, .hansen-large-pointer * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M4 4l20 8-8 4-4 8z' fill='%23000' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E") 4 4, auto !important; }

      .hansen-dark-mode img:not([role="presentation"]) { filter: brightness(0.8) !important; }

      .hansen-hide-images img, .hansen-hide-images picture, .hansen-hide-images svg:not([class*="lucide"]):not([aria-hidden]) { opacity: 0.05 !important; }

      .hansen-tooltips [title]:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        background: #1e293b;
        color: #fff;
        font-size: 11px;
        border-radius: 6px;
        white-space: nowrap;
        z-index: 99999;
        pointer-events: none;
      }
      .hansen-tooltips [aria-label]:not([title]):hover::after {
        content: attr(aria-label);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        background: #1e293b;
        color: #fff;
        font-size: 11px;
        border-radius: 6px;
        white-space: nowrap;
        z-index: 99999;
        pointer-events: none;
      }
      .hansen-tooltips img[alt]:hover::after {
        content: attr(alt);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        background: #1e293b;
        color: #fff;
        font-size: 11px;
        border-radius: 6px;
        white-space: nowrap;
        z-index: 99999;
        pointer-events: none;
      }
      .hansen-tooltips [title], .hansen-tooltips [aria-label], .hansen-tooltips img[alt] { position: relative; }

      .hansen-magnifier p:hover, .hansen-magnifier li:hover, .hansen-magnifier span:hover, .hansen-magnifier td:hover {
        transform: scale(1.15) !important;
        transform-origin: left center !important;
        transition: transform 0.15s ease-out !important;
        position: relative !important;
        z-index: 10 !important;
        background: rgba(255,255,255,0.95) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        border-radius: 4px !important;
        padding: 2px 4px !important;
      }

      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }

      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }

      .hansen-skip-link { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); z-index: 2147483647; padding: 12px 24px; background: #6366F1; color: #fff; font-size: 14px; font-weight: 600; border-radius: 0 0 8px 8px; text-decoration: none; transition: top 0.2s; }
      .hansen-skip-link:focus { top: 0; outline: 3px solid #fbbf24; outline-offset: 2px; }
    `}</style>
  );
}
