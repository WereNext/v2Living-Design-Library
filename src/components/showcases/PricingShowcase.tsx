import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function PricingShowcase() {
  const sections = [
    { id: "three-tier", title: "Three Tier Pricing" },
    { id: "comparison", title: "Feature Comparison" },
  ];

  const plans = [
    {
      name: "Starter",
      price: 9,
      description: "Perfect for individuals getting started",
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "24/7 support",
        "1 GB storage"
      ]
    },
    {
      name: "Professional",
      price: 29,
      description: "For growing teams and businesses",
      popular: true,
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "50 GB storage",
        "Team collaboration",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      price: 99,
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated support",
        "Unlimited storage",
        "Advanced security",
        "SLA guarantee"
      ]
    }
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="three-tier"
        title="Three Tier Pricing"
        description="Classic pricing table with three tiers"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg scale-105" : ""}>
              <CardHeader>
                {plan.popular && (
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => toast.success(`Selected ${plan.name} plan!`)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="comparison"
        title="Simple Comparison"
        description="Side-by-side feature comparison"
      >
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Perfect Plan</CardTitle>
            <CardDescription>All plans include a 14-day free trial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2">Feature</th>
                    <th className="text-center py-4 px-2">Starter</th>
                    <th className="text-center py-4 px-2">Professional</th>
                    <th className="text-center py-4 px-2">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Projects", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
                    { feature: "Storage", starter: "1 GB", pro: "50 GB", enterprise: "Unlimited" },
                    { feature: "Team Members", starter: "1", pro: "10", enterprise: "Unlimited" },
                    { feature: "Support", starter: "Email", pro: "Priority", enterprise: "Dedicated" },
                    { feature: "API Access", starter: false, pro: true, enterprise: true },
                    { feature: "Custom Integrations", starter: false, pro: false, enterprise: true },
                  ].map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3 px-2">{row.feature}</td>
                      <td className="text-center py-3 px-2">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : '—'
                        ) : row.starter}
                      </td>
                      <td className="text-center py-3 px-2">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : '—'
                        ) : row.pro}
                      </td>
                      <td className="text-center py-3 px-2">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : '—'
                        ) : row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
