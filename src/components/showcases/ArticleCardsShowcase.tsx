import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent } from "../ui-adapters/Card";
import { ArrowRight, Bookmark, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function ArticleCardsShowcase() {
  const sections = [
    { id: "featured-grid", title: "Featured Grid" },
    { id: "magazine-layout", title: "Magazine Layout" },
    { id: "list-view", title: "List View" },
  ];

  const articles = [
    {
      id: 1,
      category: "Fashion",
      title: "The Return of Minimalist Design: Why Less Is Always More",
      dek: "How the fashion world is embracing simplicity and rejecting excess in the new decade",
      author: "Emma Thompson",
      authorRole: "Fashion Editor",
      date: "Dec 28, 2025",
      readTime: "8 min",
      image: "👗",
      featured: true
    },
    {
      id: 2,
      category: "Culture",
      title: "Inside the Studio: Conversations with Contemporary Artists",
      dek: "Five artists share their process, inspiration, and vision for the future",
      author: "Marcus Lee",
      authorRole: "Art Critic",
      date: "Dec 27, 2025",
      readTime: "12 min",
      image: "🎨",
      featured: false
    },
    {
      id: 3,
      category: "Technology",
      title: "The Digital Renaissance: How Tech is Reshaping Editorial",
      dek: "From print to pixels, the evolution of storytelling continues",
      author: "Sarah Chen",
      authorRole: "Tech Reporter",
      date: "Dec 26, 2025",
      readTime: "10 min",
      image: "💻",
      featured: false
    },
    {
      id: 4,
      category: "Lifestyle",
      title: "Crafting the Perfect Morning Routine for Creative Minds",
      dek: "How successful designers start their day with intention and focus",
      author: "David Park",
      authorRole: "Lifestyle Writer",
      date: "Dec 25, 2025",
      readTime: "6 min",
      image: "☕",
      featured: false
    }
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="featured-grid"
        title="Featured Grid"
        description="Editorial grid with featured article and supporting stories"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Featured Article - Large */}
          <Card className="md:col-span-2 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-7xl sm:text-8xl lg:text-9xl">{articles[0].image}</span>
              </div>
              <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <Badge variant="outline">{articles[0].category}</Badge>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {articles[0].readTime}
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4 leading-tight">
                  {articles[0].title}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  {articles[0].dek}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{articles[0].author}</div>
                      <div className="text-xs text-muted-foreground">{articles[0].authorRole}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Supporting Articles - Grid */}
          {articles.slice(1).map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                <span className="text-5xl sm:text-6xl">{article.image}</span>
              </div>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 leading-tight">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                  {article.dek}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium">{article.author}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{article.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="magazine-layout"
        title="Magazine Layout"
        description="Classic magazine-inspired asymmetric layout"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Large Feature */}
          <div className="lg:col-span-8">
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <span className="text-6xl sm:text-7xl lg:text-8xl">📸</span>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <Badge className="bg-background text-foreground text-xs sm:text-sm">Featured</Badge>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <Badge variant="outline" className="mb-3 sm:mb-4">Photography</Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 leading-tight">
                  A Visual Journey Through Modern Architecture
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  Exploring the intersection of form, function, and artistic expression 
                  in contemporary design. An exclusive photo essay.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <span className="text-lg sm:text-xl">📷</span>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-medium">James Rodriguez</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Contributing Photographer</div>
                    </div>
                  </div>
                  <Button onClick={() => toast.success("Opening gallery...")} size="sm" className="w-full sm:w-auto">
                    View Gallery
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Column with Multiple Stories */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {articles.slice(1, 3).map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-6">
                  <Badge variant="secondary" className="mb-2 sm:mb-3 text-xs">
                    {article.category}
                  </Badge>
                  <h3 className="text-base sm:text-lg mb-2 leading-tight">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 sm:mb-3">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    By {article.author}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="list-view"
        title="List View"
        description="Clean list format for editorial archives and sections"
      >
        <div className="space-y-4 sm:space-y-6">
          {articles.map((article, index) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-12 gap-4 sm:gap-6 items-start">
                  {/* Number Badge */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-base sm:text-xl font-bold text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="col-span-10 sm:col-span-11 md:col-span-8 order-1 md:order-none">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                      <span className="text-xs sm:text-sm text-muted-foreground">{article.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl mb-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2 md:line-clamp-none">
                      {article.dek}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{article.author}</span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">·</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{article.readTime}</span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="col-span-12 md:col-span-3 order-2 md:order-none">
                    <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl">{article.image}</span>
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