<div align="center">

# AstraGPT

### Your AI-Powered Chat Assistant

A futuristic AI chat interface featuring real-time streaming responses, plasma-themed glassmorphism UI, and full Markdown support — built with React and Vite.

[![MIT License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

<br />

<img src="https://img.shields.io/badge/Status-Active-00ff88?style=for-the-badge" />

</div>

---

## Screenshots

<div align="center">
<table>
<tr>
<td align="center"><strong>Welcome Screen</strong></td>
<td align="center"><strong>Chat Interface</strong></td>
</tr>
<tr>
<td><img src="screenshots/welcome.png" width="400" alt="Welcome Screen" /></td>
<td><img src="screenshots/chat.png" width="400" alt="Chat Interface" /></td>
</tr>
</table>
</div>

---

## Features

### Core Chat
- **Real-time Streaming** — Responses appear token-by-token using the Fetch Streams API
- **Full Markdown Rendering** — Headings, lists, tables, blockquotes, links, bold, italic & more
- **Syntax-Highlighted Code Blocks** — 100+ languages with a one-click **Copy** button
- **Regenerate & Delete** — Hover over any message to regenerate or remove it
- **Auto-Save** — Chat history persists in `localStorage` across page refreshes

### AI Models
- **Multi-Model Selector** — Switch between Sonnet 4.6, Sonnet 4.0, Opus 3.5, and Haiku 3.0
- **Conversation Context** — Full conversation history is sent with each request for contextual replies

### Visual Design
- **Plasma Animated Background** — 5-layer radial gradient rotating on a 20-second loop
- **Glassmorphism Panels** — Frosted-glass blur effects on sidebar, header, input area & dropdowns
- **Floating Particles** — 6 animated glowing particles with ambient glow orbs
- **Neon Glow Effects** — Multi-layered pink, cyan & purple box-shadow glows
- **Scanline Overlay** — Subtle retro-CRT aesthetic
- **Animated Grid** — Slowly scrolling 50x50px grid overlay

### UI / UX
- **Fully Responsive** — Desktop, tablet & mobile with collapsible sidebar
- **Quick Action Buttons** — Code, Write, Learn, Life stuff, AstraGPT's choice
- **Streaming Progress Bar** — Animated rainbow bar at top while receiving response
- **Typing Indicator** — 3 bouncing dots while waiting for the first token
- **Status Indicator** — Floating pill showing "Thinking..." or "Streaming response..."
- **Reduced-Motion Support** — Respects `prefers-reduced-motion` for accessibility

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 |
| **Build Tool** | Vite 5 |
| **Styling** | Pure CSS3 with Custom Properties |
| **Icons** | Lucide React |
| **Markdown** | react-markdown + remark-gfm |
| **Syntax Highlighting** | react-syntax-highlighter (VSC Dark+ theme) |
| **HTML in Markdown** | rehype-raw |

---

## Project Structure

```
astragpt/
├── public/
│   └── icon.svg                  # App favicon
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Root component with background effects
│   ├── components/
│   │   ├── ChatInterface.jsx     # Core chat logic, API calls, sidebar & header
│   │   └── MessageContent.jsx    # Markdown + code block renderer
│   └── styles/
│       ├── index.css             # Global reset, CSS variables, plasma background
│       ├── App.css               # App container, scanline overlay
│       ├── ChatInterface.css     # Sidebar, header, messages, input, responsive
│       ├── MessageContent.css    # Markdown typography, code blocks, tables
│       ├── Enhancements.css      # Streaming cursor, shimmer, status indicator
│       └── ParticleEffects.css   # Particles, grid overlay, ambient glows
├── index.html                    # HTML entry point
├── vite.config.js                # Vite config (port 3000, auto-open)
├── package.json
└── LICENSE
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x

### Installation

```bash
# Clone the repository
git clone https://github.com/codewith-aditya/AstraGPT.git
cd AstraGPT

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will automatically open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Configuration

### API Endpoint

The app communicates with a backend API for AI responses. Update the endpoint in `src/components/ChatInterface.jsx`:

```js
const response = await fetch('YOUR_API_ENDPOINT/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    conversation_history: messages
  })
});
```

### API Request Format

```json
{
  "message": "User's current message",
  "conversation_history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

### API Response Format

The backend should return a **streaming text response** (chunked transfer encoding). The frontend reads it token-by-token using the Fetch ReadableStream API.

---

## Roadmap

- [ ] User authentication & accounts
- [ ] Server-side chat history persistence
- [ ] Voice input integration
- [ ] Image generation support
- [ ] Multi-conversation management
- [ ] Payment & subscription system
- [ ] File upload & analysis
- [ ] Dark / Light theme toggle

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Developed by [Aditya Wakharkar](https://github.com/codewith-aditya)**

<br />

<sub>If you found this project helpful, consider giving it a star!</sub>

</div>
