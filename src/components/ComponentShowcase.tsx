import { ButtonsShowcase } from "./showcases/ButtonsShowcase";
import { FormsShowcase } from "./showcases/FormsShowcase";
import { LayoutShowcase } from "./showcases/LayoutShowcase";
import { OverlaysShowcase } from "./showcases/OverlaysShowcase";
import { NavigationShowcase } from "./showcases/NavigationShowcase";
import { DataDisplayShowcase } from "./showcases/DataDisplayShowcase";
import { AIShowcase } from "./showcases/AIShowcase";
import { PlaygroundShowcase } from "./showcases/PlaygroundShowcase";
import { ProductCardsShowcase } from "./showcases/ProductCardsShowcase";
import { HeroShowcase } from "./showcases/HeroShowcase";
import { BottomNavShowcase } from "./showcases/BottomNavShowcase";
import { PricingShowcase } from "./showcases/PricingShowcase";
import { PlaceholderShowcase } from "./showcases/PlaceholderShowcase";
import { ShoppingCartShowcase } from "./showcases/ShoppingCartShowcase";
import { CheckoutShowcase } from "./showcases/CheckoutShowcase";
import { ReviewsShowcase } from "./showcases/ReviewsShowcase";
import { FiltersShowcase } from "./showcases/FiltersShowcase";
import { CTABlocksShowcase } from "./showcases/CTABlocksShowcase";
import { TestimonialsShowcase } from "./showcases/TestimonialsShowcase";
import { FeaturesShowcase } from "./showcases/FeaturesShowcase";
import { EmailCaptureShowcase } from "./showcases/EmailCaptureShowcase";
import { SwipeActionsShowcase } from "./showcases/SwipeActionsShowcase";
import { PullRefreshShowcase } from "./showcases/PullRefreshShowcase";
import { MobileMenuShowcase } from "./showcases/MobileMenuShowcase";
import { TouchGesturesShowcase } from "./showcases/TouchGesturesShowcase";
import { MobileFormsShowcase } from "./showcases/MobileFormsShowcase";
// Editorial components
import { EditorialHeroShowcase } from "./showcases/EditorialHeroShowcase";
import { ArticleCardsShowcase } from "./showcases/ArticleCardsShowcase";
import { LongformReadingShowcase } from "./showcases/LongformReadingShowcase";
import { EditorialFeaturesShowcase } from "./showcases/EditorialFeaturesShowcase";

interface ComponentShowcaseProps {
  category: string;
  designIntent?: string;
}

export function ComponentShowcase({ category, designIntent = "web-app" }: ComponentShowcaseProps) {
  // Editorial specific components (for web-editorial intent)
  if (category === "editorial-hero") return <EditorialHeroShowcase />;
  if (category === "article-cards") return <ArticleCardsShowcase />;
  if (category === "longform-reading") return <LongformReadingShowcase />;
  if (category === "editorial-features") return <EditorialFeaturesShowcase />;

  // E-commerce specific components
  if (category === "product-cards") return <ProductCardsShowcase />;
  if (category === "shopping-cart") return <ShoppingCartShowcase />;
  if (category === "checkout") return <CheckoutShowcase />;
  if (category === "reviews") return <ReviewsShowcase />;
  if (category === "filters") return <FiltersShowcase />;

  // Landing page specific components
  if (category === "hero") return <HeroShowcase />;
  if (category === "cta-blocks") return <CTABlocksShowcase />;
  if (category === "testimonials") return <TestimonialsShowcase />;
  if (category === "pricing") return <PricingShowcase />;
  if (category === "features") return <FeaturesShowcase />;
  if (category === "email-capture") return <EmailCaptureShowcase />;

  // Mobile specific components
  if (category === "bottom-nav") return <BottomNavShowcase />;
  if (category === "swipe-actions") return <SwipeActionsShowcase />;
  if (category === "pull-refresh") return <PullRefreshShowcase />;
  if (category === "mobile-menu") return <MobileMenuShowcase />;
  if (category === "touch-gestures") return <TouchGesturesShowcase />;
  if (category === "mobile-forms") return <MobileFormsShowcase />;

  // Default web app components
  switch (category) {
    case "playground":
      return <PlaygroundShowcase />;
    case "buttons":
      return <ButtonsShowcase designIntent={designIntent} />;
    case "forms":
      return <FormsShowcase />;
    case "layout":
      return <LayoutShowcase />;
    case "overlays":
      return <OverlaysShowcase />;
    case "navigation":
      return <NavigationShowcase />;
    case "data":
      return <DataDisplayShowcase />;
    case "ai":
      return <AIShowcase />;
    default:
      return <PlaygroundShowcase />;
  }
}