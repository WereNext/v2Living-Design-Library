import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and transform your workflow today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => toast.success("Starting free trial!")}>
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
              Contact Sales
            </Button>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-12 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>
          <h2 className="text-white mb-4">Get 50% off your first year</h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Sign up now and save on our annual plan. Offer ends soon!
          </p>
          <Button size="lg" variant="secondary" onClick={() => toast.success("Claiming offer!")}>
            Claim This Deal
          </Button>
          <p className="text-sm text-white/70 mt-4">No credit card required • Cancel anytime</p>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="with-features"
        title="CTA with Features"
        description="Call-to-action combined with feature highlights"
      >
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Everything you need to succeed</h2>
              <p className="text-xl text-muted-foreground">
                Start building amazing products in minutes, not hours
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h4 className="mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-12 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-white mb-4">Stay in the loop</h2>
            <p className="text-lg text-white/90 mb-8">
              Get weekly tips, exclusive content, and product updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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
            <p className="text-sm text-white/70 mt-4">
              Join 50,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-6 border-2 border-dashed border-border rounded-lg p-12">
          <div className="max-w-2xl mx-auto text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="mb-4">Join our community</h3>
            <p className="text-muted-foreground mb-6">
              Get instant access to exclusive resources, early feature previews, and connect 
              with other professionals in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <Input type="email" placeholder="you@company.com" className="flex-1" />
              <Button onClick={() => toast.success("Welcome to the community!")}>
                Join Now
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                No spam
              </div>
              <div className="flex items-center gap-2">
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
