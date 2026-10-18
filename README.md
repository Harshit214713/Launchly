<div align="center">

  <img src="public/brand-logo-clean.png" alt="Launchly Logo" width="100" height="100" />

  # Launchly

  ### Open-Source Visual Web Studio & Production Next.js Engine

  <p align="center">
    A high-performance visual website builder and curated template architecture.<br/>
    Design on a tactile neo-brutalist canvas, preview responsive edge viewports, deploy in 1-click to GitHub & Vercel, or export clean Next.js App Router source code with zero vendor lock-in.
  </p>

  <p align="center">
    <a href="https://github.com/simplyvardaan/Launchly/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-black.svg?style=flat-square" alt="MIT License"/></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16%20%7C%20App%20Router-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16"/></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-black?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19"/></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-black?style=flat-square&logo=tailwind-css&logoColor=38B2AC" alt="Tailwind CSS v4"/></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-black?style=flat-square&logo=typescript&logoColor=3178C6" alt="TypeScript"/></a>
    <a href="https://github.com/simplyvardaan/Launchly/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-black.svg?style=flat-square" alt="PRs Welcome"/></a>
  </p>

  <p align="center">
    <a href="#overview">Overview</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#curated-templates">Templates (22)</a> •
    <a href="#studio-editor">Studio Editor</a> •
    <a href="#cloud-deployments">1-Click Deploy</a> •
    <a href="#social-og-suite">OG & Social Suite</a> •
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

**Launchly** bridges the gap between visual design speed and production-grade engineering:

- **22 Production-Ready Templates**: Curated across SaaS, AI, Agency, Portfolio, Ecommerce, Web3, and Media with bespoke micro-interactions.
- **Visual Studio Designer**: Real-time typography scale, WCAG accessibility contrast checker, neo-brutalist palettes, section reordering, and responsive canvas viewports.
- **1-Click GitHub & Vercel Deployments**: Provision new repositories directly to GitHub or deploy live to Vercel via authenticated API workflows right from the editor.
- **Zero Lock-In Full Project ZIP Export**: Generates complete, standalone Next.js 16 + Tailwind CSS v4 source repositories ready to clone, customize, and self-host.
- **Edge Subdomain Simulation**: Instant preview at `/live/[subdomain]` with wildcard DNS middleware support.
- **AI-Powered Design Synthesis**: Prompt-driven theme engine that refactors design tokens, copy, and layout live on canvas.
- **Dynamic Social & OpenGraph Engine**: Automated `@vercel/og` image synthesis with one-tap multi-platform social sharing.

---

<a id="key-features"></a>
## Key Features

### 🎨 Visual Studio Canvas
- **Multi-Device Simulation**: Instant preview toggling between **Desktop (100%)**, **Tablet (768px)**, and **Mobile (375px)** viewports with architectural grid canvas guidelines.
- **Section Controls**: Reorder, toggle, and customize Navigation, Hero, Features, Testimonials, CTA, and Footer blocks with immediate live re-rendering.
- **WCAG Contrast Checker**: Built-in color accessibility analyzer calculating contrast ratios and offering one-click accessible color recommendations.
- **History Engine**: Granular Undo/Redo state management to freely experiment with typography, color palettes, and component hierarchy.

### 🚀 1-Click Multi-Cloud Deployments
- **GitHub Repository Creator**: Authenticate with a personal access token to automatically create public or private repositories, initialize commits, and push full project files directly from the browser.
- **Direct Vercel Deployment**: Push pre-configured production deployments to Vercel API v13 with auto-generated project names and environment presets.
- **Pre-Configured Deploy Button**: Deep-link one-click deployment templates directly into Vercel's importer.

### 📦 Complete Source Code Scaffolding
- Download a production-ready ZIP archive of your configured site containing:
  - Next.js 16 App Router architecture (`src/app/page.tsx`, `layout.tsx`, `globals.css`)
  - Tailwind CSS v4 styling rules and token definitions
  - Strict TypeScript configurations (`tsconfig.json`)
  - Standalone dependency declarations (`package.json`) and developer documentation

