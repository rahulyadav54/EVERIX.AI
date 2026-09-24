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
- [pnpm](https://pnpm.io/) 9.x
- An [Anthropic API key](https://console.anthropic.com/) (Claude)

### Setup

```bash
pnpm install
cp .env.example .env   # if present; add your API keys
pnpm run dev
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
