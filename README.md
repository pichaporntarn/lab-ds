# @your-scope/lab-ds

React + TypeScript design system based on [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com) and Tailwind CSS v4. Ships as a compiled package that works in Next.js App Router (Server Components).

Components: Avatar, Badge, Button, Checkbox, Dialog, Input, Label, ProductCard, Progress, Select, Switch.

## Install

```bash
pnpm add @your-scope/lab-ds
```

Requires `react` and `react-dom` 18 or 19.

## Usage

Import the stylesheet once, for example in `app/layout.tsx`:

```tsx
import "@your-scope/lab-ds/styles.css";
```

Then use components:

```tsx
import { Button } from "@your-scope/lab-ds";

export default function Page() {
  return <Button variant="outline">Click me</Button>;
}
```

## Theming

Colors and radius are CSS variables using shadcn/ui's semantic names (`--primary`, `--background`, `--radius`, ...). Override them after importing the stylesheet:

```css
:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.5rem;
}
```

Dark mode is enabled by a `.dark` class on an ancestor element (e.g. `<html class="dark">`).

Fonts are not bundled. Set `--font-sans`, `--font-heading` and `--font-geist-mono` in your app, for example with `next/font`:

```tsx
import { Geist, Geist_Mono, Inter } from "next/font/google";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const heading = Geist({ subsets: ["latin"], variable: "--font-heading" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// <html className={`${sans.variable} ${heading.variable} ${mono.variable}`}>
```

## Development

See [AGENTS.md](./AGENTS.md) for commands, architecture and conventions.
