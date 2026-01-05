import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Copy, Check, Code2, Eye, Download, Settings2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ExportDialog } from "./ExportDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Label } from "./ui/label";

interface CodePlaygroundProps {
  code: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  language?: string;
  editable?: boolean;
  showConfig?: boolean;
  configOptions?: {
    variants?: string[];
    sizes?: string[];
    themes?: string[];
  };
  onConfigChange?: (config: any) => void;
}

export function CodePlayground({
  code,
  children,
  title,
  description,
  language = "tsx",
  editable = true,
  showConfig = false,
  configOptions,
  onConfigChange,
}: CodePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [currentCode, setCurrentCode] = useState(code);
  const [copied, setCopied] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [config, setConfig] = useState({
    variant: configOptions?.variants?.[0] || "",
    size: configOptions?.sizes?.[0] || "",
    theme: configOptions?.themes?.[0] || "",
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfigChange = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {(title || description) && (
        <div className="border-b p-4 bg-muted/30">
          {title && <h4 className="text-sm">{title}</h4>}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "code")}>
        <div className="flex items-center justify-between border-b bg-muted/20 px-4">
          <TabsList className="h-10 bg-transparent">
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-3.5 h-3.5" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code2 className="w-3.5 h-3.5" />
              Code
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {showConfig && configOptions && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Config</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm">Configuration</h4>
                      <p className="text-xs text-muted-foreground">
                        Adjust component properties
                      </p>
                    </div>
                    {configOptions.variants && configOptions.variants.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs">Variant</Label>
                        <Select
                          value={config.variant}
                          onValueChange={(value) => handleConfigChange("variant", value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {configOptions.variants.map((variant) => (
                              <SelectItem key={variant} value={variant}>
                                {variant}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {configOptions.sizes && configOptions.sizes.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs">Size</Label>
                        <Select
                          value={config.size}
                          onValueChange={(value) => handleConfigChange("size", value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {configOptions.sizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {configOptions.themes && configOptions.themes.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs">Theme</Label>
                        <Select
                          value={config.theme}
                          onValueChange={(value) => handleConfigChange("theme", value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {configOptions.themes.map((theme) => (
                              <SelectItem key={theme} value={theme}>
                                {theme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExportOpen(true)}
              className="h-8 gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <TabsContent value="preview" className="m-0">
          <div className="p-6 md:p-8 min-h-[200px] flex items-center justify-center bg-background">
            {children}
          </div>
        </TabsContent>

        <TabsContent value="code" className="m-0">
          {editable ? (
            <div className="relative">
              <textarea
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                className="w-full min-h-[300px] p-4 font-mono text-sm bg-[#282c34] text-[#abb2bf] resize-none focus:outline-none"
                spellCheck={false}
              />
              <div className="absolute top-2 right-2">
                <span className="text-xs px-2 py-1 bg-black/30 text-white rounded">
                  Editable
                </span>
              </div>
            </div>
          ) : (
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '0.875rem',
                minHeight: '300px',
              }}
              showLineNumbers
            >
              {currentCode}
            </SyntaxHighlighter>
          )}
        </TabsContent>
      </Tabs>

      <ExportDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        code={currentCode}
        title={title}
      />
    </div>
  );
}