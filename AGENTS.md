# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this repository.

## What this is

`@your-scope/lab-ds` is a public React + TypeScript design system published to npm as a **compiled package**. (`@your-scope` is a placeholder: the unscoped name `lab-ds` is taken on npm. Replace the scope in `package.json`, this file and `README.md` before the first publish.) Components come from the `week-1-lab` Next.js app and are based on [shadcn/ui](https://ui.shadcn.com)'s `base-luma` style: **Base UI** primitives (`@base-ui/react`), **Hugeicons**, and Tailwind CSS v4 written as `@apply` in per-component CSS files. Unlike shadcn, consumers do not copy source. They install the package and import components:

```tsx
import { Button } from "@your-scope/lab-ds";
import "@your-scope/lab-ds/styles.css"; // once, e.g. in the Next.js root layout
```

The primary consumers are **Next.js App Router** apps, so every published module must work in React Server Components (see "RSC safety" below).

## Stack

- **pnpm**, version pinned by `packageManager` in `package.json` (the library is the workspace root package; `apps/*` holds private, unpublished apps such as `apps/storybook`). Dependency build scripts are blocked unless listed under `allowBuilds` in `pnpm-workspace.yaml` (currently `esbuild`, `@parcel/watcher`).
- **React** as a peer (`^18 || ^19`) + **TypeScript** (strict). TS is pinned to `~6.0` because `typescript-eslint` doesn't support newer versions yet. Don't bump it past what `typescript-eslint` allows.
- **Tailwind CSS v4**, CSS-first config (`@theme` in CSS, no `tailwind.config.js`)
- **tsup** for the JS build (ESM + CJS + `.d.ts`/`.d.cts`)
- **Storybook** (`@storybook/react-vite`, with the docs, a11y, vitest and mcp addons) in `apps/storybook`, for docs, playground and browser tests of each story
- **Vitest** + React Testing Library (jsdom, globals enabled) for tests
- **ESLint + Prettier** for lint and format (`prettier-plugin-tailwindcss` sorts classes in `cn()` calls and `@apply` rules)
- **Manual releases** (no Changesets or semantic-release). There's no LICENSE yet; one is needed before the first public release.

## Commands

```bash
pnpm install
pnpm storybook          # dev: Storybook (apps/storybook) on http://localhost:6006
pnpm build              # tsup (JS + types) + Tailwind CLI (dist/styles.css)
pnpm typecheck          # tsc --noEmit
pnpm lint               # eslint .
pnpm format             # prettier --write .
pnpm test               # vitest run
pnpm test:watch         # vitest
pnpm vitest run src/components/button/button.test.tsx   # single file
pnpm vitest run -t "applies variant and size"            # single test by name
pnpm build-storybook    # static Storybook into apps/storybook/storybook-static/
pnpm test:storybook     # run every story as a headless Chromium test (play functions, a11y)
```

Release (manual, from a clean `main`). `prepublishOnly` runs lint, typecheck, test and build automatically:

```bash
pnpm build && pnpm pack --dry-run   # check exactly which files ship (dist/, package.json, README.md)
npm version <patch|minor|major>
pnpm publish
git push --follow-tags
```

## Architecture

```
src/
  index.ts                 # public API: the only JS entry. Every export here is a semver commitment
  lib/utils.ts             # cn() = clsx + tailwind-merge
  components/<name>/
    <name>.tsx             # markup and typed props; no Tailwind classes, no CSS import
    <name>.css             # all styling, written with @apply; imported by styles/index.css
    <name>.test.tsx
    index.ts
  styles/
    index.css              # entry for dist/styles.css: Tailwind, shadcn variants, theme, component CSS, base layer
    theme.css              # design tokens: CSS variables + @theme mapping, light/dark
  test/setup.ts            # jest-dom matchers; excluded from the build
apps/storybook/             # private workspace app, never published
  .storybook/main.ts       # aliases @your-scope/lab-ds to src/index.ts so edits hot-reload without a build
  .storybook/storybook.css # imports src/styles/index.css and adds @source for the stories
  stories/<name>.stories.tsx
```

`src/components/button/` is the reference component. Copy its file layout, data-attribute pattern, test style and story style (`apps/storybook/stories/button.stories.tsx`) for new components.

### Two build outputs

1. **JS**: tsup compiles `src/**` (minus tests, stories, `src/test/`) to `dist/` as ESM (`.js`) + CJS (`.cjs`) with type declarations. `react` and `react-dom` (and `next`, if ever used) are **peerDependencies** and must stay external. Runtime libraries (`@base-ui/react`, `@hugeicons/react`, `@hugeicons/core-free-icons`, `clsx`, `tailwind-merge`) are `dependencies`. `shadcn` is a devDependency: only its CSS is used, and it is compiled into `dist/styles.css`.
2. **CSS**: the Tailwind v4 CLI compiles `src/styles/index.css` to `dist/styles.css`. Each component's `<name>.css` reaches the output through an `@import` line in `index.css`, so **a new component needs its own `@import` line there**. TSX files import no CSS: tsup would leave a raw `.css` import in `dist/`, and consumers get every style from `styles.css`. Automatic source detection is off (`source(none)`), and only `src/components` is scanned for the few utilities used directly in TSX (such as `sr-only`), with `*.stories.tsx` and `*.test.tsx` excluded so they can't add classes to the shipped CSS. **If you add component code outside `src/components`, add an `@source` line for it in `index.css`.** A class only gets into the CSS if it appears as a **complete literal string** in scanned source.

`package.json` `exports` exposes `"."` (separate `import`/`require` conditions, each with its own types) and `"./styles.css"`. `"sideEffects": ["**/*.css"]` keeps the JS tree-shakeable.

### Component styling

- **Props become data attributes**: `variant` and `size` render as `data-variant` and `data-size`, and the CSS selects on them. Variants live in CSS, not `cva`.
- **Class names are namespaced** (`.ui-button`, `.ui-dialog-content`), because the stylesheet is global.
- **All rules sit inside `@layer components`**, so utilities passed through `className` beat component styles, including their hover and other state rules. `index.css` owns the layer order.
- **Keep selector specificity flat**: wrap attribute selectors in `:where()` and order rules as base, variants, sizes, then states that must win (such as `aria-invalid`). Source order then resolves conflicts.
- **Inside a component, style its children with component classes**, because a utility on a child beats that child's hover styles (see `.ui-dialog-close`).
- **Write shadcn's marker-class selectors as plain CSS** (`group/*`, `group-data-*`, `peer-*`): the marker classes don't exist in the TSX. For example, `group-data-[size=sm]/avatar:text-xs` becomes `.ui-avatar[data-size="sm"] .ui-avatar-fallback`.
- **Base UI state attributes**: disabled Checkbox and Switch carry `[data-disabled]`; open/checked states use the `data-open:`, `data-checked:` and similar variants from `shadcn/tailwind.css`.
- **Base UI composes with the `render` prop** (`<DialogTrigger render={<Button variant="outline" />}>`).

### RSC safety (Next.js)

- Any component that uses hooks, context, refs, event handlers, or Base UI (including `Button`, `Input` and `useRender`) must start with `"use client"`. `src/index.ts` and other barrel files must **not** have it: they re-export, and the client boundary lives in the component module.
- tsup runs with `bundle: false` (one output file per source file) because bundling strips or misplaces directives. esbuild doesn't add extensions to relative imports in that mode, so a custom `renderChunk` plugin in `tsup.config.ts` rewrites `./x` to `./x.js`/`./x.cjs`, and directory imports to `./x/index.js`. It resolves specifiers against `src/`. Only plain relative imports are supported, so keep imports static and relative.
- After changing the build config, inspect `dist/`. `"use client"` must be the first statement of client modules (in CJS it follows `"use strict"`, which is fine), and every relative specifier needs an extension.
- Pure presentational components with no client APIs stay server-compatible (ProductCard is one). Don't add `"use client"` to them by default.
- Library code uses plain elements in place of `next/*` (ProductCard renders `<img>`, not `next/image`).

### Theming

Tokens in `theme.css` are copied from `week-1-lab`'s `src/app/globals.css` and follow shadcn's semantic naming (`--background`, `--primary`, `--success`, `--product-surface`, `--radius`, ...), mapped to Tailwind with `@theme inline`. Radius utilities all derive from `--radius`. Dark mode is a `.dark` class on an ancestor. Components only use semantic utilities (`bg-primary`, `text-muted-foreground`), never raw palette colors (`bg-blue-500`), so consumers can re-theme by overriding variables.

Fonts are consumer-provided: `--font-sans`, `--font-heading` and `--font-geist-mono` are set by the app (with `next/font` in the root layout), and the library only maps them to `font-sans`, `font-heading` and `font-mono`.

## Conventions

- **Adding a component from shadcn:** use `pnpm dlx shadcn@latest add <name>` (with `components.json` pointed at `src/`) or copy from the shadcn source, then adapt it to the component styling rules above:
  - Rewrite `@/` path aliases to **relative imports**. tsup doesn't rewrite TS path aliases, so they break in the published output. (The `@/*` path in `tsconfig.json` exists only so the shadcn CLI knows where to write files. ESLint rejects `@/` imports.)
  - Move its Tailwind classes into `<name>.css` and add the `@import` line to `src/styles/index.css`.
  - Move it into `src/components/<name>/`, add `"use client"` if needed, and export it from `src/index.ts`.
  - Add a test, and a story in `apps/storybook/stories/<name>.stories.tsx`. Stories import from `@your-scope/lab-ds`, like a consumer, and cover every prop and state (see the Button story).
- Add `data-slot="<name>"` on the root and spread `...props` onto it. Merge `className` with `cn("ui-<name>", className)` so consumer classes apply (the Button test checks this).
- Export each component's props, size and variant types (`ButtonProps`, `ButtonSize`, `ButtonVariant`) alongside it.
- Removing or renaming anything exported from `src/index.ts`, or changing a token name, is a **breaking change** (major version).
- **Open decision, refs:** components are plain function components that take `ref` as a prop, which works on React 19. The peer range still includes React 18, where those refs are dropped. Resolve by narrowing the peer range to `^19` or wrapping components in `React.forwardRef`.
