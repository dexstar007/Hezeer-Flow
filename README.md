# HezeerFlow Ultimate - Personal Knowledge Base with AI & Graph

A high-performance, single-page Personal Knowledge Management (PKM) application built with Next.js 16, featuring AI-powered assistance and interactive knowledge graph visualization.

## 🚀 Tech Stack

### Core Framework
- **Next.js 16** with App Router (TypeScript 5)
- **React 19** with Server Components
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library

### State Management & Storage
- **Zustand** for global state management
- **IndexedDB** (via Dexie.js) for persistent local storage
- **next-themes** for light/dark mode

### AI Integration
- **z-ai-web-dev-sdk** for GLM-4 API integration
- Streaming responses for real-time AI chat
- Support for text and vision models

### Editor & Visualization
- **react-markdown** with GFM support
- **react-syntax-highlighter** for code highlighting
- **react-force-graph-2d** for knowledge graph visualization
- Custom wikilink parser for bidirectional linking

### Internationalization
- Custom i18n implementation with ES/EN support
- Dictionary-based translations
- Language-aware AI system prompts

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── chat/
│   │   │       └── route.ts          # AI chat API endpoint
│   │   └── vault/
│   │       ├── export/
│   │       │   └── route.ts          # Vault export API
│   │       └── import/
│   │           └── route.ts          # Vault import API
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main application page
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── ai-panel.tsx                  # AI assistant panel
│   ├── knowledge-graph.tsx           # Knowledge graph visualization
│   ├── markdown-editor.tsx           # Markdown editor with wikilinks
│   ├── onboarding-modal.tsx          # Welcome/onboarding modal
│   └── sidebar.tsx                   # Document tree and tags sidebar
├── hooks/
│   ├── use-translation.ts            # i18n hook
│   └── use-notes.ts                  # Notes management hook
├── lib/
│   ├── db-indexed.ts                 # IndexedDB (Dexie) setup
│   ├── i18n.ts                       # Translation dictionaries
│   ├── utils.ts                      # Utility functions
│   └── wikilinks.ts                  # Wikilink parser utilities
└── store/
    └── use-hezeer-flow.ts            # Zustand global state store
```

## ✨ Core Features

### 1. Multi-language Support (ES/EN)
- Toggle switch in sidebar for instant language switching
- All UI strings localized
- AI system prompts automatically adapt to selected language
- Support for Spanish special characters (á, é, í, ó, ú, ñ)

### 2. Knowledge Graph & Bidirectional Linking
- **Wikilink Syntax**: Use `[[Note Name]]` to create links
- **Auto-creation**: Clicking a non-existent link creates a new note
- **Interactive Graph**: Force-directed graph visualization
- **Node Sizing**: Nodes grow based on backlink count
- **Backlinks Panel**: Shows all notes referencing current note
- Real-time graph updates as notes change

### 3. AI Integration (GLM-4 API)
- **Chat Mode**: General conversation with AI assistant
- **RAG Mode**: "Chat with Notes" - AI answers questions using your knowledge base
- **Streaming Responses**: Real-time typewriter effect
- **Context Awareness**: AI maintains conversation history
- **Multi-language**: Adapts to current UI language

### 4. Markdown Editor
- **Live Preview**: Toggle between edit and preview modes
- **Syntax Highlighting**: Code blocks with language detection
- **Wikilink Rendering**: Clickable links in preview mode
- **Template System**: Type `/` for quick templates
  - Daily Note
  - Meeting Template
  - Project Plan
- **Auto-save**: Changes persist to IndexedDB

### 5. Organization Features
- **Document Tree**: Hierarchical note navigation
- **Tag System**: Organize notes with multiple tags
- **Tag Filtering**: Filter notes by selected tags
- **Full-text Search**: Search titles, content, and tags
- **Smart Search**: Real-time filtering as you type

### 6. Data Management
- **Local Storage**: All data stored in IndexedDB
- **Vault Export**: Export entire knowledge base as JSON
- **Vault Import**: Restore from backup files
- **No Vendor Lock-in**: Open data format

### 7. UI/UX Features
- **Responsive Design**: Works on desktop and tablet
- **Light/Dark Mode**: Theme toggle with system preference detection
- **Resizable Panels**: Adjust sidebar and AI panel widths
- **Collapsible Panels**: Show/hide sidebar and AI assistant
- **Smooth Animations**: Framer Motion transitions
- **Empty States**: Helpful prompts for new users

## 🎨 Design Standards

### Typography
- **Inter** (Sans-serif) for UI elements
- **JetBrains Mono** for code blocks
- Base font size: 16px
- Line height: 1.6

### Color System
- Light mode: `#fafafa` background
- Dark mode: `#0f0f0f` background
- Tailwind CSS variables for theming
- No indigo/blue (per requirements)

