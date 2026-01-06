import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Card, CardContent } from "../ui-adapters/Card";
import { Badge } from "../ui-adapters/Badge";
import { Menu, X, Home, Search, User, Settings, Bell, ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function MobileMenuShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);

  const sections = [
    { id: "hamburger", title: "Hamburger Menu" },
    { id: "slide-out", title: "Slide Out Menu" },
    { id: "full-screen", title: "Full Screen Menu" },
  ];

  const menuItems = [
    { icon: Home, label: "Home", badge: null },
    { icon: Search, label: "Discover", badge: null },
    { icon: Bell, label: "Notifications", badge: "3" },
    { icon: User, label: "Profile", badge: null },
    { icon: Settings, label: "Settings", badge: null },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="hamburger"
        title="Hamburger Menu"
        description="Classic mobile navigation pattern"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <div className="border-b p-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h4>My App</h4>
              <Button size="icon" variant="ghost">
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {isOpen && (
              <div className="border-b bg-white">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors text-left"
                      onClick={() => {
                        toast(`Navigating to ${item.label}`);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="destructive">{item.badge}</Badge>
                      )}
                    </button>
                  );
                })}
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full" onClick={() => toast("Logging out...")}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            )}

            <CardContent className="p-8 text-center text-muted-foreground">
              <p className="text-sm">
                {isOpen ? "Menu is open" : "Tap the menu icon to open"}
              </p>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="slide-out"
        title="Slide Out Side Menu"
        description="Drawer-style navigation from the side"
      >
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Card>
              <div className="border-b p-4 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSlideMenuOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <h4>Dashboard</h4>
                <div className="w-10" />
              </div>
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Main content area
                </p>
              </CardContent>
            </Card>

            {/* Overlay */}
            {slideMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSlideMenuOpen(false)}
              />
            )}

            {/* Slide Menu */}
            <div
              className={`fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 transition-transform ${
                slideMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">John Doe</p>
                    <p className="text-xs text-white/80">john@example.com</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setSlideMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted rounded-lg transition-colors text-left"
                      onClick={() => {
                        toast(`Navigating to ${item.label}`);
                        setSlideMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <Button variant="outline" className="w-full" onClick={() => toast("Logging out...")}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSlideMenuOpen(!slideMenuOpen)}
            >
              {slideMenuOpen ? 'Close' : 'Open'} Side Menu
            </Button>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="full-screen"
        title="Full Screen Overlay Menu"
        description="Immersive full-screen navigation"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <div className="border-b p-4 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50">
              <h4>Travel App</h4>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toast("Opening full screen menu...")}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-white">Menu</h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {[
                    "Explore Destinations",
                    "My Trips",
                    "Bookings",
                    "Travel Guides",
                    "Settings",
                  ].map((item, i) => (
                    <button
                      key={item}
                      className="w-full text-left py-4 px-4 text-xl text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-12 pt-6 border-t border-white/20">
                  <Button variant="secondary" className="w-full">
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
