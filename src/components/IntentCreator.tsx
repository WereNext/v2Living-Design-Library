import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Plus, X, Check, Sparkles, Target, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { ComponentCategory } from "../hooks/useIntentManager";

interface IntentCreatorProps {
  onIntentCreated: (intent: {
    id: string;
    label: string;
    description?: string;
    categories: ComponentCategory[];
    tokens?: any;
  }) => void;
  tokens?: any;
}

const availableCategories: ComponentCategory[] = [
  { name: "Code Playground", icon: "Code2", id: "playground" },
  { name: "Buttons & Actions", icon: "Mouse", id: "buttons" },
  { name: "Forms & Inputs", icon: "Type", id: "forms" },
  { name: "Layout Components", icon: "Layout", id: "layout" },
  { name: "Overlays & Dialogs", icon: "Box", id: "overlays" },
  { name: "Navigation", icon: "Menu", id: "navigation" },
  { name: "Data Display", icon: "Palette", id: "data" },
  { name: "AI Components", icon: "Sparkles", id: "ai" },
  { name: "Product Cards", icon: "ShoppingBag", id: "product-cards" },
  { name: "Shopping Cart", icon: "ShoppingBag", id: "shopping-cart" },
  { name: "Checkout Flow", icon: "CreditCard", id: "checkout" },
  { name: "Reviews & Ratings", icon: "Star", id: "reviews" },
  { name: "Filters & Search", icon: "Filter", id: "filters" },
  { name: "Bottom Navigation", icon: "Menu", id: "bottom-nav" },
  { name: "Swipe Actions", icon: "Hand", id: "swipe-actions" },
  { name: "Pull to Refresh", icon: "RefreshCw", id: "pull-refresh" },
  { name: "Mobile Menu", icon: "AlignLeft", id: "mobile-menu" },
  { name: "Touch Gestures", icon: "Zap", id: "touch-gestures" },
  { name: "Mobile Forms", icon: "Smartphone", id: "mobile-forms" },
  { name: "Hero Sections", icon: "Megaphone", id: "hero" },
  { name: "CTA Blocks", icon: "Mouse", id: "cta-blocks" },
  { name: "Testimonials", icon: "MessageSquare", id: "testimonials" },
  { name: "Pricing Tables", icon: "DollarSign", id: "pricing" },
  { name: "Feature Grids", icon: "Grid3x3", id: "features" },
  { name: "Email Capture", icon: "Mail", id: "email-capture" }
];

export function IntentCreator({ onIntentCreated, tokens }: IntentCreatorProps) {
  const [intentLabel, setIntentLabel] = useState("");
  const [intentDescription, setIntentDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ComponentCategory[]>([
    { name: "Code Playground", icon: "Code2", id: "playground" }
  ]);
  const [customCategory, setCustomCategory] = useState({ name: "", id: "" });
  const [showCustom, setShowCustom] = useState(false);

  const toggleCategory = (category: ComponentCategory) => {
    if (category.id === "playground") return; // Always keep playground
    
    if (selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories(prev => prev.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const addCustomCategory = () => {
    if (!customCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const id = customCategory.id || customCategory.name.toLowerCase().replace(/\s+/g, '-');
    const newCategory: ComponentCategory = {
      name: customCategory.name,
      icon: "Box",
      id
    };

    setSelectedCategories(prev => [...prev, newCategory]);
    setCustomCategory({ name: "", id: "" });
    setShowCustom(false);
    toast.success("Custom category added!");
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (index === 0 && direction === 'up') return; // Can't move playground up
    if (index === selectedCategories.length - 1 && direction === 'down') return;

    const newCategories = [...selectedCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex === 0) return; // Don't allow moving above playground

    [newCategories[index], newCategories[targetIndex]] = 
      [newCategories[targetIndex], newCategories[index]];
    
    setSelectedCategories(newCategories);
  };

  const handleCreate = () => {
    if (!intentLabel.trim()) {
      toast.error("Please enter an intent name");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one component category");
      return;
    }

    const intent = {
      id: intentLabel.toLowerCase().replace(/\s+/g, '-'),
      label: intentLabel,
      description: intentDescription,
      categories: selectedCategories,
      tokens
    };

    onIntentCreated(intent);
    
    // Reset form
    setIntentLabel("");
    setIntentDescription("");
    setSelectedCategories([{ name: "Code Playground", icon: "Code2", id: "playground" }]);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Create Custom Design Intent
        </CardTitle>
        <CardDescription>
          Define a new design intent with custom component categories and apply your tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            Custom intents let you organize components for specific use cases like "SaaS Dashboard", 
            "Portfolio Site", "Admin Panel", etc. Your design tokens will be associated with this intent.
          </AlertDescription>
        </Alert>

        {/* Intent Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="intent-name">Intent Name *</Label>
            <Input
              id="intent-name"
              placeholder="e.g., SaaS Dashboard, Portfolio Site, Admin Panel"
              value={intentLabel}
              onChange={(e) => setIntentLabel(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="intent-description">Description (Optional)</Label>
            <Textarea
              id="intent-description"
              placeholder="Describe what this design intent is for..."
              value={intentDescription}
              onChange={(e) => setIntentDescription(e.target.value)}
              className="mt-2 h-20"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Component Categories *</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustom(!showCustom)}
            >
              <Plus className="w-3.5 h-3.5 mr-2" />
              Custom Category
            </Button>
          </div>

          {showCustom && (
            <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <Input
                  placeholder="Category name"
                  value={customCategory.name}
                  onChange={(e) => setCustomCategory(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Category ID (optional)"
                  value={customCategory.id}
                  onChange={(e) => setCustomCategory(prev => ({ ...prev, id: e.target.value }))}
                />
              </div>
              <Button onClick={addCustomCategory} size="sm">
                <Check className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowCustom(false)} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableCategories.map((category) => {
              const isSelected = selectedCategories.find(c => c.id === category.id);
              const isPlayground = category.id === "playground";
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  disabled={isPlayground}
                  className="justify-start"
                >
                  {isSelected && <Check className="w-3.5 h-3.5 mr-2" />}
                  {category.name}
                  {isPlayground && (
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      Required
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Selected Categories Order */}
        {selectedCategories.length > 1 && (
          <div className="space-y-3">
            <Label>Category Order (Drag to reorder)</Label>
            <div className="space-y-2">
              {selectedCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1 text-sm">{category.name}</span>
                  {category.id === "playground" && (
                    <Badge variant="secondary" className="text-[10px]">Always First</Badge>
                  )}
                  {index > 0 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveCategory(index, 'up')}
                        disabled={index === 1}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveCategory(index, 'down')}
                        disabled={index === selectedCategories.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategories(prev => prev.filter(c => c.id !== category.id))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>
            <strong>Preview:</strong> "{intentLabel || "Your Intent"}" will have{" "}
            {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}
            {tokens && " with imported design tokens"}.
          </AlertDescription>
        </Alert>

        <Button onClick={handleCreate} className="w-full" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Intent
        </Button>
      </CardContent>
    </Card>
  );
}
