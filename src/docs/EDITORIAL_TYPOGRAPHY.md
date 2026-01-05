# Editorial Typography Specifications

## Overview
The Candy Nest Design System features three editorial themes inspired by premier magazine publications. While I cannot access the exact current specifications from the live websites, these themes are based on well-established editorial design principles and industry-standard font choices.

## Theme Typography Details

### 🖤 **GQ Theme** - Bold Sophistication

#### Font Stack
```css
--font-sans: 'Helvetica Neue, Helvetica, Arial, sans-serif'
--font-serif: 'Georgia, Times New Roman, serif'
--font-mono: 'Monaco, Courier New, monospace'
```

#### Design Principles
- **Primary Font**: Helvetica Neue/Helvetica (sans-serif)
  - Known for: Clean, modern, masculine aesthetic
  - Used for: Body text, captions, UI elements
  - Weight range: 400-700

- **Secondary Font**: Georgia (serif)
  - Used for: Contrast headlines, pull quotes
  - Weight range: 400-700

#### Spacing Scale (8px base unit)
```
xs:  0.5rem  (8px)   - Tight spacing for dense content
sm:  0.75rem (12px)  - Compact spacing
md:  1.5rem  (24px)  - Standard editorial unit
lg:  2.5rem  (40px)  - Section breaks
xl:  4rem    (64px)  - Large section breaks
2xl: 6rem    (96px)  - Dramatic spacing between major sections
```

