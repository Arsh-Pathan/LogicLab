# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript check + Vite production build (tsc -b && vite build)
npm run lint         # ESLint
npm run preview      # Preview production build locally
```

### Docker (full stack with Supabase)

```bash
docker-compose --env-file .env up -d --build   # Start all services
docker-compose --env-file .env down             # Stop all services
docker-compose --env-file .env down -v          # Stop + wipe database volume
```

Services: PostgreSQL (5433), GoTrue auth, PostgREST, Kong API gateway (8000), Nginx reverse proxy (5002).

## Architecture

**LogicLab** is a digital logic circuit simulator — React + Vite + TypeScript frontend with a self-hosted Supabase backend.

### Path Alias
`@/*` maps to `./src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Core Layers

1. **Simulation Engine** (`src/engine/`) — Pure logic, no UI dependencies. `SimulationEngine.ts` does signal propagation via topological sort. `gates.ts` implements all gate evaluations (AND, OR, NOT, flip-flops, muxes, adders, etc.). Undefined inputs resolve to `0`.

2. **State Management** (`src/store/`) — Zustand stores, no React providers needed:
   - `circuitStore.ts` (~35KB, largest file) — Bridges React Flow visual state with the simulation engine. Manages nodes, edges, custom ICs, undo/redo history.
   - `uiStore.ts` — Panel visibility, selection, theme, modals, grid snapping.
   - `authStore.ts` — Supabase auth state, OAuth (Google/GitHub), session management.
   - `projectStore.ts` — Project metadata, dirty flag, auto-save.

3. **React Flow Integration** (`src/nodes/`, `src/edges/`, `src/features/workspace/`) — Custom node types (GateNode, InputNode, OutputNode, ClockNode, LEDNode, SevenSegmentNode, ICNode, JunctionNode) and WireEdge. Node types registered in `nodeTypes.ts`, edge types in `edgeTypes.ts`. Canvas component in `features/workspace/Canvas.tsx`.

4. **Service Layer** (`src/lib/services/`) — Abstracts Supabase API calls: `authService`, `circuitService`, `icService`, `profileService`, `migrationService`. Falls back to localStorage for anonymous users.

5. **Serialization** (`src/serialization/`) — `exportProject.ts` and `importProject.ts` convert between runtime state and the `LogicProject` format (defined in `src/types/circuit.ts`).

### Routing (`App.tsx`)
- `/home` — Landing page
- `/sandbox` — Circuit editor (public, localStorage)
- `/sandbox/:projectId` — Editor with specific project
- `/dashboard` — User projects (protected route)
- `/academy` — Learning curriculum
- `/docs` — Documentation
- `/community` — Shared circuits

### Key Types (`src/types/circuit.ts`)
`CircuitNodeData`, `Connection`, `ICDefinition`, `LogicProject`, `SignalState`, `ComponentType`, `GateType` — all core domain types live here.

### Database
SQL init scripts in `supabase/db/init/` (00-roles through 05-seed). Tables: `profiles`, `circuits`, `ic_definitions`, `circuit_versions`, `community_posts`, `comments`, `votes`. Row-level security enforced.

## TypeScript
- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Target: ES2022, bundler module resolution
- ESLint ignores underscore-prefixed unused vars

## Styling
- Tailwind CSS 4 via `@tailwindcss/vite` plugin (JIT, no PostCSS config)
- Theme toggling via `data-theme` attribute on root element
- GSAP used for cinematic animations (LoadingScreen)
- Three.js for 3D background effects on landing page

## No Test Framework
There is currently no test runner or test files in the project.