### Layout
- **Left Sidebar**: Document tree, tags, language switcher
- **Center Panel**: Markdown editor with live preview
- **Right Panel**: AI assistant
- **Bottom Section**: Backlinks (when available)

## 🔧 Configuration

### API Key Setup
1. Launch the application
2. Complete the onboarding wizard
3. Enter your GLM API key
4. The key is stored locally in your browser

### Environment Variables
```env
ZAI_API_KEY=your-glm-api-key  # Optional: Can be set in UI
```

## 📝 Usage Examples

### Creating Notes with Wikilinks
```markdown
# Project Ideas

I'm working on [[AI Research]] and [[Web Development]].

Related: [[Machine Learning]]
```

### Using Templates
1. Click in the editor
2. Type `/` at the start of a line
3. Select a template from the dropdown

### Chatting with Your Notes
1. Open the AI panel
2. Switch to "Chat with Notes" mode
3. Ask questions like "What are my project ideas?"
4. AI searches your notes and provides answers

### Building the Knowledge Graph
1. Create multiple notes
2. Use `[[Note Name]]` to link between them
3. Switch to Graph view
4. Explore the visual connections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun)
- GLM API key (for AI features)

### Installation
```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Check code quality
bun run lint
```

### Building for Production
```bash
bun run build
bun run start
```

## 📦 Database Schema

### IndexedDB Tables

#### Notes
```typescript
{
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
```

#### Tags
```typescript
{
  id: string;
  name: string;
  color?: string;
  createdAt: number;
}
```

#### Graph Metadata
```typescript
{
  id: string;
  noteId: string;
  links: string[];
  backlinks: string[];
  updatedAt: number;
}
```

## 🌐 API Endpoints

### AI Chat
- **POST** `/api/ai/chat`
- Body: `{ messages: Array<{role, content}>, stream: boolean }`
- Returns: Streaming Server-Sent Events

### Vault Export
- **GET** `/api/vault/export`
- Returns: JSON file with all data

### Vault Import
- **POST** `/api/vault/import`
- Body: `{ jsonData: string }`
- Returns: `{ success: boolean }`

## 🔍 Key Technical Details

### Wikilink Parser
```typescript
// Extract wikilinks from content
/\[\[([^\]]+)\]\]/g

// Replace wikilinks with markdown links
[[Note Name]] → [Note Name](wikilink:Note Name)
```

### Graph Algorithm
- Force-directed layout
- Node size proportional to backlink count
- Real-time updates on note changes
- Zoom and pan controls

### AI Streaming
```typescript
// Server-Sent Events format
data: {"choices": [{"delta": {"content": "text"}}]}

data: [DONE]
```

## 🎯 Best Practices

1. **Use Descriptive Titles**: Helps with graph navigation
2. **Link Liberally**: More connections = better knowledge graph
3. **Tag Consistently**: Makes filtering easier
4. **Regular Backups**: Export your vault periodically
5. **Template Usage**: Start with templates for common note types

## 🐛 Troubleshooting

### Graph Not Showing
- Create at least 2 notes with wikilinks
- Try zooming out using the zoom controls

### AI Not Responding
- Check your API key in settings
- Verify internet connection
- Check browser console for errors

### Notes Not Saving
- Check IndexedDB storage limit
- Try exporting/importing your vault
- Clear browser cache if needed

## 📄 License

This project is part of the Hezeer ecosystem.

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and include tests for new features.

---

Built with ❤️ using Next.js, TypeScript, and GLM-4 AI
