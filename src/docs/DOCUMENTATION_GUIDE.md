# Component Documentation Guide

## 📚 Overview

The Living Design Library includes a powerful **Component Documentation System** that allows you to add custom notes, guidelines, and commentary to each component page.

---

## ✨ Features

### **What You Can Document:**

1. **📝 Overview** - Brief description of the component
2. **🎯 When to Use** - Usage guidelines and scenarios
3. **💡 Best Practices** - Tips and recommendations
4. **♿ Accessibility** - WCAG compliance and A11y notes
5. **🎨 Design Notes** - Design decisions and rationale
6. **💻 Code Examples** - Custom code snippets
7. **🏷️ Tags** - Organize with custom tags
8. **📄 Custom Sections** - Add any additional sections you need

---

## 🚀 How to Use

### **Adding Documentation to a Component:**

1. Navigate to any component page (Buttons, Cards, Forms, etc.)
2. Look for the **"Component Documentation"** card at the top
3. Click **"Add Documentation"** or **"Edit"**
4. Fill in any sections you want
5. Click **"Save"**

### **Editing Sections:**

The documentation editor has **5 tabs**:

#### **1. Overview Tab**
- **Overview** - General component description
- **Design Notes** - Why certain design choices were made
- **Custom Sections** - Add your own sections

#### **2. Usage Tab**
- **When to Use** - Scenarios where this component fits
- **Best Practices** - Bullet-point tips (press Enter to add)

#### **3. Accessibility Tab**
- Document ARIA labels
- Keyboard navigation patterns
- Screen reader support
- Color contrast requirements
- WCAG compliance notes

#### **4. Examples Tab**
- Add custom code examples
- Support for TSX, JSX, HTML, CSS, JavaScript
- Add descriptions to examples
- Perfect for team-specific patterns

#### **5. Meta Tab**
- **Author** - Who wrote this documentation
- **Tags** - Categorize components (e.g., "form", "interactive", "mobile-optimized")
- **Load Template** - Quick-start with pre-built templates

---

## 📋 Documentation Templates

### **Available Templates:**

1. **Component Standard**
   - Overview
   - When to Use
   - Best Practices
   - Accessibility

2. **Design System**
   - Pattern Overview
   - Design Decisions
   - Implementation Guide

3. **Quick Notes**
   - Simple notes field

Select a template in the **Meta** tab to quick-start your documentation.

---

## 💾 Storage & Export

### **Where is Documentation Stored?**
- Stored in **browser localStorage**
- Persists across sessions
- Separate from design systems
- Can be exported/imported

### **Export Options:**

1. **Export as Markdown** (per component)
   - Click the download icon in preview mode
   - Downloads a `.md` file with all documentation

2. **Export All Documentation**
   ```javascript
   // Use the useDocumentation hook
   const { exportAllDocumentation } = useDocumentation();
   exportAllDocumentation(); // Downloads JSON file
   ```

3. **Import Documentation**
   ```javascript
   const { importDocumentation } = useDocumentation();
   importDocumentation(jsonString);
   ```

---

## 🎨 Markdown Support

All text fields support **Markdown formatting**:

```markdown
## Headings
**Bold text**
*Italic text*
- Bullet points
1. Numbered lists
`inline code`
[Links](https://example.com)
```

---

## 🔧 Adding Documentation to New Components

### **For Developers:**

**Option 1: Use DocumentationWrapper**

```tsx
import { DocumentationWrapper } from './components/DocumentationWrapper';

export function MyShowcase() {
  return (
    <DocumentationWrapper 
      componentId="my-component" 
      componentName="My Component"
    >
      {/* Your showcase content */}
    </DocumentationWrapper>
  );
}
```

**Option 2: Manual Integration**

```tsx
import { ComponentDocumentation } from './components/ComponentDocumentation';
import { useDocumentation } from './hooks/useDocumentation';

export function MyShowcase() {
  const { getDocumentation, saveDocumentation } = useDocumentation();
  const componentId = "my-component";
  const documentation = getDocumentation(componentId);

  return (
    <div className="space-y-6">
      <ComponentDocumentation
        componentId={componentId}
        componentName="My Component"
        documentation={documentation}
        onSave={saveDocumentation}
      />
      
      {/* Your showcase content */}
    </div>
  );
}
```

---

## 📖 Example Documentation

### **Button Component Documentation:**

**Overview:**
> Buttons are interactive elements that trigger actions when clicked. They come in various styles (variants) and sizes to match different use cases and hierarchy levels in your interface.

**When to Use:**
- Primary actions (e.g., "Submit", "Save", "Buy Now")
- Secondary actions (e.g., "Cancel", "Go Back")
- Destructive actions (e.g., "Delete", "Remove")
- Navigation (as link buttons)

**Best Practices:**
- Use clear, action-oriented labels ("Save Changes" not "OK")
- Place primary actions on the right in dialogs
- Maintain sufficient touch target size (min 44x44px for mobile)
- Use consistent button sizing within the same context
- Don't use more than one primary button per section

**Accessibility:**
- Always include descriptive text or aria-label
- Ensure color contrast meets WCAG AA (4.5:1)
- Support keyboard navigation (Enter/Space to activate)
- Provide visible focus indicators
- Use appropriate ARIA roles for icon-only buttons

---

## 🎯 Use Cases

### **1. Team Documentation**
Document your team's conventions and patterns:
- "We use outline buttons for secondary actions"
- "Primary buttons should only appear once per page section"

### **2. Design Handoff**
Designers can document:
- When to use each variant
- Spacing requirements
- Animation preferences

### **3. Developer Guidelines**
Engineers can add:
- Implementation notes
- Performance considerations
- Browser compatibility notes

### **4. Accessibility Audit**
Document accessibility requirements:
- ARIA patterns
- Keyboard interactions
- Screen reader behavior

### **5. Client Documentation**
For agencies building design systems for clients:
- Brand-specific usage rules
- Industry compliance requirements
- Custom implementation notes

---

## 🔍 Finding Documentation

### **View Mode:**
- Click **"View"** button to see documentation without editing
- All sections are displayed in an organized, readable format
- Code examples are syntax-highlighted

### **Search by Tags:**
Coming soon: Search documentation by tags across all components

---

## 🚀 Best Practices for Documentation

### **✅ DO:**
- Keep overview concise (2-3 sentences)
- Use bullet points for best practices
- Include specific code examples
- Document accessibility requirements
- Add tags for easy filtering
- Update documentation when components change

### **❌ DON'T:**
- Write novels - keep it scannable
- Duplicate what's already in code comments
- Forget to document accessibility
- Leave author field blank (helps track who to ask)

---

## 🔮 Future Enhancements

Coming soon:
- [ ] Search across all documentation
- [ ] Version documentation with design systems
- [ ] Team collaboration features
- [ ] AI-powered documentation suggestions
- [ ] Export to Confluence/Notion
- [ ] Documentation coverage reports
- [ ] Link related components
- [ ] Screenshot attachments

---

## 📞 Questions?

The documentation system is designed to be flexible and grow with your needs. Start simple with just an overview, then expand sections as your library matures.

**Happy documenting! 📚**
