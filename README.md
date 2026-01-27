# Living Design Library

A complete design system infrastructure with AI agent integration via MCP (Model Context Protocol).

Original Figma project: https://www.figma.com/design/UmwgpO0DUTvxefqLKwppnq/Living-Design-Library

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start app + MCP server (recommended)
npm run dev:full

# Or start app only
npm run dev
```

**App:** http://localhost:3001
**MCP Server:** Runs automatically with `dev:full`

📖 **[Read the Quick Start Guide →](QUICK_START.md)**

---

## ✨ What's Included

### Design System Builder
- Create design systems from scratch
- Import from Figma JSON
- Load from 8+ pre-built libraries (shadcn, Material, Chakra, etc.)
- Multi-theme support
- Git-like versioning

### Component Library
- 32+ pre-built components
- Multi-framework export (React, Vue, HTML, Svelte)
- Live token preview
- Copy-paste ready code

### MCP Server for AI Agents
- 13 AI agent tools
- Connect with Claude Code, Cline, Continue.dev, Zed
- Generate components from natural language
- Import Figma tokens via AI
- Real-time design system sync

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 30 seconds
- **[MCP_AUTO_LAUNCH.md](MCP_AUTO_LAUNCH.md)** - Auto-launch MCP server guide
- **[MCP_SETUP_COMPLETE.md](MCP_SETUP_COMPLETE.md)** - Full MCP setup documentation
- **[src/mcp-server/README.md](src/mcp-server/README.md)** - MCP server details
- **[USE_CASES.md](USE_CASES.md)** - 15 use case scenarios

---

## 🎯 Key Features

### For Designers
- Import Figma tokens as JSON → Instant design system
- Preview components with your tokens in real-time
- Export design systems for developers

### For Developers
- Generate production-ready component code
- Multi-framework support (React, Vue, HTML, Svelte)
- Design token CSS variables
- Type-safe TypeScript support

### For AI Agents (via MCP)
- `list_design_systems` - Get all systems
- `get_component_code` - Generate components
- `import_figma_tokens` - Import from Figma
- `get_page_template` - Generate full pages
- **+9 more tools** for complete design system management

---

## 🛠️ npm Scripts

```bash
npm run dev              # App only
npm run dev:full         # App + MCP (recommended)
npm run dev:with-mcp     # Background MCP + App
npm run mcp:start        # MCP server only
npm run mcp:dev          # MCP with auto-reload
npm run build            # Production build
npm run test             # Run tests
```

---

## 🤖 AI Agent Integration

### Supported Tools
- ✅ **Claude Code** - Full native support
- ✅ **Cline** - VS Code extension
- ✅ **Continue.dev** - VS Code & JetBrains
- ✅ **Zed** - Native editor support

### Quick Setup
1. Run `npm run dev:full`
2. MCP server auto-configured at startup
3. Ask Claude Code: "List my design systems"

**[Full MCP Setup Guide →](MCP_SETUP_COMPLETE.md)**

---

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** shadcn/ui + Radix UI + Tailwind CSS
- **State:** React Context + LocalStorage
- **MCP:** @modelcontextprotocol/sdk
- **Testing:** Vitest + React Testing Library
- **Design:** Figma integration + Dynamic theming

---

## 🧪 Testing

```bash
npm test                           # Run all tests
npm test -- src/tests/use-cases.test.tsx --run   # Specific test
```

**41 tests covering 15 use cases** ✅

---

## 📁 Project Structure

```
v2Living-Design-Library/
├── src/
│   ├── components/         # UI components
│   ├── lib/                # Core libraries
│   ├── hooks/              # React hooks
│   ├── contexts/           # React contexts
│   ├── tests/              # Test suite
│   └── mcp-server/         # MCP server
│       ├── index.js        # Main server
│       ├── data-sync.js    # Data loading
│       └── app-data.json   # Design systems
├── QUICK_START.md          # Quick start guide
├── MCP_AUTO_LAUNCH.md      # Auto-launch guide
└── package.json            # Dependencies & scripts
```

---

## 🎨 Use Cases

1. **Create design systems from scratch**
2. **Import Figma design tokens**
3. **Load pre-built library templates**
4. **Generate multi-framework components**
5. **Version control your design systems**
6. **AI-powered component generation**
7. **White-label design systems**
8. **A/B test design variations**
9. **Dark/light mode management**
10. **Production code export**

**[View all 15 use cases →](USE_CASES.md)**

---

## 🤝 Contributing

Issues and PRs welcome! This is an open-source project.

---

## 📄 License

MIT

---

## 🔗 Links

- **Figma Project:** https://www.figma.com/design/UmwgpO0DUTvxefqLKwppnq/Living-Design-Library
- **MCP Protocol:** https://modelcontextprotocol.io
- **Claude Code:** https://claude.com/claude-code

---

**Made with ❤️ for designers and developers**

**Last Updated:** January 22, 2026
