import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Input } from "../ui-adapters/Input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";
import { CodePlayground } from "../CodePlayground";

export function MessagingShowcase() {
  const [messageInput, setMessageInput] = useState("");

  const sections = [
    { id: "chat-messages", title: "Chat Messages" },
    { id: "conversation-list", title: "Conversation List" },
    { id: "chat-input", title: "Chat Input" },
    { id: "message-states", title: "Message States" },
  ];

  const messages = [
    { id: 1, sender: "them", text: "Hey! How's the project going?", time: "10:30 AM", avatar: "A" },
    { id: 2, sender: "me", text: "Going well! Just finished the design phase.", time: "10:32 AM", status: "read" },
    { id: 3, sender: "them", text: "That's great! Can you share some screenshots?", time: "10:33 AM", avatar: "A" },
    { id: 4, sender: "me", text: "Sure, I'll send them over in a few minutes. Just need to clean up a few things first.", time: "10:35 AM", status: "delivered" },
    { id: 5, sender: "them", text: "Perfect, take your time!", time: "10:36 AM", avatar: "A" },
  ];

  const conversations = [
    { id: 1, name: "Alice Johnson", avatar: "AJ", lastMessage: "Perfect, take your time!", time: "10:36 AM", unread: 0, online: true },
    { id: 2, name: "Bob Smith", avatar: "BS", lastMessage: "Can we schedule a call?", time: "9:15 AM", unread: 2, online: true },
    { id: 3, name: "Carol Williams", avatar: "CW", lastMessage: "Thanks for the update!", time: "Yesterday", unread: 0, online: false },
    { id: 4, name: "David Brown", avatar: "DB", lastMessage: "The files are ready", time: "Yesterday", unread: 0, online: false },
    { id: 5, name: "Team Design", avatar: "TD", lastMessage: "Meeting at 3 PM", time: "Monday", unread: 5, online: false },
  ];

  const chatMessagesCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck } from "lucide-react";

function ChatMessages({ messages }) {
  return (
    <ScrollArea className="h-96 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={\`flex gap-3 \${message.sender === "me" ? "flex-row-reverse" : ""}\`}
          >
            {message.sender === "them" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>{message.avatar}</AvatarFallback>
              </Avatar>
            )}
            <div className={\`max-w-[70%] \${message.sender === "me" ? "text-right" : ""}\`}>
              <div
                className={\`rounded-2xl px-4 py-2 \${
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                }\`}
              >
                {message.text}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span>{message.time}</span>
                {message.sender === "me" && message.status === "read" && (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`;

  const conversationListCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function ConversationList({ conversations, onSelect }) {
  return (
    <div className="w-80 border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>
      <div className="divide-y">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 text-left"
            onClick={() => onSelect(conv.id)}
          >
            <div className="relative">
              <Avatar>
                <AvatarFallback>{conv.avatar}</AvatarFallback>
              </Avatar>
              {conv.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{conv.name}</span>
                <span className="text-xs text-muted-foreground">{conv.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <Badge className="rounded-full">{conv.unread}</Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}`;

  const chatInputCode = `import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile } from "lucide-react";

function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t">
      <Button variant="ghost" size="icon">
        <Paperclip className="w-5 h-5" />
      </Button>
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1"
      />
      <Button variant="ghost" size="icon">
        <Smile className="w-5 h-5" />
      </Button>
      <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}`;

  const messageStatesCode = `import { Check, CheckCheck, Clock } from "lucide-react";

function MessageStatus({ status }) {
  switch (status) {
    case "sending":
      return <Clock className="w-3 h-3 text-muted-foreground" />;
    case "sent":
      return <Check className="w-3 h-3 text-muted-foreground" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
    case "read":
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    default:
      return null;
  }
}

// Usage in message bubble
<div className="flex items-center gap-1 text-xs text-muted-foreground">
  <span>10:35 AM</span>
  <MessageStatus status="read" />
</div>`;

  const sendMessage = () => {
    if (messageInput.trim()) {
      toast.success(`Message sent: "${messageInput}"`);
      setMessageInput("");
    }
  };

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="chat-messages"
        title="Chat Messages"
        description="Message bubbles with sender/receiver styling and timestamps"
      >
        <CodePlayground code={chatMessagesCode} preview={
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Alice Johnson</CardTitle>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-xs">
                  <Button variant="ghost" size="icon" onClick={() => toast("Starting voice call...")}>
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toast("Starting video call...")}>
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80 p-md">
                <div className="space-y-md">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-sm ${message.sender === "me" ? "flex-row-reverse" : ""}`}
                    >
                      {message.sender === "them" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-[70%] ${message.sender === "me" ? "text-right" : ""}`}>
                        <div
                          className={`rounded-2xl px-md py-sm ${
                            message.sender === "me"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm"
                          }`}
                        >
                          {message.text}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${message.sender === "me" ? "justify-end" : ""}`}>
                          <span>{message.time}</span>
                          {message.sender === "me" && message.status === "read" && (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          )}
                          {message.sender === "me" && message.status === "delivered" && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  <div className="flex gap-sm">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">A</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-md py-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="conversation-list"
        title="Conversation List"
        description="List of conversations with online status and unread counts"
      >
        <CodePlayground code={conversationListCode} preview={
          <Card className="max-w-sm mx-auto">
            <CardHeader className="border-b py-sm">
              <div className="relative">
                <Search className="absolute left-sm top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className="w-full flex items-center gap-sm p-md hover:bg-muted/50 text-left transition-colors"
                    onClick={() => toast(`Opening chat with ${conv.name}...`)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{conv.avatar}</AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{conv.name}</span>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="rounded-full h-5 min-w-5 flex items-center justify-center">{conv.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="chat-input"
        title="Chat Input"
        description="Message input with attachment and emoji options"
      >
        <CodePlayground code={chatInputCode} preview={
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-0">
              <div className="flex items-center gap-xs p-md border-t">
                <Button variant="ghost" size="icon" onClick={() => toast("Opening file picker...")}>
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => toast("Opening emoji picker...")}>
                  <Smile className="w-5 h-5" />
                </Button>
                <Button size="icon" onClick={sendMessage} disabled={!messageInput.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="message-states"
        title="Message States"
        description="Visual indicators for message delivery status"
      >
        <CodePlayground code={messageStatesCode} preview={
          <div className="max-w-md mx-auto space-y-md">
            <Card>
              <CardContent className="pt-lg">
                <h4 className="text-sm font-medium mb-md">Message Status Indicators</h4>
                <div className="space-y-md">
                  {/* Sending */}
                  <div className="flex justify-end">
                    <div className="max-w-[70%]">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-md py-sm">
                        Sending this message...
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
                        <span>Now</span>
                        <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  </div>

                  {/* Sent */}
                  <div className="flex justify-end">
                    <div className="max-w-[70%]">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-md py-sm">
                        Message sent to server
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
                        <span>10:30 AM</span>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="flex justify-end">
                    <div className="max-w-[70%]">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-md py-sm">
                        Message delivered to recipient
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
                        <span>10:31 AM</span>
                        <CheckCheck className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Read */}
                  <div className="flex justify-end">
                    <div className="max-w-[70%]">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-md py-sm">
                        Message has been read
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
                        <span>10:32 AM</span>
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-lg">
                <h4 className="text-sm font-medium mb-md">Online Status Indicators</h4>
                <div className="flex items-center gap-lg">
                  <div className="flex items-center gap-xs">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>ON</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <span className="text-sm">Online</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>AW</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background" />
                    </div>
                    <span className="text-sm">Away</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>OF</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-background" />
                    </div>
                    <span className="text-sm">Offline</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
