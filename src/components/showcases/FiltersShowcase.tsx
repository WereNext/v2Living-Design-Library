import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function FiltersShowcase() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "sidebar-filters", title: "Sidebar Filters" },
    { id: "top-filters", title: "Top Bar Filters" },
    { id: "active-filters", title: "Active Filters" },
  ];

  const categories = [
    { id: "electronics", label: "Electronics", count: 124 },
    { id: "clothing", label: "Clothing", count: 89 },
    { id: "home", label: "Home & Garden", count: 56 },
    { id: "sports", label: "Sports", count: 42 },
  ];

  const brands = [
    { id: "brand-a", label: "Brand A", count: 34 },
    { id: "brand-b", label: "Brand B", count: 28 },
    { id: "brand-c", label: "Brand C", count: 19 },
    { id: "brand-d", label: "Brand D", count: 15 },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleBrand = (id: string) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    toast.success("Filters cleared");
  };

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="sidebar-filters"
        title="Sidebar Filters"
        description="Vertical filter panel for e-commerce"
      >
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Filters
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>Categories</Label>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label
                        htmlFor={category.id}
                        className="text-sm cursor-pointer"
                      >
                        {category.label}
                      </label>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({category.count})
                    </span>
                  </div>
                ))}
              </div>

              {/* Brands */}
              <div className="space-y-3">
                <Label>Brands</Label>
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={brand.id}
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={() => toggleBrand(brand.id)}
                      />
                      <label
                        htmlFor={brand.id}
                        className="text-sm cursor-pointer"
                      >
                        {brand.label}
                      </label>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({brand.count})
                    </span>
                  </div>
                ))}
              </div>

              <Button className="w-full" onClick={() => toast.success("Filters applied!")}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 flex items-center justify-center text-muted-foreground">
            Product grid would appear here
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="top-filters"
        title="Top Bar Filters"
        description="Horizontal filter bar for quick sorting"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                All Filters
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button variant="outline" size="sm">
                Price: Low to High
              </Button>
              <Button variant="outline" size="sm">
                Most Popular
              </Button>
              <Button variant="outline" size="sm">
                New Arrivals
              </Button>
              <Button variant="outline" size="sm">
                Top Rated
              </Button>
              <div className="flex-1" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 h-9 w-64"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-12 text-center text-muted-foreground">
          <p>Product results (245 items found)</p>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="active-filters"
        title="Active Filters Display"
        description="Show applied filters with remove option"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Active Filters ({selectedCategories.length + selectedBrands.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCategories.length === 0 && selectedBrands.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No filters applied
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((id) => {
                  const category = categories.find(c => c.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="gap-2">
                      {category?.label}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => toggleCategory(id)}
                      />
                    </Badge>
                  );
                })}
                {selectedBrands.map((id) => {
                  const brand = brands.find(b => b.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="gap-2">
                      {brand?.label}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => toggleBrand(id)}
                      />
                    </Badge>
                  );
                })}
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <Badge variant="secondary" className="gap-2">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => setPriceRange([0, 1000])}
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <Label>Try selecting some filters:</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedCategories(["electronics", "clothing"])}
            >
              Select Categories
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedBrands(["brand-a", "brand-b"])}
            >
              Select Brands
            </Button>
          </div>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
