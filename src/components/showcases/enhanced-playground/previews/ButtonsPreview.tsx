import { Heart, Share2, Bookmark, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ButtonsPreviewProps {
  theme: {
    colors?: Record<string, string>;
    borderRadius?: Record<string, string>;
    shadows?: Record<string, string>;
  };
}

export function ButtonsPreview({ theme }: ButtonsPreviewProps) {
  const getColor = (key: string, fallback: string) =>
    theme.colors?.[key] ? `hsl(${theme.colors[key]})` : fallback;

  const getRadius = (key: string, fallback: string) =>
    theme.borderRadius?.[key] || fallback;

  const getShadow = (key: string, fallback: string) =>
    theme.shadows?.[key] || fallback;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Interactive Buttons</h4>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => toast.success('Primary button clicked!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: getColor('primary', '#000'),
            color: getColor('primary-foreground', '#fff'),
            borderRadius: getRadius('radius-md', '0.5rem'),
            boxShadow: getShadow('shadow-sm', 'none'),
          }}
        >
          Primary Button
        </button>
        <button
          onClick={() => toast.success('Secondary button clicked!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: getColor('secondary', '#666'),
            color: getColor('secondary-foreground', '#fff'),
            borderRadius: getRadius('radius-md', '0.5rem'),
            boxShadow: getShadow('shadow-sm', 'none'),
          }}
        >
          Secondary Button
        </button>
        <button
          onClick={() => toast.info('Outline button clicked!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 border-2"
          style={{
            backgroundColor: 'transparent',
            color: getColor('primary', '#000'),
            borderColor: getColor('primary', '#000'),
            borderRadius: getRadius('radius-md', '0.5rem'),
          }}
        >
          Outline Button
        </button>
        <button
          onClick={() => toast.error('Destructive action!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: getColor('destructive', '#ef4444'),
            color: getColor('destructive-foreground', '#fff'),
            borderRadius: getRadius('radius-md', '0.5rem'),
            boxShadow: getShadow('shadow-sm', 'none'),
          }}
        >
          Destructive
        </button>
      </div>

      <h4 className="text-sm font-medium text-muted-foreground mt-6">Icon Buttons</h4>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => toast('Liked!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
          style={{
            backgroundColor: getColor('primary', '#000'),
            color: getColor('primary-foreground', '#fff'),
            borderRadius: getRadius('radius-md', '0.5rem'),
          }}
        >
          <Heart className="w-4 h-4" />
          Like
        </button>
        <button
          onClick={() => toast('Shared!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 border-2"
          style={{
            backgroundColor: 'transparent',
            color: getColor('foreground', '#000'),
            borderColor: getColor('border', '#e5e5e5'),
            borderRadius: getRadius('radius-md', '0.5rem'),
          }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={() => toast('Bookmarked!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
          style={{
            backgroundColor: getColor('secondary', '#666'),
            color: getColor('secondary-foreground', '#fff'),
            borderRadius: getRadius('radius-md', '0.5rem'),
          }}
        >
          <Bookmark className="w-4 h-4" />
          Bookmark
        </button>
        <button
          onClick={() => toast('Added to cart!')}
          className="px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 border-2"
          style={{
            backgroundColor: 'transparent',
            color: getColor('primary', '#000'),
            borderColor: getColor('primary', '#000'),
            borderRadius: getRadius('radius-md', '0.5rem'),
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
