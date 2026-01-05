import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { toast } from "sonner";
import type { PlaygroundComponent } from "../types";

const PRICING_FEATURES = [
  "Unlimited projects",
  "Advanced analytics",
  "24/7 support",
  "Custom domain",
  "API access"
];

export const pricingCard: PlaygroundComponent = {
  id: "pricing-card",
  name: "Pricing Card",
  category: "Cards",
  code: `import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

export function PricingCard() {
  const features = [
    "Unlimited projects",
    "Advanced analytics",
    "24/7 support",
    "Custom domain",
    "API access"
  ];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Pro Plan</CardTitle>
          <Badge>Popular</Badge>
        </div>
        <CardDescription>
          Perfect for growing teams
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl">$29</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full" size="lg">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}`,
  preview: (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Pro Plan</CardTitle>
          <Badge>Popular</Badge>
        </div>
        <CardDescription>Perfect for growing teams</CardDescription>
        <div className="mt-4">
          <span className="text-4xl">$29</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {PRICING_FEATURES.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full" size="lg" onClick={() => toast.success("Subscribed to Pro!")}>
          Get Started
        </Button>
      </CardContent>
    </Card>
  )
};

export const statsCards: PlaygroundComponent = {
  id: "stats-cards",
  name: "Stats Cards",
  category: "Cards",
  code: `import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

export function StatsCards() {
  const stats = [
    { title: "Total Revenue", value: "$45,231", change: "+20.1%", emoji: "💰" },
    { title: "Active Users", value: "2,350", change: "+15.3%", emoji: "👥" },
    { title: "Total Orders", value: "1,234", change: "+8.2%", emoji: "🛒" },
    { title: "Growth Rate", value: "24.5%", change: "+4.1%", emoji: "📈" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">{stat.title}</CardTitle>
            <span className="text-2xl">{stat.emoji}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`,
  preview: (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Total Revenue</CardTitle>
          <span className="text-2xl">💰</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">$45,231</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+20.1%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Active Users</CardTitle>
          <span className="text-2xl">👥</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">2,350</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+15.3%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
};

export const cardComponents = [pricingCard, statsCards];
