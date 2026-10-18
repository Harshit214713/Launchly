<div align="center">

  <img src="public/brand-logo-clean.png" alt="Launchly Logo" width="100" height="100" />

  # Launchly

  ### Open-Source Visual Web Studio & Production Next.js Engine

  <p align="center">
    A high-performance visual website builder and curated template architecture.<br/>
    Design on a tactile neo-brutalist canvas, preview responsive edge viewports, and export clean Next.js 15 App Router source code with zero vendor lock-in.
  </p>

  <p align="center">
    <a href="https://github.com/simplyvardaan/Launchly/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-black.svg?style=flat-square" alt="MIT License"/></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15%20%7C%2016-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js"/></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-black?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19"/></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-black?style=flat-square&logo=tailwind-css&logoColor=38B2AC" alt="Tailwind CSS v4"/></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-black?style=flat-square&logo=typescript&logoColor=3178C6" alt="TypeScript"/></a>
    <a href="https://github.com/simplyvardaan/Launchly/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-black.svg?style=flat-square" alt="PRs Welcome"/></a>
  </p>

  <p align="center">
    <a href="#overview">Overview</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#curated-templates">Templates</a> •
    <a href="#studio-editor">Studio Editor</a> •
    <a href="#quickstart">Quickstart</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>

</div>

---

<a id="overview"></a>
## Overview

Most website builders generate bloated, unmaintainable markup trapped inside proprietary platforms. Hand-coding landing pages requires hours of repetitive scaffolding before seeing a single interactive component.

Launchly combines visual canvas customization with clean, modern source code:

- **Curated Template Systems**: Production-grade architectures covering AI agents, SaaS telemetry, brutalist creative studios, luxury ecommerce, and Web3 finance.
- **Visual Studio Editor**: Real-time typography scales, curated palettes, spacing controllers, and section arrangement.
- **AI-Powered Synthesis**: Natural language prompt generation that refactors design tokens, copy, and layout live on canvas.
- **Edge Deployment Simulation**: Instant preview at `/live/[subdomain]` with wildcard DNS middleware support for custom domains.
- **Zero Lock-In Source Export**: Clean TypeScript, Tailwind v4, and Next.js 15 App Router components ready for immediate deployment to Vercel, Netlify, or self-hosted servers.

---

<a id="architecture"></a>
## Architecture & Flow

Launchly operates as a full-stack Next.js application leveraging SSR, Turbopack, and edge middleware:

```
[Template Registry]
        │
        ▼
[Studio Canvas Engine] ───► [AI Design Synthesizer]
        │                              │
        ├──────────────────────────────┘
        ▼
[Live Edge Router] (/live/[subdomain])
        │
        ├──► Wildcard Subdomain Routing (src/middleware.ts)
        └──► Clean Component Source Export
```

---

<a id="curated-templates"></a>
## Curated Templates

Every template is designed as a standalone, production-ready system with bespoke layout patterns and micro-interactions:

| Template | Category | Aesthetic Focus | Architecture |
|---|---|---|---|
| **Agenn AI** | AI | Holographic graphs, prompt playground, token telemetry | Next.js 15, Framer Motion, Tailwind v4 |
| **Fabrica Studio** | Agency | Kinetic motion reels, Swiss brutalist typography | Next.js 15, Geist Mono, TypeScript |
| **Chronicle OS** | SaaS | Linear and Raycast dark glass telemetry, incident radar | Next.js 15, Lucide Icons, SVG charts |
| **Atelier Maison** | Ecommerce | High-fashion editorial lookbook, slide-out drawer cart | Next.js 15, Custom Flexbox, Radix UI |
| **Noora Studio** | Agency | Spatial 3D device staging, fluid hover state transitions | Next.js 15, Framer Motion, Tailwind v4 |
| **Solstice Defi** | Web3 | Real-time candlestick charts, algorithmic depth feeds | Next.js 15, High-density Grid, TypeScript |
| **Sora Cinema** | Media | 2.39:1 widescreen viewports, golden hour aesthetic | Next.js 15, HTML5 Media, CSS Backdrop |
| **Strata Cloud** | SaaS | Sub-second latency radar, CLI telemetry streams | Next.js 15, Terminal Components, Radix UI |
| **Elian Portfolio** | Portfolio | Editorial portfolio, minimalist project showcases | Next.js 15, CSS Grid, TypeScript |

---

<a id="studio-editor"></a>
## Studio Editor & Edge Hosting

