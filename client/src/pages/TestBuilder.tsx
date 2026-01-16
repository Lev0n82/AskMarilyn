import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { CheckCircle2, XCircle, GripVertical, Trash2, RotateCcw, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface Action {
  id: string;
  name: string;
  level: "high" | "mid" | "low";
  description: string;
}

const availableActions: Action[] = [
  // High-level actions
  { id: "login", name: "login", level: "high", description: "Log in to the application" },
  { id: "create_invoice", name: "create_invoice", level: "high", description: "Create a new invoice" },
  { id: "verify_total", name: "verify_total", level: "high", description: "Verify the invoice total" },
  { id: "logout", name: "logout", level: "high", description: "Log out of the application" },
  
  // Mid-level actions (should not be used directly in test)
  { id: "enter_username", name: "enter_username", level: "mid", description: "Enter username in field" },
  { id: "enter_password", name: "enter_password", level: "mid", description: "Enter password in field" },
  { id: "click_login_button", name: "click_login_button", level: "mid", description: "Click the login button" },
  { id: "add_line_item", name: "add_line_item", level: "mid", description: "Add a line item to invoice" },
  
  // Low-level actions (should definitely not be used)
  { id: "click", name: "click", level: "low", description: "Click an element" },
  { id: "type", name: "type", level: "low", description: "Type text into a field" },
  { id: "wait", name: "wait", level: "low", description: "Wait for element" },
  { id: "scroll", name: "scroll", level: "low", description: "Scroll the page" },
];

const correctSequence = ["login", "create_invoice", "verify_total", "logout"];

export default function TestBuilder() {
  const [testFlow, setTestFlow] = useState<Action[]>([]);
  const [draggedAction, setDraggedAction] = useState<Action | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null);

  const handleDragStart = (action: Action) => {
    setDraggedAction(action);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedAction && !testFlow.find(a => a.id === draggedAction.id)) {
      setTestFlow([...testFlow, draggedAction]);
      setIsValidated(false);
      setValidationResult(null);
    }
    setDraggedAction(null);
  };

  const removeAction = (id: string) => {
    setTestFlow(testFlow.filter(a => a.id !== id));
    setIsValidated(false);
    setValidationResult(null);
  };

  const resetFlow = () => {
    setTestFlow([]);
    setIsValidated(false);
    setValidationResult(null);
  };

  const validateFlow = () => {
    const errors: string[] = [];
    
    // Check for low-level actions
    const lowLevelActions = testFlow.filter(a => a.level === "low");
    if (lowLevelActions.length > 0) {
      errors.push(`Low-level actions detected: ${lowLevelActions.map(a => a.name).join(", ")}. These should never appear in high-level tests.`);
    }
    
    // Check for mid-level actions
    const midLevelActions = testFlow.filter(a => a.level === "mid");
    if (midLevelActions.length > 0) {
      errors.push(`Mid-level actions detected: ${midLevelActions.map(a => a.name).join(", ")}. These should be encapsulated within high-level actions.`);
    }
    
    // Check sequence
    const highLevelFlow = testFlow.filter(a => a.level === "high").map(a => a.id);
    if (highLevelFlow.length !== correctSequence.length) {
      errors.push(`Expected ${correctSequence.length} high-level actions, found ${highLevelFlow.length}.`);
    } else {
      for (let i = 0; i < correctSequence.length; i++) {
        if (highLevelFlow[i] !== correctSequence[i]) {
          errors.push(`Action at position ${i + 1} should be "${correctSequence[i]}", not "${highLevelFlow[i]}".`);
        }
      }
    }
    
    const valid = errors.length === 0;
    setIsValidated(true);
    setValidationResult({ valid, errors });
    
    if (valid) {
      toast.success("Perfect! Your test flow follows ABT principles correctly.");
    } else {
      toast.error("There are issues with your test flow. Review the feedback below.");
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200";
      case "mid": return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200";
      case "low": return "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200";
      default: return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-serif font-bold text-primary">Interactive Test Builder</h1>
          <p className="text-muted-foreground leading-relaxed">
            Build a test flow by dragging actions from the palette to the test area. 
            Your goal is to create a clean, high-level test that follows ABT principles.
          </p>
          <div className="bg-accent/50 p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Your Mission:</p>
                <p className="text-sm text-muted-foreground">
                  Create a test that: Logs in → Creates an invoice → Verifies the total → Logs out.
                  Use only high-level actions!
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr,2fr] gap-6">
          {/* Action Palette */}
          <Card className="border-border paper-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Action Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">HIGH-LEVEL (Business Logic)</p>
                <div className="space-y-2">
                  {availableActions.filter(a => a.level === "high").map(action => (
                    <div
                      key={action.id}
                      draggable
                      onDragStart={() => handleDragStart(action)}
                      className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] ${getLevelColor(action.level)} ${testFlow.find(a => a.id === action.id) ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 opacity-50" />
                        <code className="text-sm font-mono">{action.name}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-2">MID-LEVEL (Component)</p>
                <div className="space-y-2">
                  {availableActions.filter(a => a.level === "mid").map(action => (
                    <div
                      key={action.id}
                      draggable
                      onDragStart={() => handleDragStart(action)}
                      className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] ${getLevelColor(action.level)} ${testFlow.find(a => a.id === action.id) ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 opacity-50" />
                        <code className="text-sm font-mono">{action.name}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">LOW-LEVEL (Technical)</p>
                <div className="space-y-2">
                  {availableActions.filter(a => a.level === "low").map(action => (
                    <div
                      key={action.id}
                      draggable
                      onDragStart={() => handleDragStart(action)}
                      className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] ${getLevelColor(action.level)} ${testFlow.find(a => a.id === action.id) ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 opacity-50" />
                        <code className="text-sm font-mono">{action.name}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Flow Builder */}
          <Card className="border-border paper-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg">Your Test Flow</CardTitle>
              <Button variant="outline" size="sm" onClick={resetFlow}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`min-h-[300px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                  draggedAction ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                {testFlow.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p className="font-serif italic">Drag actions here to build your test...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {testFlow.map((action, index) => (
                      <div
                        key={action.id}
                        className={`p-3 rounded-lg border flex items-center justify-between ${getLevelColor(action.level)}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <code className="font-mono">{action.name}</code>
                          <span className="text-xs opacity-70">({action.level})</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAction(action.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={validateFlow}
                disabled={testFlow.length === 0}
                className="w-full font-serif"
              >
                Validate Test Flow
              </Button>

              {isValidated && validationResult && (
                <div className={`p-4 rounded-lg border ${
                  validationResult.valid 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}>
                  <div className="flex items-start gap-3">
                    {validationResult.valid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-semibold ${validationResult.valid ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                        {validationResult.valid ? "Excellent Work!" : "Needs Improvement"}
                      </p>
                      {validationResult.valid ? (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your test flow follows ABT principles perfectly. It uses only high-level, 
                          business-readable actions in the correct sequence.
                        </p>
                      ) : (
                        <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1 mt-2">
                          {validationResult.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
