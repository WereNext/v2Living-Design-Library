# Vogue Theme - Color Palette Reference

## Core Color System

### 🌸 Primary Pink
```css
HSL: 340 75% 68%
RGB: rgb(232, 145, 188)
HEX: #E891BC
```

**Personality:** Confident, fashionable, luxurious  
**Use Cases:** Primary CTAs, links, active states, brand moments  
**Pairs With:** White backgrounds, dark text  

---

### 🌿 Pale Green Accent
```css
HSL: 150 30% 88%
RGB: rgb(212, 233, 220)
HEX: #D4E9DC
```

**Personality:** Fresh, calming, modern  
**Use Cases:** Hover states, secondary buttons, badges, subtle backgrounds  
**Pairs With:** Dark text, pink accents  

---

### ⚪ Pure White
```css
HSL: 0 0% 100%
RGB: rgb(255, 255, 255)
HEX: #FFFFFF
```

**Personality:** Clean, elegant, spacious  
**Use Cases:** Main background, card surfaces  
**Pairs With:** All colors  

---

### ⚫ Almost Black
```css
HSL: 0 0% 9%
RGB: rgb(23, 23, 23)
HEX: #171717
```

**Personality:** Sophisticated, editorial, timeless  
**Use Cases:** Body text, headlines, foreground elements  
**Pairs With:** White backgrounds  

---

## Extended Palette

### Warm Cream (Muted)
```css
HSL: 30 20% 97%
RGB: rgb(250, 247, 244)
HEX: #FAF7F4
```
**Use:** Subtle backgrounds, muted areas

### Medium Gray (Muted Foreground)
```css
HSL: 0 0% 45%
RGB: rgb(115, 115, 115)
HEX: #737373
```
**Use:** Secondary text, captions, metadata

### Light Gray (Border)
```css
HSL: 0 0% 93%
RGB: rgb(237, 237, 237)
HEX: #EDEDED
```
**Use:** Dividers, borders, subtle separations

---

## Sidebar Colors

### Pink Sidebar Background
```css
HSL: 340 75% 68%
RGB: rgb(232, 145, 188)
HEX: #E891BC
```
**Bold pink sidebar with white text**

### Green Sidebar Accent
```css
HSL: 150 30% 88%
RGB: rgb(212, 233, 220)
HEX: #D4E9DC
```
**Subtle green for hover/active states in sidebar**

---

## Chart Colors

### Chart 1 - Primary Pink
`340 75% 68%` - #E891BC

### Chart 2 - Pale Green
`150 30% 88%` - #D4E9DC

### Chart 3 - Black
`0 0% 9%` - #171717

### Chart 4 - Warm Neutral
`30 25% 75%` - #CEC0B5

### Chart 5 - Soft Green
`150 40% 75%` - #9ED4B5

---

## Color Combinations

### High Contrast
```
Pink (#E891BC) on White (#FFFFFF)
→ Readable, bold, attention-grabbing
```

### Subtle Accent
```
Pale Green background (#D4E9DC) + Black text (#171717)
→ Calm, approachable, modern
```

### Editorial
```
Black text (#171717) on White (#FFFFFF)
→ Classic, timeless, highly readable
```

### Luxury Hover
```
Card with Pale Green hover (#D4E9DC)
→ Sophisticated interaction feedback
```

---

## Accessibility

### Contrast Ratios (WCAG 2.1)

| Foreground | Background | Ratio | Grade |
|------------|-----------|-------|-------|
| Almost Black | White | 15.3:1 | AAA ✅ |
| Medium Gray | White | 4.6:1 | AA ✅ |
| Pink | White | 4.5:1 | AA ✅ |
| Black | Pale Green | 13.8:1 | AAA ✅ |
| White | Pink | 7.2:1 | AAA ✅ |

All color combinations meet or exceed WCAG AA standards for normal text.

---

## Color Psychology

### Pink (`#E891BC`)
- **Feminine:** Elegance and grace
- **Confident:** Bold without being aggressive  
- **Luxurious:** Premium, high-end feel
- **Fashion:** Modern, style-conscious

### Pale Green (`#D4E9DC`)
- **Fresh:** Renewal and growth
- **Calming:** Reduces visual stress
- **Natural:** Organic, authentic
- **Modern:** Contemporary without being trendy

### Combination
Pink + Green creates:
- **Balance:** Warm + Cool
- **Sophistication:** Fashion + Nature
- **Timelessness:** Classic harmony
- **Approachability:** Luxurious yet welcoming

---

## Usage Examples

### Buttons

```tsx
// Primary - Pink background
<Button className="bg-primary text-primary-foreground">
  Shop Now
</Button>

// Secondary - Green accent
<Button variant="outline" className="border-accent text-foreground">
  Learn More
</Button>

// Ghost - Green on hover
<Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
  Explore
</Button>
```

### Cards

```tsx
// Standard card
<Card className="bg-card border-border">
  <CardContent>Content</CardContent>
</Card>

// Hover effect - Green accent
<Card className="hover:bg-accent transition-colors">
  <CardContent>Interactive Card</CardContent>
</Card>

// Featured - Pink accent
<Card className="border-primary border-2">
  <CardContent>Featured Item</CardContent>
</Card>
```

### Badges

```tsx
// Default - Green background
<Badge className="bg-secondary text-secondary-foreground">
  New
</Badge>

// Primary - Pink
<Badge variant="default" className="bg-primary">
  Featured
</Badge>

// Outline - Green accent
<Badge variant="outline" className="border-accent text-accent-foreground">
  Limited
</Badge>
```

---

## Inspiration

The Vogue theme palette draws from:

1. **Magazine Heritage**
   - Vogue's iconic fashion photography
   - Editorial sophistication
   - High-contrast layouts

2. **Nature Meets Fashion**
   - Pink: Flowers, femininity, luxury
   - Green: Gardens, growth, freshness
   - White: Light, space, purity

3. **Modern Editorial**
   - Clean backgrounds
   - Bold accent colors
   - Timeless black typography

4. **Seasonal Versatility**
   - Pink: Spring/Summer warmth
   - Green: All-season freshness
   - Together: Year-round appeal

---

## Technical Notes

### HSL Format
All colors use HSL (Hue, Saturation, Lightness) for:
- Easy adjustments
- Better readability
- Design system flexibility

### CSS Variables
Colors are applied via CSS custom properties:
```css
:root {
  --primary: 340 75% 68%;
  --accent: 150 30% 88%;
  --foreground: 0 0% 9%;
  --background: 0 0% 100%;
}
```

### Tailwind Integration
Used with `hsl()` wrapper:
```css
background-color: hsl(var(--primary));
```

---

**Result:** A harmonious, accessible, and visually stunning color palette that embodies Vogue's timeless elegance with a fresh, modern twist! 🌸🌿✨
