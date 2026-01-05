# Editorial Components - Web Editorial Design Intent

## Overview
Added comprehensive editorial components to support magazine-style web publishing, inspired by premier publications like GQ, Vogue, and The New Yorker.

## New Components Created

### 1. **EditorialHeroShowcase** (`/components/showcases/EditorialHeroShowcase.tsx`)
Magazine-style hero sections with editorial flair:
- **Feature Story Hero**: Large-format hero with byline, reading time, and article metadata
- **Cover Story**: Magazine cover-style layout with bold typography and issue labeling
- **Breaking News**: Time-sensitive editorial with urgency indicators and live updates

**Key Features:**
- Author bylines with avatars
- Reading time estimates
- Category badges
- Social sharing actions (bookmark, share)
- Metadata displays (publish date, author role)

### 2. **ArticleCardsShowcase** (`/components/showcases/ArticleCardsShowcase.tsx`)
Editorial article card layouts:
- **Featured Grid**: Large featured article with supporting stories in grid
- **Magazine Layout**: Asymmetric magazine-inspired layout with sidebar
- **List View**: Clean list format for archives and section pages

**Key Features:**
- Featured/supporting article hierarchy
- Author information with roles
- Article "dek" (subheadline/summary)
- Reading time badges
- Category tags
- Numbered list items for rankings

### 3. **LongformReadingShowcase** (`/components/showcases/LongformReadingShowcase.tsx`)
Optimized long-form reading experiences:
- **Article Body**: Drop caps, section breaks, optimized typography
- **Pull Quotes**: Multiple pull quote styles (center, sidebar, inline)
- **Author Bio**: Editorial-style author information and contributor credits

**Key Features:**
- CSS drop cap styling (`first-letter` pseudo-element)
- Pull quotes with attribution
- Section dividers (decorative dots)
- Multi-author bylines
- Editor's notes
- Contributor grids

### 4. **EditorialFeaturesShowcase** (`/components/showcases/EditorialFeaturesShowcase.tsx`)
Supporting editorial features:
- **Section Headers**: Magazine-style section navigation (4 variants)
- **Related Articles**: Contextual recommendations and series navigation
- **Share & Bookmark**: Social sharing and content saving tools

**Key Features:**
- Category grid navigation
- Numbered section headers
- Bold cover-style headers
- Related article grids
- Series navigation (multi-part stories)
- Social share buttons (Facebook, Twitter, LinkedIn, Email)
- Bookmark functionality
- Copy link action

## Design System Integration

### **Candy Nest Design System** (`/lib/candy-nest-themes.ts`)
3 editorial themes inspired by premier magazines:

#### **GQ Theme**
- **Colors**: Deep black primary, GQ orange accent, clean white background
- **Typography**: Playfair Display (editorial serif) + Inter
- **Spacing**: Generous (up to 4rem)
- **Border Radius**: Sharp, minimal (0.125rem)
- **Feel**: Bold, masculine sophistication

#### **Vogue Theme**
- **Colors**: Vogue pink/rose primary, pure white, warm cream accents
- **Typography**: Poppins + Playfair Display
- **Spacing**: Luxurious (up to 5rem)
- **Border Radius**: Zero (clean edges like print)
- **Feel**: Timeless elegance and luxury

#### **The New Yorker Theme**
- **Colors**: Classic black text, soft cream background (paper-like), editorial blue accent
- **Typography**: Inter + Georgia (classic reading serif)
- **Spacing**: Editorial breathing room (up to 4.5rem)
- **Border Radius**: Subtle (0.25-0.5rem)
- **Feel**: Intellectual clarity with reading focus

### **Design Intent: Web Editorial**
New intent category in the system with dedicated components:
- Editorial Heroes
- Article Cards
- Longform Reading
- Editorial Features
- Buttons & Actions
- Forms & Inputs

## Typography Features

### Editorial Typography Principles
1. **Drop Caps**: CSS `first-letter` pseudo-elements for magazine-style opening paragraphs
2. **Reading Optimization**: Cream backgrounds to reduce eye strain
3. **Generous Line Height**: `leading-relaxed` for comfortable long-form reading
4. **Hierarchy**: Large headlines (4xl-8xl), clear dek text (xl-2xl)
5. **Font Pairing**: Serif headlines + sans-serif body (or vice versa)

### Key Typography Classes Used
- `text-5xl md:text-6xl` - Feature headlines
- `text-7xl md:text-8xl` - Cover story headlines
- `text-xl md:text-2xl` - Dek/subheadline text
- `leading-tight` - Headlines
- `leading-relaxed` - Body text
- `tracking-widest uppercase` - Editorial labels (e.g., "Culture", "Page 24")