The Studio Editor (`/editor/[templateId]`) offers a complete design workspace:

- **Multi-Device Canvas**: Seamlessly toggle across Desktop (1440px), Tablet (768px), and Mobile (375px) viewports with architectural grid backgrounds.
- **Token Management**: Live modification of primary accents, dark/light surface tokens, font scale, and corner radii.
- **Section Controls**: Toggle and reorder Navigation, Hero, Feature matrices, Testimonials, Call to Action, and Footer blocks.
- **Prompt Synthesis**: Provide natural language creative prompts to dynamically re-theme colors, typography, and marketing copy.
- **Subdomain Deployment**: Publish directly to custom subdomains (`[subdomain].launchly.site` or custom domains) with instant edge caching.

---

<a id="tech-stack"></a>
## Tech Stack

- **Core**: [Next.js 15 / 16](https://nextjs.org) (App Router, Turbopack, React Server Components)
- **Runtime**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with CSS Variables & Neo-Brutalist Design Tokens
- **Language**: [TypeScript 5](https://www.typescriptlang.org) (Strict Mode)
- **Icons**: [Lucide React](https://lucide.dev)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com)
- **Database / Auth**: [Supabase](https://supabase.com) (PostgreSQL, JWT Sessions, Row Level Security)
- **Build & Bundler**: Next.js Turbopack

---

<a id="quickstart"></a>
## Quickstart

Follow these steps to run Launchly locally:

### 1. Prerequisites
- **Node.js**: `v18.18+` or `v20+`
- Package manager: `npm`, `pnpm`, or `bun`

### 2. Clone the Repository
```bash
git clone https://github.com/simplyvardaan/Launchly.git
cd Launchly
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Required environment variables:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
AUTH_SECRET="your-secure-auth-secret"
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Analyzes code for TypeScript and ESLint standards |

---

## Project Structure

```
Launchly/
├── public/                      # Static assets, brand logos, testimonials
│   ├── brand-logo-clean.png
│   ├── brand-name-dark.png
│   └── brand-name-light.png
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # REST endpoints (auth, sites, payments, ai)
│   │   │   ├── ai/generate/     # Prompt-to-design engine
│   │   │   ├── sites/publish/   # Domain deployment engine
│   │   │   └── ...
│   │   ├── dashboard/           # User project management workspace
│   │   ├── editor/[templateId]/ # Studio visual designer
│   │   ├── live/[subdomain]/    # Deployed website edge surface
│   │   ├── templates/           # Template gallery & deep dive preview
│   │   ├── layout.tsx           # Root shell & typography
│   │   └── page.tsx             # Main landing page
│   ├── components/              # Neo-brutalist and modular UI blocks
│   │   ├── Hero.tsx
│   │   ├── LiveWorkspaceSection.tsx
│   │   ├── TemplatesSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/                     # Database client, template data, utilities
│   │   ├── db.ts                # Site persistence layer
│   │   ├── supabase.ts          # Supabase client & admin instances
│   │   └── templates.ts         # Curated template registry
│   ├── middleware.ts            # Wildcard subdomain edge router
│   └── types/                   # TypeScript schemas and models
├── .env.example
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

---

<a id="api-reference"></a>
## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/templates` | Retrieves all registered templates and categories |
| `GET` | `/api/templates/[id]` | Returns specifications and metadata for a given template |
| `POST` | `/api/ai/generate` | Generates bespoke color tokens, copy, and layout from prompt |
| `GET` | `/api/sites` | Fetches site records by user ID or subdomain |
| `POST` | `/api/sites/publish` | Provisions a new live deployment at `/live/[subdomain]` |
| `POST` | `/api/newsletter` | Subscribes an email to system updates |
| `POST` | `/api/contact` | Submits inquiries and support requests |
| `POST` | `/api/auth/signup` | Registers a new user session |
| `POST` | `/api/auth/login` | Authenticates existing credentials and issues session cookie |
| `GET` | `/api/auth/me` | Retrieves the active authenticated user profile |

---

<a id="contributing"></a>
## Contributing

Launchly is open source. Community contributions, bug fixes, template submissions, and architectural improvements are welcome.

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. Commit your changes following conventional commit syntax:
   ```bash
   git commit -m "feat(templates): add minimal architectural agency layout"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/awesome-feature
   ```
5. Open a Pull Request on GitHub.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and standards.

---

<a id="license"></a>
## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.
