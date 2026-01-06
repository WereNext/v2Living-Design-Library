import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Card, CardContent } from "../ui-adapters/Card";
import { Trash2, Archive, Star, Mail } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function SwipeActionsShowcase() {
  const [swipedItems, setSwipedItems] = useState<Record<number, string>>({});

  const sections = [
    { id: "email-list", title: "Email List" },
    { id: "todo-list", title: "Todo List" },
    { id: "card-stack", title: "Card Stack" },
  ];

  const emails = [
    { id: 1, from: "Alice Johnson", subject: "Meeting tomorrow", time: "10:30 AM", unread: true },
    { id: 2, from: "Bob Smith", subject: "Project update", time: "9:15 AM", unread: true },
    { id: 3, from: "Carol White", subject: "Quick question", time: "Yesterday", unread: false },
  ];

  const handleSwipeReveal = (id: number, direction: string) => {
    setSwipedItems(prev => ({ ...prev, [id]: direction }));
  };

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="email-list"
        title="Swipeable Email List"
        description="Swipe actions for email management"
      >
        <div className="max-w-md mx-auto space-y-2">
          {emails.map((email) => (
            <div key={email.id} className="relative">
              {/* Action buttons revealed on swipe */}
              {swipedItems[email.id] === 'left' && (
                <div className="absolute right-0 top-0 h-full flex items-center gap-1 px-2 bg-destructive/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-12 text-destructive"
                    onClick={() => {
                      toast.success("Deleted");
                      setSwipedItems(prev => {
                        const newState = { ...prev };
                        delete newState[email.id];
                        return newState;
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {swipedItems[email.id] === 'right' && (
                <div className="absolute left-0 top-0 h-full flex items-center gap-1 px-2 bg-blue-50">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-12 text-blue-600"
                    onClick={() => {
                      toast.success("Archived");
                      setSwipedItems(prev => {
                        const newState = { ...prev };
                        delete newState[email.id];
                        return newState;
                      });
                    }}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <Card 
                className={`cursor-pointer transition-transform ${swipedItems[email.id] ? 'translate-x-16' : ''}`}
                onClick={() => toast(`Opening: ${email.subject}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <span className={`font-semibold ${email.unread ? '' : 'font-normal'}`}>
                      {email.from}
                    </span>
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                  </div>
                  <p className={`text-sm ${email.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {email.subject}
                  </p>
                  {swipedItems[email.id] && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwipeReveal(email.id, 'left');
                        }}
                      >
                        Swipe Left ←
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwipeReveal(email.id, 'right');
                        }}
                      >
                        Swipe Right →
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!swipedItems[email.id] && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSwipeReveal(email.id, 'right')}
                  >
                    Reveal Left Actions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSwipeReveal(email.id, 'left')}
                  >
                    Reveal Right Actions
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="todo-list"
        title="Swipeable Todo Items"
        description="Quick actions for task management"
      >
        <div className="max-w-md mx-auto space-y-3">
          {[
            { id: 1, task: "Finish project proposal", completed: false },
            { id: 2, task: "Review pull requests", completed: false },
            { id: 3, task: "Team meeting at 3pm", completed: true },
          ].map((todo) => (
            <div key={todo.id} className="relative group">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${todo.completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                        {todo.completed && (
                          <div className="text-white text-xs">✓</div>
                        )}
                      </div>
                      <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                        {todo.task}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => toast("Marked as favorite")}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => toast.success("Deleted")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="card-stack"
        title="Swipeable Card Stack"
        description="Tinder-style card swiping"
      >
        <div className="max-w-sm mx-auto">
          <div className="relative h-[500px]">
            {[
              { emoji: "🎧", name: "Premium Headphones", price: "$299" },
              { emoji: "⌚", name: "Smart Watch", price: "$449" },
              { emoji: "📱", name: "Smartphone", price: "$899" },
            ].map((item, i) => (
              <Card
                key={i}
                className="absolute inset-0 cursor-pointer hover:shadow-xl transition-all"
                style={{
                  transform: `translateY(${i * 20}px) scale(${1 - i * 0.05})`,
                  zIndex: 3 - i,
                }}
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center text-9xl">
                    {item.emoji}
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2">{item.name}</h3>
                    <p className="text-2xl text-primary mb-6">{item.price}</p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-14 w-14 rounded-full"
                        onClick={() => toast("Passed")}
                      >
                        <span className="text-2xl">✕</span>
                      </Button>
                      <Button
                        size="icon"
                        className="h-14 w-14 rounded-full"
                        onClick={() => toast.success("Liked!")}
                      >
                        <span className="text-2xl">❤️</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Swipe left to pass, right to like
          </p>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
