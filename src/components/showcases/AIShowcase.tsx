import { useState } from "react";
import { ShowcaseSection } from "../ShowcaseSection";
import { ShowcaseCard } from "../ShowcaseCard";
import { Button } from "../ui-adapters/Button";
import { Input } from "../ui-adapters/Input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Badge } from "../ui-adapters/Badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { 
  Bot, 
  Send, 
  Paperclip, 
  Mic, 
  Sparkles, 
  Settings, 
  FileText, 
  RotateCcw, 
  MoreVertical, 
  MessageSquare, 
  Code, 
  ImageIcon,
  CheckCircle2,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIShowcase() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      role: "user",
      content: "Can you explain what design tokens are?",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      role: "assistant",
      content: "Design tokens are the visual design atoms of a design system. They're named entities that store visual design attributes like colors, typography, spacing, and more. They help maintain consistency across your product by providing a single source of truth for these values.",
      timestamp: new Date(Date.now() - 180000),
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [sidebarMessages, setSidebarMessages] = useState<Message[]>([]);
  const [sidebarInput, setSidebarInput] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a demo response. In a real application, this would come from your AI service.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSidebarSend = () => {
    if (!sidebarInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: sidebarInput,
      timestamp: new Date(),
    };

    setSidebarMessages([...sidebarMessages, userMessage]);
    setSidebarInput("");

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I can help you with that! This is a compact AI assistant.",
        timestamp: new Date(),
      };
      setSidebarMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const suggestedPrompts = [
    "Explain design systems",
    "How do I use color tokens?",
    "Best practices for spacing",
    "Accessibility guidelines",
  ];

  const sections = [
    { id: "ai-chat", title: "AI Chat Interface" },
    { id: "ai-sidebar", title: "AI Sidebar Assistant" },
    { id: "message-variations", title: "Message Variations" },
    { id: "input-variations", title: "AI Input Variations" },
    { id: "status-indicators", title: "AI Status Indicators" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="ai-chat"
        title="AI Chat Interface"
        description="Full-featured chat interface for AI conversations"
      >
        <ShowcaseCard
          defaultName="AI Chat Interface"
          category="ai"
          designIntent="web-app"
          description="Full-featured AI chat interface with message history, model selection, and suggested prompts"
        >
        <Card className="w-full max-w-4xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Avatar>
                  <AvatarFallback className="bg-primary">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription className="flex items-center gap-xs mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Online
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-xs">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-xs" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-xs" />
                      Export Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RotateCcw className="w-4 h-4 mr-xs" />
                      Clear History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-md">
              <div className="space-y-md">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-md space-y-sm">
              <div className="flex flex-wrap gap-xs">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(prompt)}
                    className="text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {prompt}
                  </Button>
                ))}
              </div>
              <div className="flex gap-xs">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </ShowcaseCard>
      </ShowcaseSection>

      <ShowcaseSection
        id="ai-sidebar"
        title="AI Sidebar Assistant"
        description="Compact AI assistant that can be embedded in a sidebar"
      >
        <ShowcaseCard
          defaultName="AI Sidebar Assistant"
          category="ai"
          designIntent="web-app"
          description="Compact AI assistant designed for sidebar integration with quick actions and features panel"
        >
        <div className="grid gap-lg md:grid-cols-2">
          <Card className="w-full max-w-sm">
            <CardHeader className="pb-sm">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-xs">
                  <Bot className="w-4 h-4" />
                  Quick Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-sm">
              <ScrollArea className="h-64 pr-md">
                <div className="space-y-sm">
                  {sidebarMessages.length === 0 ? (
                    <div className="text-center py-xl text-muted-foreground text-sm">
                      <Bot className="w-8 h-8 mx-auto mb-xs opacity-50" />
                      Ask me anything!
                    </div>
                  ) : (
                    sidebarMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-xs ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-primary text-xs">
                              <Bot className="w-3 h-3 text-primary-foreground" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-sm py-xs max-w-[80%] text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-xs">
                <Input
                  placeholder="Ask a question..."
                  value={sidebarInput}
                  onChange={(e) => setSidebarInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSidebarSend();
                    }
                  }}
                  className="text-sm"
                />
                <Button size="icon" onClick={handleSidebarSend}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-sm">
            <CardHeader className="pb-sm">
              <CardTitle className="text-base">AI Features</CardTitle>
              <CardDescription className="text-xs">
                Quick actions and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-xs">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MessageSquare className="w-4 h-4 mr-xs" />
                  Start Conversation
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="w-4 h-4 mr-xs" />
                  Summarize Document
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Code className="w-4 h-4 mr-xs" />
                  Generate Code
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <ImageIcon className="w-4 h-4 mr-xs" />
                  Create Image
                </Button>
                <Separator className="my-sm" />
                <div className="space-y-xs text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Token Usage</span>
                    <Badge variant="secondary" className="text-xs">
                      1.2K / 10K
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[12%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </ShowcaseCard>
      </ShowcaseSection>

      <ShowcaseSection
        id="message-variations"
        title="Message Variations"
        description="Different message bubble styles and states"
      >
        <ShowcaseCard
          defaultName="AI Message Variations"
          category="ai"
          designIntent="web-app"
          description="Collection of AI message bubble styles including user messages, assistant responses with actions, code blocks, and system notifications"
        >
        <div className="space-y-md max-w-2xl">
          {/* User Message */}
          <div className="flex justify-end gap-xs">
            <div className="bg-primary text-primary-foreground rounded-lg px-md py-xs max-w-[70%]">
              <p className="text-sm">This is a user message with some content</p>
              <div className="flex items-center gap-xs mt-1 justify-end">
                <span className="text-xs opacity-75">2:30 PM</span>
                <CheckCircle2 className="w-3 h-3 opacity-75" />
              </div>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Assistant Message with Actions */}
          <div className="flex gap-xs">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 max-w-[70%]">
              <div className="bg-muted rounded-lg px-md py-xs">
                <p className="text-sm">
                  Here's a detailed response from the AI assistant. It can include multiple
                  paragraphs and helpful information.
                </p>
                <div className="text-xs text-muted-foreground mt-1">2:31 PM</div>
              </div>
              <div className="flex gap-1 mt-xs">
                <Button variant="ghost" size="sm" className="h-7">
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button variant="ghost" size="sm" className="h-7">
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7">
                  <ThumbsDown className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7">
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Code Block Message */}
          <div className="flex gap-xs">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 max-w-[70%]">
              <div className="bg-muted rounded-lg overflow-hidden">
                <div className="px-md py-xs">
                  <p className="text-sm mb-xs">Here's a code example:</p>
                </div>
                <div className="bg-black/90 text-green-400 px-md py-sm font-mono text-xs">
                  <code>
                    const greeting = "Hello, World!";
                    <br />
                    console.log(greeting);
                  </code>
                </div>
                <div className="px-md py-xs flex justify-between items-center border-t">
                  <span className="text-xs text-muted-foreground">JavaScript</span>
                  <Button variant="ghost" size="sm" className="h-6">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* System Message */}
          <div className="flex justify-center">
            <div className="bg-secondary px-md py-xs rounded-full">
              <p className="text-xs text-muted-foreground flex items-center gap-xs">
                <Zap className="w-3 h-3" />
                Switched to GPT-4 model
              </p>
            </div>
          </div>
        </div>
        </ShowcaseCard>
      </ShowcaseSection>

      <ShowcaseSection
        id="input-variations"
        title="AI Input Variations"
        description="Different input styles for AI interactions"
      >
        <ShowcaseCard
          defaultName="AI Input Variations"
          category="ai"
          designIntent="web-app"
          description="Different AI input field styles including standard input, multi-line textarea, and inputs with character limits"
        >
        <div className="space-y-md max-w-2xl">
          {/* Standard Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Standard Message Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-xs">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Textarea Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Multi-line Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-xs">
                <Textarea 
                  placeholder="Type a longer message or prompt..." 
                  className="min-h-24 resize-none"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button>
                    Send
                    <Send className="w-4 h-4 ml-xs" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input with Character Count */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Input with Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-xs">
                <Textarea 
                  placeholder="Maximum 500 characters..." 
                  className="min-h-20 resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <span>0 / 500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </ShowcaseCard>
      </ShowcaseSection>

      <ShowcaseSection
        id="status-indicators"
        title="AI Status Indicators"
        description="Loading states and status displays"
      >
        <ShowcaseCard
          defaultName="AI Status Indicators"
          category="ai"
          designIntent="web-app"
          description="Status indicator cards showing different AI states including online status, processing, and high load warnings"
        >
        <div className="grid gap-md md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-lg">
              <div className="flex items-center gap-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-sm">AI Online</p>
                  <p className="text-xs text-muted-foreground">Ready to assist</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-lg">
              <div className="flex items-center gap-sm">
                <Clock className="w-4 h-4 text-muted-foreground animate-spin" />
                <div>
                  <p className="text-sm">Processing</p>
                  <p className="text-xs text-muted-foreground">Generating response...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-lg">
              <div className="flex items-center gap-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm">High Load</p>
                  <p className="text-xs text-muted-foreground">Response may be slower</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </ShowcaseCard>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex gap-sm ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`flex-1 max-w-[70%] ${isUser ? "flex justify-end" : ""}`}>
        <div
          className={`rounded-lg px-md py-xs ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <div className={`flex items-center gap-xs mt-1 text-xs opacity-75 ${isUser ? "justify-end" : ""}`}>
            <span>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-sm">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-primary">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg px-md py-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}