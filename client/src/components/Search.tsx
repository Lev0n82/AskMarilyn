import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search as SearchIcon, FileText, AlertTriangle, Layers, BookOpen, Code } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Search() {
  const [open, setOpen] = React.useState(false);
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Modules">
            <CommandItem
              onSelect={() => runCommand(() => setLocation("/module-1"))}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>The Testing Paradox</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setLocation("/module-2"))}
            >
              <Layers className="mr-2 h-4 w-4" />
              <span>The Three Layers</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setLocation("/module-3"))}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Anti-Patterns</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setLocation("/module-4"))}
            >
              <Layers className="mr-2 h-4 w-4" />
              <span>Architecture</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setLocation("/module-5"))}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Language of Logic</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Tools">
            <CommandItem
              onSelect={() => runCommand(() => setLocation("/refactoring-challenge"))}
            >
              <Code className="mr-2 h-4 w-4" />
              <span>Refactoring Challenge</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => window.open("/abt_cheat_sheet.pdf", "_blank"))}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Download Cheat Sheet</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
