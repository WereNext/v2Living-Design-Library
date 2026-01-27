import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Input } from "../ui-adapters/Input";
import { ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function CTABlocksShowcase() {
  const sections = [
    { id: "simple-cta", title: "Simple CTA" },
    { id: "with-features", title: "With Features" },
    { id: "newsletter", title: "Newsletter Signup" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="simple-cta"
        title="Simple CTA Block"
        description="Clean and direct call-to-action sections"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2xl text-center text-white">
          <h2 className="text-white mb-md">Ready to get started?</h2>
          <p className="text-xl text-white/90 mb-xl max-w-2xl mx-auto">
            Join thousands of satisfied customers and transform your workflow today.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Button size="lg" variant="secondary" onClick={() => toast.success("Starting free trial!")}>
              Start Free Trial
              <ArrowRight className="ml-xs w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
              Contact Sales
            </Button>
          </div>
        </div>

        <div className="mt-lg bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-2xl text-center text-white">
          <div className="inline-flex items-center gap-xs bg-white/20 rounded-full px-md py-xs mb-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>
          <h2 className="text-white mb-md">Get 50% off your first year</h2>
          <p className="text-lg text-white/90 mb-xl max-w-xl mx-auto">
            Sign up now and save on our annual plan. Offer ends soon!
          </p>
          <Button size="lg" variant="secondary" onClick={() => toast.success("Claiming offer!")}>
            Claim This Deal
          </Button>
          <p className="text-sm text-white/70 mt-md">No credit card required • Cancel anytime</p>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="with-features"
        title="CTA with Features"
        description="Call-to-action combined with feature highlights"
      >
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-2xl">
              <h2 className="mb-md">Everything you need to succeed</h2>
              <p className="text-xl text-muted-foreground">
                Start building amazing products in minutes, not hours
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-lg mb-2xl">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  desc: "Deploy in seconds with our optimized platform",
                },
                {
                  icon: "🔒",
                  title: "Secure by Default",
                  desc: "Enterprise-grade security built in",
                },
                {
                  icon: "📊",
                  title: "Analytics Included",
                  desc: "Track everything that matters",
                },
              ].map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="text-4xl mb-sm">{feature.icon}</div>
                  <h4 className="mb-xs">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-md justify-center">
              <Button size="lg" onClick={() => toast.success("Getting started!")}>
                Get Started Free
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="newsletter"
        title="Newsletter Signup CTA"
        description="Email capture with compelling copy"
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-2xl text-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-5xl mb-md">📬</div>
            <h2 className="text-white mb-md">Stay in the loop</h2>
            <p className="text-lg text-white/90 mb-xl">
              Get weekly tips, exclusive content, and product updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-sm max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/90 flex-1"
              />
              <Button
                size="lg"
                variant="secondary"
                onClick={() => toast.success("Subscribed successfully!")}
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-md">
              Join 50,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-lg border-2 border-dashed border-border rounded-lg p-2xl">
          <div className="max-w-2xl mx-auto text-center">
            <Zap className="w-12 h-12 mx-auto mb-md text-primary" />
            <h3 className="mb-md">Join our community</h3>
            <p className="text-muted-foreground mb-lg">
              Get instant access to exclusive resources, early feature previews, and connect 
              with other professionals in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-sm max-w-md mx-auto mb-lg">
              <Input type="email" placeholder="you@company.com" className="flex-1" />
              <Button onClick={() => toast.success("Welcome to the community!")}>
                Join Now
              </Button>
            </div>
            <div className="flex items-center justify-center gap-lg text-sm text-muted-foreground">
              <div className="flex items-center gap-xs">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Free forever
              </div>
              <div className="flex items-center gap-xs">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                No spam
              </div>
              <div className="flex items-center gap-xs">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Instant access
              </div>
            </div>
          </div>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
