# GitHub Copilot Instructions - Wiki-Methods Project

## Project Overview

Next.js 15 application replicating the Sustainability Methods Wiki with modern data visualizations. Integrates MediaWiki API content with user-generated posts and interactive D3.js charts. Uses App Router, Server Components, Server Actions, Prisma ORM with PostgreSQL.

## Core Architecture (CRITICAL)

### Server-First Approach

- **DEFAULT**: Server Components for all content rendering
- **Client Components** (`"use client"`) ONLY for:
  - Forms with `useFormStatus` (see `components/form/postForm.tsx`)
  - D3.js visualizations requiring DOM manipulation
  - Interactive UI with state management
  - Browser APIs (localStorage, window, document)
- **Server Actions** for ALL mutations - see pattern in `lib/actions.ts`

## Server Action Patterns

✅ ALWAYS use for mutations:

- Form submissions (createPost, updatePost, deletePost)
- Database operations
- File operations

❌ NEVER use Client Components for:

- Simple data display
- Static content rendering
- Wiki content parsing

### Database & External APIs

- **Prisma singleton pattern**: Import `prisma` from `@/lib/db.ts` (handles dev/prod instances)
- **MediaWiki integration**: Use `fetchPageContent()` and `fetchAllEntries()` from `@/lib/fetchData.ts`
- **Image proxy**: Next.js rewrites `/images/*` to external wiki domain (see `next.config.mjs`)
- **Type safety**: Use Prisma-generated types `import { Post, User } from "@generated/prisma/client.js"`
- **Prisma errors**: Import error types from `@prisma/client/runtime/client`

## Component Patterns

### Server Component (Default) - Wiki Content Pattern

```typescript
// ✅ Direct async data fetching in Server Components

import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
// ✅ Direct async data fetching in Server Components
export default async function WikiPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { title } = await params;
  const rawContent = await fetchPageContent(title);

  // Server-side HTML sanitization
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  const content = purify.sanitize(rawContent);

  return (
    <div>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
```

### Client Component Pattern - Forms with Server Actions

```typescript
"use client";
export default function PostForm({ wikiArticle }: PostFormProps) {
  return (
    <form action={createPost}>
      {" "}
      {/* Server Action */}
      <Button type="submit" defaultText="Create" loadingText="Creating..." />
    </form>
  );
}
```

## Chart Components

- ALWAYS use "use client" for D3.js visualizations
- ALWAYS include cleanup in useEffect
- ALWAYS use proper TypeScript types from chartTypes.ts

### D3.js Visualization Pattern

```typescript
"use client";
// Use ChartWrapper for SSR-safe D3 components
<ChartWrapper Component={ForceDirectedGraph} props={{ nodes, links }} />;
// ChartWrapper handles dynamic imports to prevent hydration issues
```

### Server Actions - Error Handling Pattern

```typescript
"use server";
export const createPost = async (formData: FormData) => {
  try {
    // Database operation
    await prisma.post.create({
      data: {
        /* ... */
      },
    });
    revalidatePath("/posts");
    redirect("/posts?success=created");
  } catch (error) {
    // Handle Next.js redirect errors vs Prisma errors
    if (error && typeof error === "object" && "digest" in error) {
      throw error; // Re-throw Next.js redirects
    }
    redirect("/posts?error=failed");
  }
};
```

## Key Libraries & Implementation Patterns

- **Styling**: CSS Modules (`styles.className`) - component-scoped styling
- **Database**: Prisma singleton (`@/lib/db.ts`) with PostgreSQL, auto-generated types
- **External Content**: MediaWiki API integration with URL rewriting for images
- **Visualizations**: D3.js with `ChartWrapper` for SSR compatibility and cleanup
- **Forms**: Server Actions + `useFormStatus` hook for loading states
- **Error Handling**: Graceful fallbacks (see `fetchPageContent` error handling)

## Code Style

- TypeScript strict mode - NO `any` types. To balance type safety and scalability for a generic component, use generics in the interface. This allows you to specify the prop types for each component, while keeping the component flexible for future use cases.
- Import order: React → Next.js → External → Internal → Styles
- PascalCase components, descriptive names
- Proper error handling with user-friendly messages

## Domain Context

Academic research methods and sustainability content from MediaWiki source. Users are researchers and students.

## Development Workflow

- **Start Development**: `npm run dev --turbopack` (uses Turbopack for faster builds)
- **Database Setup**: `npx prisma generate` (auto-runs on `npm install`)
- **Schema Changes**: Use `npx prisma db push` for development
- **Type Generation**: Prisma types auto-generated in `prisma/generated/prisma/`, import from `@generated/prisma/client.js`

## Coding Guidelines

- **File Structure**: Feature-based organization (`components/`, `app/`, `lib/`)
- **API Centralization**: MediaWiki calls in `@/lib/fetchData.ts`, all mutations as Server Actions
- **Data Flow**: Server Components → props → Client Components (avoid client imports in server pages)
- **URL Handling**: MediaWiki images proxied through Next.js rewrites (`/images/*`)

### Naming Conventions

- Variables/Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

## Required Practices

- **Input validation**: Validate all form data and API inputs
- **HTML sanitization**: Use DOMPurify for external HTML content
- **Error handling**: Graceful errors with user-friendly messages
- **TypeScript strict mode**: Enable strict compilation
- **Environment variables**: Use `.env.local`, never commit secrets

## Performance Optimization

- **Server Components**: Keep heavy logic server-side
- **Image optimization**: Use Next.js Image component
- **Font optimization**: Use Next.js font optimization
- **Caching**: Leverage Next.js caching and `revalidatePath()`

## MediaWiki Integration Specifics

- **API Endpoint**: `https://sustainabilitymethods.org/api.php`
- **Image Handling**: External images automatically proxied through Next.js (`/images/*` → external domain)
- **Content Safety**: All external HTML from MediaWiki must be sanitized with DOMPurify before rendering with `dangerouslySetInnerHTML` to prevent XSS vulnerabilities.
- **Error Fallbacks**: `fetchPageContent()` returns user-friendly message for missing pages
- **URL Rewriting**: Relative image URLs converted to absolute URLs in `fetchPageContent()`

## Key Integration Points

- **Posts ↔ Wiki**: Posts can reference wiki articles via `wikiArticle` field
- **Dynamic Routes**: `/wiki/[title]` fetches content from MediaWiki API
- **Cross-References**: Posts page can filter by wiki article (`?wiki=Article_Title`)
- **Data Sources**: Mix of PostgreSQL (user posts) + MediaWiki API (content)

---

**Domain**: Academic sustainability research methods. Users are researchers and students exploring methodology connections through interactive visualizations and collaborative feedback.

## Wiki-Methods Terminology

- "Methods" = Academic research methods (not HTTP methods)
- "Wiki content" = Content from sustainabilitymethods.org
- "Starter data" = Beginner-friendly method recommendations
