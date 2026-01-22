import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Input } from "../ui-adapters/Input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Checkbox } from "../ui/checkbox";
import { Mail, Send, Gift, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function EmailCaptureShowcase() {
  const sections = [
    { id: "simple", title: "Simple Form" },
    { id: "popup-style", title: "Popup Style" },
    { id: "inline", title: "Inline Forms" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="simple"
        title="Simple Email Capture"
        description="Clean and minimal email subscription forms"
      >
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Subscribe to our newsletter</CardTitle>
              <p className="text-sm text-muted-foreground">
                Get the latest updates delivered to your inbox
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <Button className="w-full" onClick={() => toast.success("Subscribed!")}>
                Subscribe
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <Button onClick={() => toast.success("Subscribed!")}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="popup-style"
        title="Popup Style Forms"
        description="Eye-catching modal-style email capture"
      >
        <div className="max-w-lg mx-auto">
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                onClick={() => toast("Modal closed")}
              >
                ✕
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🎁
                </div>
                <h3 className="mb-2">Get 20% off your first order!</h3>
                <p className="text-muted-foreground">
                  Join our newsletter and receive exclusive offers
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                    I agree to receive marketing emails and accept the privacy policy
                  </label>
                </div>
                <Button className="w-full" size="lg" onClick={() => toast.success("Welcome! Check your email for the discount code")}>
                  <Gift className="w-4 h-4 mr-2" />
                  Claim My Discount
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  10,000+ people already subscribed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="inline"
        title="Inline Email Forms"
        description="Embeddable forms for landing pages"
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Sparkles className="w-10 h-10 mb-4" />
                  <h3 className="text-white mb-2">Stay updated</h3>
                  <p className="text-white/90">
                    Join our community and never miss an update
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-white/90 flex-1"
                  />
                  <Button variant="secondary" onClick={() => toast.success("Subscribed!")}>
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <h4 className="mb-2">Get early access</h4>
                  <p className="text-sm text-muted-foreground">
                    Be the first to know when we launch new features
                  </p>
                </div>
                <div className="flex gap-2 md:min-w-[400px]">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button onClick={() => toast.success("You're on the list!")}>
                    Join Waitlist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border-2 border-dashed rounded-lg p-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-5xl mb-4">📬</div>
              <h3 className="mb-2">Weekly Newsletter</h3>
              <p className="text-muted-foreground mb-6">
                Tips, tutorials, and exclusive content delivered every week
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                <Input type="email" placeholder="you@example.com" className="flex-1" />
                <Button onClick={() => toast.success("Welcome aboard!")}>
                  Sign Up Free
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  No spam
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Unsubscribe anytime
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Free forever
                </div>
              </div>
            </div>
          </div>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
