# React Learning Notes – Team Task Tracker

## Phase 1: React Fundamentals

### Step 1: Project Setup (Vite + React 19)

**What:** Vite is a dev server and build tool. `main.jsx` is the entry point that mounts React into `<div id="root">`.

**How it works:**
1. Browser loads `index.html`, which has `<div id="root">` and a `<script type="module" src="/src/main.jsx">`.
2. `createRoot(...).render(<App />)` tells React to take over that div.
3. `App` returns JSX, which React turns into DOM nodes.

**Implemented:** Clean Vite project, folder structure by responsibility (components, pages, hooks, context, services, utils, data).

**Use when:** Starting any modern SPA.
**Avoid:** Create React App (deprecated).

**Common mistakes:**
- Putting everything in `App.jsx`.
- Installing libraries before they're needed.
- Forgetting `.jsx` extension on files containing JSX (Vite requires it).

**Interview Q&A:**
1. *Why Vite over CRA?* Native ESM dev server (no full bundle on start) and Rollup-based production builds. It's much faster, and CRA is no longer maintained.
2. *What does StrictMode do?* In development only, it double-invokes renders and effects (mount → unmount → mount) to expose impure renders and missing cleanups. It has no effect in production.
3. *What does `createRoot` do vs the old `ReactDOM.render`?* `createRoot` enables React 18+ concurrent features (automatic batching, transitions). `ReactDOM.render` was removed in React 19.