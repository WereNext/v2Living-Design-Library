# Living Design Library MCP Server

MCP (Model Context Protocol) server that allows AI coding agents to connect to your Living Design Library. Import Figma tokens, manage design systems, and export components in any framework through natural language.

## What is MCP?

Model Context Protocol (MCP) is an open protocol that connects AI assistants to external tools and data sources. This MCP server acts as a bridge between AI coding agents and your design library.

**Currently Supported AI Tools:**
- ✅ **Claude Code** (from Anthropic) - Full native support
- ✅ **Cline** - Autonomous AI coding agent for VS Code with easy copy-paste MCP setup
- ✅ **Continue.dev** - Open-source AI assistant for VS Code & JetBrains
- ✅ **Zed** - High-performance code editor with MCP integration

**Note:** Popular tools like Cursor, Windsurf, and GitHub Copilot do not currently support MCP.

## Features

- 🎨 **Design System Management**: Create, list, and manage multiple design systems
- 📥 **Figma Token Import**: Import design tokens directly from Figma JSON exports
- 📚 **Library Templates**: Load from 8 pre-built libraries (shadcn/ui, Material Design 3, etc.)
- 🧩 **Component Export**: Get production-ready code in React, Vue, HTML, or Svelte
- 🎯 **Design Intents**: Organize components by categories (Web App, E-commerce, etc.)
- 🔧 **Token Management**: Access and customize colors, spacing, typography, shadows, and more

## Installation

```bash
cd mcp-server
npm install
```

## Configuration

### For Claude Code

