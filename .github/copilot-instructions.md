# GitHub Copilot Instructions - Wiki-Methods Project

## Project Overview

Next.js 15 application replicating the Sustainability Methods Wiki with modern data visualizations. Uses App Router, Server Components, Server Actions, Prisma ORM, and D3.js.

## Core Architecture (CRITICAL)

### Server-First Approach

- **DEFAULT**: Server Components for all content rendering
- **Client Components** (`"use client"`) ONLY for:
  - Interactive UI (forms with complex state, drag interactions)
  - Data visualizations with client-side interactivity
  - Browser APIs (localStorage, window, document)
- **Server Actions** for all mutations and form handling

### Type Safety

- **ALWAYS use Prisma-generated types**: `import { Post, User } from "@prisma/client"`
- Extend when needed: `type PostWithExtras = Post & { extraField?: string }`
- Import from `@/lib/db` for database operations

## Component Patterns

### Server Component (Default)

```typescript
// ✅ No "use client" - fetch data directly
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

- **NEVER use next/dynamic with { ssr: false } inside Server Components**

### Client Component (When Required)

**ONLY for:**

- Interactive UI (state, event handlers, forms with complex interactions)
- Data visualizations requiring client-side interactivity (D3.js)
- Browser APIs (localStorage, window, document)
- Custom hooks and context providers

```typescript
"use client";
import { useState } from "react";
// ✅ Only for interactivity
```

### Server Action

**Use for ALL mutations and form handling**

```typescript
"use server";
import { revalidatePath } from "next/cache";
// ✅ For mutations
```

## Key Libraries & Patterns

- **Styling**: CSS Modules (`styles.className`)
- **Database**: Prisma with PostgreSQL
- **Visualizations**: D3.js (Client Components with cleanup)
- **Wiki Content**: `fetchPageContent()` from `@/lib/fetchData`
- **Forms**: Server Actions + `useFormStatus` for loading states

## Code Style

- TypeScript strict mode - NO `any` types. To balance type safety and scalability for a generic component, use generics in the interface. This allows you to specify the prop types for each component, while keeping the component flexible for future use cases.
- Import order: React → Next.js → External → Internal → Styles
- PascalCase components, descriptive names
- Proper error handling with user-friendly messages

## Domain Context

Academic research methods and sustainability content from MediaWiki source. Users are researchers and students.

## Coding Guidelines

- **File Structure**: Organize files by feature (e.g., components, pages, lib)
- **Component Design**: Aim for small, reusable components. Use the DRY (don't repeat yourself) principle to avoid code duplication.
- **API Calls**: Centralize API calls in `@/lib/fetchData.ts`
- **Passing Data**: Avoid importing client components into server-side pages. Use props to pass data between components. For global state, consider using context or a state management library.

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

---

**See additional prompt files for specific guidance on components, visualizations, and content handling.**
