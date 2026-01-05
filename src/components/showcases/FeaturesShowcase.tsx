import { ShowcaseSection } from "../ShowcaseSection";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Zap, Shield, BarChart, Users, Smartphone, Globe } from "lucide-react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function FeaturesShowcase() {
  const sections = [
    { id: "icon-grid", title: "Icon Grid" },
    { id: "cards", title: "Feature Cards" },
    { id: "alternating", title: "Alternating Layout" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance ensures your app runs at peak speed",
      color: "from-yellow-400 to-orange-400"
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Enterprise-grade security built into every layer",
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Gain insights with powerful analytics and reporting",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time collaboration",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Fully responsive design works on any device",
      color: "from-red-400 to-rose-400"
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Deploy globally with edge network infrastructure",
      color: "from-indigo-400 to-violet-400"
    }
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="icon-grid"
        title="Icon Grid Layout"
        description="Clean feature grid with icons"
      >
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-12">
          <div className="text-center mb-12">
            <Badge className="mb-4">Features</Badge>
            <h2 className="mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you build better products faster
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="cards"
        title="Feature Cards"
        description="Features displayed as interactive cards"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="alternating"
        title="Alternating Feature Layout"
        description="Features with alternating image/content layout"
      >
        <div className="space-y-16">
          {[
            {
              title: "Collaborate in real-time",
              description: "Work together with your team seamlessly. See changes as they happen, comment on designs, and ship faster than ever before.",
              features: ["Live cursors", "Instant updates", "Team chat", "Version history"],
              image: "👥",
              reverse: false
            },
            {
              title: "Deploy anywhere",
              description: "One-click deployment to the cloud. Scale automatically with global CDN, automatic SSL, and edge caching built in.",
              features: ["Global CDN", "Auto-scaling", "Zero config", "Custom domains"],
              image: "🚀",
              reverse: true
            },
            {
              title: "Built for developers",
              description: "Modern developer experience with hot reload, TypeScript support, and comprehensive documentation.",
              features: ["TypeScript ready", "Hot reload", "CLI tools", "Great docs"],
              image: "💻",
              reverse: false
            }
          ].map((item, i) => (
            <div key={i} className={`grid md:grid-cols-2 gap-8 items-center ${item.reverse ? 'md:flex-row-reverse' : ''}`}>
              <div className={item.reverse ? 'md:order-2' : ''}>
                <Badge className="mb-4">Feature {i + 1}</Badge>
                <h3 className="mb-4">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-80 flex items-center justify-center text-8xl ${item.reverse ? 'md:order-1' : ''}`}>
                {item.image}
              </div>
            </div>
          ))}
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
