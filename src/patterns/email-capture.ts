import type { PatternCategory } from "./types";

export const emailCapturePatterns: PatternCategory = {
  id: "email-capture",
  name: "Email Capture",
  description: "Forms and components for capturing email addresses and newsletter signups",
  intents: ["landing", "ecommerce", "web-app", "saas"],
  icon: "Mail",
  addedBy: "system",

  variants: [
    {
      id: "simple-card",
      name: "Simple Card",
      description: "Clean card with icon, title, and single email input",
      components: ["Card", "CardHeader", "CardContent", "CardTitle", "Input", "Button", "Label"],
      useWhen: [
        "newsletter signup",
        "simple email capture",
        "sidebar widget",
        "minimal form"
      ],
      tokens: {
        spacing: ["space-y-lg", "space-y-md", "space-y-xs", "mb-md"],
        colors: ["primary", "primary/10", "muted-foreground", "background"],
        radius: ["radius-md", "rounded-full"],
      },
      addedBy: "system",
      customizable: true,
      code: `<Card>
  <CardHeader className="text-center">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-md">
      <Mail className="w-6 h-6 text-primary" />
    </div>
    <CardTitle>Subscribe to our newsletter</CardTitle>
    <p className="text-sm text-muted-foreground">
      Get the latest updates delivered to your inbox
    </p>
  </CardHeader>
  <CardContent className="space-y-md">
    <div className="space-y-xs">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
    <Button className="w-full">Subscribe</Button>
    <p className="text-xs text-center text-muted-foreground">
      We respect your privacy. Unsubscribe anytime.
    </p>
  </CardContent>
</Card>`,
    },

    {
      id: "inline-compact",
      name: "Inline Compact",
      description: "Horizontal input with button, minimal footprint",
      components: ["Card", "CardContent", "Input", "Button"],
      useWhen: [
        "inline signup",
        "compact form",
        "footer newsletter",
        "minimal space"
      ],
      tokens: {
        spacing: ["pt-lg", "gap-sm"],
        colors: ["background"],
      },
      addedBy: "system",
      customizable: true,
      code: `<Card>
  <CardContent className="pt-lg">
    <div className="flex gap-sm">
      <div className="flex-1">
        <Input type="email" placeholder="Enter your email" />
      </div>
      <Button>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </CardContent>
</Card>`,
    },

    {
      id: "popup-discount",
      name: "Popup with Discount",
      description: "Eye-catching modal-style with incentive offer",
      components: ["Card", "CardContent", "Input", "Button", "Checkbox"],
      useWhen: [
        "popup modal",
        "discount offer",
        "first-time visitor",
        "exit intent",
        "promotional signup"
      ],
      tokens: {
        spacing: ["pt-lg", "mb-lg", "mb-md", "mb-xs", "space-y-md", "space-y-xs", "gap-xs", "top-md", "right-md", "mr-xs"],
        colors: ["muted-foreground", "foreground", "purple-400", "pink-400"],
        radius: ["rounded-full", "rounded-lg"],
        shadows: ["shadow-xl"],
      },
      addedBy: "system",
      customizable: true,
      code: `<Card className="border-2 shadow-xl">
  <CardContent className="pt-lg">
    <button className="absolute top-md right-md text-muted-foreground hover:text-foreground">
      ✕
    </button>
    <div className="text-center mb-lg">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-md text-3xl">
        🎁
      </div>
      <h3 className="mb-xs">Get 20% off your first order!</h3>
      <p className="text-muted-foreground">
        Join our newsletter and receive exclusive offers
      </p>
    </div>
    <div className="space-y-md">
      <div className="space-y-xs">
        <Input type="email" placeholder="Enter your email" />
      </div>
      <div className="flex items-start gap-xs">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
          I agree to receive marketing emails and accept the privacy policy
        </label>
      </div>
      <Button className="w-full" size="lg">
        <Gift className="w-4 h-4 mr-xs" />
        Claim My Discount
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        10,000+ people already subscribed
      </p>
    </div>
  </CardContent>
</Card>`,
    },

    {
      id: "gradient-banner",
      name: "Gradient Banner",
      description: "Full-width gradient banner with two-column layout",
      components: ["Input", "Button"],
      useWhen: [
        "hero section",
        "landing page",
        "full-width banner",
        "prominent signup"
      ],
      tokens: {
        spacing: ["p-xl", "gap-xl", "mb-md", "mb-xs", "gap-xs"],
        colors: ["blue-600", "purple-600", "white", "white/90"],
        radius: ["rounded-lg"],
      },
      addedBy: "system",
      customizable: true,
      code: `<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-xl text-white">
  <div className="max-w-3xl mx-auto">
    <div className="grid md:grid-cols-2 gap-xl items-center">
      <div>
        <Sparkles className="w-10 h-10 mb-md" />
        <h3 className="text-white mb-xs">Stay updated</h3>
        <p className="text-white/90">
          Join our community and never miss an update
        </p>
      </div>
      <div className="flex gap-xs">
        <Input type="email" placeholder="Your email" className="bg-white/90 flex-1" />
        <Button variant="secondary">Subscribe</Button>
      </div>
    </div>
  </div>
</div>`,
    },

    {
      id: "waitlist-card",
      name: "Waitlist Card",
      description: "Two-column card for early access waitlists",
      components: ["Card", "CardContent", "Input", "Button"],
      useWhen: [
        "waitlist",
        "early access",
        "coming soon",
        "beta signup"
      ],
      tokens: {
        spacing: ["pt-lg", "gap-lg", "mb-xs", "gap-xs"],
        colors: ["muted-foreground"],
      },
      addedBy: "system",
      customizable: true,
      code: `<Card>
  <CardContent className="pt-lg">
    <div className="grid md:grid-cols-[1fr_auto] gap-lg items-center">
      <div>
        <h4 className="mb-xs">Get early access</h4>
        <p className="text-sm text-muted-foreground">
          Be the first to know when we launch new features
        </p>
      </div>
      <div className="flex gap-xs md:min-w-[400px]">
        <Input type="email" placeholder="Enter your email" className="flex-1" />
        <Button>Join Waitlist</Button>
      </div>
    </div>
  </CardContent>
</Card>`,
    },

    {
      id: "newsletter-dashed",
      name: "Weekly Newsletter",
      description: "Centered card with trust badges and dashed border",
      components: ["Input", "Button"],
      useWhen: [
        "weekly newsletter",
        "content subscription",
        "blog signup",
        "trust indicators"
      ],
      tokens: {
        spacing: ["p-xl", "mb-md", "mb-xs", "mb-lg", "gap-sm", "gap-lg", "gap-xs"],
        colors: ["muted-foreground", "green-600"],
        radius: ["rounded-lg"],
      },
      addedBy: "system",
      customizable: true,
      code: `<div className="border-2 border-dashed rounded-lg p-xl">
  <div className="max-w-2xl mx-auto text-center">
    <div className="text-5xl mb-md">📬</div>
    <h3 className="mb-xs">Weekly Newsletter</h3>
    <p className="text-muted-foreground mb-lg">
      Tips, tutorials, and exclusive content delivered every week
    </p>
    <div className="flex flex-col sm:flex-row gap-sm max-w-md mx-auto mb-lg">
      <Input type="email" placeholder="you@example.com" className="flex-1" />
      <Button>Sign Up Free</Button>
    </div>
    <div className="flex items-center justify-center gap-lg text-sm text-muted-foreground">
      <div className="flex items-center gap-xs">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        No spam
      </div>
      <div className="flex items-center gap-xs">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        Unsubscribe anytime
      </div>
      <div className="flex items-center gap-xs">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        Free forever
      </div>
    </div>
  </div>
</div>`,
    },
  ],
};