### 🌐 Edge Subdomains & Wildcard Routing
- Publish custom landing pages instantly to `/live/[subdomain]`.
- Built-in edge middleware (`src/middleware.ts`) supports custom subdomain host mapping for custom domains.

### 🖼️ Dynamic Open Graph & Social Sharing Suite
- **Dynamic OG Image Generator** (`/api/og`): Generates custom high-resolution OpenGraph cards with live accents, typography, and badges.
- **Social Sharing Modal**: Instant pre-formatted post sharing to **X (Twitter)**, **LinkedIn**, **Reddit**, and **WhatsApp**, complete with interactive live card previews and clipboard copying.

---

<a id="architecture"></a>
## Architecture & Flow

```
                      ┌──────────────────────────────────────┐
                      │        Launchly Visual Studio        │
                      │       (/editor/[templateId])         │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┼────────────────────────┐
                 ▼                       ▼                        ▼
       [AI Design Synthesizer]  [WCAG Contrast Engine]   [Multi-Device Canvas]
       (/api/ai/generate)       (getContrastRatio)       (Desktop/Tablet/Mobile)
                 │                       │                        │
                 └───────────────────────┼────────────────────────┘
                                         │
                                         ▼
                 ┌────────────────────────────────────────────────┐
                 │          Unified Export & Publish Core         │
                 └───────┬────────────────┬───────────────┬───────┘
                         │                │               │
        ┌────────────────┴─────┐   ┌──────┴────────┐   ┌──┴──────────────────┐
        ▼                      ▼   ▼               ▼   ▼                     ▼
[1-Click GitHub Deploy]  [Vercel Cloud]   [ZIP Scaffolder]   [Edge Live Subdomain]
  (/api/deploy/github)     (/api/deploy/    (zipExport.ts)     (/live/[subdomain])
                           vercel)                 │                   │
                                                   ▼                   ▼
                                         [Next.js 16 Repo]   [Dynamic OG Cards]
                                         (Zero Lock-In)        (/api/og)
```

---

<a id="curated-templates"></a>
## Curated Templates (22)

Launchly includes 22 standalone, production-ready template architectures:

| Template | Category | Aesthetic Focus | Tech Stack |
|---|---|---|---|
| **Agenn AI** | AI | Multi-agent intelligence, token telemetry & holographic graphs | Next.js 16, Framer Motion, Tailwind v4 |
| **Fabrica Studio** | Agency | Kinetic motion reels, Swiss brutalist typography | Next.js 16, Geist Mono, TypeScript |
| **Chronicle OS** | SaaS | Linear & Raycast telemetry, incident radar, dark glass | Next.js 16, Lucide Icons, SVG charts |
| **Atelier Maison** | Ecommerce | High-fashion editorial lookbook, slide-out drawer cart | Next.js 16, Stripe Ready, Radix UI |
| **Noora Studio** | Agency | Spatial 3D device staging, fluid hover state transitions | Next.js 16, Framer Motion, Tailwind v4 |
| **Solstice Protocol** | Web3 | Real-time candlestick charts, algorithmic depth feeds | Next.js 16, High-density Grid, TypeScript |
| **Sora Cinema** | Media | 2.39:1 widescreen viewports, golden hour aesthetic | Next.js 16, HTML5 Media, CSS Backdrop |
| **Strata Cloud** | SaaS | Sub-second latency radar, CLI telemetry streams | Next.js 16, Terminal Components, Radix UI |
| **Elian Portfolio** | Portfolio | Editorial portfolio, minimalist project showcases | Next.js 16, CSS Grid, TypeScript |
| **Apex Aero** | Media | Wind tunnel telemetry stats & carbon fiber microtextures | Next.js 16, SVG Gauges, TypeScript |
| **Zenith Health** | AI | Biometric holographic vitals ring & epigenetic tracking | Next.js 16, Biometric Canvas, Tailwind v4 |
| **Nova Roasters** | Ecommerce | Flavor profile radar & custom grind subscription builder | Next.js 16, Snipcart Ready, TypeScript |
| **Prism 3D** | AI | Real-time 60fps WebGL viewport & procedural material graph | Next.js 16, Three.js / WebGL, Tailwind v4 |
| **Monolith DB** | SaaS | Live consensus heatmap & browser interactive SQL runner | Next.js 16, Wasm SQL, Tailwind v4 |
| **Vortex Studio** | Media | Ray-traced 4K gameplay teaser player & skill trees | Next.js 16, Web Audio API, Tailwind v4 |
| **Kinfolk Atelier** | Portfolio | Architectural blueprint viewer & Swiss-Kyoto grid | Next.js 16, Serif Fonts, Tailwind v4 |
| **Kuro Omakase** | Ecommerce | Seasonal 18-course timeline & interactive reservation | Next.js 16, Calendar Booking, Tailwind v4 |
| **Valkyrie Sound** | Media | Real-time interactive SVG waveform scope & Moog dials | Next.js 16, Web Audio API, Tailwind v4 |
| **Pulse Protocol** | Web3 | Modular ZK-rollup terminal & live circuit validator | Next.js 16, Web3 / Viem, Tailwind v4 |
| **Hyperion Capital** | Agency | Deeptech investment thesis papers & founder pitch portal | Next.js 16, Force-Directed Graph |
| **Lumina Workspace** | SaaS | Bidirectional graph linking & collaborative markdown | Next.js 16, Tiptap Editor, Tailwind v4 |
| **Zeno Objects** | Ecommerce | Slide-over cart drawer & material finish swatch switcher | Next.js 16, Stripe Cart, Tailwind v4 |

