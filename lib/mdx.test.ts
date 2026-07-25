/**
 * Tests for markdown content parsing utilities.
 * The fs boundary is mocked so tests are deterministic and never
 * touch real files on disk.
 */

import { beforeEach, describe, expect, mock, test } from "bun:test";

// ---------------------------------------------------------------------------
// Shared mutable state for the fs mock
// ---------------------------------------------------------------------------

type FakeDirent = {
    name: string;
    isFile: () => boolean;
    isDirectory: () => boolean;
};

let mockDirents: FakeDirent[] = [];
const mockFileMap = new Map<string, string>();
let readdirThrowsEnoent = false;

// Set up the mock before the module is imported via await import().
// readFile matches by file-name suffix so tests don't need to know
// the full absolute path that mdx.ts constructs internally.
mock.module("node:fs/promises", () => ({
    readdir: async (_dir: string) => {
        if (readdirThrowsEnoent) {
            throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
        }

        return mockDirents;
    },
    readFile: async (filePath: string) => {
        for (const [suffix, content] of mockFileMap) {
            if (filePath.endsWith(suffix)) {
                return content;
            }
        }

        throw Object.assign(new Error(`ENOENT: ${filePath}`), {
            code: "ENOENT",
        });
    },
}));

const { getAllBlogPosts, getBlogPostBySlug, getAllProblems, getProblemBySlug } =
    await import("./mdx");

beforeEach(() => {
    mockDirents = [];
    mockFileMap.clear();
    readdirThrowsEnoent = false;
});

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const BLOG_ALPHA = `---
title: "Alpha Post"
slug: "alpha-post"
datePublished: "2026-06-01"
excerpt: "Alpha excerpt."
tags: ["engineering"]
---
Alpha body.`;

const BLOG_BETA = `---
title: "Beta Post"
slug: "beta-post"
datePublished: "2026-05-01"
excerpt: "Beta excerpt."
---
Beta body.`;

const BLOG_WITH_UPDATED_AT = `---
title: "Updated Post"
slug: "updated-post"
datePublished: "2026-06-01"
updatedAt: "2026-06-15"
excerpt: "An updated excerpt."
---
Updated body.`;

const BLOG_INVALID = `---
title: ""
slug: "bad"
datePublished: "not-a-date"
excerpt: ""
---
Ignored.`;

const PROBLEM_TWO_SUM = `---
title: "Two Sum"
slug: "two-sum"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-04-01"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
excerpt: "Return indices of the two numbers that add up to the target."
---
Problem body.`;

