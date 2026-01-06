import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Input } from "../ui-adapters/Input";
import { Badge } from "../ui-adapters/Badge";
import { ArrowRight, Play, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function HeroShowcase() {
  const sections = [
    { id: "centered", title: "Centered Hero" },
    { id: "split", title: "Split Hero" },
    { id: "video", title: "Video Background" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="centered"
        title="Centered Hero"
        description="Classic centered hero section with call-to-action"
      >
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-12 md:p-20 text-center">
          <Badge className="mb-4">New Release</Badge>
          <h1 className="mb-4 max-w-3xl mx-auto">
            Build amazing products faster than ever
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The complete design system with everything you need to create 
            beautiful, responsive applications in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" onClick={() => toast.success("Getting started!")}>
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              14-day free trial
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="split"
        title="Split Hero"
        description="Hero with content on one side and visual on the other"
      >
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12">
              <Badge className="mb-4" variant="secondary">
                💎 Premium Quality
              </Badge>
              <h1 className="mb-4">
                Transform your workflow today
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of teams already using our platform to ship 
                better products faster. Start your journey today.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex -space-x-2">
                  {['👨', '👩', '🧑', '👴'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    Loved by 10,000+ users
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => toast.success("Started trial!")}>
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  See Pricing
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-full min-h-[400px] flex items-center justify-center text-8xl">
              🚀
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="video"
        title="Video Background Hero"
        description="Full-width hero with video or gradient background"
      >
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg overflow-hidden text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 p-12 md:p-20 text-center">
            <h1 className="mb-4 text-white max-w-3xl mx-auto">
              The future of design is here
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Create stunning experiences with our cutting-edge tools and 
              components. Join the revolution today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="max-w-xs bg-white/90"
              />
              <Button size="lg" variant="secondary" onClick={() => toast.success("Subscribed!")}>
                Get Early Access
              </Button>
            </div>
            <p className="text-sm text-white/70">
              Join 50,000+ people already on the waitlist
            </p>
          </div>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
