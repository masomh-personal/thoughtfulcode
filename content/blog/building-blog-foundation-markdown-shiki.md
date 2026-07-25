---
title: "Building the Blog Foundation (Markdown + Syntax Highlighting)"
slug: "building-blog-foundation-markdown-shiki"
datePublished: "2026-02-18"
excerpt: "How I designed a clean blog architecture with Markdown-first content, server-side syntax highlighting, and room to scale."
tags: ["engineering", "nextjs", "markdown"]
---

I wanted a blog setup that stays simple today but does not paint me into a corner tomorrow.

The goals were straightforward:

- write posts as plain Markdown files in the repository
- keep styling and metadata consistent across posts
- support premium code syntax highlighting for technical content
- keep the data layer flexible for a future move to a database

## Why Markdown-First

For this portfolio, blog posts are mostly prose plus code snippets.
That means plain Markdown is enough right now.

I am intentionally **not** using embedded React inside content yet. This keeps authoring friction low and reduces rendering complexity.

## A Better Code Reading Experience

Code readability matters in technical writing. I use `rehype-highlight` during server rendering, which gives code blocks useful token contrast without sending a syntax highlighter to the browser.

```ts
function getPostReadingTime(words: number): string {
    const minutes = Math.max(1, Math.ceil(words / 220));
    return `${minutes} min read`;
}
```

Even short examples are easier to scan when syntax contrast is clear.

## Date Formatting Decisions

I started with `date-fns` for date formatting because it is small, modern, and ergonomic in TypeScript-heavy codebases. For this site, the need is even simpler: turn an ISO publish date into a label like "May 2, 2026".

That is enough for the built-in `Intl.DateTimeFormat` API.

```ts
const publishedDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

export function formatPublishedDate(isoDate: string): string {
    return publishedDateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}
```

This keeps date display logic explicit and consistent across blog pages without carrying a dependency for one formatting call.

## Designing for Future Migration

Today, posts live in files. Later, I may move blog storage to a database.

To make that change easier, page components should consume a narrow content API rather than reading files directly. That way, data source changes stay localized.

## Closing Thoughts

This is the kind of foundation I prefer:

- minimal moving parts
- strong defaults
- room to evolve without rewrites

As I publish more posts, I will iterate on presentation details like copy-code buttons, line highlights, and richer metadata.
