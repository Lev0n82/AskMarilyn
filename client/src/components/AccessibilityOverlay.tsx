import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";

interface AccessibilityState {
  fontSize: number;
  lineSpacing: number;
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
}

const DEFAULT_STATE: AccessibilityState = {
  fontSize: 0,
  lineSpacing: 0,
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
};

const STORAGE_KEY = "hansen-accessibility-settings";

export default function AccessibilityOverlay() {
  const [isOpen, setIsOpen] = useState(false);
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

    return () => {
      root.style.fontSize = "";
      body.style.lineHeight = "";
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
      if (t.includes("increase font") || t.includes("bigger text")) updateState("fontSize", Math.min(4, state.fontSize + 1));
      else if (t.includes("decrease font") || t.includes("smaller text")) updateState("fontSize", Math.max(-2, state.fontSize - 1));
      else if (t.includes("high contrast") || t.includes("contrast mode")) updateState("highContrast", !state.highContrast);
      else if (t.includes("dyslexia")) updateState("dyslexiaFont", !state.dyslexiaFont);
      else if (t.includes("stop animation") || t.includes("reduce motion")) updateState("stopAnimations", !state.stopAnimations);
      else if (t.includes("reading guide")) updateState("readingGuide", !state.readingGuide);
      else if (t.includes("highlight link")) updateState("linkHighlight", !state.linkHighlight);
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

  const updateState = useCallback(<K extends keyof AccessibilityState>(key: K, value: AccessibilityState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => { setState(DEFAULT_STATE); }, []);

  const activeCount = Object.entries(state).filter(([key, val]) => {
    if (key === "fontSize" || key === "lineSpacing") return val !== 0;
    return val === true;
  }).length;

  return (
    <>
      {/* Trigger Button — ♿ icon, 48x48px, fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[2147483646] w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label={`Accessibility settings${activeCount > 0 ? ` (${activeCount} active)` : ""}`}
        aria-expanded={isOpen}
        style={{ minWidth: "48px", minHeight: "48px" }}
      >
        <Accessibility className="w-6 h-6" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[2147483646] bg-black/20 backdrop-blur-sm md:bg-black/10 md:backdrop-blur-none"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Panel — 320px desktop, full-width mobile */}
      <div
        className={`fixed top-0 right-0 z-[2147483647] h-full w-full md:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility Settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Accessibility className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Accessibility</h2>
              <p className="text-xs text-gray-500">Customize your experience</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close accessibility panel"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Controls */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-5 space-y-6">
          {/* GROUP 1: Visual */}
          <ControlGroup title="Visual" icon={<Eye className="w-4 h-4" />}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Font Size</span>
                </div>
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {state.fontSize > 0 ? `+${state.fontSize * 12.5}%` : state.fontSize < 0 ? `${state.fontSize * 12.5}%` : "Default"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateState("fontSize", Math.max(-2, state.fontSize - 1))} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" aria-label="Decrease font size" style={{ minWidth: "44px", minHeight: "44px" }}>
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 h-2 bg-gray-100 rounded-full relative">
                  <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((state.fontSize + 2) / 6) * 100}%` }} />
                </div>
                <button onClick={() => updateState("fontSize", Math.min(4, state.fontSize + 1))} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" aria-label="Increase font size" style={{ minWidth: "44px", minHeight: "44px" }}>
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Line Spacing</span>
                </div>
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {state.lineSpacing === 0 ? "Default" : `+${state.lineSpacing * 25}%`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateState("lineSpacing", Math.max(0, state.lineSpacing - 1))} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" aria-label="Decrease line spacing" style={{ minWidth: "44px", minHeight: "44px" }}>
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 h-2 bg-gray-100 rounded-full relative">
                  <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(state.lineSpacing / 3) * 100}%` }} />
                </div>
                <button onClick={() => updateState("lineSpacing", Math.min(3, state.lineSpacing + 1))} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" aria-label="Increase line spacing" style={{ minWidth: "44px", minHeight: "44px" }}>
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
            <PillToggle icon={<Contrast className="w-4 h-4 text-gray-500" />} label="High Contrast" description="Increase text and UI contrast" checked={state.highContrast} onChange={(v) => updateState("highContrast", v)} />
            <PillToggle icon={<Type className="w-4 h-4 text-gray-500" />} label="Dyslexia Font" description="Use OpenDyslexic typeface" checked={state.dyslexiaFont} onChange={(v) => updateState("dyslexiaFont", v)} />
          </ControlGroup>

          {/* GROUP 2: Navigation */}
          <ControlGroup title="Navigation" icon={<Keyboard className="w-4 h-4" />}>
            <PillToggle icon={<Keyboard className="w-4 h-4 text-gray-500" />} label="Keyboard Navigation" description="Enhanced keyboard controls" checked={state.keyboardNav} onChange={(v) => updateState("keyboardNav", v)} />
            <PillToggle icon={<MousePointer className="w-4 h-4 text-gray-500" />} label="Focus Indicators" description="Visible focus rings on all elements" checked={state.focusIndicators} onChange={(v) => updateState("focusIndicators", v)} />
            <PillToggle icon={<MousePointer className="w-4 h-4 text-gray-500" />} label="Large Pointer" description="Increase cursor visibility" checked={state.largePointer} onChange={(v) => updateState("largePointer", v)} />
            <PillToggle icon={<Pause className="w-4 h-4 text-gray-500" />} label="Stop Animations" description="Disable all motion and transitions" checked={state.stopAnimations} onChange={(v) => updateState("stopAnimations", v)} />
          </ControlGroup>

          {/* GROUP 3: Content */}
          <ControlGroup title="Content" icon={<BookOpen className="w-4 h-4" />}>
            <PillToggle icon={<Volume2 className="w-4 h-4 text-gray-500" />} label="Screen Reader / TTS" description="Text-to-speech for page content" checked={state.screenReader} onChange={(v) => updateState("screenReader", v)} />
            <PillToggle icon={<BookOpen className="w-4 h-4 text-gray-500" />} label="Reading Guide" description="Highlight current reading line" checked={state.readingGuide} onChange={(v) => updateState("readingGuide", v)} />
            <PillToggle icon={<Link2 className="w-4 h-4 text-gray-500" />} label="Highlight Links" description="Make all links visually distinct" checked={state.linkHighlight} onChange={(v) => updateState("linkHighlight", v)} />
          </ControlGroup>

          {/* GROUP 4: Advanced */}
          <ControlGroup title="Advanced" icon={<Mic className="w-4 h-4" />}>
            <PillToggle icon={<Mic className="w-4 h-4 text-gray-500" />} label="Voice Commands" description={`Say "increase font" or "high contrast"`} checked={state.voiceCommands} onChange={(v) => updateState("voiceCommands", v)} />
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2">
              <p className="text-xs text-blue-700 font-medium mb-1">Available voice commands:</p>
              <ul className="text-xs text-blue-600 space-y-0.5">
                <li>&quot;Increase font&quot; / &quot;Bigger text&quot;</li>
                <li>&quot;Decrease font&quot; / &quot;Smaller text&quot;</li>
                <li>&quot;High contrast&quot; / &quot;Contrast mode&quot;</li>
                <li>&quot;Dyslexia font&quot;</li>
                <li>&quot;Stop animations&quot; / &quot;Reduce motion&quot;</li>
                <li>&quot;Reading guide&quot;</li>
                <li>&quot;Highlight links&quot;</li>
                <li>&quot;Reset all&quot;</li>
              </ul>
            </div>
          </ControlGroup>

          {/* Reset All */}
          <button onClick={resetAll} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-colors" style={{ minHeight: "44px" }}>
            <RotateCcw className="w-4 h-4" />
            Reset All Settings
          </button>

          {/* Accessibility Page Link */}
          <a href="/accessibility" className="block text-center text-sm text-blue-600 hover:text-blue-700 underline py-2">
            View our Accessibility Statement
          </a>
        </div>
      </div>

      {/* Reading Guide Overlay */}
      {state.readingGuide && <ReadingGuide />}
      <AccessibilityStyles />
    </>
  );
}

function ControlGroup({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors" aria-expanded={expanded} style={{ minHeight: "44px" }}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>
      {expanded && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
  );
}

function PillToggle({ icon, label, description, checked, onChange }: { icon: React.ReactNode; label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {icon}
        <div className="min-w-0">
          <span className="text-sm font-medium text-gray-700 block">{label}</span>
          <span className="text-xs text-gray-400 block truncate">{description}</span>
        </div>
      </div>
      <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-blue-600" : "bg-gray-200"}`} role="switch" aria-checked={checked} aria-label={label} style={{ minWidth: "44px", minHeight: "24px" }}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function ReadingGuide() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = (e: MouseEvent) => setY(e.clientY);
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);
  return (
    <div className="fixed inset-0 z-[2147483645] pointer-events-none" aria-hidden="true" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.4) ${y - 24}px, transparent ${y - 24}px, transparent ${y + 24}px, rgba(0,0,0,0.4) ${y + 24}px)` }} />
  );
}

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
      .hansen-keyboard-nav *:focus { outline: 3px solid #2563eb !important; outline-offset: 2px !important; }
      .hansen-focus-indicators *:focus-visible { outline: 3px solid #dc2626 !important; outline-offset: 3px !important; box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.2) !important; }
      .hansen-link-highlight a { background-color: #fef08a !important; color: #1e40af !important; text-decoration: underline !important; padding: 2px 4px !important; border-radius: 2px !important; }
      .hansen-large-pointer, .hansen-large-pointer * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M4 4l20 8-8 4-4 8z' fill='%23000' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E") 4 4, auto !important; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
      .hansen-skip-link { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); z-index: 2147483647; padding: 12px 24px; background: #1e40af; color: #fff; font-size: 14px; font-weight: 600; border-radius: 0 0 8px 8px; text-decoration: none; transition: top 0.2s; }
      .hansen-skip-link:focus { top: 0; outline: 3px solid #fbbf24; outline-offset: 2px; }
    `}</style>
  );
}
