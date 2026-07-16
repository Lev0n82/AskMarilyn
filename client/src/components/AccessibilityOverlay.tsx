import { useState } from "react";
import {
  Accessibility,
  X,
  ZoomIn,
  ZoomOut,
  Contrast,
  Type,
  MousePointer,
  Keyboard,
  BookOpen,
  Link2,
  Volume2,
  Pause,
} from "lucide-react";

interface AccessibilityState {
  fontSize: number; // 0 = normal, -2 to +4
  highContrast: boolean;
  dyslexiaFont: boolean;
  stopAnimations: boolean;
  keyboardNav: boolean;
  readingGuide: boolean;
  linkHighlight: boolean;
  screenReader: boolean;
}

export default function AccessibilityOverlay() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>({
    fontSize: 0,
    highContrast: false,
    dyslexiaFont: false,
    stopAnimations: false,
    keyboardNav: false,
    readingGuide: false,
    linkHighlight: false,
    screenReader: false,
  });

  const applyStyles = (newState: AccessibilityState) => {
    const root = document.documentElement;

    // Font size
    const baseSize = 16 + newState.fontSize * 2;
    root.style.fontSize = `${baseSize}px`;

    // High contrast
    if (newState.highContrast) {
      root.style.filter = "contrast(1.5)";
    } else {
      root.style.filter = "";
    }

    // Dyslexia font
    if (newState.dyslexiaFont) {
      root.style.fontFamily = "OpenDyslexic, Comic Sans MS, sans-serif";
    } else {
      root.style.fontFamily = "";
    }

    // Stop animations
    if (newState.stopAnimations) {
      const style = document.getElementById("a11y-stop-animations");
      if (!style) {
        const s = document.createElement("style");
        s.id = "a11y-stop-animations";
        s.textContent = "*, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; transition-delay: 0s !important; }";
        document.head.appendChild(s);
      }
    } else {
      document.getElementById("a11y-stop-animations")?.remove();
    }

    // Link highlighting
    if (newState.linkHighlight) {
      const style = document.getElementById("a11y-link-highlight");
      if (!style) {
        const s = document.createElement("style");
        s.id = "a11y-link-highlight";
        s.textContent = "a { outline: 2px solid #f59e0b !important; outline-offset: 2px !important; text-decoration: underline !important; }";
        document.head.appendChild(s);
      }
    } else {
      document.getElementById("a11y-link-highlight")?.remove();
    }

    // Keyboard navigation focus indicators
    if (newState.keyboardNav) {
      const style = document.getElementById("a11y-keyboard-nav");
      if (!style) {
        const s = document.createElement("style");
        s.id = "a11y-keyboard-nav";
        s.textContent = "*:focus { outline: 3px solid #3b82f6 !important; outline-offset: 2px !important; } *:focus:not(:focus-visible) { outline: none !important; }";
        document.head.appendChild(s);
      }
    } else {
      document.getElementById("a11y-keyboard-nav")?.remove();
    }
  };

  const updateState = (key: keyof AccessibilityState, value: any) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    applyStyles(newState);
  };

  const resetAll = () => {
    const defaultState: AccessibilityState = {
      fontSize: 0,
      highContrast: false,
      dyslexiaFont: false,
      stopAnimations: false,
      keyboardNav: false,
      readingGuide: false,
      linkHighlight: false,
      screenReader: false,
    };
    setState(defaultState);
    applyStyles(defaultState);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 left-4 z-[99998] w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Open accessibility settings"
        title="Accessibility Options"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 left-4 z-[99998] w-[300px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          role="dialog"
          aria-label="Accessibility Settings"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              <span className="font-semibold text-sm">Accessibility</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-blue-700 rounded p-1" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">Font Size</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateState("fontSize", Math.max(-2, state.fontSize - 1))}
                  className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                  aria-label="Decrease font size"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-xs w-6 text-center font-mono">{state.fontSize > 0 ? `+${state.fontSize}` : state.fontSize}</span>
                <button
                  onClick={() => updateState("fontSize", Math.min(4, state.fontSize + 1))}
                  className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                  aria-label="Increase font size"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Toggle Controls */}
            <ToggleControl
              icon={<Contrast className="w-4 h-4 text-slate-600" />}
              label="High Contrast"
              checked={state.highContrast}
              onChange={(v) => updateState("highContrast", v)}
            />
            <ToggleControl
              icon={<Type className="w-4 h-4 text-slate-600" />}
              label="Dyslexia Font"
              checked={state.dyslexiaFont}
              onChange={(v) => updateState("dyslexiaFont", v)}
            />
            <ToggleControl
              icon={<Pause className="w-4 h-4 text-slate-600" />}
              label="Stop Animations"
              checked={state.stopAnimations}
              onChange={(v) => updateState("stopAnimations", v)}
            />
            <ToggleControl
              icon={<Keyboard className="w-4 h-4 text-slate-600" />}
              label="Keyboard Navigation"
              checked={state.keyboardNav}
              onChange={(v) => updateState("keyboardNav", v)}
            />
            <ToggleControl
              icon={<BookOpen className="w-4 h-4 text-slate-600" />}
              label="Reading Guide"
              checked={state.readingGuide}
              onChange={(v) => updateState("readingGuide", v)}
            />
            <ToggleControl
              icon={<Link2 className="w-4 h-4 text-slate-600" />}
              label="Highlight Links"
              checked={state.linkHighlight}
              onChange={(v) => updateState("linkHighlight", v)}
            />
            <ToggleControl
              icon={<Volume2 className="w-4 h-4 text-slate-600" />}
              label="Screen Reader / TTS"
              checked={state.screenReader}
              onChange={(v) => updateState("screenReader", v)}
            />

            {/* Reset */}
            <button
              onClick={resetAll}
              className="w-full mt-2 text-sm text-red-600 hover:text-red-700 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Reset All Settings
            </button>
          </div>
        </div>
      )}

      {/* Reading Guide Overlay */}
      {state.readingGuide && <ReadingGuide />}
    </>
  );
}

function ToggleControl({ icon, label, checked, onChange }: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-slate-200"}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function ReadingGuide() {
  const [y, setY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    setY(e.clientY);
  };

  return (
    <div
      className="fixed inset-0 z-[99997] pointer-events-none"
      style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.3) ${y - 20}px, transparent ${y - 20}px, transparent ${y + 20}px, rgba(0,0,0,0.3) ${y + 20}px)` }}
      onMouseMove={handleMouseMove as any}
    />
  );
}
