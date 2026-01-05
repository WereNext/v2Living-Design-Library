import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Home, Search, Bell, User, ShoppingBag, Heart, MessageCircle, PlusCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function BottomNavShowcase() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeTab2, setActiveTab2] = useState("shop");

  const sections = [
    { id: "basic", title: "Basic Bottom Nav" },
    { id: "with-labels", title: "With Labels" },
    { id: "with-badge", title: "With Notifications" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="basic"
        title="Basic Bottom Navigation"
        description="Simple bottom navigation for mobile apps"
      >
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-b from-blue-50 to-purple-50 rounded-t-lg p-8 text-center">
            <h3 className="mb-2">Mobile App Screen</h3>
            <p className="text-muted-foreground">
              Content area with bottom navigation below
            </p>
          </div>
          <div className="border-t bg-white rounded-b-lg shadow-lg">
            <div className="flex justify-around items-center h-16">
              {[
                { icon: Home, id: "home" },
                { icon: Search, id: "search" },
                { icon: Bell, id: "notifications" },
                { icon: User, id: "profile" },
              ].map(({ icon: Icon, id }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    toast(`Navigated to ${id}`);
                  }}
                  className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                    activeTab === id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="with-labels"
        title="Bottom Nav with Labels"
        description="Navigation with icon labels for better clarity"
      >
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-t-lg p-8 text-center">
            <h3 className="mb-2">Shopping App</h3>
            <p className="text-muted-foreground">
              Browse products with easy navigation
            </p>
          </div>
          <div className="border-t bg-white rounded-b-lg shadow-lg">
            <div className="flex justify-around items-center py-2">
              {[
                { icon: ShoppingBag, id: "shop", label: "Shop" },
                { icon: Search, id: "search", label: "Search" },
                { icon: Heart, id: "wishlist", label: "Wishlist" },
                { icon: User, id: "account", label: "Account" },
              ].map(({ icon: Icon, id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab2(id);
                    toast(`Opened ${label}`);
                  }}
                  className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    activeTab2 === id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="with-badge"
        title="Bottom Nav with Notifications"
        description="Navigation with notification badges and center action"
      >
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-t-lg p-8 text-center">
            <h3 className="mb-2">Social App</h3>
            <p className="text-muted-foreground">
              Stay connected with notifications
            </p>
          </div>
          <div className="border-t bg-white rounded-b-lg shadow-lg relative">
            <div className="flex justify-around items-center h-16">
              {[
                { icon: Home, id: "home", label: "Home" },
                { icon: Search, id: "explore", label: "Explore" },
                { icon: PlusCircle, id: "create", label: "Create", center: true },
                { icon: Bell, id: "activity", label: "Activity", badge: 5 },
                { icon: MessageCircle, id: "messages", label: "Messages", badge: 2 },
              ].map(({ icon: Icon, id, label, badge, center }) => (
                <button
                  key={id}
                  onClick={() => toast(`${label} clicked!`)}
                  className={`relative flex flex-col items-center justify-center ${
                    center ? "w-14 h-14 -mt-7 bg-primary text-white rounded-full shadow-lg" : "flex-1"
                  } transition-colors ${
                    !center && "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={center ? "w-6 h-6" : "w-5 h-5"} />
                  {badge && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
