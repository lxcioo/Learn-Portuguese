# LearnPortuguese 🇵🇹

A modern, offline-first Progressive Web App (PWA) for learning European Portuguese (pt-PT) with structured learning paths, context dialogues, situational grammar, Leitner spaced repetition, and authentic native audio.

---

## ✨ Features

- **Structured Curriculum**: 20 complete units covering A1/A2 levels (vocabulary, dialogues, grammar, and exams).
- **European Portuguese Audio**: Authentic pt-PT pronunciation with offline caching and zero-latency audio playback.
- **Context Dialogues & Comprehensible Input**: Realistic conversations with line-by-line inspection, slow tempo mode, and cultural notes.
- **Grammar Guide & Interactive Building Blocks**: Grammar explanations with interactive verb conjugation blocks and *Ser vs. Estar* decision exercises.
- **Leitner Spaced Repetition Box System**: 4 review boxes with dynamic review intervals, error tracking, and custom practice sessions.
- **Offline-First PWA**: Fully functional offline with Service Worker caching (`dist/sw.js`), installable on iOS, Android, macOS, and Windows.
- **Dark Mode**: Automatic system preference detection with manual toggle.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v20+ (Node.js 22 LTS recommended) or [Bun](https://bun.sh/)
- `npm` or `bun`

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Run Development Server

```bash
npm run dev
# or
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server with proxy middleware at `http://localhost:3000` |
| `npm run build` | Compiles `public/content.json` from `src/models/data/units/`, syncs audio, and builds the production PWA to `dist/` |
| `npm run preview` | Starts a local static preview server of the production build in `dist/` |
| `npm run typecheck` | Validates TypeScript types across the entire project (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint on project files |
| `npm run generate-audio` | Pre-downloads European Portuguese (pt-PT) audio files for all exercises |

---

## 🚢 Publishing & Deployment

### 1. GitHub Pages (Automated via GitHub Actions)

The repository includes a ready-to-run GitHub Actions workflow in [`.github/workflows/deploy_content.yml`](.github/workflows/deploy_content.yml):

1. Push your changes to the `main` branch.
2. Ensure GitHub Pages is enabled in your repository:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**
3. The workflow will automatically:
   - Install dependencies
   - Build the web app and PWA into `dist/`
   - Deploy `dist/` directly to GitHub Pages

### 2. Manual Static Hosting (Vercel, Netlify, Cloudflare Pages, S3)

Run the production build:

```bash
npm run build
```

Deploy the generated `dist/` folder to any static hosting provider. The build is completely self-contained with relative asset linking and service worker configuration.

---

## 📱 PWA Installation

- **iOS / Safari**: Tap the **Share** button and select **Add to Home Screen**.
- **Android / Chrome**: Tap the **Install** banner or the three dots menu > **Install App**.
- **Desktop (Chrome/Edge/Brave)**: Click the **Install** icon in the address bar.
