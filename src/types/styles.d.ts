// Allows TypeScript to recognise plain CSS files imported as side-effects
// (e.g. `import "./globals.css"` in layout.tsx).
// CSS Modules (*.module.css) are already typed by Next.js via
// `/// <reference types="next" />` in next-env.d.ts, so they are not
// redeclared here to avoid a duplicate-declaration conflict.
declare module "*.css";
