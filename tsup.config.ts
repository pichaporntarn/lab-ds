import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Options } from "tsup";

const SRC = path.resolve("src");
const DIST = path.resolve("dist");

/**
 * We build unbundled (one output file per source file) so that each module's
 * `"use client"` directive stays at the top of its own file, which Next.js
 * App Router needs. esbuild doesn't rewrite import specifiers in unbundled
 * mode, so this plugin turns `./button` into `./button.js` / `./button.cjs`,
 * and directory imports into `./button/index.js`.
 */
const fixRelativeImportExtensions = (): NonNullable<Options["plugins"]>[number] => ({
  name: "fix-relative-import-extensions",
  renderChunk(code, info) {
    const ext = this.format === "cjs" ? ".cjs" : ".js";
    const srcDir = path.dirname(path.join(SRC, path.relative(DIST, info.path)));

    const rewrite = (spec: string) => {
      if (!spec.startsWith(".") || path.extname(spec)) return spec;
      const target = path.join(srcDir, spec);
      const isDir = existsSync(target) && statSync(target).isDirectory();
      return isDir ? `${spec}/index${ext}` : `${spec}${ext}`;
    };

    return {
      code: code.replace(
        /(\bfrom\s*|\bimport\s*|\brequire\(\s*)(["'])(\.{1,2}\/[^"']*)\2/g,
        (_m, lead: string, q: string, spec: string) => `${lead}${q}${rewrite(spec)}${q}`,
      ),
    };
  },
});

export default defineConfig({
  entry: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.stories.{ts,tsx}",
    "!src/test/**",
  ],
  format: ["esm", "cjs"],
  bundle: false,
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  outDir: "dist",
  plugins: [fixRelativeImportExtensions()],
});
