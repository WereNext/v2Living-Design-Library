import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { ArrowRight, Bookmark, Share2, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function EditorialHeroShowcase() {
  const sections = [
    { id: "feature-story", title: "Feature Story Hero" },
    { id: "cover-story", title: "Cover Story" },
    { id: "breaking-news", title: "Breaking News" },
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="feature-story"
        title="Feature Story Hero"
        description="Large-format hero for long-form feature articles"
      >
        <div className="bg-card rounded-lg overflow-hidden border">
          {/* Large Feature Image */}
          <div className="relative aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent)]" />
            </div>
            <span className="text-5xl sm:text-7xl lg:text-8xl">📰</span>
          </div>

          {/* Article Metadata & Headline */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            {/* Category & Reading Time */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                Culture
              </Badge>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>12 min read</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">
              The Future of Editorial Design in the Digital Age
            </h1>

            {/* Dek (subheadline) */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              How premier publications are reinventing storytelling for a new generation 
              of readers seeking depth, beauty, and meaning in their content.
            </p>

            {/* Byline */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-b py-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium">Alexandra Chen</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Senior Editor</div>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                December 31, 2025
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => toast.success("Reading article...")} className="flex-1 sm:flex-none">
                Read Article
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="cover-story"
        title="Cover Story"
        description="Magazine-style cover with bold typography"
      >
        <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 text-background rounded-lg overflow-hidden min-h-[600px] flex items-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-background/20" />
              ))}
            </div>
          </div>

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
            {/* Issue Label */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-background">
                <div className="text-xs tracking-widest uppercase">Winter 2025 Issue</div>
              </div>
            </div>

            {/* Cover Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 sm:mb-8 leading-[0.9] tracking-tight">
              The Art of Storytelling
            </h1>

            {/* Cover Dek */}
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 opacity-90 leading-relaxed max-w-4xl">
              Inside the creative process of today's most influential writers and editors
            </p>

            {/* Additional Stories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 border-t-2 border-background pt-6 sm:pt-8 max-w-5xl">
              {[
                "Behind the Lens: Portrait of a Photographer",
                "Typography Matters: A Conversation with Type Directors",
                "The Return of Long-Form Journalism"
              ].map((title, i) => (
                <div key={i} className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="text-xs tracking-widest uppercase mb-2 opacity-60">
                    Page {(i + 1) * 24}
                  </div>
                  <div className="text-base sm:text-lg leading-tight">{title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="breaking-news"
        title="Breaking News"
        description="Time-sensitive editorial with urgency"
      >
        <div className="bg-destructive text-destructive-foreground rounded-lg px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Badge variant="secondary" className="animate-pulse">
              Breaking
            </Badge>
            <div className="text-lg sm:text-xl font-bold">
              Major Design System Update Released
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Badge>Technology</Badge>
            <span className="text-xs sm:text-sm text-muted-foreground">Updated 5 minutes ago</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 leading-tight">
            Industry Leaders Announce New Standards for Editorial Design Systems
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            In a coordinated announcement, major publications revealed a unified approach 
            to digital design that promises to reshape how we experience content online.
          </p>

          <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b mb-4 sm:mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <div className="text-sm sm:text-base font-medium">Breaking News Desk</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Live Updates</div>
            </div>
          </div>

          {/* Timeline of Updates */}
          <div className="space-y-3 sm:space-y-4">
            {[
              { time: "2:45 PM", text: "Initial announcement from design community" },
              { time: "3:12 PM", text: "Major publications confirm adoption" },
              { time: "3:28 PM", text: "Industry experts weigh in on implications" }
            ].map((update, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="font-mono text-muted-foreground sm:min-w-[80px]">
                  {update.time}
                </div>
                <div>{update.text}</div>
              </div>
            ))}
          </div>

          <Button className="mt-8" onClick={() => toast.success("Following story...")}>
            Follow This Story
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}