import { ShowcaseSection } from "../ShowcaseSection";
import { ShowcaseCard } from "../ShowcaseCard";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui-adapters/Card";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function ProductCardsShowcase() {
  const sections = [
    { id: "basic-cards", title: "Basic Product Cards" },
    { id: "grid-layout", title: "Grid Layout" },
    { id: "featured", title: "Featured Products" },
  ];

  const products = [
    {
      id: 1,
      name: "Premium Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: "🎧",
      rating: 4.5,
      reviews: 128,
      badge: "Sale"
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 449.99,
      image: "⌚",
      rating: 4.8,
      reviews: 256,
      badge: "New"
    },
    {
      id: 3,
      name: "Wireless Earbuds",
      price: 159.99,
      image: "🎵",
      rating: 4.6,
      reviews: 89,
      badge: "Popular"
    },
    {
      id: 4,
      name: "Laptop Stand",
      price: 79.99,
      image: "💻",
      rating: 4.3,
      reviews: 45
    }
  ];

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="basic-cards"
        title="Basic Product Cards"
        description="Essential product card components for e-commerce"
      >
        <ShowcaseCard
          defaultName="Basic Product Card"
          category="product"
          designIntent="ecommerce"
          description="Full-featured product card with image, rating, price, wishlist, and cart actions"
        >
          <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-48 flex items-center justify-center text-6xl relative">
                    {product.image}
                    {product.badge && (
                      <Badge className="absolute top-xs right-xs">
                        {product.badge}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-xs left-xs bg-white/80 hover:bg-white"
                      onClick={() => toast("Added to wishlist!")}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-md">
                  <div className="flex items-center gap-1 mb-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                  <CardTitle className="text-base mb-1">{product.name}</CardTitle>
                  <div className="flex items-center gap-xs">
                    <span className="text-xl">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-md pt-0 gap-xs">
                  <Button className="flex-1" onClick={() => toast.success("Added to cart!")}>
                    <ShoppingCart className="w-4 h-4 mr-xs" />
                    Add to Cart
                  </Button>
                  <Button variant="outline">Quick View</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ShowcaseCard>
      </ShowcaseSection>

      <ShowcaseSection
        id="grid-layout"
        title="Grid Layout"
        description="Responsive product grid with multiple items"
      >
        <ShowcaseCard
          defaultName="Product Card Grid"
          category="product"
          designIntent="ecommerce"
          description="Compact product cards designed for grid layouts with responsive columns"
        >
          <div className="grid gap-md grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 h-32 flex items-center justify-center text-4xl relative">
                  {product.image}
                  {product.badge && (
                    <Badge className="absolute top-1 right-1 text-xs">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-sm">
                  <p className="text-sm mb-1 truncate">{product.name}</p>
                  <p className="font-semibold">${product.price}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-sm pt-0">
                  <Button size="sm" className="w-full" onClick={() => toast.success("Added!")}>
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ShowcaseCard>
      </ShowcaseSection>

      <ShowcaseSection
        id="featured"
        title="Featured Product"
        description="Large featured product showcase"
      >
        <ShowcaseCard
          defaultName="Featured Product Card"
          category="product"
          designIntent="ecommerce"
          description="Large hero-style product card with detailed information, ideal for highlighting premium or featured items"
        >
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-100 md:w-1/2 h-64 md:h-auto flex items-center justify-center text-9xl">
                🎧
              </div>
              <div className="md:w-1/2 p-xl">
                <Badge className="mb-md">Featured Product</Badge>
                <h2 className="mb-xs">Premium Wireless Headphones</h2>
                <div className="flex items-center gap-xs mb-md">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-muted-foreground">(512 reviews)</span>
                </div>
                <p className="text-muted-foreground mb-lg">
                  Experience premium sound quality with active noise cancellation,
                  40-hour battery life, and comfort designed for all-day wear.
                </p>
                <div className="flex items-baseline gap-sm mb-lg">
                  <span className="text-4xl">$299.99</span>
                  <span className="text-xl text-muted-foreground line-through">$399.99</span>
                  <Badge variant="destructive">25% OFF</Badge>
                </div>
                <div className="flex gap-sm">
                  <Button size="lg" className="flex-1" onClick={() => toast.success("Added to cart!")}>
                    <ShoppingCart className="w-5 h-5 mr-xs" />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </ShowcaseCard>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
