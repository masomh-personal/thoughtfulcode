# hamadeh.io

A modern, performance-focused portfolio website showcasing software engineering skills, code problems, algorithms, data structures, and technical writing.

**Core Philosophy:** Clarity over cleverness. Every decision demonstrates maintainable, thoughtful code that future engineers can easily understand and extend.

---

## Tech Stack

| Layer                       | Technology                                  | Rationale                                                                         |
| --------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| **Framework**               | Next.js 16 (App Router)                     | Production-ready, excellent docs, perfect for SSG + SEO, React 19 support         |
| **React**                   | React 19                                    | Server Components, enhanced performance, required for Next.js 16                  |
| **Language**                | TypeScript 7 (native Go compiler)           | Native-speed type checking, with TypeScript 6 kept only for Next.js build tooling |
| **Styling**                 | Tailwind CSS                                | Utility-first, fast development, great with Next.js                               |
| **Content**                 | Markdown + react-markdown                   | Version-controlled content rendered as Server Components                          |
| **Syntax Highlighting**     | rehype-highlight                            | Build-time highlighting without a client-side syntax highlighter                  |
| **Frontmatter Parsing**     | @11ty/gray-matter                           | Extract metadata from Markdown files                                              |
| **Frontmatter Validation**  | Valibot                                     | Lightweight schema validation (~1KB vs Zod's ~14KB), better performance           |
| **Linting & Formatting**    | Oxfmt + Oxlint                              | Oxc-powered formatter and linter with fast JS/TS, React, a11y, and Next.js checks |
| **Runtime**                 | Bun v1.3.14                                 | Fast installs, built-in test runner, instant TypeScript, production-ready         |
| **BaaS (Future, optional)** | Supabase / Appwrite                         | Add only when write-path/auth requirements appear                                 |
| **Deployment**              | Vercel                                      | Git-native deploys, previews for PRs, simple static-first workflow                |
| **UI Approach**             | Custom wrapper components (`components/ui`) | Design-system control with lightweight dependencies                               |
| **Icons**                   | react-icons                                 | Broad icon coverage with tree-shakeable imports                                   |

---

## Getting Started

### Prerequisites

- **Bun** v1.3.14 ([Install Bun](https://bun.sh/docs/installation))
- **Git** for version control

Node.js is not required. Package installation, local development, builds, tests,
and repository automation run through Bun.

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hamadeh-io

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
bun run build

# Start production server
bun start
```

---

## Scripts

| Script                              | Description                                           |
| ----------------------------------- | ----------------------------------------------------- |
| `bun run dev`                       | Start development server with hot reload              |
| `bun run dev:fresh`                 | Clear the Next.js cache, then start development       |
| `bun run build`                     | Build production bundle                               |
| `bun run start`                     | Start production server                               |
| `bun run typegen`                   | Generate Next.js route and environment types          |
| `bun run check`                     | Run Oxlint checks                                     |
| `bun run check:fix`                 | Fix linting issues, then format with Oxfmt            |
| `bun run check:staged`              | Format and lint supported staged files before commit  |
| `bun run check:toolchain`           | Verify Bun's shim cache is not corrupted              |
| `bun run format`                    | Format code with Oxfmt                                |
| `bun run format:check`              | Check formatting without writing changes              |
| `bun run type-check`                | Run TypeScript 7 type checking with `tsc`             |
| `bun run type-check:tests`          | Type-check library and solution tests                 |
| `bun run test`                      | Run tests with Bun test runner                        |
| `bun run test:coverage`             | Run tests with coverage report                        |
| `bun run content:check`             | Validate content, slugs, and solution/post parity     |
| `bun run healthcheck`               | Run formatting, type checks, lint, content, and tests |
| `bun run clean`                     | Remove generated files and alternate locks, reinstall |
| `bun run clean:next`                | Remove the Next.js build cache                        |
| `bun run new:problem <url-or-slug>` | Scaffold new problem workspace from URL/slug          |
| `bun run publish:problem <slug>`    | Generate markdown post from completed local solution  |

---

## Testing

### Test Runner

Uses **Bun's built-in test runner**. Tests import their helpers explicitly from
`bun:test`.

```typescript
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
            // Edge case tests
        });
    });

    describe("Stress Tests", () => {
        test("should handle large input", () => {
            // Stress tests
        });
    });
});
```

**Important:** Always use `test()` instead of `it()` for consistency.

### Coverage

- **Current policy:** Report coverage on every test run; restore strict
  thresholds after app and component behavior coverage is broad enough
- **Configuration:** `bunfig.toml`
- **Run:** `bun test --coverage`

---

## Code Quality

### Linting & Formatting

**Oxfmt** handles formatting and **Oxlint** handles linting:

- **Linting:** TypeScript, React, accessibility, and Next.js rules through Oxlint
- **Formatting:** Oxfmt with 4-space indentation and project config in `.oxfmtrc.json`
- **Staged files:** `scripts/check-staged.ts` is available for explicit staged format and lint checks
- **Quality gates:** `healthcheck` combines format checking, type-checking, linting, and tests
- **Toolchain guard:** `healthcheck` and both git hooks start with `scripts/check-toolchain.sh`, which verifies Bun's shared `/tmp/bun-node-*` shim before anything else. A corrupted shim makes every script launch the wrong program and exit 0, so checks would pass without running. If it fails, run `rm -rf /tmp/bun-node-*`

### TypeScript

- **Strict Mode:** Enabled
- **Explicit Return Types:** Required for all exported functions
- **Type Checking:** Run `bun run type-check` before committing. This uses the TypeScript 7 native compiler.
- **TypeScript 6:** Still installed, but only so `next build` can load the compiler API that TypeScript 7 does not ship yet. See [`docs/typescript-conventions.md`](docs/typescript-conventions.md).
- **Typing Convention:** `interface` for object/props contracts, `type` for unions/aliases

### Git Hooks

**Pre-commit (Husky):**

- Toolchain guard, then type check only, so local commits do not depend on machine-specific native formatter bindings

**Pre-push (Husky):**

- Run the complete healthcheck, including formatting, type checks, content validation, Oxlint, and tests, then build the production bundle.

---

## Project Structure

```text
hamadeh-io/
├── app/                 # Next.js App Router routes and pages
├── components/          # Reusable UI and layout components
│   ├── ui/              # Project-owned design-system wrappers
│   └── layout/          # Header/Footer/navigation
├── content/             # Markdown content (problems, blog)
├── docs/                # Architecture and styling docs
├── lib/                 # Shared utilities and Markdown parsers
├── public/              # Static assets
├── scripts/             # Bun scripts (clean, solution tooling)
├── lib/*.test.ts        # App/content behavior tests
├── .oxfmtrc.json        # Oxfmt config
├── bunfig.toml          # Bun test config
├── next.config.mjs      # Next.js config
├── postcss.config.mjs   # PostCSS + Tailwind v4 plugin wiring
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies and scripts
```

---

## Architecture Decisions

For detailed architecture decisions, patterns, and conventions, see [`docs/architecture.md`](docs/architecture.md).
For TypeScript style conventions and examples, see [`docs/typescript-conventions.md`](docs/typescript-conventions.md).

**Quick Summary:**

- **Next.js 16:** Production-ready, SSG for fast loads, React 19 support
- **Bun:** 25x faster installs, built-in tooling, production-ready
- **Oxc tooling:** Oxfmt for formatting and Oxlint for JS/TS, React, a11y, and Next.js linting
- **Valibot:** Lightweight validation (~1KB vs Zod's ~14KB)
- **Markdown:** Version-controlled content, type-safe, zero infrastructure

## Styling Guidelines

For detailed styling conventions, Tailwind CSS patterns, and design guidelines, see [`docs/styling.md`](docs/styling.md).

**Quick Summary:**

- **Utility-First:** Use Tailwind utilities over custom CSS
- **Semantic HTML:** Proper HTML elements before styling
- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Dark-Only Theme:** Implemented with CSS variables and Tailwind v4
- **Responsive:** Mobile-first approach with Tailwind breakpoints

---

## Content Structure

### Markdown Frontmatter (Code Problems)

```yaml
---
title: "Two Sum"
slug: "two-sum"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-01-15"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
excerpt: "Solving Two Sum with a hash map approach for optimal time complexity"
---
```

### Markdown Frontmatter (Blog Posts)

```yaml
---
title: "Why I Love TypeScript"
slug: "why-i-love-typescript"
datePublished: "2026-01-18"
updatedAt: "2026-01-18" # Track revisions
excerpt: "Exploring the benefits of TypeScript for modern web development"
tags: ["typescript", "web-development"]
---
```

---

## Performance Targets

| Metric                       | Target  | Measurement                            |
| ---------------------------- | ------- | -------------------------------------- |
| **First Contentful Paint**   | < 1.5s  | Lighthouse                             |
| **Largest Contentful Paint** | < 2.5s  | Lighthouse                             |
| **Time to Interactive**      | < 3.0s  | Lighthouse                             |
| **Cumulative Layout Shift**  | < 0.1   | Lighthouse                             |
| **Bundle Size (Initial)**    | < 200KB | Lighthouse / network transfer analysis |

**Optimization Strategies:**

- Next.js Image optimization (`next/image`)
- Static generation for all content pages (SSG)
- Server-side markdown rendering and syntax highlighting
- Route-scoped font loading for the component showcase
- Font optimization (`next/font`)
- Lazy loading for below-the-fold components
- Repeatable Lighthouse checks before releases that change rendering or assets

---

## Accessibility

**WCAG 2.1 AA Compliance:**

- Semantic HTML
- Proper heading hierarchy (h1 → h6)
- Alt text for all images
- Sufficient color contrast (4.5:1 minimum)
- Keyboard navigation support
- Focus indicators
- ARIA labels where needed

**Enhanced Features:**

- Skip to main content link
- Reduced motion support (`prefers-reduced-motion`)
- Focus trap for modals (Phase 2)
- Touch-friendly targets (44x44px minimum for mobile)

---

## SEO

- Unique `<title>` for every page
- Meta descriptions (155 characters max)
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs
- Structured data (JSON-LD) for blog posts
- Sitemap.xml (automatic with Next.js)
- robots.txt
- RSS feed for blog content (`app/blog/rss.xml/route.ts`)

---

## Deployment

**Vercel (managed Next.js runtime, static-first):**

- Connect GitHub repository in Vercel.
- Set **Production Branch** to `main`.
- Keep preview deployments enabled for pull requests and non-production branches.
- Add required environment variables in **Vercel → Project Settings → Environment Variables**.
- The repository toolchain is Bun-only. Vercel controls its managed production
  runtime separately, so it is not a local Node.js requirement.

Optional public metadata variables default to the production site values:
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_AUTHOR_NAME`, and
`NEXT_PUBLIC_AUTHOR_EMAIL`.

**CI (GitHub Actions):**

- On pushes and pull requests for `main` and active release branches such as
  `next-version`, CI runs the healthcheck, dependency audit, and production
  build.
- Merge to `main` only after CI passes, then Vercel promotes that commit to production.
- For the full PR checklist and release flow, see [`docs/release.md`](docs/release.md).

---

## Development Principles

- **YAGNI:** Build only what's needed now
- **KISS:** Simple solutions over clever ones
- **Separation of Concerns:** Clear boundaries between layers
- **DRY:** But don't abstract too early
- **TypeScript First:** Every function needs explicit return types
- **Test Behavior:** Cover user-visible outcomes and important boundaries before enforcing broad thresholds
- **Document Thoroughly:** JSDoc for all exports
- **Optimize Early:** Lighthouse audits from day one

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
# Unix / macOS / Git Bash
cp .env.local.example .env.local

# Windows (PowerShell)
Copy-Item .env.local.example .env.local

# Windows (cmd)
copy .env.local.example .env.local
```

Use the same variables in **Vercel → Project Settings → Environment Variables** for deployment.

| Variable                   | Required | Notes                                                                  |
| -------------------------- | -------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | Canonical site URL (e.g. https://hamadeh.io)                           |
| `NEXT_PUBLIC_SITE_NAME`    | Yes      | Site/brand name                                                        |
| `NEXT_PUBLIC_AUTHOR_NAME`  | Yes      | Author name                                                            |
| `NEXT_PUBLIC_AUTHOR_EMAIL` | Yes      | Contact email                                                          |
| `NEXT_PUBLIC_GIT_BRANCH`   | No       | Branch name for footer badge (format: `branch-sha`); empty shows `---` |
| `NEXT_PUBLIC_GIT_SHA`      | No       | Commit hash; footer shows last 5 chars; empty shows `---`              |
| `NEXT_PUBLIC_GIT_FULL_SHA` | No       | Full 40-char SHA; enables badge link to specific commit                |
| `BACKEND_API_URL`          | Phase 2  | Optional backend endpoint (server use unless intentionally public)     |
| `BACKEND_API_KEY`          | Phase 2  | Server-only; never expose to client                                    |

---

## Troubleshooting

### Bun Not Found

If `bun` command is not recognized:

```bash
# Use the official installer
curl -fsSL https://bun.sh/install | bash  # macOS/Linux
powershell -c "irm bun.sh/install.ps1 | iex"  # Windows
```

### TypeScript Errors

If you see TypeScript errors after installing dependencies:

```bash
# Clean and reinstall
bun run clean
bun install
```

### Oxfmt Format on Save Not Working

1. Install an Oxc/Oxfmt-compatible extension in VS Code/Cursor
2. Ensure your editor uses `oxfmt` as the formatter for supported file types
3. Reload the editor window

### Content Validation Errors

`bun run content:check` validates every blog post and problem before release,
and reports all failures at once. Beyond frontmatter schemas and duplicate
slugs it enforces the invariants that live between files: filenames match the
frontmatter `slug` that builds the route, problem posts keep the `# Problem`
heading the layout splits on, every published problem has a `solutions/<slug>/`
workspace, code fences use a language the renderer registers, and the code in a
problem post matches `solutions/<slug>/solution.ts` verbatim.

That last one is the important one: these solutions are presented as tested, so
when the check reports drift, copy the tested file into the post rather than
editing the post to look right.

### Git Hooks Not Running

If Husky hooks aren't executing:

```bash
# Reinstall Husky
bun run prepare
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

---

## Quick Reference

### Adding New Content

#### Code Problem Workflow

**Step 1: Scaffold a New Problem**

```bash
# From LeetCode URL
bun run new:problem https://leetcode.com/problems/two-sum/

# Or just the slug
bun run new:problem two-sum
```

This creates:

```
solutions/two-sum/
├── solution.ts         # Starter code with problem description
├── solution.test.ts    # Test template
└── metadata.json       # Frontmatter data (auto-filled from source)
```

**Step 2: Code Your Solution**

1. Implement your solution in `solutions/two-sum/solution.ts`
2. Write tests in `solutions/two-sum/solution.test.ts`
3. Run tests: `bun test solutions/two-sum/solution.test.ts`
4. Iterate until you're happy with the solution

**Step 3: Update Metadata**

Edit `solutions/two-sum/metadata.json`:

- Update `timeComplexity` (change from `O(?)`)
- Update `spaceComplexity` (change from `O(?)`)
- Optionally add `companies`, `hints`, `relatedProblems`

**Step 4: Publish to Markdown**

```bash
bun run publish:problem two-sum
```

This generates `content/problems/two-sum.md` with:

- Frontmatter from metadata.json
- Your solution code
- Template sections for explanation

Publishing is one-way. Once the file exists the markdown is the source of
truth, so a second run refuses to overwrite the analysis you wrote by hand.
Pass `--force` if you really do want the template back.

**Step 5: Add Explanations**

Edit `content/problems/two-sum.md` to add:

- Problem description
- Examples
- Approach explanation
- Complexity analysis details
- Key takeaways

**Step 6: Preview & Commit**

```bash
# Preview at http://localhost:3000/problems/two-sum
bun run dev

# When ready, commit
git add .
git commit -m "feat: add two-sum solution"
```

---

#### Blog Post Workflow

1. Create Markdown file in `content/blog/[slug].md`
2. Add frontmatter with title, slug, datePublished, tags
3. Write content in Markdown

#### Page Layout Convention

- Wrap route pages with `PageContainer` from `components/layout/PageContainer.tsx`
- Prefer consistent page shell spacing over per-page container classes
- Use route-level `loading.tsx` for async transitions when page rendering can take noticeable time
- For content-heavy detail routes (for example blog or problem detail pages), prefer `prefetch={false}` on list-card links so content loads on explicit user intent (click)

### Common Workflows

**Before Committing:**

```bash
bun run healthcheck  # Formatting, type checks, content, Oxlint, tests
```

**Before Pushing:**

- Pre-push hook automatically runs `bun run healthcheck` and `bun run build`
- Run `bun audit` before opening a PR to `main`

**Adding a New Dependency:**

```bash
bun add <package-name>        # Production dependency
bun add -d <package-name>     # Dev dependency
```

**Updating Dependencies:**

```bash
bun update                    # Update all dependencies
bun update <package-name>     # Update specific package
```

---

## Future Improvements

### Oxc Tooling

- [ ] Track Oxfmt Tailwind class sorting and CSS formatting behavior as the formatter matures
- [ ] Consider an Oxlint config file if CLI flags stop being enough for project rules
- **Current approach**: Keep Tailwind v4 config CSS-first in `app/globals.css`, with Oxfmt, Oxlint, type-checking, and tests as guardrails

### Content QA

- [x] Validate frontmatter schemas and duplicate slugs with `bun run content:check`
- [ ] Check internal links and referenced problem solution paths
- [ ] Add filename/slug consistency checks after existing historical filenames are normalized

---

## Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **react-markdown Documentation:** https://github.com/remarkjs/react-markdown
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Oxfmt Documentation:** https://oxc.rs/docs/guide/usage/formatter.html
- **Oxlint Documentation:** https://oxc.rs/docs/guide/usage/linter.html
- **Valibot Documentation:** https://valibot.dev/
- **Bun Documentation:** https://bun.sh/docs
- **Bun Testing:** https://bun.sh/docs/test

---

## License

Private project
