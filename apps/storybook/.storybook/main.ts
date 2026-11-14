import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

// Stories import the public package name, exactly like a consumer app.
// This alias points it at the library source so edits hot-reload without `pnpm build`.
const libSrc = fileURLToPath(new URL("../../../src/", import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = [
      { find: /^@your-scope\/lab-ds$/, replacement: `${libSrc}index.ts` },
    ];
    return viteConfig;
  },
};

export default config;