---

<a id="studio-editor"></a>
## Studio Editor & Canvas Workspace

The Studio Editor (`/editor/[templateId]`) offers a complete design workspace:

- **Viewport Scaler**: Toggle between Desktop, Tablet, and Mobile to audit responsive layouts with live grid background overlays.
- **Design Tokens**: Dynamically tune primary accents, background colors, text contrast, font pairings, and border radii.
- **Accessible Color Engine**: Integrated WCAG contrast checker flags inaccessible combinations and suggests compliant alternatives automatically.
- **Component Inspector**: Edit hero headings, subheadings, primary CTA links, feature matrices, customer testimonials, and footer links with live updates.
- **Interactive AI Prompting**: Type natural language prompts (e.g., *"Make it look like a cyberpunk terminal"* or *"Minimalist warm editorial archive"*) to re-theme in real time.

---

<a id="cloud-deployments"></a>
## 1-Click Cloud Deployments & Zero Lock-In Export

### 1. GitHub Deployment
1. Click **Deploy** in the Studio Editor header.
2. Select the **GitHub** tab.
3. Paste a GitHub Personal Access Token (requires `repo` scope).
4. Specify your desired repository name and choose Public or Private visibility.
5. Click **Create & Push Repository** — Launchly automatically initializes the repository and pushes all Next.js 16 project files.

### 2. Vercel Direct Deployment
1. Select the **Vercel** tab inside the Deploy Modal.
2. Enter your Vercel API Token.
3. Click **Deploy to Vercel** — your project will be uploaded and built automatically via the Vercel API v13.

### 3. Standalone ZIP Export
1. Click **Export ZIP** in the editor toolbar.
2. Launchly packages all components, styles, dependencies, and configs into a ready-to-run `.zip` file.
3. Extract and run locally with `npm install && npm run dev`.

---

<a id="social-og-suite"></a>
## Dynamic Open Graph & Social Sharing Suite

Launchly includes a built-in OpenGraph generator and social distribution suite:

- **Dynamic OpenGraph Route**: Access `/api/og?title=Your+Site&accent=%23FF5588&bg=%230A0B10` for branded, high-DPI social cards generated on the fly using `@vercel/og`.
- **Social Sharing Modal**: Click **Share** on any template or live website to open the social dialog.
- **Multi-Platform Support**: One-click sharing for:
  - 𝕏 (Twitter) with pre-filled hashtags and launch copy
  - LinkedIn with publication attribution
  - Reddit with community formatting
  - WhatsApp direct message integration
- **Live Social Card Preview**: Real-time visual mockup showing how your page appears across social feeds.

---