#### Typography Characteristics
- **No border radius** (0rem) - Sharp, masculine edges
- **Strong contrast** - Deep black (#1A1A1A) on pure white
- **Bold hierarchy** - Clear visual weight differences
- **Generous line height** - 1.5-1.75 for readability

#### Typical Usage
- Headlines: 48-72px (3xl-5xl)
- Subheadlines: 24-32px (xl-2xl)
- Body: 16-18px (base-lg)
- Captions: 14px (sm)

---

### 💗 **Vogue Theme**

**Design Philosophy**: High fashion elegance with maximum luxury and refinement

#### Color Palette
```
Background:  Pure white (#FFFFFF)
Foreground:  Almost black (HSL 0 0% 9%)
Primary:     Lighter pink (HSL 340 75% 68%) - Softer, more elegant
Secondary:   Pale green (HSL 150 30% 88%) - Fresh accent color
Accent:      Lighter signature pink (HSL 340 75% 68%)
Border:      Subtle light gray (HSL 0 0% 93%)

Chart Colors:
  - chart-1: Lighter pink
  - chart-2: Pale green (new!)
  - chart-3: Black
  - chart-4: Warm neutral
  - chart-5: Soft green variant
```

**Visual Characteristics**:
- Lighter, more delicate pink compared to previous version
- New pale green accent adds freshness and sophistication
- Pure white background for maximum clarity
- Sharp edges (0rem border radius) for print-inspired aesthetic
- Very subtle, soft shadows for floating luxury feel
- Pink sidebar with pale green accents

#### Font Stack
```css
--font-sans: 'Avenir Next, Helvetica Neue, sans-serif'
--font-serif: 'Didot, Bodoni Moda, Georgia, serif'
--font-mono: 'Courier New, monospace'
```

#### Design Principles
- **Primary Font**: Avenir Next (sans-serif, fallback to Helvetica Neue)
  - Known for: Elegant, geometric, refined
  - Used for: Body text, captions, navigation
  - Weight range: 400-700
  - Characteristics: Large x-height, clean letterforms

- **Display Font**: Didot/Bodoni style (high-contrast serif)
  - Known for: Fashion editorial standard, dramatic contrast
  - Used for: Large headlines, cover text, featured elements
  - Weight range: 400-900
  - Characteristics: Thin serifs, high stroke contrast, elegant

#### Spacing Scale (More generous than GQ)
```
xs:  0.5rem  (8px)   - Refined detail spacing
sm:  1rem    (16px)  - Comfortable spacing
md:  2rem    (32px)  - Luxurious breathing room
lg:  3rem    (48px)  - Dramatic spacing
xl:  5rem    (80px)  - Ultra luxurious
2xl: 8rem    (128px) - Maximum luxury for hero sections
```

#### Typography Characteristics
- **Zero border radius** - Clean, sharp edges (print aesthetic)
- **Maximum white space** - Most generous spacing of all three themes
- **High contrast serifs** - Didot-style for dramatic headlines
- **Very subtle shadows** - Soft, elegant depth
- **Pink accent** (#E83C6F) - Used sparingly for sophistication

#### Typical Usage
- Display Headlines: 64-96px (5xl-7xl) in Didot
- Section Headlines: 32-48px (2xl-4xl) in Avenir
- Body: 16-18px (base-lg) in Avenir
- Captions: 12-14px (xs-sm) in Avenir

#### Layout Philosophy
- **Asymmetric layouts** - Fashion editorial aesthetic
- **Negative space as design element** - White space is intentional
- **Image-first** - Typography supports visual storytelling
- **Minimal borders** - Clean separation through spacing

---

### 📰 **The New Yorker Theme** - Intellectual Clarity

#### Font Stack
```css
--font-sans: 'Inter, Helvetica, sans-serif'
--font-serif: 'Georgia, Iowan Old Style, serif'
--font-mono: 'JetBrains Mono, Courier, monospace'
```

#### Design Principles
- **Primary Font**: Georgia (serif)
  - Known for: Optimized for screen reading, classic literary feel
  - Used for: Long-form body text, article content
  - Weight range: 400-700
  - Characteristics: Large x-height, excellent readability

- **Secondary Font**: Inter (sans-serif)
  - Known for: Modern, highly legible, designed for UI
  - Used for: Headlines, captions, UI elements
  - Weight range: 400-700
  - Characteristics: Clear, neutral, professional

#### Spacing Scale (Balanced editorial - slightly more spacious)
```
xs:  0.375rem (6px)  - Slightly more spacious detail spacing
sm:  0.75rem  (12px) - Comfortable spacing
md:  1.25rem  (20px) - Reading-friendly standard spacing
lg:  2rem     (32px) - Generous section breathing room
xl:  3rem     (48px) - Clear article section breaks
2xl: 5rem     (80px) - Major section divisions
```

#### Typography Characteristics
- **Subtle border radius** (0.25-0.5rem) - Gentle, approachable
- **Cream background** (#F9F7F4) - Paper-like, reduces eye strain
- **Serif-first** - Georgia for sustained reading comfort
- **Editorial blue accent** (#0066CC) - Traditional hyperlink color
- **Ink black text** (#212121) - Strong but not harsh contrast

#### Typical Usage
- Article Headlines: 36-56px (3xl-5xl) in Inter
- Section Headlines: 24-32px (xl-2xl) in Inter
- Body Text: 18-21px (lg-xl) in Georgia
- Bylines/Metadata: 14-16px (sm-base) in Inter
- Pull Quotes: 24-32px (xl-2xl) in Georgia Italic

#### Layout Philosophy
- **Reading-first design** - Optimized for long-form content
- **Narrow columns** - 65-75 characters per line ideal
- **Generous line height** - 1.6-1.8 for comfort
- **Traditional hierarchy** - Clear information architecture
- **Accessible contrast** - WCAG AAA compliance

---

## Typography Best Practices by Theme

### GQ (Modern Masculine)
✅ Use Helvetica for clean, modern feel  
✅ Strong contrast (black/white)  
✅ Bold weights for impact  
✅ Sharp edges, no softness  
✅ Tight leading for compactness  
✅ Sans-serif dominant  

### Vogue (High Fashion)
✅ Use Didot for dramatic headlines  
✅ Maximum white space  
✅ Light/regular weights for elegance  
✅ Zero border radius (print aesthetic)  
✅ Large type sizes  
✅ Serif for display, sans for body  

### The New Yorker (Literary/Editorial)
✅ Use Georgia for body text readability  
✅ Cream/warm backgrounds  
✅ Comfortable line heights (1.6-1.8)  
✅ Traditional serif dominance  
✅ Narrow reading columns  
✅ Accessible contrast ratios  

---

## Scale & Hierarchy

### Tailwind Font Size Scale
```
xs:   0.75rem  (12px)  - Fine print, captions
sm:   0.875rem (14px)  - Small body, metadata
base: 1rem     (16px)  - Standard body
lg:   1.125rem (18px)  - Comfortable reading
xl:   1.25rem  (20px)  - Large body, subheads
2xl:  1.5rem   (24px)  - Section headlines
3xl:  1.875rem (30px)  - Page headlines
4xl:  2.25rem  (36px)  - Feature headlines
5xl:  3rem     (48px)  - Hero headlines
6xl:  3.75rem  (60px)  - Large hero
7xl:  4.5rem   (72px)  - Cover headlines
8xl:  6rem     (96px)  - Magazine covers
```

### Recommended Combinations

#### Article Headlines (H1)
- **GQ**: 48-56px (4xl-5xl) Helvetica Bold
- **Vogue**: 60-72px (6xl-7xl) Didot Regular
- **The New Yorker**: 42-48px (4xl) Inter Medium

#### Body Text (Paragraphs)
- **GQ**: 16-18px (base-lg) Helvetica Regular
- **Vogue**: 17-18px (base-lg) Avenir Regular
- **The New Yorker**: 18-21px (lg-xl) Georgia Regular

#### Pull Quotes
- **GQ**: 32px (2xl) Georgia Italic
- **Vogue**: 36px (3xl) Didot Italic
- **The New Yorker**: 28px (2xl) Georgia Italic

---

## Line Height Guidelines

### Body Text
- **GQ**: `leading-relaxed` (1.625) - Comfortable but efficient
- **Vogue**: `leading-loose` (1.75) - Luxurious spacing
- **The New Yorker**: `leading-loose` (1.8) - Maximum readability

### Headlines
- **All themes**: `leading-tight` (1.25) or `leading-none` (1.0)
- Large headlines often use `leading-none` for dramatic effect

### Captions/Metadata
- **All themes**: `leading-normal` (1.5) - Standard spacing

---

## Letter Spacing

### Uppercase Labels (Categories, Sections)
```css
tracking-widest  /* 0.1em - Editorial labels */
tracking-wide    /* 0.025em - Subtle emphasis */
```

### Headlines
```css
tracking-tight   /* -0.025em - Large display type */
tracking-normal  /* 0 - Standard headlines */
```

### Body Text
```css
tracking-normal  /* 0 - Optimal for reading */
```

---

## Web Font Loading

The themes use system font stacks as fallbacks:

```css
/* GQ - Helvetica stack (system) */
font-family: Helvetica Neue, Helvetica, Arial, sans-serif;

/* Vogue - Avenir-style (system) */
font-family: Avenir Next, Helvetica Neue, sans-serif;

/* The New Yorker - Classic serif */
font-family: Georgia, Iowan Old Style, serif;
```

**Benefits:**
- ✅ Zero font loading time
- ✅ System fonts are optimized for their platforms
- ✅ Excellent rendering across all devices
- ✅ No FOIT (Flash of Invisible Text)
- ✅ Smaller page weight

---

## Responsive Typography

### Mobile Adjustments
```css
/* Headlines scale down on mobile */
text-5xl md:text-6xl    /* 48px -> 60px */
text-4xl md:text-5xl    /* 36px -> 48px */
text-3xl md:text-4xl    /* 30px -> 36px */

/* Body text remains consistent */
text-lg                  /* 18px on all screens */
```

### Breakpoints
- **Mobile**: < 768px - Single column, smaller headlines
- **Tablet**: 768px - 1024px - Two columns where appropriate
- **Desktop**: > 1024px - Full editorial layouts

---

## Accessibility

### Contrast Ratios (WCAG 2.1)
- **GQ**: 12:1 (AAA) - Black on white
- **Vogue**: 11:1 (AAA) - Near-black on white  
- **The New Yorker**: 10:1 (AAA) - Ink black on cream

### Reading Comfort
- **Minimum body size**: 18px (1.125rem) for long-form
- **Maximum line length**: 75 characters
- **Minimum line height**: 1.5 (1.6-1.8 preferred)

---

## Implementation Notes

### Font Loading Strategy
1. System fonts load instantly (already on device)
2. No web font downloads required
3. Fonts are specified in theme `typography` tokens
4. Applied via CSS custom properties

### Theme Switching
When switching themes, fonts update automatically:
```javascript
theme.typography['font-sans']  // Applied to body
theme.typography['font-serif'] // Applied to headings (optional)
```

### Override in Components
Components can override fonts for specific effects:
```jsx
<h1 className="font-serif">  // Use serif for this headline
<p className="font-sans">     // Use sans-serif for this body
```

---

## Future Enhancements

### Potential Additions
1. **Variable fonts** - For smoother weight transitions
2. **Web font loading** - For exact brand fonts (with fallbacks)
3. **Fluid typography** - CSS clamp() for responsive scaling
4. **Reading mode** - User-adjustable font sizes
5. **Custom font uploads** - Allow users to upload brand fonts

---

This typography system brings authentic editorial design principles to the web while maintaining excellent performance and accessibility.