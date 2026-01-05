import { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Sparkles, Code2, Download, Copy, Check, Target } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createSyntaxTheme } from "../../../lib/syntax-theme";
import {
  playgroundComponents,
  getComponentsByCategory,
  findComponentById,
} from "./components";
import type { PlaygroundIntent } from "./types";

interface PlaygroundShowcaseProps {
  designIntent?: string;
  onDesignIntentChange?: (intent: string) => void;
  availableIntents?: PlaygroundIntent[];
}

const DEFAULT_INTENTS: PlaygroundIntent[] = [
  { value: "web-app", label: "Web App" },
  { value: "marketing", label: "Marketing Site" },
  { value: "dashboard", label: "Dashboard" },
  { value: "ecommerce", label: "E-Commerce" },
];

export function PlaygroundShowcase({
  designIntent = "web-app",
  onDesignIntentChange,
  availableIntents = DEFAULT_INTENTS,
}: PlaygroundShowcaseProps) {
  const [selectedComponent, setSelectedComponent] = useState("button-variants");
  const [copied, setCopied] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState("react");

  const categories = useMemo(
    () => getComponentsByCategory(playgroundComponents),
    []
  );

  const selectedComponentData = useMemo(
    () => findComponentById(playgroundComponents, selectedComponent),
    [selectedComponent]
  );

  const syntaxTheme = useMemo(() => createSyntaxTheme(), []);

  const handleCopy = async () => {
    if (selectedComponentData) {
      await navigator.clipboard.writeText(selectedComponentData.code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleIntentChange = (value: string) => {
    onDesignIntentChange?.(value);
    const intentLabel = availableIntents.find(i => i.value === value)?.label;
    toast.success(`Switched to ${intentLabel} intent`);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header Toolbar */}
      <div className="border-b bg-card px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-primary" />
            <h1 className="text-sm">Playground</h1>
          </div>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          {/* Design Intent Selector */}
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-muted-foreground" />
            <Select value={designIntent} onValueChange={handleIntentChange}>
              <SelectTrigger className="w-[110px] sm:w-[130px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableIntents.map(intent => (
                  <SelectItem key={intent.value} value={intent.value}>
                    {intent.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          {/* Component Selector */}
          <Select value={selectedComponent} onValueChange={setSelectedComponent}>
            <SelectTrigger className="w-[140px] sm:w-[160px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {playgroundComponents
                    .filter(c => c.category === category)
                    .map(component => (
                      <SelectItem key={component.id} value={component.id}>
                        {component.name}
                      </SelectItem>
                    ))}
                </div>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          {/* Framework Selector */}
          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
            <SelectTrigger className="w-[100px] sm:w-[110px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React + TS</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="angular">Angular</SelectItem>
              <SelectItem value="css">CSS Vars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Badge variant="outline" className="text-xs h-6 px-2">
            <Sparkles className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Tokens</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 text-xs px-2 sm:px-3 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-7 text-xs px-2 sm:px-3 gap-1.5"
            onClick={() => toast.info("Export feature ready!")}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left - Code */}
        <div className="flex-1 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r max-h-[50vh] lg:max-h-none">
          <div className="border-b bg-muted/10 px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm">Source Code</span>
              <Badge variant="secondary" className="text-xs">
                {selectedFramework === "react" ? "TypeScript" : selectedFramework}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground hidden md:block">
              Using design tokens from your active theme
            </span>
          </div>
          <ScrollArea className="flex-1">
            <SyntaxHighlighter
              language="tsx"
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: "0.75rem",
                height: "100%",
                background: "#ffffff",
              }}
              showLineNumbers
              codeTagProps={{
                style: {
                  fontSize: "0.75rem",
                  lineHeight: "1.5",
                },
              }}
            >
              {selectedComponentData?.code || ""}
            </SyntaxHighlighter>
          </ScrollArea>
        </div>

        {/* Right - Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-secondary/30 min-h-[50vh] lg:min-h-0">
          <div className="border-b bg-card/80 backdrop-blur-sm px-3 sm:px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
              </div>
              <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                Live Preview
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {selectedComponentData?.name}
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 sm:p-8 lg:p-12 flex items-center justify-center min-h-full">
              {selectedComponentData?.preview}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
