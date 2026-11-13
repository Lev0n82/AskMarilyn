import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accessibility,
  Type,
  Contrast,
  Eye,
  MousePointer2,
  Pause,
  RotateCcw,
  Minus,
  Plus,
  Focus,
} from "lucide-react";

interface AccessibilitySettings {
  fontSize: number; // 80-150 (percentage)
  highContrast: boolean;
  reducedMotion: boolean;
  largerCursor: boolean;
  highlightLinks: boolean;
  highlightFocus: boolean;
  lineHeight: number; // 1-2.5
  letterSpacing: number; // 0-3 (px)
  dyslexiaFont: boolean;
  saturation: number; // 0-200 (percentage)
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reducedMotion: false,
  largerCursor: false,
  highlightLinks: true,
  highlightFocus: true,
  lineHeight: 1.6,
  letterSpacing: 0,
  dyslexiaFont: false,
  saturation: 100,
};

const STORAGE_KEY = "accessibility-settings";

function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: AccessibilitySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Font size
  root.style.fontSize = `${settings.fontSize}%`;

  // Line height
  root.style.setProperty("--a11y-line-height", `${settings.lineHeight}`);
  document.body.style.lineHeight = `${settings.lineHeight}`;

  // Letter spacing
  root.style.setProperty("--a11y-letter-spacing", `${settings.letterSpacing}px`);
  document.body.style.letterSpacing = `${settings.letterSpacing}px`;

  // High contrast
  if (settings.highContrast) {
    root.classList.add("a11y-high-contrast");
  } else {
    root.classList.remove("a11y-high-contrast");
  }

  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add("a11y-reduced-motion");
  } else {
    root.classList.remove("a11y-reduced-motion");
  }

  // Larger cursor
  if (settings.largerCursor) {
    root.classList.add("a11y-larger-cursor");
  } else {
    root.classList.remove("a11y-larger-cursor");
  }

  // Highlight links
  if (settings.highlightLinks) {
    root.classList.add("a11y-highlight-links");
  } else {
    root.classList.remove("a11y-highlight-links");
  }

  // Highlight focus
  if (settings.highlightFocus) {
    root.classList.add("a11y-highlight-focus");
  } else {
    root.classList.remove("a11y-highlight-focus");
  }

  // Dyslexia font
  if (settings.dyslexiaFont) {
    root.classList.add("a11y-dyslexia-font");
  } else {
    root.classList.remove("a11y-dyslexia-font");
  }

  // Saturation
  if (settings.saturation !== 100) {
    root.style.filter = `saturate(${settings.saturation}%)`;
  } else {
    root.style.filter = "";
  }
}

export function FloatingAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  const isModified = JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
          aria-label="Accessibility settings"
          title="Accessibility settings"
        >
          <Accessibility className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {isModified && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" aria-hidden="true" />
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[360px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility Settings
          </SheetTitle>
          <SheetDescription>
            Customize the site to meet your accessibility needs. Changes are saved automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Type className="w-4 h-4" />
                Font Size
              </Label>
              <span className="text-sm text-muted-foreground">{settings.fontSize}%</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateSetting("fontSize", Math.max(80, settings.fontSize - 10))}
                aria-label="Decrease font size"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([v]) => updateSetting("fontSize", v)}
                min={80}
                max={150}
                step={5}
                className="flex-1"
                aria-label="Font size slider"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateSetting("fontSize", Math.min(150, settings.fontSize + 10))}
                aria-label="Increase font size"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Line Height</Label>
              <span className="text-sm text-muted-foreground">{settings.lineHeight.toFixed(1)}</span>
            </div>
            <Slider
              value={[settings.lineHeight]}
              onValueChange={([v]) => updateSetting("lineHeight", v)}
              min={1}
              max={2.5}
              step={0.1}
              aria-label="Line height slider"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Letter Spacing</Label>
              <span className="text-sm text-muted-foreground">{settings.letterSpacing}px</span>
            </div>
            <Slider
              value={[settings.letterSpacing]}
              onValueChange={([v]) => updateSetting("letterSpacing", v)}
              min={0}
              max={3}
              step={0.5}
              aria-label="Letter spacing slider"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4" />
                Color Saturation
              </Label>
              <span className="text-sm text-muted-foreground">{settings.saturation}%</span>
            </div>
            <Slider
              value={[settings.saturation]}
              onValueChange={([v]) => updateSetting("saturation", v)}
              min={0}
              max={200}
              step={10}
              aria-label="Color saturation slider"
            />
          </div>

          {/* Toggle switches */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Contrast className="w-4 h-4" />
                High Contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(v) => updateSetting("highContrast", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Pause className="w-4 h-4" />
                Reduce Animations
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(v) => updateSetting("reducedMotion", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="larger-cursor" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <MousePointer2 className="w-4 h-4" />
                Larger Cursor
              </Label>
              <Switch
                id="larger-cursor"
                checked={settings.largerCursor}
                onCheckedChange={(v) => updateSetting("largerCursor", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="highlight-links" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <MousePointer2 className="w-4 h-4" />
                Highlight Links
              </Label>
              <Switch
                id="highlight-links"
                checked={settings.highlightLinks}
                onCheckedChange={(v) => updateSetting("highlightLinks", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="highlight-focus" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Focus className="w-4 h-4" />
                Enhanced Focus Ring
              </Label>
              <Switch
                id="highlight-focus"
                checked={settings.highlightFocus}
                onCheckedChange={(v) => updateSetting("highlightFocus", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dyslexia-font" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Type className="w-4 h-4" />
                Dyslexia-Friendly Font
              </Label>
              <Switch
                id="dyslexia-font"
                checked={settings.dyslexiaFont}
                onCheckedChange={(v) => updateSetting("dyslexiaFont", v)}
              />
            </div>
          </div>

          {/* Reset */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={resetAll}
              disabled={!isModified}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>

          {/* Accessibility statement link */}
          <div className="text-xs text-muted-foreground text-center pb-4">
            <p>These settings are stored locally and persist across sessions.</p>
            <p className="mt-1">
              Need additional support?{" "}
              <a href="/accessibility" className="underline hover:text-foreground">
                View our accessibility statement
              </a>
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
