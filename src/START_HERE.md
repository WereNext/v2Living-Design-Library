# 🎯 START HERE - Living Design Library

## 🚀 Two Ways to Get Started

### **Option 1: Quick Start (Fastest)**

Get running in 60 seconds:

```bash
# Install dependencies
npm install

# Start the app
npm run dev
```

**Open:** http://localhost:3000

✅ **Done!** The app is now running.

---

### **Option 2: Full Guide (Recommended)**

For complete setup, features, and workflows:

📖 **[READ THE QUICK START GUIDE →](QUICK_START_GUIDE.md)**

**Covers:**
- ✅ Complete installation
- ✅ Import components from Figma
- ✅ Upload & manage images
- ✅ Design token system
- ✅ Export code (React, Vue, Svelte, Angular, iOS, Android)
- ✅ Run tests
- ✅ Package for desktop (Electron)
- ✅ Troubleshooting

---

## 🎯 What Is This?

**Living Design Library** is a complete design system infrastructure that replaces:

| Old Stack | New Stack |
|-----------|-----------|
| Figma + Manual coding | ✅ Auto-generate from Figma |
| Git for design tokens | ✅ Built-in versioning |
| Storybook | ✅ Interactive docs |
| Token Studio | ✅ Token editor |
| Multiple export tools | ✅ Multi-framework export |

**Result:** Design → Code in **5 minutes** instead of **5 days**.

---

## ⚡ 30-Second Demo

```bash
# 1. Start the app
npm run dev

# 2. In the app:
#    - Click "Import from Figma"
#    - Paste any Figma URL
#    - Click "Import"

# 3. Component imported!
#    - Click "Edit" to customize
#    - Click "Export" to get React/Vue/Svelte code

# 4. Done! 🎉
```

---

## 📦 Core Features

### **✅ Component System:**
- Import from Figma (structure + styles)
- Visual editor with live preview
- Component tree navigation
- Property inspector
- Image replacement

### **✅ Image Management:**
- Drag & drop upload
- Auto-optimization (compression, resize)
- Image library (search, filter, organize)
- Replace images in components
- Thumbnail generation

### **✅ Design Tokens:**
- 6-tab editor (colors, typography, spacing, etc.)
- Import from Figma
- Multiple themes (light/dark/custom)
- Template builder
- Export to 10+ formats

### **✅ Code Export:**
- **React** (.jsx, .tsx)
- **Vue** (.vue)
- **Svelte** (.svelte)
- **Angular** (.component.ts)
- **HTML + CSS** (.html)
- **iOS** (.swift)
- **Android** (.xml)
- **Tailwind** (config)
- **SCSS** (variables)
- **CSS** (custom properties)

### **✅ Developer Tools:**
- 275+ automated tests
- TypeScript types
- MCP server (AI agent integration)
- Git-like versioning
- Works 100% offline

---

## 🧪 Run Tests

```bash
# Quick test
npm test

# Visual test UI (recommended)
npm run test:ui
```

**Coverage:**
- ✅ 275+ tests
- ✅ Version management
- ✅ Accessibility validation
- ✅ Token export
- ✅ Code generation
- ✅ Component parsing

**See:** [TESTING_QUICK_START.md](TESTING_QUICK_START.md)

---

## 🖥️ Desktop App

Package as a native desktop app:

```bash
# macOS
npm run package:mac

# Windows
npm run package:win

# Linux
npm run package:linux
```

**Output:** Installable app in `/dist` folder

---

## 📖 Documentation

### **Getting Started:**
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** ⭐ START HERE
- **[TESTING_QUICK_START.md](TESTING_QUICK_START.md)** - Run tests

### **Features:**
- **[COMPONENT_IMPORT_COMPLETE.md](COMPONENT_IMPORT_COMPLETE.md)** - Import system
- **[PHASE_2_COMPLETE.md](PHASE_2_COMPLETE.md)** - Visual editor
- **[PHASE_3_COMPLETE.md](PHASE_3_COMPLETE.md)** - Image management
- **[TOKEN_SYSTEM_SUMMARY.md](TOKEN_SYSTEM_SUMMARY.md)** - Design tokens

### **Architecture:**
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design
- **[ARCHITECTURE_STATUS_SUMMARY.md](ARCHITECTURE_STATUS_SUMMARY.md)** - Status
- **[NEXT_PHASES_ROADMAP.md](NEXT_PHASES_ROADMAP.md)** - Future plans

