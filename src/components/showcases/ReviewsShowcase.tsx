import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui-adapters/Input";
import { Label } from "../ui/label";
import { Star, ThumbsUp, ThumbsDown, Camera } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";
import { CodePlayground } from "../CodePlayground";

export function ReviewsShowcase() {
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, number>>({});
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const sections = [
    { id: "rating-summary", title: "Rating Summary" },
    { id: "review-list", title: "Review List" },
    { id: "write-review", title: "Write Review" },
    { id: "review-card", title: "Review Card" },
  ];

  const reviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      date: "2 days ago",
      verified: true,
      title: "Absolutely amazing!",
      content: "This product exceeded all my expectations. The quality is outstanding and it arrived quickly. Highly recommend to anyone looking for a reliable option.",
      helpful: 24,
      images: ["📷", "📷"]
    },
    {
      id: 2,
      author: "John D.",
      rating: 4,
      date: "1 week ago",
      verified: true,
      title: "Great value for money",
      content: "Really happy with this purchase. Good quality and works as described. Only minor issue is the packaging could be better.",
      helpful: 15
    },
    {
      id: 3,
      author: "Emma L.",
      rating: 5,
      date: "2 weeks ago",
      verified: false,
      title: "Love it!",
      content: "Perfect! Exactly what I was looking for. Will definitely buy again.",
      helpful: 8
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 124, percentage: 68 },
    { stars: 4, count: 32, percentage: 18 },
    { stars: 3, count: 15, percentage: 8 },
    { stars: 2, count: 7, percentage: 4 },
    { stars: 1, count: 4, percentage: 2 },
  ];

  const averageRating = 4.5;
  const totalReviews = 182;

  const markHelpful = (id: number) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    toast.success("Thanks for your feedback!");
  };

  const ratingSummaryCode = `import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

function RatingSummary({ averageRating, totalReviews, distribution }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:border-r">
            <div className="text-6xl font-bold mb-2">{averageRating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={\`w-6 h-6 \${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }\`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">
              Based on {totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm">{item.stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={item.percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <Button>Write a Review</Button>
        </div>
      </CardContent>
    </Card>
  );
}`;

  const reviewListCode = `import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";

function ReviewList({ reviews, onHelpful }) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{review.author}</span>
                  {review.verified && (
                    <Badge variant="secondary">Verified Purchase</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={\`w-4 h-4 \${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }\`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
            <h4 className="font-medium mb-2">{review.title}</h4>
            <p className="text-muted-foreground mb-4">{review.content}</p>
            <div className="flex items-center gap-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Was this helpful?</span>
              <Button size="sm" variant="outline" onClick={() => onHelpful(review.id)}>
                <ThumbsUp className="w-4 h-4 mr-1" /> Yes ({review.helpful})
              </Button>
              <Button size="sm" variant="outline">
                <ThumbsDown className="w-4 h-4 mr-1" /> No
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`;

  const writeReviewCode = `import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Camera } from "lucide-react";

function WriteReview({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Your Rating</Label>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i + 1)}
              >
                <Star
                  className={\`w-8 h-8 cursor-pointer transition-colors \${
                    i < (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                  }\`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="title">Review Title</Label>
          <Input id="title" placeholder="Summarize your experience" />
        </div>

        <div>
          <Label htmlFor="review">Your Review</Label>
          <Textarea id="review" placeholder="Tell others about your experience..." rows={4} />
        </div>

        <div>
          <Label>Add Photos (optional)</Label>
          <Button variant="outline" className="mt-2">
            <Camera className="w-4 h-4 mr-2" /> Add Photos
          </Button>
        </div>

        <Button className="w-full">Submit Review</Button>
      </CardContent>
    </Card>
  );
}`;

  const compactReviewCode = `import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

function CompactReviewCard({ review }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
            {review.author[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{review.author}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={\`w-3 h-3 \${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }\`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm font-medium mb-1">{review.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{review.content}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">{review.date}</span>
              {review.verified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}`;

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="rating-summary"
        title="Rating Summary"
        description="Overall product rating with distribution breakdown"
      >
        <CodePlayground code={ratingSummaryCode} preview={
          <Card>
            <CardContent className="pt-lg">
              <div className="grid md:grid-cols-2 gap-xl">
                <div className="text-center md:border-r">
                  <div className="text-6xl mb-xs">{averageRating}</div>
                  <div className="flex items-center justify-center gap-1 mb-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    Based on {totalReviews} reviews
                  </p>
                </div>
                <div className="space-y-xs">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-sm">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm">{item.stars}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-lg pt-lg border-t text-center">
                <Button onClick={() => toast("Opening review form...")}>
                  Write a Review
                </Button>
              </div>
            </CardContent>
          </Card>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="review-list"
        title="Review List"
        description="Customer reviews with helpful voting functionality"
      >
        <CodePlayground code={reviewListCode} preview={
          <div className="space-y-md">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-lg">
                  <div className="flex items-start justify-between mb-sm">
                    <div>
                      <div className="flex items-center gap-xs mb-1">
                        <span className="font-semibold">{review.author}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-xs">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h4 className="mb-xs">{review.title}</h4>
                  <p className="text-muted-foreground mb-md">{review.content}</p>
                  {review.images && (
                    <div className="flex gap-xs mb-md">
                      {review.images.map((img, i) => (
                        <div
                          key={i}
                          className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded flex items-center justify-center text-3xl cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => toast("Opening image...")}
                        >
                          {img}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-md pt-md border-t">
                    <span className="text-sm text-muted-foreground">
                      Was this helpful?
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markHelpful(review.id)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-xs" />
                      Yes ({review.helpful + (helpfulVotes[review.id] || 0)})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast("Feedback recorded")}
                    >
                      <ThumbsDown className="w-4 h-4 mr-xs" />
                      No
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="write-review"
        title="Write a Review"
        description="Review submission form with star rating selector"
      >
        <CodePlayground code={writeReviewCode} preview={
          <div className="max-w-lg mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-md">
                <div>
                  <Label>Your Rating</Label>
                  <div className="flex items-center gap-1 mt-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setSelectedRating(i + 1)}
                      >
                        <Star
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            i < (hoverRating || selectedRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                    {selectedRating > 0 && (
                      <span className="ml-sm text-sm text-muted-foreground">
                        {selectedRating === 1 && "Poor"}
                        {selectedRating === 2 && "Fair"}
                        {selectedRating === 3 && "Good"}
                        {selectedRating === 4 && "Very Good"}
                        {selectedRating === 5 && "Excellent"}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input id="review-title" placeholder="Summarize your experience" className="mt-xs" />
                </div>

                <div>
                  <Label htmlFor="review-body">Your Review</Label>
                  <Textarea
                    id="review-body"
                    placeholder="Tell others about your experience with this product..."
                    rows={4}
                    className="mt-xs"
                  />
                </div>

                <div>
                  <Label>Add Photos (optional)</Label>
                  <div className="flex gap-sm mt-xs">
                    <Button variant="outline" onClick={() => toast("Opening file picker...")}>
                      <Camera className="w-4 h-4 mr-xs" /> Add Photos
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-xs">
                    Add up to 5 photos to help others see what to expect
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    if (selectedRating === 0) {
                      toast.error("Please select a rating");
                    } else {
                      toast.success("Review submitted!");
                      setSelectedRating(0);
                    }
                  }}
                >
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </div>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="review-card"
        title="Compact Review Card"
        description="Condensed review format for product listings"
      >
        <CodePlayground code={compactReviewCode} preview={
          <div className="max-w-2xl mx-auto space-y-sm">
            {reviews.slice(0, 2).map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-md">
                  <div className="flex items-start gap-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {review.author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-xs mb-1">
                        <span className="font-semibold text-sm">{review.author}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-1">{review.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {review.content}
                      </p>
                      <div className="flex items-center gap-sm mt-xs">
                        <span className="text-xs text-muted-foreground">
                          {review.date}
                        </span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs h-5">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        } />
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
