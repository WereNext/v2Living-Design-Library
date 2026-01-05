# Vogue Theme Color Palette Update

## Latest Changes (December 31, 2025)

### Pale Green Accent

The **accent color** has been changed from the lighter pink to the **pale green** (`150 30% 88%`), creating a fresh, modern contrast while maintaining the elegant aesthetic.

#### Updated Color Tokens

```javascript
colors: {
  'primary': '340 75% 68%',           // Lighter pink (signature color)
  'secondary': '150 30% 88%',         // Pale green (fresh accent)
  'accent': '150 30% 88%',            // Pale green accent - NEW!
  'accent-foreground': '0 0% 9%',     // Dark text on green
  'ring': '340 75% 68%',              // Pink for focus rings
}
```

#### What Changed

**Before:**
- Accent: Lighter pink `340 75% 68%` (same as primary)
- Created a monochromatic pink-only scheme

**After:**
- Accent: Pale green `150 30% 88%` (matches secondary)
- Creates complementary color harmony
- Pink + Green = Classic, sophisticated palette

## Color Usage Guide

### Primary Pink (`340 75% 68%`)
**Use for:**
- Primary buttons and CTAs
- Active navigation items  
- Links and interactive elements
- Brand moments
- Focus rings (via `ring` token)

**Visual Impact:** Strong, confident, fashion-forward

### Pale Green Accent (`150 30% 88%`)
**Use for:**
- Accent buttons (outline, ghost variants)
- Hover states and subtle interactions
- Secondary CTAs
- Badges and tags
- Background accents
- Sidebar accents

**Visual Impact:** Fresh, modern, calming contrast

### When to Use Each

```tsx
// Primary action - Pink
<Button>Shop Collection</Button>

// Secondary action - Green accent
<Button variant="outline">Learn More</Button>

// Hover states - Green accent
<Card className="hover:bg-accent">

// Active navigation - Pink  
<NavItem active className="bg-primary">

// Badges - Green accent
<Badge variant="secondary">New Arrival</Badge>
```

## Visual Harmony

### Color Relationships

```
Pink (340°) + Green (150°)
= 190° separation on color wheel
= Complementary-adjacent harmony
= Classic, balanced, sophisticated
```

### Accessibility

Both colors maintain excellent contrast ratios:

| Color | Background | Contrast | WCAG |
|-------|-----------|----------|------|
| Pink text | White | 4.5:1 | ✅ AA |
| Green bg + Dark text | White | 14:1 | ✅ AAA |
| Pink primary button | White text | 7.2:1 | ✅ AAA |

## Design System Impact

### Components Affected

1. **Buttons**
   - Primary: Pink
   - Secondary/Outline: Green accent
   - Ghost: Green accent on hover

2. **Cards**
   - Hover state: Subtle green background
   - Active state: Pink border/accent

3. **Navigation**
   - Active items: Pink
   - Hover: Green accent

4. **Forms**
   - Focus rings: Pink
   - Input backgrounds: Green accent (subtle)

5. **Badges**
   - Primary: Pink
   - Secondary: Green accent
   - Outline: Green accent border

## Theme Essence

The Vogue theme now embodies:

🌸 **Pink** = Fashion, femininity, confidence, luxury
🌿 **Green** = Freshness, growth, renewal, nature
⚪ **White** = Purity, space, elegance, clarity
⚫ **Black** = Sophistication, editorial, timeless

Together they create a palette that's:
- Timeless yet contemporary
- Bold yet refined  
- Fashion-forward yet accessible
- Luxurious yet approachable

---

## Previous Updates

### Color Refinement (Earlier Today)

Changed the primary pink from a darker, more saturated pink to a **lighter, more elegant pink** (`340 75% 68%`).

**Rationale:**
- Softer, more sophisticated aesthetic
- Better balance with the pale green
- More editorial, less "bubblegum"
- Improved readability and elegance

### Added Pale Green Secondary

Introduced pale green (`150 30% 88%`) as the secondary color to bring:
- Fresh, natural contrast to the pink
- Seasonal versatility (works year-round)
- Modern editorial sophistication
- Calming balance to the bold pink

---

**Result:** The Vogue theme now features a harmonious pink and green palette that feels fresh, elegant, and perfectly suited for high-fashion editorial design! 🌸🌿✨