### **Import Guides:**
- **[FIGMA_IMPORT_GUIDE.md](FIGMA_IMPORT_GUIDE.md)** - Figma integration
- **[DESIGN_TOKEN_FLOW.md](DESIGN_TOKEN_FLOW.md)** - Token workflow

---

## 🎓 Complete Workflow

```
┌─────────────────────────────────────────┐
│ 1. IMPORT FROM FIGMA                    │
│    ├─ Paste Figma URL                   │
│    ├─ Component structure extracted     │
│    ├─ Layouts preserved                 │
│    └─ Images downloaded                 │
├─────────────────────────────────────────┤
│ 2. UPLOAD CUSTOM IMAGES                 │
│    ├─ Drag & drop images                │
│    ├─ Auto-optimization                 │
│    └─ Saved to library                  │
├─────────────────────────────────────────┤
│ 3. EDIT COMPONENT                       │
│    ├─ Visual editor                     │
│    ├─ Replace images                    │
│    ├─ Adjust colors, spacing            │
│    └─ Live preview                      │
├─────────────────────────────────────────┤
│ 4. IMPORT DESIGN TOKENS                 │
│    ├─ Import from Figma                 │
│    ├─ Edit token values                 │
│    └─ Create themes                     │
├─────────────────────────────────────────┤
│ 5. EXPORT CODE                          │
│    ├─ Choose framework (React/Vue/etc)  │
│    ├─ Copy generated code               │
│    └─ Production-ready!                 │
└─────────────────────────────────────────┘

⏱️ Total Time: ~5 minutes
✅ Result: Production-ready component + tokens
```

---

## 🎯 Quick Commands

| Command | What It Does |
|---------|--------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm test` | Run all tests |
| `npm run test:ui` | Visual test interface |
| `npm run build` | Build for production |
| `npm run package:mac` | Build macOS app |
| `npm run package:win` | Build Windows app |
| `npm run package:linux` | Build Linux app |

---

## 🎉 Current Status

```
✅ Phase 1: Component Import System     COMPLETE
✅ Phase 2: Visual Component Editor     COMPLETE
✅ Phase 3: Image Upload & Management   COMPLETE

📦 Total: 26 files, ~7,600 lines of code
🧪 Tests: 275+ automated tests passing
📖 Docs: 9,000+ lines of documentation

🚀 STATUS: PRODUCTION READY!
```

---

## 🆘 Need Help?

### **Problems starting the app?**

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Figma import not working?**

1. Check API key: Settings → API Keys
2. Make sure Figma file is public or shared
3. Try a different file

### **Tests failing?**

```bash
# Update dependencies
npm install

# Clear cache
npx vitest run --clearCache

# Run simple test first
npx vitest run tests/simple-tests.test.ts
```

### **Still stuck?**

Check these docs:
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - Complete setup guide
- **[TESTING_QUICK_START.md](TESTING_QUICK_START.md)** - Test troubleshooting
- **tests/README.md** - Test documentation

---

## 🚀 Ready to Start!

**Beginner? Start here:**

```bash
npm install && npm run dev
```

Then read: **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)**

**Experienced? Jump right in:**

```bash
npm install && npm run dev
```

1. Import a Figma component
2. Edit it
3. Export code
4. Ship it! 🚢

---

## 🎯 What You'll Build

**In your first 30 minutes:**
- ✅ Import component from Figma
- ✅ Upload custom images
- ✅ Edit component visually
- ✅ Export to React/Vue/Svelte
- ✅ Have production-ready code

**After 1 week:**
- ✅ Complete design system
- ✅ Multiple themes
- ✅ Component library
- ✅ Multi-framework exports
- ✅ Automated workflow

**Result:** 100x faster design-to-code workflow! 🚀

---

## 💡 Pro Tip

**Start with a simple component:**

1. Find a button or card in Figma
2. Import it
3. Export to React
4. See the magic! ✨

**Then:** Import more complex components (heroes, forms, etc.)

---

## 🎉 Let's Go!

**One command to start:**

```bash
npm install && npm run dev
```

**Then visit:** http://localhost:3000

**Happy building!** 🎨➡️💻

---

*Living Design Library - From design to production in minutes, not days.*

**Version:** 1.0.0 (Production Ready)  
**Status:** ✅ All features complete  
**License:** MIT
