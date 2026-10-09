# Contributing to Launchly 🚀

First off, thank you for considering contributing to **Launchly**! 🎉 

Launchly is an open-source, gamified website builder and curated template ecosystem engineered for modern developers and creators. We welcome contributions from everyone, whether you're fixing a bug, adding a new template, polishing animations, or improving documentation.

---

## 📑 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features & Templates](#suggesting-features--templates)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Local Development Setup](#-local-development-setup)
- [Git Commit Guidelines](#-git-commit-guidelines)
- [Code Style & Best Practices](#-code-style--best-practices)
- [Community & Support](#-community--support)

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code of conduct. Please report unacceptable behavior via GitHub issues or directly to the project maintainers.

---

## 🛠 How Can I Contribute?

### Reporting Bugs

Before submitting a bug report, check existing [GitHub Issues](https://github.com/simplyvardaan/Launchly/issues) to avoid duplicates.

When filing a bug, please use the **Bug Report Template** and include:
1. **A clear summary**: What were you doing, and what went wrong?
2. **Steps to reproduce**: Numbered steps to trigger the bug.
3. **Environment details**: Node.js version, browser, OS, and package manager.
4. **Screenshots / Console Logs**: Any relevant visual proof or stack traces.

### Suggesting Features & Templates

We love new ideas, whether it's:
- A new curated template (SaaS, AI, Agency, Portfolio, Web3, etc.)
- A visual editor control (fonts, borders, gradients, shadows)
- Live preview responsive tweaks or code export optimizations

Please open a [Feature Request](https://github.com/simplyvardaan/Launchly/issues/new) describing your concept, user benefit, and proposed design.

### Submitting Pull Requests

1. **Fork the Repository**: Click "Fork" on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
3. **Install Dependencies & Test**:
   ```bash
   npm install
   npm run dev
   ```
4. **Commit Your Changes**: Follow the [Git Commit Guidelines](#-git-commit-guidelines).
5. **Push to Your Fork**:
   ```bash
   git push origin feat/your-feature-name
   ```
6. **Open a Pull Request**: Submit a PR to `simplyvardaan/Launchly:main` with a clear description and testing notes.

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js**: `v18.18.0` or higher (`v20.x` recommended)
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`

### Setup Instructions

```bash
# 1. Clone your fork
git clone https://github.com/simplyvardaan/Launchly.git
cd Launchly

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

### Key Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts local Next.js development server with hot-reload |
| `npm run build` | Builds the production Next.js bundle |
| `npm run start` | Serves the production build locally |
| `npm run lint` | Runs ESLint checks across TypeScript / TSX files |

---

## 📝 Git Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>
```

### Common Types:

| Prefix | Description | Example |
|---|---|---|
| `feat` | A new feature or template | `feat(editor): add font family picker` |
| `fix` | A bug fix | `fix(navbar): prevent dark mode flash` |
| `docs` | Documentation changes | `docs(readme): add template matrix` |
| `style` | Formatting, CSS changes, white space | `style(cta): refine drop shadow tokens` |
| `refactor` | Code restructuring without feature change | `refactor(db): streamline sites cache` |
| `perf` | Performance improvement | `perf(preview): optimize iframe render latency` |
| `chore` | Maintenance, dependencies, tooling | `chore(deps): update lucide-react` |

---

## 🎨 Code Style & Best Practices

- **TypeScript Strictness**: Always provide proper types and avoid `any`.
- **Styling Architecture**: We use Tailwind CSS v4 alongside modular tokens and CSS variables. Keep the Neo-brutalist / Cyberpunk design aesthetic cohesive.
- **Component Design**: Favor composable, accessible components using Radix UI primitives and Lucide React icons.
- **Micro-Animations**: Utilize Framer Motion with subtle spring transitions (`stiffness: 300`, `damping: 24`). Avoid jarring layout jumps.

---

## 💬 Community & Support

- Star the project on [GitHub](https://github.com/simplyvardaan/Launchly) to show your support!
- Share your feedback via GitHub Issues or Discussions.
- Tag [@simplyvardaan](https://github.com/simplyvardaan) on GitHub with questions.

Thank you for building Launchly with us! 🚀