function file(name: string): FakeDirent {
    return { name, isFile: () => true, isDirectory: () => false };
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

describe("getAllBlogPosts", () => {
    test("parses valid frontmatter and returns typed fields", async () => {
        mockDirents = [file("alpha-post.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);

        const [first] = await getAllBlogPosts();

        const expected = {
            slug: "alpha-post",
            title: "Alpha Post",
            datePublished: "2026-06-01",
            excerpt: "Alpha excerpt.",
            tags: ["engineering"],
        };
        expect(first?.slug).toBe(expected.slug);
        expect(first?.title).toBe(expected.title);
        expect(first?.datePublished).toBe(expected.datePublished);
        expect(first?.excerpt).toBe(expected.excerpt);
        expect(first?.tags).toEqual(expected.tags);
    });

    test("strips frontmatter and returns the markdown body in content", async () => {
        mockDirents = [file("alpha-post.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);

        const [first] = await getAllBlogPosts();

        expect(first?.content.trim()).toBe("Alpha body.");
    });

    test("sorts posts by datePublished descending", async () => {
        mockDirents = [file("beta-post.md"), file("alpha-post.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);
        mockFileMap.set("beta-post.md", BLOG_BETA);

        const result = await getAllBlogPosts();

        const expected = ["alpha-post", "beta-post"];
        expect(result.map((p) => p.slug)).toEqual(expected);
    });

    test("rejects invalid frontmatter so builds cannot omit posts silently", async () => {
        mockDirents = [file("alpha-post.md"), file("invalid.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);
        mockFileMap.set("invalid.md", BLOG_INVALID);

        const expected = "Title is required";
        const result = getAllBlogPosts();

        expect(result).rejects.toThrow(expected);
    });

    test("rejects duplicate slugs", async () => {
        mockDirents = [file("alpha-post.md"), file("duplicate-alpha.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);
        mockFileMap.set("duplicate-alpha.md", BLOG_ALPHA);

        const expected = 'Duplicate blog slug "alpha-post"';
        const result = getAllBlogPosts();

        expect(result).rejects.toThrow(expected);
    });

    test("returns empty array when content directory does not exist", async () => {
        readdirThrowsEnoent = true;

        const result = await getAllBlogPosts();

        expect(result).toEqual([]);
    });

    test("preserves optional updatedAt when present", async () => {
        mockDirents = [file("updated-post.md")];
        mockFileMap.set("updated-post.md", BLOG_WITH_UPDATED_AT);

        const [first] = await getAllBlogPosts();

        expect(first?.updatedAt).toBe("2026-06-15");
    });

    test("leaves updatedAt undefined when absent", async () => {
        mockDirents = [file("alpha-post.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);

        const [first] = await getAllBlogPosts();

        expect(first?.updatedAt).toBeUndefined();
    });
});

describe("getBlogPostBySlug", () => {
    test("returns the matching post", async () => {
        mockDirents = [file("alpha-post.md"), file("beta-post.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);
        mockFileMap.set("beta-post.md", BLOG_BETA);

        const expected = "beta-post";
        const result = await getBlogPostBySlug(expected);

        expect(result.slug).toBe(expected);
        expect(result.content.trim()).toBe("Beta body.");
    });

    test("throws a descriptive error for an unknown slug", async () => {
        mockDirents = [file("alpha-post.md")];
        mockFileMap.set("alpha-post.md", BLOG_ALPHA);

        const expected = `Blog post with slug "not-here" not found`;

        expect(getBlogPostBySlug("not-here")).rejects.toThrow(expected);
    });
});

// ---------------------------------------------------------------------------
// Problem posts
// ---------------------------------------------------------------------------

describe("getAllProblems", () => {
    test("parses all required frontmatter fields", async () => {
        mockDirents = [file("two-sum.md")];
        mockFileMap.set("two-sum.md", PROBLEM_TWO_SUM);

        const [first] = await getAllProblems();

        const expected = {
            slug: "two-sum",
            title: "Two Sum",
            source: "leetcode" as const,
            difficulty: "easy" as const,
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)",
        };
        expect(first?.slug).toBe(expected.slug);
        expect(first?.title).toBe(expected.title);
        expect(first?.source).toBe(expected.source);
        expect(first?.difficulty).toBe(expected.difficulty);
        expect(first?.timeComplexity).toBe(expected.timeComplexity);
        expect(first?.spaceComplexity).toBe(expected.spaceComplexity);
    });

    test("includes the markdown body in content", async () => {
        mockDirents = [file("two-sum.md")];
        mockFileMap.set("two-sum.md", PROBLEM_TWO_SUM);

        const [first] = await getAllProblems();

        expect(first?.content.trim()).toBe("Problem body.");
    });

    test("returns empty array when content directory does not exist", async () => {
        readdirThrowsEnoent = true;

        const result = await getAllProblems();

        expect(result).toEqual([]);
    });

    test("rejects duplicate slugs", async () => {
        mockDirents = [file("two-sum.md"), file("duplicate-two-sum.md")];
        mockFileMap.set("two-sum.md", PROBLEM_TWO_SUM);
        mockFileMap.set("duplicate-two-sum.md", PROBLEM_TWO_SUM);

        const expected = 'Duplicate problem slug "two-sum"';
        const result = getAllProblems();

        expect(result).rejects.toThrow(expected);
    });
});

describe("getProblemBySlug", () => {
    test("returns the matching problem", async () => {
        mockDirents = [file("two-sum.md")];
        mockFileMap.set("two-sum.md", PROBLEM_TWO_SUM);

        const expected = "two-sum";
        const result = await getProblemBySlug(expected);

        expect(result.slug).toBe(expected);
    });

    test("throws a descriptive error for an unknown slug", async () => {
        mockDirents = [];

        const expected = `Problem post with slug "no-such" not found`;

        expect(getProblemBySlug("no-such")).rejects.toThrow(expected);
    });
});
