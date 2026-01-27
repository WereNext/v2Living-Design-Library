import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Input } from "../ui-adapters/Input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Search, SlidersHorizontal, X, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";
import { CodePlayground } from "../CodePlayground";

export function FiltersShowcase() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const sections = [
    { id: "sidebar-filters", title: "Sidebar Filters" },
    { id: "top-filters", title: "Top Bar Filters" },
    { id: "search-autocomplete", title: "Search Autocomplete" },
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

  const searchSuggestions = [
    { type: "recent", text: "wireless headphones" },
    { type: "recent", text: "running shoes" },
    { type: "trending", text: "smart watch" },
    { type: "trending", text: "laptop stand" },
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

  const sidebarFiltersCode = `import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

function SidebarFilters({ categories, brands, onApply }) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Filters
          <Button variant="ghost" size="sm">Clear All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={10} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>\${priceRange[0]}</span>
            <span>\${priceRange[1]}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label>Categories</Label>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id={category.id} />
                <label htmlFor={category.id} className="text-sm">{category.label}</label>
              </div>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </div>

        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}`;

  const topFiltersCode = `import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

function TopFilterBar() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            All Filters
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button variant="outline" size="sm">Price: Low to High</Button>
          <Button variant="outline" size="sm">Most Popular</Button>
          <Button variant="outline" size="sm">New Arrivals</Button>
          <Button variant="outline" size="sm">Top Rated</Button>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9 h-9 w-64" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}`;

  const searchAutocompleteCode = `import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, TrendingUp } from "lucide-react";

function SearchAutocomplete({ suggestions, onSearch }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 h-12 text-base"
        />
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50">
          <CardContent className="p-2">
            {suggestions.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-muted"
                onClick={() => onSearch(item.text)}
              >
                {item.type === "recent" ? (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                )}
                <span>{item.text}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}`;

  const activeFiltersCode = `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

function ActiveFilters({ filters, onRemove, onClear }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Active Filters ({filters.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filters.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No filters applied
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge key={filter.id} variant="secondary" className="gap-2">
                {filter.label}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => onRemove(filter.id)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}`;

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="sidebar-filters"
        title="Sidebar Filters"
        description="Vertical filter panel for e-commerce product listings"
      >
        <CodePlayground code={sidebarFiltersCode} preview={
          <div className="grid md:grid-cols-[280px_1fr] gap-lg">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  Filters
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-lg">
                {/* Search */}
                <div className="space-y-xs">
                  <Label>Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-sm top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-sm">
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
                <div className="space-y-sm">
                  <Label>Categories</Label>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-xs">
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
                <div className="space-y-sm">
                  <Label>Brands</Label>
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-xs">
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

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-xl flex items-center justify-center text-muted-foreground">
              Product grid would appear here
            </div>
          </div>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="top-filters"
        title="Top Bar Filters"
        description="Horizontal filter bar for quick sorting and filtering"
      >
        <CodePlayground code={topFiltersCode} preview={
          <>
            <Card>
              <CardContent className="p-md">
                <div className="flex flex-wrap items-center gap-sm">
                  <Button variant="outline" size="sm" onClick={() => toast("Opening filter panel...")}>
                    <SlidersHorizontal className="w-4 h-4 mr-xs" />
                    All Filters
                  </Button>
                  <div className="h-6 w-px bg-border" />
                  <Button variant="outline" size="sm" onClick={() => toast("Sorting by price...")}>
                    Price: Low to High
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast("Sorting by popularity...")}>
                    Most Popular
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast("Showing new arrivals...")}>
                    New Arrivals
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast("Sorting by rating...")}>
                    Top Rated
                  </Button>
                  <div className="flex-1" />
                  <div className="relative">
                    <Search className="absolute left-sm top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      className="pl-9 h-9 w-64"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-lg bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-2xl text-center text-muted-foreground">
              <p>Product results (245 items found)</p>
            </div>
          </>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="search-autocomplete"
        title="Search with Autocomplete"
        description="Search input with recent and trending suggestions"
      >
        <CodePlayground code={searchAutocompleteCode} preview={
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-md top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-12 h-12 text-base"
                />
              </div>

              {showSuggestions && (
                <Card className="absolute top-full left-0 right-0 mt-xs z-50">
                  <CardContent className="p-xs">
                    <div className="px-sm py-xs text-xs text-muted-foreground uppercase tracking-wide">
                      Recent Searches
                    </div>
                    {searchSuggestions
                      .filter((s) => s.type === "recent")
                      .map((item, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-sm px-sm py-xs rounded hover:bg-muted text-left"
                          onClick={() => {
                            setSearchQuery(item.text);
                            toast(`Searching for "${item.text}"...`);
                          }}
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{item.text}</span>
                        </button>
                      ))}
                    <div className="px-sm py-xs text-xs text-muted-foreground uppercase tracking-wide mt-xs">
                      Trending
                    </div>
                    {searchSuggestions
                      .filter((s) => s.type === "trending")
                      .map((item, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-sm px-sm py-xs rounded hover:bg-muted text-left"
                          onClick={() => {
                            setSearchQuery(item.text);
                            toast(`Searching for "${item.text}"...`);
                          }}
                        >
                          <TrendingUp className="w-4 h-4 text-orange-500" />
                          <span>{item.text}</span>
                        </button>
                      ))}
                  </CardContent>
                </Card>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-md">
              Click the search box to see suggestions
            </p>
          </div>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="active-filters"
        title="Active Filters Display"
        description="Show applied filters with ability to remove individually"
      >
        <CodePlayground code={activeFiltersCode} preview={
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Active Filters ({selectedCategories.length + selectedBrands.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)})
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedCategories.length === 0 && selectedBrands.length === 0 && priceRange[0] === 0 && priceRange[1] === 1000 ? (
                  <p className="text-sm text-muted-foreground text-center py-md">
                    No filters applied. Try selecting some filters below.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-xs">
                    {selectedCategories.map((id) => {
                      const category = categories.find(c => c.id === id);
                      return (
                        <Badge key={id} variant="secondary" className="gap-xs">
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
                        <Badge key={id} variant="secondary" className="gap-xs">
                          {brand?.label}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => toggleBrand(id)}
                          />
                        </Badge>
                      );
                    })}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                      <Badge variant="secondary" className="gap-xs">
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

            <div className="mt-lg">
              <div className="flex flex-wrap items-center gap-md">
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPriceRange([100, 500])}
                >
                  Set Price Range
                </Button>
              </div>
            </div>
          </>
        } />
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
