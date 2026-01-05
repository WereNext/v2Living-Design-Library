# Electron Build & Distribution Guide

## 📦 Building a macOS Electron App

### **Step 1: Add Electron Dependencies**

```bash
npm install --save-dev electron electron-builder concurrently wait-on
```

### **Step 2: Update package.json**

Add these scripts to your `package.json`:

```json
{
  "name": "living-design-library",
  "version": "1.0.0",
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    
    "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "vite build && electron-builder",
    "electron:build:mac": "vite build && electron-builder --mac",
    "electron:build:mac:arm64": "vite build && electron-builder --mac --arm64",
    "electron:build:mac:x64": "vite build && electron-builder --mac --x64",
    "electron:build:all": "vite build && electron-builder --mac --win --linux"
  }
}
```

---

## 🚀 Building for macOS

### **Option 1: Universal Binary (Intel + Apple Silicon)**

```bash
npm run electron:build:mac
```

This creates:
- `release/Living Design Library-1.0.0-arm64.dmg` (Apple Silicon)
- `release/Living Design Library-1.0.0-x64.dmg` (Intel)
- `release/Living Design Library-1.0.0-universal.dmg` (Universal - both)

### **Option 2: Apple Silicon Only**

```bash
npm run electron:build:mac:arm64
```

### **Option 3: Intel Only**

```bash
npm run electron:build:mac:x64
```

---

## 📤 Distribution Options

### **Option 1: GitHub Releases (Recommended - FREE)**

1. **Create a GitHub repository** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/living-design-library.git
   git push -u origin main
   ```

2. **Build the app**
   ```bash
   npm run electron:build:mac
   ```

3. **Create a GitHub Release**
   - Go to: `https://github.com/yourusername/living-design-library/releases`
   - Click "Draft a new release"
   - Tag: `v1.0.0`
   - Title: `Living Design Library v1.0.0`
   - Upload the `.dmg` file from `release/` folder
   - Click "Publish release"

4. **Users download from:**
   ```
   https://github.com/yourusername/living-design-library/releases/latest
   ```

**Pros:**
- ✅ FREE unlimited bandwidth
- ✅ Automatic version management
- ✅ Built-in download analytics
- ✅ Users trust GitHub
- ✅ No server needed

**Cons:**
- ❌ Max 2GB per file (not an issue for Electron apps)
- ❌ No custom domain (unless you redirect)

---

### **Option 2: Your Own Website**

Host the `.dmg` file on your own server or CDN:

```html
<!-- Download page -->
<a href="https://yoursite.com/downloads/LivingDesignLibrary-1.0.0.dmg" 
   download
   class="download-button">
  Download for macOS (Apple Silicon)
</a>

<a href="https://yoursite.com/downloads/LivingDesignLibrary-1.0.0-x64.dmg" 
   download
   class="download-button">
  Download for macOS (Intel)
</a>
```

**Hosting options:**
- **Netlify** - Free 100GB/month bandwidth
- **Vercel** - Free 100GB/month bandwidth
- **AWS S3 + CloudFront** - Pay as you go (~$0.05/GB)
- **DigitalOcean Spaces** - $5/month for 250GB transfer

---

### **Option 3: Homebrew Cask (Advanced)**

Create a Homebrew formula for easy installation:

```bash
brew install --cask living-design-library
```

**Setup:**
1. Create a tap repository
2. Write a Cask formula
3. Submit PR to homebrew-cask

**Example Cask:**
```ruby
cask "living-design-library" do
  version "1.0.0"
  sha256 "abc123..."
  
  url "https://github.com/yourusername/living-design-library/releases/download/v#{version}/LivingDesignLibrary-#{version}.dmg"
  name "Living Design Library"
  desc "Design system management platform"
  homepage "https://yoursite.com"
  
  app "Living Design Library.app"
end
```

---

### **Option 4: Mac App Store (Requires Apple Developer Account)**

**Requirements:**
- Apple Developer Account ($99/year)
- Code signing certificate
- Notarization

**Pros:**
- ✅ Trusted distribution
- ✅ Automatic updates
- ✅ Discoverability

**Cons:**
- ❌ $99/year
- ❌ Apple review process
- ❌ 30% revenue share (if paid)

---

## 🎯 Recommended Setup for Figma Make Download

### **Best Approach: GitHub Releases + Landing Page**

1. **Build the app:**
   ```bash
   npm run electron:build:mac
   ```

2. **Upload to GitHub Releases**
   - Free hosting
   - Unlimited bandwidth
   - Professional

3. **Create download page on your site:**

```html
<!-- /downloads.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Download Living Design Library</title>
</head>
<body>
  <h1>Download Living Design Library</h1>
  <p>A complete design system management platform</p>
  
  <div class="downloads">
    <a href="https://github.com/yourusername/living-design-library/releases/download/v1.0.0/LivingDesignLibrary-1.0.0-arm64.dmg">
      <button>
        📥 Download for macOS (Apple Silicon)
        <small>M1, M2, M3 Macs</small>
      </button>
    </a>
    
    <a href="https://github.com/yourusername/living-design-library/releases/download/v1.0.0/LivingDesignLibrary-1.0.0-x64.dmg">
      <button>
        📥 Download for macOS (Intel)
        <small>Intel-based Macs</small>
      </button>
    </a>
    
    <a href="https://github.com/yourusername/living-design-library/releases/download/v1.0.0/LivingDesignLibrary-1.0.0-universal.dmg">
      <button>
        📥 Download Universal (Both)
        <small>Works on all Macs (larger file)</small>
      </button>
    </a>
  </div>
  
  <p>
    <strong>Latest Version:</strong> 1.0.0<br>
    <strong>File Size:</strong> ~150MB (arm64), ~160MB (x64), ~300MB (universal)<br>
    <strong>Requires:</strong> macOS 10.15 (Catalina) or later
  </p>
  
  <h2>Installation</h2>
  <ol>
    <li>Download the appropriate version for your Mac</li>
    <li>Open the downloaded .dmg file</li>
    <li>Drag "Living Design Library" to Applications folder</li>
    <li>Launch from Applications</li>
  </ol>
  
  <h2>First Launch (Gatekeeper Warning)</h2>
  <p>If you see "App can't be opened because it's from an unidentified developer":</p>
  <ol>
    <li>Go to System Preferences → Security & Privacy</li>
    <li>Click "Open Anyway"</li>
  </ol>
  
  <p><em>Or use the web version: <a href="/">Launch Web App</a></em></p>
</body>
</html>
```

