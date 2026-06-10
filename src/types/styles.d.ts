// Allows TypeScript to recognise plain CSS files imported as side-effects
// (e.g. `import "./globals.css"` in layout.tsx).
// CSS Modules (*.module.css) are already typed by Next.js via
// `/// <reference types="next" />` in next-env.d.ts, so they are not
// redeclared here to avoid a duplicate-declaration conflict.
declare module "*.css";

// Next.js 15 removed the global RequestInit augmentation that adds the `next`
// fetch extension option (revalidate, tags). Restore it here so TypeScript
// accepts `fetch(url, { next: { revalidate: N } })` in Server Components.
interface RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}
