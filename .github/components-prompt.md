# Component Development Guidelines

## File Structure

```
src/components/
├── componentName/
│   ├── componentName.tsx
│   └── componentName.module.css
```

## Server Component Patterns

### Page Components

```typescript
// src/app/wiki/[title]/page.tsx
export default async function WikiPage({
  params,
}: {
  params: { title: string };
}) {
  const content = await fetchPageContent(params.title);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{params.title.replace("_", " ")}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

### Data Fetching Components

- Fetch data directly in Server Components
- Handle errors gracefully with try-catch
- Use existing utility functions from `@/lib/fetchData`

## Client Component Patterns

### Interactive Elements

```typescript
"use client";
import { useState } from "react";
import styles from "./modal.module.css";

export default function Modal({ isOpen, onClose }: ModalProps) {
  // Client-side state and event handlers
}
```

### Form Components with Server Actions

```typescript
"use client";
import { useFormStatus } from "react-dom";

export default function Button({ defaultText, loadingText }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>{pending ? loadingText : defaultText}</button>
  );
}
```

Link to the Next.js Form Components documentation for more examples https://nextjs.org/docs/app/api-reference/components/form

## CSS Module Patterns

- Use semantic class names: `container`, `title`, `content`, `card`
- Implement hover effects and transitions
- Follow responsive design patterns from existing components
- Use CSS custom properties for theming

## Props and TypeScript

```typescript
interface ComponentProps {
  title: string;
  data: Post[]; // Use Prisma types
  onAction?: () => void;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({ title, data, onAction }) => {
  // Component logic
};
```

## Common Component Types

- **PostCard**: Display post previews with delete functionality
- **FilterDropdown**: Client component for filtering with router navigation
- **Modal**: Client component for confirmation dialogs
- **CheckboxBlock**: Form input groups for filtering
- **Button**: Reusable button with loading states
