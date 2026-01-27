import { ShowcaseSection } from "../ShowcaseSection";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent } from "../ui-adapters/Card";
import { Quote } from "lucide-react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function LongformReadingShowcase() {
  const sections = [
    { id: "article-body", title: "Article Body" },
    { id: "pull-quotes", title: "Pull Quotes" },
    { id: "author-bio", title: "Author Bio" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="article-body"
        title="Article Body"
        description="Optimized long-form reading experience with drop caps and section breaks"
      >
        <Card>
          <CardContent className="p-xl md:p-2xl max-w-3xl mx-auto">
            {/* Article Header */}
            <div className="mb-2xl pb-xl border-b">
              <Badge className="mb-md">Design & Culture</Badge>
              <h1 className="text-4xl md:text-5xl mb-lg leading-tight">
                The Art of Editorial Design in the Digital Age
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                How traditional magazine design principles are evolving for the web, 
                creating new opportunities for storytelling and reader engagement.
              </p>
            </div>

            {/* Body Text with Drop Cap */}
            <div className="prose prose-lg max-w-none">
              <p className="first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-sm first-letter:mt-1 first-letter:leading-none">
                The evolution of editorial design has always been tied to the technologies 
                and mediums through which stories are told. From Gutenberg's press to the 
                glossy pages of Vogue, each innovation has brought new possibilities for 
                how we present information, evoke emotion, and guide readers through 
                complex narratives.
              </p>

              <p className="mt-lg leading-relaxed text-muted-foreground">
                Today, we stand at another inflection point. Digital platforms have 
                democratized publishing, but they've also created new challenges. How do 
                we maintain the craft, beauty, and intentionality of great editorial design 
                when everyone has a website? How do we create reading experiences that 
                honor both the content and the reader?
              </p>

              <h2 className="text-3xl mt-2xl mb-lg font-bold">
                The Principles Remain Timeless
              </h2>

              <p className="leading-relaxed text-muted-foreground">
                Despite technological change, the fundamentals of editorial design haven't 
                shifted. Typography still matters. White space is still sacred. The 
                relationship between image and text remains crucial. What has changed is 
                our ability to adapt these principles to new contexts—responsive layouts, 
                variable fonts, and interactive elements.
              </p>

              <p className="mt-lg leading-relaxed text-muted-foreground">
                Consider the work of legendary art directors like Alexey Brodovitch at 
                Harper's Bazaar or Fabien Baron at Vogue. Their layouts weren't just 
                beautiful—they were strategic. Every element served the story. Every white 
                space gave the reader room to breathe. These aren't tricks; they're 
                timeless design principles that translate perfectly to digital media.
              </p>
            </div>

            {/* Section Divider */}
            <div className="my-2xl flex justify-center">
              <div className="flex gap-xs">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                <div className="w-2 h-2 rounded-full bg-primary/30" />
              </div>
            </div>

            {/* Continue Body */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl mb-lg font-bold">
                The Digital Advantage
              </h2>

              <p className="leading-relaxed text-muted-foreground">
                What's exciting about digital editorial design is how it expands the 
                designer's toolkit. We can now use animation to guide attention, 
                interactive elements to deepen engagement, and responsive layouts to ensure 
                beauty across all screen sizes. The constraint of a fixed page is gone; in 
                its place, we have infinite possibilities.
              </p>

              <p className="mt-lg leading-relaxed text-muted-foreground">
                But with great power comes great responsibility. The best digital editorial 
                designs don't use every trick available—they use the right tricks for the 
                story. They respect the reader's time and attention. They create hierarchy 
                through restraint as much as through flourish.
              </p>
            </div>
          </CardContent>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        id="pull-quotes"
        title="Pull Quotes"
        description="Highlighted quotes to break up long-form content"
      >
        <div className="space-y-xl">
          {/* Large Center Pull Quote */}
          <Card className="bg-primary/5 border-l-4 border-primary">
            <CardContent className="p-xl md:p-2xl">
              <Quote className="w-12 h-12 text-primary mb-lg" />
              <blockquote className="text-3xl md:text-4xl leading-tight mb-lg">
                "The best editorial design doesn't shout—it whispers. It guides without 
                forcing, illuminates without glaring."
              </blockquote>
              <cite className="text-lg text-muted-foreground not-italic">
                — Massimo Vignelli, Design Legend
              </cite>
            </CardContent>
          </Card>

          {/* Side Pull Quote */}
          <div className="grid md:grid-cols-3 gap-xl">
            <Card className="md:col-span-2">
              <CardContent className="p-xl">
                <p className="leading-relaxed text-muted-foreground mb-md">
                  The relationship between designer and editor has always been collaborative. 
                  Great publications understand that design isn't decoration—it's an integral 
                  part of the storytelling process. When the editor and designer work in 
                  harmony, magic happens.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  This collaboration becomes even more important in digital contexts, where 
                  the designer must consider not just how something looks, but how it 
                  behaves, loads, and adapts to different contexts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-l-4 border-foreground">
              <CardContent className="p-lg flex flex-col justify-center h-full">
                <Quote className="w-8 h-8 text-foreground mb-md" />
                <blockquote className="text-xl leading-tight mb-md">
                  "Design is intelligence made visible."
                </blockquote>
                <cite className="text-sm text-muted-foreground not-italic">
                  — Saul Bass
                </cite>
              </CardContent>
            </Card>
          </div>

          {/* Inline Quote */}
          <Card>
            <CardContent className="p-xl md:p-2xl">
              <div className="max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed text-muted-foreground mb-xl">
                  Typography is the foundation of editorial design. As type designer Erik 
                  Spiekermann once noted,
                </p>
                
                <div className="pl-xl border-l-4 border-primary my-xl bg-primary/5 p-lg">
                  <p className="text-2xl leading-relaxed">
                    "Type is a beautiful group of letters, not a group of beautiful letters."
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-muted-foreground mt-xl">
                  This insight captures something essential: great typography creates a 
                  unified reading experience, not just a collection of pretty letterforms. 
                  It's about rhythm, consistency, and serving the content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="author-bio"
        title="Author Bio"
        description="Editorial-style author information and credentials"
      >
        <div className="space-y-xl">
          {/* Inline Author Bio */}
          <Card>
            <CardContent className="p-xl md:p-2xl">
              <div className="flex flex-col md:flex-row gap-xl items-start">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <span className="text-6xl">✍️</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs tracking-widest uppercase text-muted-foreground mb-xs">
                    About the Author
                  </div>
                  <h3 className="text-2xl mb-md">Alexandra Chen</h3>
                  <p className="text-muted-foreground leading-relaxed mb-md">
                    Alexandra is a senior editor covering design, culture, and technology. 
                    Her work has appeared in leading publications including The New York Times, 
                    Wired, and Design Observer. She holds an MFA from Yale School of Art and 
                    lives in Brooklyn.
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <Badge variant="secondary">Design</Badge>
                    <Badge variant="secondary">Culture</Badge>
                    <Badge variant="secondary">Technology</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Author Byline */}
          <Card>
            <CardContent className="p-xl">
              <div className="text-xs tracking-widest uppercase text-muted-foreground mb-lg">
                Contributors
              </div>
              <div className="grid md:grid-cols-3 gap-lg">
                {[
                  { name: "Marcus Lee", role: "Photography", emoji: "📸" },
                  { name: "Sarah Chen", role: "Research", emoji: "📊" },
                  { name: "David Park", role: "Illustration", emoji: "🎨" }
                ].map((contributor, i) => (
                  <div key={i} className="text-center">
                    <div className="w-20 h-20 mx-auto mb-sm rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-3xl">{contributor.emoji}</span>
                    </div>
                    <div className="font-medium mb-1">{contributor.name}</div>
                    <div className="text-sm text-muted-foreground">{contributor.role}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Editor's Note */}
          <Card className="bg-muted/30">
            <CardContent className="p-xl">
              <div className="max-w-2xl mx-auto">
                <div className="text-xs tracking-widest uppercase text-muted-foreground mb-md">
                  Editor's Note
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  This article is part of our ongoing series exploring the intersection of 
                  design and technology. We invite readers to share their thoughts and 
                  experiences with digital editorial design in the comments below.
                </p>
                <div className="mt-lg pt-lg border-t">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-lg">📝</span>
                    </div>
                    <div>
                      <div className="font-medium">Emily Rodriguez</div>
                      <div className="text-sm text-muted-foreground">Senior Editor, Design</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