---

## 🔐 Code Signing (Optional but Recommended)

To avoid Gatekeeper warnings:

1. **Get Apple Developer account** ($99/year)

2. **Install certificate**
   ```bash
   # List certificates
   security find-identity -v -p codesigning
   ```

3. **Update electron-builder.json:**
   ```json
   {
     "mac": {
       "identity": "Developer ID Application: Your Name (TEAM_ID)",
       "hardenedRuntime": true,
       "gatekeeperAssess": false,
       "notarize": {
         "teamId": "TEAM_ID"
       }
     }
   }
   ```

4. **Build signed app:**
   ```bash
   export APPLE_ID="your@email.com"
   export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
   npm run electron:build:mac
   ```

---

## 🚢 Auto-Update Setup (Optional)

Enable automatic updates using electron-updater:

```bash
npm install --save electron-updater
```

**In main.js:**
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();
  
  // Check every hour
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 60 * 60 * 1000);
});
```

**Update electron-builder.json:**
```json
{
  "publish": {
    "provider": "github",
    "owner": "yourusername",
    "repo": "living-design-library",
    "releaseType": "release"
  }
}
```

Users will automatically get notified of updates!

---

## 📊 Download Analytics

### **Track Downloads with:**

1. **GitHub Insights**
   - Built-in download stats per release
   - See which platform is most popular

2. **Custom Analytics**
   ```html
   <a href="download-url" 
      onclick="gtag('event', 'download', { 'platform': 'mac-arm64' })">
     Download
   </a>
   ```

3. **Short Links with Analytics**
   - Use bit.ly or similar
   - Track click-through rates

---

## 🎨 Creating App Icons

You need icons in multiple sizes. Use this tool:
- **iconutil** (built into macOS)

```bash
# Create iconset folder
mkdir icon.iconset

# Add PNG files:
# icon_16x16.png, icon_32x32.png, icon_64x64.png, 
# icon_128x128.png, icon_256x256.png, icon_512x512.png, icon_1024x1024.png
# Plus @2x versions

# Convert to .icns
iconutil -c icns icon.iconset -o build/icon.icns
```

---

## 📋 Complete Workflow

```bash
# 1. Install dependencies
npm install --save-dev electron electron-builder

# 2. Create Electron files (already done)
# - /electron/main.js
# - /electron/preload.js
# - /electron-builder.json

# 3. Add app icons to /build/
# - icon.icns (macOS)
# - icon.ico (Windows)
# - icon.png (Linux)

# 4. Build the web app
npm run build

# 5. Build Electron app
npm run electron:build:mac

# 6. Upload to GitHub Releases
# Go to: github.com/yourrepo/releases
# Create new release
# Upload: release/*.dmg

# 7. Share download link
# https://github.com/yourrepo/releases/latest
```

---

## 💡 Tips

### **Reduce File Size:**
```json
// electron-builder.json
{
  "compression": "maximum",
  "asarUnpack": ["**/*.node"],
  "files": [
    "!**/.git",
    "!**/node_modules/*/{CHANGELOG.md,README.md}",
    "!**/node_modules/.bin"
  ]
}
```

### **Add Crash Reporting:**
```bash
npm install @sentry/electron
```

### **Add Native Menus:**
Already included in `electron/main.js`!

---

## 🆚 Web App vs Desktop App

**When to use Desktop App:**
- ✅ Need native menus and shortcuts
- ✅ Want to work offline guaranteed
- ✅ File system access (save/open .designsystem files)
- ✅ macOS app store distribution
- ✅ Professional appearance

**When to use Web App:**
- ✅ Cross-platform (works everywhere)
- ✅ No installation needed
- ✅ Always latest version
- ✅ Easier to maintain
- ✅ Free hosting (Netlify/Vercel)

**Recommendation:** Offer BOTH!
- Web app as default
- Desktop app as premium/download option

---

## 📝 Example Download Page Copy

```markdown
# Download Living Design Library

**Desktop App for macOS**

Get the native macOS experience with keyboard shortcuts, native menus, 
and offline support.

[Download for macOS (Apple Silicon) - 150MB]
[Download for macOS (Intel) - 160MB]

Or use the web version: [Launch Web App →]

---

**What's Included:**
✅ All features from web version
✅ Native macOS menus and shortcuts
✅ Works completely offline
✅ Faster performance
✅ Import/export design system files
✅ Free forever, no account required

**System Requirements:**
• macOS 10.15 (Catalina) or later
• 200MB free disk space

**Updates:**
Download new versions from this page or check for updates in the app menu.
```

---

## 🎉 Summary

**Yes, you can absolutely distribute a macOS Electron build!**

**Recommended approach:**
1. Build with `electron-builder`
2. Upload to GitHub Releases (FREE)
3. Link from your Figma Make site
4. Offer both web and desktop versions

**Total cost:** $0 (unless you want code signing = $99/year)

This gives you a professional, native macOS app with zero hosting costs!
