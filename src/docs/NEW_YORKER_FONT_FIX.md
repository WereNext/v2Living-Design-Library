# The New Yorker Theme - Font Issue Fixed

## Problem
When The New Yorker theme was selected (with Georgia font), the font was being applied to the **entire application UI** including:
- The design system sidebar
- Navigation menus
- Buttons and controls
- All interface elements

This made the UI look inconsistent since Georgia is meant only for editorial content previews, not the design system interface itself.

## Root Cause

In `/hooks/useDesignSystems.ts`, there were multiple places applying the font directly to `document.body`:

```javascript
// BEFORE (Wrong - affects everything):
if (key === 'font-sans') {
  root.style.fontFamily = value;
  document.body.style.fontFamily = value;  // ❌ This applied Georgia everywhere!
}
```

This code was applying the theme font to the entire document body, overriding all other fonts.

## Solution

**Removed all `document.body.style.fontFamily` assignments** from the theme application logic.

Now the font is **only set as a CSS variable**:

```javascript
// AFTER (Correct - only sets CSS variable):
Object.entries(theme.typography || {}).forEach(([key, value]) => {
  root.style.setProperty(`--${key}`, value);
  // Don't apply font-sans to document.body - only set CSS variable
  // This prevents the theme font from affecting the design system UI itself
});
```

## How It Works Now

### 1. CSS Variable Set
```css
:root {
  --font-sans: 'Georgia, Iowan Old Style, Times New Roman, serif';
}
```

### 2. Font Class Applied in CSS
```css
.font-georgia {
  font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif;
}

.font-georgia * {
  font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif;
}
```

### 3. Components Use the Font Class

Component previews in the playground can now explicitly apply the font class:

```tsx
<div className="font-georgia">
  <h1>The Art of Slow Reading</h1>
  <p>In an age of infinite scroll...</p>
</div>
```

## Files Modified

### `/hooks/useDesignSystems.ts`
- **Line ~333:** Removed `document.body.style.fontFamily = value;`
- **Line ~452:** Removed `document.body.style.fontFamily = value;`
- **Line ~604:** Removed `document.body.style.fontFamily = value;`

**Total changes:** 3 locations fixed

### `/styles/globals.css`
- **Line ~340:** Added `.font-georgia` and `.font-georgia *` classes

### `/lib/candy-nest-themes.ts`
- **Line ~220:** Updated `fontFamily: 'georgia'` to match CSS class

## Result

✅ **Design System UI** - Uses default system font (Inter/system fonts)  
✅ **Component Previews** - Can use Georgia when `.font-georgia` class is applied  
✅ **Theme Tokens** - Georgia is available via `--font-sans` CSS variable  
✅ **No Global Override** - Font doesn't leak into UI chrome  

## Testing

To verify the fix:

1. **Switch to Candy Nest Design System**
2. **Select The New Yorker theme**
3. **Check that:**
   - Sidebar still uses system font ✅
   - Navigation menus use system font ✅
   - Buttons and controls use system font ✅
   - Component previews can use Georgia when explicitly styled ✅

## Theme Font Mapping

| Theme | Font | CSS Class | Applied To |
|-------|------|-----------|------------|
| **GQ** | Helvetica Neue | `.font-system` | Components only |
| **Vogue** | Avenir Next | `.font-system` | Components only |
| **New Yorker** | **Georgia** | **`.font-georgia`** | **Components only** |

All theme fonts are now **opt-in** via CSS classes, not global overrides!

## Architecture Improvement

### Before (Global Font Problem)
```
Theme Selected
  ↓
document.body.style.fontFamily = "Georgia"
  ↓
EVERYTHING uses Georgia ❌
  ├─ Sidebar
  ├─ Navigation
  ├─ Buttons
  └─ Component Previews
```

### After (Scoped Font Solution)
```
Theme Selected
  ↓
:root { --font-sans: "Georgia" }
  ↓
CSS class created (.font-georgia)
  ↓
Only elements with .font-georgia use Georgia ✅
  └─ Component Previews (when styled)

Design System UI
  └─ Uses default fonts (Inter/system) ✅
```

## Summary

**Fixed:** Georgia no longer takes over the entire design system UI  
**Maintained:** Georgia is still available for component previews  
**Improved:** All theme fonts now work the same way (scoped, not global)  

The design system UI will always use professional system fonts while component previews can use theme-specific typography! 🎨✨

---

**Status:** ✅ Fixed and tested  
**Impact:** Low (isolated change)  
**Breaking:** No breaking changes  
