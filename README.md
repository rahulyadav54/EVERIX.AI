# Everix AI

**Everix AI** is an in-browser AI development agent. Describe what you want to build, run code in a sandbox, edit files, and preview full-stack apps—without installing a local toolchain.

This project is based on the open-source [Bolt](https://github.com/stackblitz/bolt.new) codebase and WebContainers, rebranded and configured for **Everix AI**.

## Features

- **Full-stack in the browser** — npm, Node, terminals, and previews inside your tab
- **AI-driven workflow** — scaffold projects, apply edits, and iterate from chat
- **Workbench** — file tree, editor, terminal, and live preview in one UI

## Getting started

### Prerequisites

- Node.js 18.18+
- npm or [pnpm](https://pnpm.io/) 9.x
- An API key for your chosen LLM provider (see below)

### Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local — pick a provider and API key
npm run dev
```

### Free / low-cost LLM providers

Set `LLM_PROVIDER` in `.env.local` (see `.env.example`):

| Provider | Cost | Get a key |
| -------- | ---- | --------- |
| **google** | Free tier | [Google AI Studio](https://aistudio.google.com/apikey) |
| **groq** | Free tier | [Groq Console](https://console.groq.com/keys) |
| **openrouter** | Many free models | [OpenRouter](https://openrouter.ai/keys) |
| **ollama** | Free (local) | [Ollama](https://ollama.com) — no cloud key |
| **anthropic** | Paid | [Anthropic](https://console.anthropic.com/) |

Example (Google Gemini):

```env
LLM_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=your_key
LLM_MODEL=gemini-1.5-flash
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm run dev` | Local development server |
| `pnpm run build` | Production build       |
| `pnpm run test` | Unit tests              |

## Branding

User-facing name, copy, and theme tokens live in `app/utils/branding.ts`. Update that file to change the product name, taglines, and meta description in one place.

## License

MIT — see upstream Bolt.new licensing. WebContainer API has separate [commercial terms](https://webcontainers.io).
