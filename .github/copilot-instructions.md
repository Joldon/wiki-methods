# GitHub Copilot Instructions - Wiki-Methods Project

## Project Overview
Next.js 14 application replicating the Sustainability Methods Wiki with modern data visualizations. Uses App Router, Server Components, Server Actions, Prisma ORM, and D3.js.

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

### Client Component (When Required)
```typescript
"use client";
import { useState } from "react";
// ✅ Only for interactivity
```

### Server Action
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
- TypeScript strict mode - avoid `any`
- Import order: React → Next.js → External → Internal → Styles
- PascalCase components, descriptive names
- Proper error handling with user-friendly messages

## Domain Context
Academic research methods and sustainability content from MediaWiki source. Users are researchers and students.

---
**See additional prompt files for specific guidance on components, visualizations, and content handling.**