import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { Code2, Eye, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ShowcaseSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  code?: string;
  showCode?: boolean;
}

export function ShowcaseSection({ id, title, description, children, code, showCode = true }: ShowcaseSectionProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id={id} className="mb-12 scroll-mt-20">
      <div className="mb-6">
        <h3 className="mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-lg border bg-card overflow-hidden">
        {code && showCode && (
          <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2">
            <div className="flex gap-1">
              <Button
                variant={viewMode === "preview" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className="h-8 gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </Button>
              <Button
                variant={viewMode === "code" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("code")}
                className="h-8 gap-2"
              >
                <Code2 className="w-3.5 h-3.5" />
                Code
              </Button>
            </div>
            {viewMode === "code" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
        )}
        {viewMode === "preview" ? (
          <div className="p-8">
            {children}
          </div>
        ) : (
          <SyntaxHighlighter
            language="tsx"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '0.875rem',
              minHeight: '200px',
            }}
            showLineNumbers
          >
            {code || ""}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}