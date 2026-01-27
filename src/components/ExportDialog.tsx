import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Copy, Check, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from "./ui/scroll-area";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  title?: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  code,
  title,
}: ExportDialogProps) {
  const [activeFramework, setActiveFramework] = useState("vue");
  const [copied, setCopied] = useState(false);

  const frameworks = [
    { id: "vue", name: "Vue 3", language: "vue" },
    { id: "svelte", name: "Svelte", language: "svelte" },
    { id: "react-native", name: "React Native", language: "tsx" },
    { id: "angular", name: "Angular", language: "typescript" },
    { id: "css", name: "CSS Variables", language: "css" },
  ];

  const convertToFramework = (framework: string): string => {
    switch (framework) {
      case "vue":
        return convertToVue(code);
      case "svelte":
        return convertToSvelte(code);
      case "react-native":
        return convertToReactNative(code);
      case "angular":
        return convertToAngular(code);
      case "css":
        return extractCSSVariables(code);
      default:
        return code;
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string, framework: string) => {
    const extensions: Record<string, string> = {
      vue: "vue",
      svelte: "svelte",
      "react-native": "tsx",
      angular: "component.ts",
      css: "css",
    };
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `component.${extensions[framework] || "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentCode = convertToFramework(activeFramework);
  const currentLanguage = frameworks.find(f => f.id === activeFramework)?.language || "tsx";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Export to Framework</DialogTitle>
          <DialogDescription>
            Convert your component to different frameworks and formats
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeFramework} onValueChange={setActiveFramework} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {frameworks.map((framework) => (
              <TabsTrigger key={framework.id} value={framework.id} className="text-xs">
                {framework.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {frameworks.find(f => f.id === activeFramework)?.name} Code
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(currentCode, activeFramework)}
                >
                  <Download className="w-3.5 h-3.5 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(currentCode)}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px] rounded-lg border">
              <SyntaxHighlighter
                language={currentLanguage}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {currentCode}
              </SyntaxHighlighter>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Framework conversion utilities
function convertToVue(reactCode: string): string {
  // Simple conversion - in production, you'd use AST transformation
  let vueCode = `<template>
  <div>
    <!-- Converted from React -->
    <!-- Note: Manual adjustments may be needed -->
    ${reactCode.replace(/className=/g, 'class=')}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Component logic here
</script>

<style scoped>
/* Component styles */
</style>`;

  return vueCode;
}

function convertToSvelte(reactCode: string): string {
  let svelteCode = `<script lang="ts">
  // Component logic here
  let count = 0;
</script>

<!-- Converted from React -->
<!-- Note: Manual adjustments may be needed -->
${reactCode.replace(/className=/g, 'class=')}

<style>
  /* Component styles */
</style>`;

  return svelteCode;
}

function convertToReactNative(reactCode: string): string {
  // Convert web components to React Native equivalents
  let nativeCode = reactCode
    .replace(/<div/g, '<View')
    .replace(/<\/div>/g, '</View>')
    .replace(/<button/g, '<TouchableOpacity')
    .replace(/<\/button>/g, '</TouchableOpacity>')
    .replace(/<input/g, '<TextInput')
    .replace(/<\/input>/g, '</TextInput>')
    .replace(/className=/g, 'style=');

  return `import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

// Converted from React Web
// Note: Tailwind classes need to be converted to StyleSheet
${nativeCode}

const styles = StyleSheet.create({
  // Add your styles here
});`;
}

function convertToAngular(reactCode: string): string {
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: \`
    <!-- Converted from React -->
    <!-- Note: Manual adjustments needed for Angular syntax -->
    ${reactCode.replace(/className=/g, 'class=')}
  \`,
  styles: [\`
    /* Component styles */
  \`]
})
export class ComponentName {
  // Component logic here
}`;
}

function extractCSSVariables(reactCode: string): string {
  return `:root {
  /* Primary Colors */
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  
  /* Secondary Colors */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  /* Accent Colors */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  
  /* Destructive */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  
  /* Surfaces */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  
  /* Borders */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  
  /* Muted */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  /* Radius */
  --radius: 0.5rem;
}

/* Example component styles */
.component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 1rem;
}`;
}