## Layout Patterns

### Grid Systems
- **Featured Grid**: 2-column featured + 2x2 supporting articles
- **Magazine Layout**: Asymmetric 8/4 column split
- **List View**: 12-column grid with number badge + content + thumbnail

### Spacing Strategy
- **Generous Padding**: 8-12 units for card content
- **White Space**: Intentional breathing room between sections
- **Reading Width**: `max-w-3xl` or `max-w-4xl` for article bodies

## Component Anatomy

### Article Card Structure
```
[Image/Visual]
[Category Badge] [Reading Time]
[Headline]
[Dek/Summary]
[Author Avatar] [Author Name] [Date]
```

### Hero Structure
```
[Large Image/Visual]
[Category] [Reading Time]
[Headline (5xl-6xl)]
[Dek (xl-2xl)]
[Byline: Avatar + Name + Role + Date]
[CTA Buttons]
```

## Color Tokens

### Editorial-Specific Colors
- **Accent Colors**: Used sparingly for brand identity (GQ orange, Vogue pink, New Yorker blue)
- **Backgrounds**: Clean whites or soft creams for reading comfort
- **Text**: High contrast for readability (dark text on light, or inverse)
- **Borders**: Subtle, understated

### Sidebar Customization
Each theme includes `sidebar` tokens for navigation:
- GQ: Dark sidebar with orange accents
- Vogue: Pink sidebar with white accents
- The New Yorker: Cream sidebar matching page background

## Interaction Patterns

### Social Actions
- **Bookmark**: Save article for later reading
- **Share**: Multi-platform sharing (social + email + copy link)
- **Follow Story**: Subscribe to updates on breaking news

### Reading Aids
- **Reading Time**: Estimated time to completion
- **Progress Indicators**: For multi-part series
- **Related Content**: Contextual recommendations

## Best Practices

### When to Use Editorial Components
✅ Magazine-style publications
✅ News sites and journalism
✅ Long-form content platforms
✅ Literary magazines and journals
✅ Cultural commentary sites
✅ Photo essays and visual stories

### Design Principles
1. **Typography First**: Let type do the heavy lifting
2. **White Space**: Give content room to breathe
3. **Hierarchy**: Clear visual importance (featured vs. supporting)
4. **Metadata**: Always show author, date, category, reading time
5. **Reading Comfort**: Optimize for sustained reading sessions

## Integration with Candy Nest Themes

To use the editorial components with magazine aesthetics:

1. **Select Candy Nest Design System**
2. **Choose a Theme**: GQ (bold), Vogue (elegant), or The New Yorker (intellectual)
3. **Set Design Intent**: "Web Editorial"
4. **Browse Components**: Editorial Heroes, Article Cards, Longform Reading, Editorial Features

The components will automatically adapt to the selected theme's:
- Color palette
- Typography scale
- Spacing system
- Border radius
- Visual effects

## File Structure
```
/lib/candy-nest-themes.ts          # Theme definitions
/hooks/useDesignSystems.ts         # System registration
/components/showcases/
  - EditorialHeroShowcase.tsx      # Hero variations
  - ArticleCardsShowcase.tsx       # Card layouts
  - LongformReadingShowcase.tsx    # Reading experience
  - EditorialFeaturesShowcase.tsx  # Supporting features
/components/ComponentShowcase.tsx  # Component routing
/App.tsx                          # Intent categories
```

## Future Enhancements

### Potential Additions
- **Photo Essays**: Full-screen image galleries with captions
- **Multimedia Stories**: Video/audio embeds with editorial treatment
- **Interactive Elements**: Expandable sections, side-by-side comparisons
- **Newsletter Signup**: Editorial-styled email capture
- **Comments**: Reader discussion with editorial moderation
- **Author Pages**: Dedicated author archives and bios
- **Table of Contents**: Jump navigation for very long articles
- **Print Styles**: CSS print stylesheets for article printing

## Technical Notes

### Component Dependencies
- `lucide-react`: Icons (Bookmark, Share2, Clock, User, Quote, etc.)
- `sonner@2.0.3`: Toast notifications
- Shadcn UI components: Button, Badge, Card, Separator

### Responsive Behavior
- Mobile: Single column, stacked layouts
- Tablet: 2-column grids where appropriate
- Desktop: Full asymmetric magazine layouts

### Accessibility
- Semantic HTML (`<article>`, `<h1>`, `<blockquote>`, `<cite>`)
- High contrast text
- Readable font sizes
- Keyboard navigation support
- ARIA labels where appropriate

---

This editorial component system brings the sophistication and craft of print magazine design to the web, creating beautiful, readable, and engaging content experiences.