<a id="tech-stack"></a>
## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Server Components, Route Handlers)
- **Runtime**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with CSS Variables & Neo-Brutalist Design Tokens
- **Language**: [TypeScript 5](https://www.typescriptlang.org) (Strict Mode)
- **Motion & Interactions**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com) (Dialog, Select, Slider, Switch, Tabs, Tooltip)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Code Export & Bundling**: [JSZip](https://stuk.github.io/jszip/)
- **Dynamic Graphics**: [@vercel/og](https://vercel.com/docs/functions/og-image-generation) / Next.js ImageResponse, [QRCode](https://github.com/soldair/node-qrcode)
- **Database & Auth (Optional)**: [Supabase](https://supabase.com) (PostgreSQL, Row Level Security)

---

<a id="quickstart"></a>
## Quickstart

Follow these steps to run Launchly locally:

### 1. Prerequisites
- **Node.js**: `v20.0+`
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
Create a `.env.local` file from the provided example:
```bash
cp .env.example .env.local
```

Default local configuration:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3000
AUTH_SECRET="launchly_local_super_secret_development_key_change_me_in_prod"
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

<a id="available-scripts"></a>
## Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Analyzes code for TypeScript and ESLint standards |
| `npm run db:setup` | Initializes the optional PostgreSQL database schema |

---

<a id="project-structure"></a>
## Project Structure

```
Launchly/
├── public/                       # Static assets, branding, and template previews
│   ├── brand-logo-clean.png
│   ├── brand-name-dark.png
│   ├── brand-name-light.png
│   └── templates/                # Template preview thumbnails
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # REST & Cloud Route Handlers
│   │   │   ├── ai/generate/      # Prompt-to-design AI engine
│   │   │   ├── deploy/github/    # 1-Click GitHub repo creator & file pusher
│   │   │   ├── deploy/vercel/    # Direct Vercel cloud deployment API
│   │   │   ├── og/               # Dynamic OpenGraph image generator
│   │   │   ├── sites/publish/    # Edge subdomain site publisher
│   │   │   ├── stats/            # Telemetry & platform statistics
│   │   │   ├── templates/        # Template registry API endpoints
│   │   │   └── ...
│   │   ├── dashboard/            # Project management & user dashboard
│   │   ├── editor/[templateId]/  # Visual studio canvas designer
│   │   ├── live/[subdomain]/     # Edge live website surface
│   │   ├── templates/            # Template gallery & deep dive preview
│   │   ├── layout.tsx            # Root layout, fonts, and metadata
│   │   └── page.tsx              # Landing page
│   ├── components/               # Reusable UI blocks and modals
│   │   ├── DeployModal.tsx       # GitHub & Vercel deployment modal
│   │   ├── SocialShareModal.tsx  # Multi-platform social sharing dialog
│   │   ├── LiveWorkspaceSection.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── TemplatesSection.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/                      # Core business logic and helpers
│   │   ├── projectFiles.ts       # Next.js 16 project scaffolding generator
│   │   ├── zipExport.ts          # In-browser ZIP archive builder
│   │   ├── contrast.ts           # WCAG contrast ratio calculations
│   │   ├── templates.ts          # Curated 22-template catalog registry
│   │   ├── db.ts                 # Persistence layer
│   │   └── supabase.ts           # Supabase client & credentials
│   ├── middleware.ts             # Wildcard subdomain edge router
│   └── types/                    # TypeScript interfaces and schemas
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
| `GET` | `/api/templates/[id]/source` | Downloads source code archive for a specific template |
| `POST` | `/api/ai/generate` | Generates bespoke color tokens, copy, and layout from prompt |
| `POST` | `/api/deploy/github` | Provisions a new repository and pushes source code directly to GitHub |
| `POST` | `/api/deploy/vercel` | Deploys a live instance directly via the Vercel API |
| `GET` | `/api/og` | Generates dynamic OpenGraph preview images on the edge |
| `GET` | `/api/sites` | Fetches site records by user ID or subdomain |
| `POST` | `/api/sites/publish` | Provisions a live deployment at `/live/[subdomain]` |
| `GET` | `/api/stats` | Returns platform metrics, active templates, and user stats |
| `POST` | `/api/checkout` | Processes checkout and plan upgrades |
| `POST` | `/api/payments/verify` | Validates payment status and fulfillment |
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
