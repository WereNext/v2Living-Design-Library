import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, ArrowDown, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function PullRefreshShowcase() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const sections = [
    { id: "basic", title: "Basic Pull to Refresh" },
    { id: "custom", title: "Custom Animations" },
    { id: "infinite-scroll", title: "Infinite Scroll" },
  ];

  const simulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      toast.success("Content refreshed!");
    }, 2000);
  };

  const posts = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    author: ["Alice", "Bob", "Carol", "David", "Emma"][i],
    content: [
      "Just launched our new product! 🚀",
      "Beautiful weather today ☀️",
      "Working on something exciting...",
      "Coffee + Code = ❤️",
      "New blog post is live!"
    ][i],
    time: `${i + 1}h ago`,
    avatar: ["👩", "👨", "👩", "👨", "👩"][i]
  }));

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="basic"
        title="Basic Pull to Refresh"
        description="Standard pull-to-refresh pattern"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <div className="relative">
              {/* Pull indicator */}
              <div className={`flex items-center justify-center py-4 border-b bg-muted/50 transition-all ${isPulling ? 'opacity-100' : 'opacity-0'}`}>
                <ArrowDown className={`w-5 h-5 text-muted-foreground transition-transform ${isPulling ? 'animate-bounce' : ''}`} />
                <span className="ml-2 text-sm text-muted-foreground">
                  Pull to refresh
                </span>
              </div>

              {/* Refreshing indicator */}
              {isRefreshing && (
                <div className="flex items-center justify-center py-4 border-b bg-primary/10">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-primary">
                    Refreshing...
                  </span>
                </div>
              )}

              <CardContent className="p-0">
                <div className="p-4 border-b text-sm text-muted-foreground text-center">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-4 border-b last:border-0 hover:bg-muted/50">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xl flex-shrink-0">
                        {post.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{post.author}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-sm">{post.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>
          </Card>
          
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsPulling(!isPulling)}
            >
              {isPulling ? 'Release' : 'Simulate Pull'}
            </Button>
            <Button
              className="flex-1"
              onClick={simulateRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="custom"
        title="Custom Refresh Animations"
        description="Branded loading animations"
      >
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center text-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
                  <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin" />
                </div>
                <p className="text-sm font-semibold">Loading fresh content...</p>
                <p className="text-xs text-muted-foreground mt-1">Please wait</p>
              </div>
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-sm font-semibold text-white">Syncing...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="infinite-scroll"
        title="Infinite Scroll with Load More"
        description="Automatic content loading on scroll"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-0 max-h-[500px] overflow-auto">
              {posts.map((post) => (
                <div key={post.id} className="p-4 border-b hover:bg-muted/50">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xl flex-shrink-0">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{post.author}</span>
                        <span className="text-xs text-muted-foreground">{post.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => toast("Loading more...")}
                >
                  <Loader2 className="w-4 h-4 mr-2" />
                  Load More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