Add to your Claude Code config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "living-design-library": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.js"]
    }
  }
}
```

### For Cline (VS Code)

Cline has an easy copy-paste MCP configuration interface:

1. Open Cline settings (click gear icon in Cline sidebar)
2. Scroll to "MCP Servers" section
3. Copy and paste this configuration:

```json
{
  "mcpServers": {
    "design-library": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.js"]
    }
  }
}
```

4. Click "Restart MCP Servers" or reload VS Code

### For Continue.dev (VS Code / JetBrains)

Add to your Continue config (click gear icon in Continue sidebar):

```json
{
  "mcpServers": {
    "design-library": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.js"]
    }
  }
}
```

### For Zed Editor

Add to your Zed settings.json:

```json
{
  "context_servers": {
    "design-library": {
      "command": {
        "path": "node",
        "args": ["/absolute/path/to/mcp-server/index.js"]
      }
    }
  }
}
```

### For Other MCP-Compatible Tools

Most MCP-compatible AI tools support similar configuration. Add the server using the command:

```bash
node /path/to/mcp-server/index.js
```

## Usage Examples

Once connected, your AI coding agent can interact with the design library using natural language:

### Import Figma Tokens

```
"Import my Figma design tokens from this JSON file and create a design system called 'My Product Design'"
```

The AI will use the `import_figma_tokens` tool to parse your Figma variables and create a new design system.

### Load a Library Template

```
"Load the shadcn/ui template as my base design system"
```

The AI will use `load_library_template` to create a system with shadcn/ui tokens.

### Create Custom Design System

```
"Create a design system called 'Dark Mode App' with these colors: primary #6366f1, secondary #8b5cf6, background #0f172a"
```

The AI will use `create_design_system` with your custom tokens.

### Export Component Code

```
"Give me a Button component in React using my active design system"
```

The AI will use `get_component_code` to generate production-ready React code with your design tokens.

### List Available Components

```
"What components are available in the library?"
```

The AI will use `list_components` to show all available components.

### Get Design Tokens

```
"Show me all the color tokens from my design system"
```

The AI will use `get_design_tokens` to retrieve specific token types.

## Available Tools

The MCP server provides these tools to AI agents:

### Design System Management
- `list_design_systems` - List all design systems
- `get_design_system` - Get full details of a design system
- `create_design_system` - Create a new design system from scratch
- `set_active_system` - Set which design system to use for components

### Import & Templates
- `import_figma_tokens` - Import Figma JSON and create design system
- `list_library_templates` - List pre-built library templates
- `load_library_template` - Load shadcn/ui, Material Design, etc.

### Components & Code
- `list_components` - List all available components
- `get_component_code` - Export component in React/Vue/HTML/Svelte
- `get_design_tokens` - Get colors, spacing, typography, etc.

## Workflow Example

Here's a complete workflow an AI agent could execute:

1. **Load Base Template**
   ```
   Human: "Load the Material Design 3 template"
   AI: Uses load_library_template → Creates system with Material tokens
   ```

2. **Customize Tokens**
   ```
   Human: "Update the primary color to #FF5722"
   AI: Uses get_design_system → Updates tokens → Shows changes
   ```

3. **Export Components**
   ```
   Human: "Give me Button, Card, and Modal components in React"
   AI: Uses get_component_code 3 times → Returns all code with MD3 tokens
   ```

4. **Import Figma Design**
   ```
   Human: "I have new tokens from Figma, create a new system called 'Brand 2.0'"
   AI: Uses import_figma_tokens → Parses JSON → Creates new system
   ```

## Design Token Structure

Design tokens follow this structure:

```json
{
  "colors": {
    "primary": "#6366f1",
    "secondary": "#8b5cf6",
    "background": "#ffffff",
    "foreground": "#1f2937"
  },
  "spacing": {
    "xs": "0.5rem",
    "sm": "0.75rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem"
  },
  "typography": {
    "fontFamily": "system-ui, sans-serif",
    "fontSize": "1rem",
    "fontWeight": "400"
  },
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "0.75rem"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.1)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)"
  }
}
```

## Component Categories (Design Intents)

16 predefined categories:
- Web App
- E-commerce
- Mobile Experience
- Landing Page
- Dashboard & Analytics
- SaaS Platform
- Social Media
- Blog & Content
- Portfolio & Showcase
- Admin Panel
- Documentation
- Authentication
- Messaging & Chat
- Calendar & Scheduling
- Media Gallery
- Forms & Surveys

Plus unlimited custom categories!

## Available Components (32+)

Button, Input, Card, Modal, Dropdown, Checkbox, Radio, Switch, Slider, Progress, Badge, Avatar, Alert, Toast, Tabs, Accordion, Tooltip, Popover, DatePicker, Select, Textarea, Table, Pagination, Breadcrumb, Sidebar, Navbar, Footer, Hero, Pricing, Testimonial, Feature, CTA

## Frameworks Supported

- **React** - Functional components with hooks
- **Vue 3** - Composition API components
- **HTML** - Pure HTML/CSS with JavaScript
- **Svelte** - Svelte components with scoped styles

## Development

Run in development mode with auto-reload:

```bash
npm run dev
```

## Architecture

```
AI Coding Agent (Claude/ChatGPT/etc.)
         ↓
    MCP Protocol
         ↓
Living Design Library MCP Server (this)
         ↓
Design Systems & Component Generator
```

## Storage

Currently uses in-memory storage. In production, you would connect this to:
- Your actual design library database
- File system for persistent storage
- API endpoints to your living design library web app
- LocalStorage/IndexedDB from the browser app

## Extending the Server

To add new component templates:

1. Add component name to `AVAILABLE_COMPONENTS`
2. Add templates in `generateComponentCode()` function
3. Restart the MCP server

To add new library templates:

1. Add tokens in `getLibraryTemplateTokens()` function
2. Add to the enum in `load_library_template` schema

## Troubleshooting

**Server not appearing in Claude Code?**
- Check config file path is correct
- Ensure absolute path to index.js is used
- Restart Claude Code after config changes
- Check Claude Code logs: Help → View Logs

**Tools not working?**
- Verify Node.js version is 18+
- Run `npm install` in mcp-server directory
- Check for errors with `npm start`

## License

MIT

## Contributing

Feel free to add more component templates, library templates, or enhance the Figma token parser!
