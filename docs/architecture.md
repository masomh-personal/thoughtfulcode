# Architecture Decisions

This document outlines the architectural decisions, patterns, and conventions used in hamadeh.io.

---

## Core Principles

- **YAGNI (You Aren't Gonna Need It):** Build only what's needed now
- **KISS (Keep It Simple, Stupid):** Simple solutions over clever ones
- **Separation of Concerns:** Clear boundaries between layers
- **DRY (Don't Repeat Yourself):** But don't abstract too early
- **Clarity over Cleverness:** Every decision demonstrates maintainable, thoughtful code

---

## Technology Stack Rationale

### Next.js 16 (App Router)

**Why:**

- Production-ready with 10+ years of battle-testing
- Excellent documentation and community support
- Perfect for SSG (Static Site Generation) - fast loads, excellent SEO
- React 19 support with Server Components
- Turbopack bundler for faster builds
- Zero-config Vercel deployment

**Patterns:**

- Use App Router for all routes (`app/` directory)
- Leverage Server Components by default
- Use Client Components (`'use client'`) only when needed (interactivity, hooks, browser APIs)
- Static generation for all content pages (SSG)

### React 19

**Why:**

- Required for Next.js 16
- Server Components for better performance
- Enhanced performance optimizations
- Better developer experience

**Patterns:**

- Prefer Server Components
- Use Client Components sparingly
- Leverage React 19 features (use hook, Server Actions)

### TypeScript

**Why:**

- Type safety catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code
- Portfolio showcase of best practices

**Patterns:**

- Strict mode enabled (`strict: true` in `tsconfig.json`)
- Explicit return types for all exported functions
- No `any` types (use `unknown` when needed)
- Narrow types early with type guards
- Use discriminated unions for complex state

#### Type Modeling Convention (Project Standard)

To keep typing consistent and easy to scan:

- Use `interface` for object-shaped contracts (especially component props)
- Use `type` for unions, string literals, aliases, mapped/conditional helpers
- Prefer `ComponentProps<"...">` for DOM wrapper props in UI components
- Keep behavior-specific prop extensions explicit (e.g., `onClick` wrappers)
- Optimize for consistency and readability over strict ideology

**Examples:**

```ts
type BadgeColor = "primary" | "secondary" | "tertiary" | "default";

interface BadgeProps extends React.ComponentProps<"span"> {
    color?: BadgeColor;
}
```

For additional examples and a quick decision guide, see [`docs/typescript-conventions.md`](./typescript-conventions.md).

### Bun

**Why:**

- 25x faster package installation
- Built-in test runner, bundler, package manager
- Instant TypeScript execution
- Production-ready (Vercel supports Bun)

**Runtime policy:**

- Bun is the only supported package manager and local JavaScript runtime.
- `engines.bun` in `package.json` is the single source of truth for which
  versions are supported. `packageManager` pins the exact version CI installs,
  and `scripts/ensure-bun.ts` fails the build if either one is not honored.
  Vercel is exempt from the range because it provisions its own Bun, and the
  range exists for development tooling rather than the production build.
- Scripts that run our own code, and the Next.js CLI, invoke Bun explicitly.
- Oxc's binaries (Oxfmt, Oxlint) are launched through `node_modules/.bin`
  rather than forced onto Bun's runtime with `--bun`. They are native binaries
  behind a thin JS entry point, so the flag bought nothing and coupled the
  formatter to Bun-specific Node-API behavior. `bun run` already resolves
  `node` to Bun inside scripts, so this changes which code runs the launcher,
  not which runtime the repo standardizes on.
- Vercel owns the managed Next.js production runtime independently from the
  repository's local toolchain.

### Oxfmt and Oxlint

**Why:**

- Oxc-powered formatter and linter for fast local and CI feedback
- Oxfmt keeps formatting deterministic across JS, TS, CSS, Markdown, and config files
- Oxlint covers TypeScript, React, accessibility, and Next.js checks without the ESLint dependency tree
- Smaller audit surface than the previous combined formatter, linter, and health-check setup

**Patterns:**

- Formatter configuration lives in `.oxfmtrc.json`
- Package scripts wrap Oxfmt/Oxlint so hooks and CI use the same commands
- Pre-commit runs the fast TypeScript check.
- `scripts/check-staged.ts` remains available as an explicit staged format/lint command.
- Pre-push and CI run the complete healthcheck and production build.

### Valibot

**Why:**

- Lightweight (~1KB vs Zod's ~14KB)
- Critical for 200KB bundle size target
- 2-10x faster runtime validation
- Tree-shakeable (modular design)
- Better TypeScript inference

**Usage:**

- Validate Markdown frontmatter schemas
- Type-safe content parsing
- Runtime validation at build time

### Markdown for Content

**Why:**

- Version control everything in Git
- Type safety with Valibot schemas
- Zero infrastructure (no database, no CMS)
- Performance (static generation at build time)
- Developer-friendly Markdown authored in Git

**Patterns:**

- All content in `content/` directory
- Frontmatter validated with Valibot schemas
- Static generation for all content pages
- Rendered with `react-markdown`, `remark-gfm`, and `rehype-highlight`

---

## Project Structure

```
hamadeh-io/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (Server Component)
│   ├── page.tsx           # Homepage (Server Component)
│   ├── problems/         # Code problems (dynamic routes)
│   ├── blog/              # Blog posts (dynamic routes)
│   ├── about/             # Resume/about page
├── components/            # React components
│   ├── ui/                # Project-owned UI wrappers/components
│   ├── layout/            # Header, Footer, Navigation
│   ├── problems/          # Problem-specific components
│   └── blog/              # Blog-specific components
├── lib/                   # Utilities and helpers
│   ├── mdx.ts            # Markdown processing utilities
│   ├── schemas.ts        # Valibot schemas for frontmatter
│   ├── utils.ts          # General utilities
│   └── constants.ts      # App constants
├── content/              # Markdown content files
│   ├── problems/        # Code problems
│   ├── blog/            # Blog posts
├── public/              # Static assets
├── scripts/             # Automation scripts
└── docs/                # Documentation (this folder)
```

---

## Component Architecture

### Server Components (Default)

**When to use:**

- Fetching data
- Accessing backend resources
- Keeping sensitive information on server
- Large dependencies that should reduce client bundle

**Example:**

```typescript
// app/problems/[slug]/page.tsx
export default async function ProblemPage({ params }: Props) {
    const solution = await getProblemBySlug(params.slug);

    return <SolutionView solution={solution} />;
}
```

### Client Components

**When to use:**

- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Third-party libraries that require client-side execution

**Example:**

```typescript
'use client';

import { useState } from 'react';

export function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Toggle theme
        </button>
    );
}
```

### Component Organization

- **Co-location:** Keep related components close together
- **One component per file:** Clear file naming (`ComponentName.tsx`)
- **Barrel exports:** Use `index.ts` files sparingly, only for public API
- **Shared components:** Place in `components/ui/` or `components/layout/`
- **Feature-specific:** Place in feature folders (`components/problems/`, `components/blog/`)

---

## Data Fetching Patterns

### Static Generation (SSG)

**All page routes are statically rendered:**

- Code problems
- Blog posts
- About page

**Pattern:**

```typescript
// app/problems/[slug]/page.tsx
export async function generateStaticParams() {
    const solutions = await getAllProblems();
    return solutions.map((solution) => ({
        slug: solution.slug,
    }));
}

export default async function ProblemPage({ params }: Props) {
    const solution = await getProblemBySlug(params.slug);
    return <SolutionView solution={solution} />;
}
```

### Markdown Processing

**Pattern:**

1. Read Markdown files from `content/` directory
2. Parse frontmatter with `@11ty/gray-matter`
3. Validate frontmatter with Valibot schemas
4. Render Markdown with `react-markdown`
5. Apply GFM and server-side syntax highlighting
6. Generate static pages at build time

**Example:**

```typescript
// lib/mdx.ts
import matter from "@11ty/gray-matter";
import { parse } from "valibot";
import { problemFrontmatterSchema } from "./schemas";

export async function getProblemBySlug(slug: string): Promise<ProblemPost> {
    const filePath = path.join(
        process.cwd(),
        "content",
        "problems",
        `${slug}.md`
    );
    const fileContents = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = parse(problemFrontmatterSchema, data);

    return {
        ...frontmatter,
        content,
    };
}
```

---

## Error Handling

### Type-Safe Errors

**Pattern:**

```typescript
type Result<T, E = Error> =
    { success: true; data: T } | { success: false; error: E };

export async function getProblemBySlug(
    slug: string
): Promise<Result<ProblemPost, "NOT_FOUND" | "INVALID_FORMAT">> {
    try {
        const solution = await readSolutionFile(slug);
        return { success: true, data: solution };
    } catch (error) {
        if (error.code === "ENOENT") {
            return { success: false, error: "NOT_FOUND" };
        }
        return { success: false, error: "INVALID_FORMAT" };
    }
}
```

### Error Boundaries

- Use React error boundaries for client-side errors
- Provide fallback UI for graceful degradation
- Log errors for debugging (development only)

---

## Testing Strategy

### Test Organization

- Keep solution tests beside each `solutions/<slug>/solution.ts`.
- Keep app and library tests beside the module whose behavior they verify.
- Prefer boundary-focused behavior tests over a separate mirrored test tree.

### Test Structure

**Test imports:**

- Tests import `describe`, `expect`, `test`, and other helpers explicitly from
  `bun:test`.
- Always use `test()` instead of `it()` for consistency.

**Pattern:**

```typescript
import { describe, expect, test } from "bun:test";

describe("Feature Name", () => {
    describe("Basics", () => {
        test("should handle normal case", () => {
            const input = "test";
            const expected = "result";
            const result = myFunction(input);

            expect(result).toBe(expected);
        });
    });

    describe("Edge Cases", () => {
        test("should handle empty input", () => {
            const input = "";
            const expected = "";
            const result = myFunction(input);

            expect(result).toBe(expected);
        });
    });

    describe("Stress Tests", () => {
        test("should handle large input", () => {
            const input = "a".repeat(10000);
            const expected = "result";
            const result = myFunction(input);

            expect(result).toBe(expected);
        });
    });
});
```

**Important:**

- Always use `test()` instead of `it()` for consistency
- Use `test.skip()`, `test.only()`, `test.todo()` for test modifiers

### Coverage Policy

- Coverage is reported on every test run through `bunfig.toml`.
- Strict thresholds stay disabled until app and component behavior coverage is broad enough to make the gate meaningful.
- Re-enable thresholds incrementally rather than allowing solution tests to hide app-level gaps.

---

## Performance Optimization

### Bundle Size

**Target:** < 200KB initial bundle

**Strategies:**

- Dynamic imports for syntax highlighting (load only when viewing code)
- Tree-shake syntax highlighting (import specific languages only)
- Code splitting (automatic with Next.js)
- Measure with Lighthouse and browser network tooling before and after performance changes

### Image Optimization

- Use `next/image` for all images
- Provide `width` and `height` to prevent layout shift
- Use appropriate image formats (WebP, AVIF)

### Font Optimization

- Use `next/font` for custom fonts
- Preload critical fonts
- Use system fonts when possible

### Static Generation

- All page routes use static rendering or `generateStaticParams`
- Generate all pages at build time
- Pre-render for instant page loads

---

## Security Considerations

### Input Validation

- Validate all user inputs with Valibot schemas
- Sanitize user-generated content
- Never trust client-side validation alone

### Environment Variables

- Never commit `.env` files
- Use `NEXT_PUBLIC_` prefix only for client-side variables
- Keep API keys server-side only

### Content Security

- No eval() or Function() constructors
- Sanitize Markdown content before allowing untrusted author input
- Add a Content Security Policy before introducing untrusted or interactive content

---

## Future Considerations (Phase 2)

### API Routes

- Place in `app/api/` directory
- Use App Router API route handlers
- Validate requests with Valibot
- Rate limiting for public endpoints

### Optional Backend Integration

- Add a backend only when product requirements justify it (auth, write paths, private data)
- Keep data-access logic isolated in `lib/backend/` or provider-specific adapters
- Keep typed boundaries and schema validation at API edges
- Keep secrets server-only and avoid `NEXT_PUBLIC_` for sensitive values

---

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [react-markdown Documentation](https://github.com/remarkjs/react-markdown)
