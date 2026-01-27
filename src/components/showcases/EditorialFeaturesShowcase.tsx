import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent } from "../ui-adapters/Card";
import { ArrowRight, Bookmark, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { Separator } from "../ui/separator";

export function EditorialFeaturesShowcase() {
  const sections = [
    { id: "section-headers", title: "Section Headers" },
    { id: "related-articles", title: "Related Articles" },
    { id: "share-tools", title: "Share & Bookmark" },
  ];

  const relatedArticles = [
    {
      id: 1,
      title: "The Evolution of Magazine Design",
      category: "Design History",
      readTime: "7 min"
    },
    {
      id: 2,
      title: "Typography Best Practices for Web Editorial",
      category: "Typography",
      readTime: "9 min"
    },
    {
      id: 3,
      title: "Creating Engaging Visual Hierarchies",
      category: "Layout",
      readTime: "6 min"
    }
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="section-headers"
        title="Section Headers"
        description="Editorial section navigation and content organization"
      >
        <div className="space-y-xl">
          {/* Magazine-Style Section Header */}
          <Card>
            <CardContent className="p-2xl text-center">
              <div className="max-w-2xl mx-auto">
                <div className="inline-block px-lg py-xs border-2 border-foreground mb-lg">
                  <span className="text-xs tracking-widest uppercase font-bold">
                    Culture & Society
                  </span>
                </div>
                <h2 className="text-5xl mb-lg leading-tight">
                  The Modern Editorial
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Exploring the stories, ideas, and perspectives shaping our world
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Minimal Section Header */}
          <Card className="bg-muted/30">
            <CardContent className="p-xl">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-md mb-lg">
                  <div className="h-px bg-foreground flex-1" />
                  <Badge variant="outline" className="text-xs tracking-widest uppercase">
                    Features
                  </Badge>
                  <div className="h-px bg-foreground flex-1" />
                </div>
                <h2 className="text-4xl text-center mb-md">
                  This Week's Stories
                </h2>
                <p className="text-center text-muted-foreground">
                  Hand-picked articles from our editors
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bold Section Header with Number */}
          <Card className="bg-foreground text-background">
            <CardContent className="p-2xl">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-start gap-lg">
                  <div className="text-8xl font-bold opacity-30">
                    01
                  </div>
                  <div className="flex-1 pt-md">
                    <div className="text-sm tracking-widest uppercase opacity-75 mb-md">
                      Chapter One
                    </div>
                    <h2 className="text-4xl mb-md leading-tight">
                      The Foundations of Great Design
                    </h2>
                    <p className="text-lg opacity-90 leading-relaxed">
                      Understanding the principles that underpin all successful editorial work
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Grid Header */}
          <div className="grid md:grid-cols-4 gap-md">
            {[
              { name: "Fashion", emoji: "👗", count: 24 },
              { name: "Culture", emoji: "🎨", count: 31 },
              { name: "Technology", emoji: "💻", count: 18 },
              { name: "Lifestyle", emoji: "☕", count: 27 }
            ].map((category, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-lg text-center">
                  <div className="text-4xl mb-sm">{category.emoji}</div>
                  <h3 className="text-lg font-bold mb-xs">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} articles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="related-articles"
        title="Related Articles"
        description="Contextual article recommendations and series navigation"
      >
        <div className="space-y-xl">
          {/* Sidebar-Style Related */}
          <Card>
            <CardContent className="p-xl">
              <h3 className="text-2xl mb-lg pb-md border-b">
                Continue Reading
              </h3>
              <div className="space-y-lg">
                {relatedArticles.map((article) => (
                  <div key={article.id} className="group cursor-pointer">
                    <Badge variant="secondary" className="mb-xs text-xs">
                      {article.category}
                    </Badge>
                    <h4 className="text-lg mb-xs group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {article.readTime}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grid-Style Related */}
          <div>
            <div className="mb-lg">
              <h3 className="text-3xl mb-xs">You May Also Enjoy</h3>
              <p className="text-muted-foreground">
                Hand-picked stories from our editors
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-lg">
              {relatedArticles.map((article, i) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-lg">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-md">
                      <span className="text-2xl font-bold text-primary">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <Badge variant="outline" className="mb-sm text-xs">
                      {article.category}
                    </Badge>
                    <h4 className="text-lg mb-sm leading-tight">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{article.readTime}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Series Navigation */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-xl">
              <div className="flex items-start gap-lg">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📚</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs tracking-widest uppercase text-muted-foreground mb-xs">
                    Part of a Series
                  </div>
                  <h3 className="text-2xl mb-sm">
                    The Future of Editorial Design
                  </h3>
                  <p className="text-muted-foreground mb-lg">
                    A five-part exploration of how publishing is evolving in the digital age
                  </p>
                  <div className="flex flex-wrap gap-xs mb-lg">
                    {['Introduction', 'Typography', 'Layout', 'Interaction', 'Future'].map((part, i) => (
                      <Button 
                        key={i} 
                        variant={i === 1 ? "default" : "outline"}
                        size="sm"
                      >
                        {i + 1}. {part}
                      </Button>
                    ))}
                  </div>
                  <Button variant="link" className="p-0">
                    View Full Series
                    <ArrowRight className="ml-xs w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="share-tools"
        title="Share & Bookmark"
        description="Social sharing and content saving functionality"
      >
        <div className="space-y-xl">
          {/* Floating Share Bar */}
          <Card>
            <CardContent className="p-xl">
              <h3 className="text-xl mb-lg">Floating Share Toolbar</h3>
              <div className="flex items-center justify-center gap-md p-lg bg-muted/30 rounded-lg">
                <Button variant="outline" size="sm" onClick={() => toast.success("Bookmarked!")}>
                  <Bookmark className="w-4 h-4 mr-xs" />
                  Save
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-xs" />
                  More
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Share Card */}
          <Card>
            <CardContent className="p-xl">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl mb-md">Share This Story</h3>
                <p className="text-muted-foreground mb-xl">
                  Help us spread quality journalism and thoughtful design
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
                  {[
                    { name: 'Facebook', icon: Facebook, color: 'bg-blue-500' },
                    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
                    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
                    { name: 'Email', icon: Mail, color: 'bg-slate-500' }
                  ].map((platform) => (
                    <Button
                      key={platform.name}
                      variant="outline"
                      className="h-auto py-lg flex flex-col gap-xs"
                      onClick={() => toast.success(`Sharing on ${platform.name}...`)}
                    >
                      <platform.icon className="w-6 h-6" />
                      <span className="text-sm">{platform.name}</span>
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-md">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <Button 
                  variant="outline" 
                  className="mt-lg"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookmark Options */}
          <div className="grid md:grid-cols-2 gap-lg">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-xl">
                <Bookmark className="w-12 h-12 text-primary mb-md" />
                <h3 className="text-xl mb-xs">Save for Later</h3>
                <p className="text-muted-foreground mb-lg">
                  Add this article to your reading list and access it anytime
                </p>
                <Button onClick={() => toast.success("Added to reading list!")}>
                  Save Article
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-xl">
                <Mail className="w-12 h-12 text-primary mb-md" />
                <h3 className="text-xl mb-xs">Email This Story</h3>
                <p className="text-muted-foreground mb-lg">
                  Share this article directly with friends and colleagues
                </p>
                <Button variant="outline" onClick={() => toast.success("Opening email...")}>
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
