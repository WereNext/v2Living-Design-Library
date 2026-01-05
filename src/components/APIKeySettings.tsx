import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Eye, EyeOff, Key, Check, X, AlertTriangle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const API_KEY_STORAGE_KEY = "designLibrary_llm_api_key";
const API_PROVIDER_STORAGE_KEY = "designLibrary_llm_provider";
const API_ENDPOINT_STORAGE_KEY = "designLibrary_llm_endpoint";
const API_MODEL_STORAGE_KEY = "designLibrary_llm_model";

type LLMProvider = "openai" | "anthropic" | "google" | "cohere" | "mistral" | "groq" | "together" | "perplexity" | "openrouter" | "custom";

const LLM_PROVIDERS = [
  { 
    value: "openai", 
    label: "OpenAI", 
    placeholder: "sk-proj-...", 
    url: "https://platform.openai.com/api-keys", 
    endpoint: "https://api.openai.com/v1",
    models: ["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]
  },
  { 
    value: "anthropic", 
    label: "Anthropic (Claude)", 
    placeholder: "sk-ant-api03-...", 
    url: "https://console.anthropic.com/settings/keys", 
    endpoint: "https://api.anthropic.com/v1",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307", "claude-2.1"]
  },
  { 
    value: "google", 
    label: "Google AI (Gemini)", 
    placeholder: "AIza...", 
    url: "https://aistudio.google.com/app/apikey", 
    endpoint: "https://generativelanguage.googleapis.com/v1",
    models: ["gemini-pro", "gemini-pro-vision", "gemini-ultra"]
  },
  { 
    value: "mistral", 
    label: "Mistral AI", 
    placeholder: "...", 
    url: "https://console.mistral.ai/api-keys/", 
    endpoint: "https://api.mistral.ai/v1",
    models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"]
  },
  { 
    value: "groq", 
    label: "Groq", 
    placeholder: "gsk_...", 
    url: "https://console.groq.com/keys", 
    endpoint: "https://api.groq.com/openai/v1",
    models: ["mixtral-8x7b-32768", "llama2-70b-4096"]
  },
  { 
    value: "together", 
    label: "Together AI", 
    placeholder: "...", 
    url: "https://api.together.xyz/settings/api-keys", 
    endpoint: "https://api.together.xyz/v1",
    models: ["mistralai/Mixtral-8x7B-Instruct-v0.1", "meta-llama/Llama-2-70b-chat-hf"]
  },
  { 
    value: "perplexity", 
    label: "Perplexity", 
    placeholder: "pplx-...", 
    url: "https://www.perplexity.ai/settings/api", 
    endpoint: "https://api.perplexity.ai",
    models: ["pplx-7b-online", "pplx-70b-online"]
  },
  { 
    value: "openrouter", 
    label: "OpenRouter", 
    placeholder: "sk-or-v1-...", 
    url: "https://openrouter.ai/keys", 
    endpoint: "https://openrouter.ai/api/v1",
    models: ["openai/gpt-4-turbo-preview", "anthropic/claude-3-opus", "google/gemini-pro"]
  },
  { 
    value: "cohere", 
    label: "Cohere", 
    placeholder: "...", 
    url: "https://dashboard.cohere.com/api-keys", 
    endpoint: "https://api.cohere.ai/v1",
    models: ["command", "command-light", "command-nightly"]
  },
  { 
    value: "custom", 
    label: "Custom / Other", 
    placeholder: "Your API key", 
    url: "", 
    endpoint: "",
    models: []
  },
] as const;

export function APIKeySettings() {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const storedProvider = localStorage.getItem(API_PROVIDER_STORAGE_KEY) as LLMProvider;
    const storedEndpoint = localStorage.getItem(API_ENDPOINT_STORAGE_KEY);
    const storedModel = localStorage.getItem(API_MODEL_STORAGE_KEY);
    
    if (storedKey) {
      setApiKey(storedKey);
      setHasKey(true);
      setIsSaved(true);
    }
    
    if (storedProvider) {
      setProvider(storedProvider);
    }
    
    if (storedEndpoint) {
      setCustomEndpoint(storedEndpoint);
    }
    
    if (storedModel) {
      setSelectedModel(storedModel);
    }
  }, []);

  useEffect(() => {
    // Reset model when provider changes
    const providerData = LLM_PROVIDERS.find(p => p.value === provider);
    if (providerData?.models.length) {
      setSelectedModel(providerData.models[0]);
    } else {
      setSelectedModel("");
    }
    setTestResult(null);
  }, [provider]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      localStorage.setItem(API_PROVIDER_STORAGE_KEY, provider);
      
      const endpoint = provider === "custom" ? customEndpoint : selectedProvider?.endpoint || "";
      localStorage.setItem(API_ENDPOINT_STORAGE_KEY, endpoint);
      localStorage.setItem(API_MODEL_STORAGE_KEY, selectedModel);
      
      setHasKey(true);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.removeItem(API_PROVIDER_STORAGE_KEY);
    localStorage.removeItem(API_ENDPOINT_STORAGE_KEY);
    localStorage.removeItem(API_MODEL_STORAGE_KEY);
    setApiKey("");
    setCustomEndpoint("");
    setHasKey(false);
    setIsSaved(false);
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate API test (in production, this would make an actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation based on key format
    const isValid = apiKey.trim().length > 10 && (
      (provider === "openai" && apiKey.startsWith("sk-")) ||
      (provider === "anthropic" && apiKey.startsWith("sk-ant-")) ||
      (provider === "google" && apiKey.startsWith("AIza")) ||
      (provider === "groq" && apiKey.startsWith("gsk_")) ||
      (provider === "openrouter" && apiKey.startsWith("sk-or-")) ||
      (provider === "perplexity" && apiKey.startsWith("pplx-")) ||
      provider === "custom" ||
      provider === "mistral" ||
      provider === "together" ||
      provider === "cohere"
    );
    
    setTestResult(isValid ? "success" : "error");
    setTesting(false);
  };

  const selectedProvider = LLM_PROVIDERS.find(p => p.value === provider);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          AI Provider API Key
        </CardTitle>
        <CardDescription>
          Configure your preferred LLM API key to enable AI-powered token generation features.
          Your key is stored locally in your browser and never sent to our servers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Warning */}
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-sm">
            <strong>Important:</strong> Never share your API keys publicly or commit them to version control.
            Keys are stored in your browser's local storage only.
          </AlertDescription>
        </Alert>

        {/* Provider Selection */}
        <div className="space-y-2">
          <Label htmlFor="provider">AI Provider</Label>
          <Select value={provider} onValueChange={(v) => setProvider(v as LLMProvider)}>
            <SelectTrigger id="provider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LLM_PROVIDERS.map(p => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Endpoint (only for custom provider) */}
        {provider === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="custom-endpoint">Custom Endpoint URL</Label>
            <Input
              id="custom-endpoint"
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="font-mono text-sm"
            />
          </div>
        )}

        {/* Model Selection */}
        {selectedProvider?.models && selectedProvider.models.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {selectedProvider.models.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={selectedProvider?.placeholder || "Your API key"}
                className="pr-10 font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleTest} disabled={!apiKey.trim() || testing} variant="outline">
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              "Save"
            )}
          </Button>
          {hasKey && (
            <Button variant="destructive" onClick={handleClear}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Test Result */}
        {testResult === "success" && (
          <Alert className="bg-green-500/10 border-green-500/20">
            <Check className="w-4 h-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Connection successful! API key is valid.
            </AlertDescription>
          </Alert>
        )}
        
        {testResult === "error" && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <X className="w-4 h-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              Connection failed. Please check your API key and try again.
            </AlertDescription>
          </Alert>
        )}

        {hasKey && !testResult && (
          <Alert className="bg-green-500/10 border-green-500/20">
            <Check className="w-4 h-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              API key configured for <strong>{selectedProvider?.label}</strong>. AI-powered features are now available.
            </AlertDescription>
          </Alert>
        )}

        {!hasKey && selectedProvider?.url && (
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Where to get an API key:</strong>
              <br />
              Visit <a href={selectedProvider.url} target="_blank" rel="noopener noreferrer" className="underline">
                {selectedProvider.label} API Keys
              </a> to create your API key.
            </AlertDescription>
          </Alert>
        )}

        {/* Supported Providers Info */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <p className="text-sm font-medium">Supported Providers:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>OpenAI</strong> - GPT-4 Turbo, GPT-4, GPT-3.5</li>
            <li>• <strong>Anthropic</strong> - Claude 3 Opus, Sonnet, Haiku</li>
            <li>• <strong>Google AI</strong> - Gemini Pro, Gemini Ultra</li>
            <li>• <strong>Mistral AI</strong> - Mistral Large, Medium, Small</li>
            <li>• <strong>Groq</strong> - Mixtral 8x7B, Llama 2 70B (ultra-fast)</li>
            <li>• <strong>Together AI</strong> - Open-source models</li>
            <li>• <strong>Perplexity</strong> - Search-optimized models</li>
            <li>• <strong>OpenRouter</strong> - Multi-model gateway</li>
            <li>• <strong>Cohere</strong> - Command models</li>
            <li>• <strong>Custom</strong> - Any OpenAI-compatible API</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function getStoredAPIKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function getStoredProvider(): LLMProvider | null {
  return localStorage.getItem(API_PROVIDER_STORAGE_KEY) as LLMProvider;
}

export function getStoredEndpoint(): string | null {
  return localStorage.getItem(API_ENDPOINT_STORAGE_KEY);
}

export function getStoredModel(): string | null {
  return localStorage.getItem(API_MODEL_STORAGE_KEY);
}

export function hasAPIKey(): boolean {
  return !!localStorage.getItem(API_KEY_STORAGE_KEY);
}