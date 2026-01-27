import { ShowcaseSection } from "../ShowcaseSection";
import { Card, CardContent } from "../ui-adapters/Card";
import { Badge } from "../ui-adapters/Badge";
import { Star, Quote } from "lucide-react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function TestimonialsShowcase() {
  const sections = [
    { id: "cards", title: "Testimonial Cards" },
    { id: "grid", title: "Testimonial Grid" },
    { id: "featured", title: "Featured Testimonial" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO at TechCorp",
      avatar: "👩",
      rating: 5,
      content: "This product has completely transformed how we work. The team is more productive and our clients are happier than ever.",
      company: "TechCorp"
    },
    {
      name: "Michael Chen",
      role: "Designer",
      avatar: "👨",
      rating: 5,
      content: "I've tried many tools, but this one stands out. The attention to detail and user experience is exceptional.",
      company: "Creative Studio"
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      avatar: "👩",
      rating: 5,
      content: "Finally, a solution that just works. No complicated setup, no learning curve. It's perfect.",
      company: "StartupXYZ"
    }
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="cards"
        title="Testimonial Cards"
        description="Individual testimonial cards with ratings"
      >
        <div className="grid md:grid-cols-3 gap-lg">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-lg">
                <div className="flex items-center gap-0.5 mb-md">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-md">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="grid"
        title="Testimonial Grid"
        description="Multi-column testimonial layout"
      >
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-xl">
          <div className="text-center mb-2xl">
            <h2 className="mb-md">Loved by thousands</h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {[...testimonials, ...testimonials].slice(0, 6).map((testimonial, i) => (
              <Card key={i} className="bg-white">
                <CardContent className="pt-lg">
                  <Quote className="w-8 h-8 text-primary/20 mb-sm" />
                  <p className="text-sm text-muted-foreground mb-md">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-sm pt-md border-t">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xl">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="featured"
        title="Featured Testimonial"
        description="Large, prominent testimonial section"
      >
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2xl text-white text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-white text-white" />
                ))}
              </div>
              <Quote className="w-12 h-12 mx-auto mb-lg text-white/40" />
              <blockquote className="text-2xl mb-xl text-white">
                &ldquo;This is hands down the best investment we've made for our business. 
                The ROI was visible within the first month, and our team productivity 
                has increased by 40%.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-md">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                  👨
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg text-white">David Martinez</p>
                  <p className="text-white/80">VP of Engineering at InnovateLabs</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-lg grid md:grid-cols-2 gap-lg">
          {[
            {
              quote: "Game-changing platform that saved us countless hours",
              author: "Lisa Wang",
              role: "Operations Manager",
              company: "GlobalTech"
            },
            {
              quote: "The support team is incredibly responsive and helpful",
              author: "James Taylor",
              role: "Founder",
              company: "StartupHub"
            }
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="pt-lg">
                <div className="flex gap-md">
                  <Quote className="w-10 h-10 text-primary/20 flex-shrink-0" />
                  <div>
                    <p className="mb-md italic">&ldquo;{item.quote}&rdquo;</p>
                    <div className="flex items-center gap-sm">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-xl">
                        {i === 0 ? '👩' : '👨'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.role} • {item.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
