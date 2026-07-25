/**
 * Markdown content processing utilities
 * Reads, parses, and validates content files with frontmatter.
 */

import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import matter from "@11ty/gray-matter";
import {
    type BlogFrontmatter,
    type ProblemFrontmatter,
    validateBlogFrontmatter,
    validateProblemFrontmatter,
} from "./schemas";

export interface ProblemPost extends ProblemFrontmatter {
    content: string;
    filePath: string;
}
export interface BlogPost extends BlogFrontmatter {
    content: string;
    filePath: string;
}

/**
 * Holds the parsed corpus for the life of the process in production.
 *
 * Every slug page loads the full corpus to find one post, so a static build of
 * N pages re-reads N files N times. Development and tests opt out so editor
 * saves and mocked filesystems stay visible.
 */
function memoizeInProduction<T>(load: () => Promise<T>): () => Promise<T> {
    if (process.env.NODE_ENV !== "production") {
        return load;
    }

    let pending: Promise<T> | undefined;

    return () => (pending ??= load());
}

async function readAllProblems(): Promise<ProblemPost[]> {
    const contentDir = join(process.cwd(), "content", "problems");
    const posts: ProblemPost[] = [];

    try {
        const files = await findContentFiles(contentDir, [".md"]);

        for (const filePath of files) {
            const post = await getProblemByPath(filePath);
            posts.push(post);
        }

        assertUniqueSlugs(posts, "problem");
        return posts.sort((a, b) => {
            const dateA = new Date(a.datePublished).getTime();
            const dateB = new Date(b.datePublished).getTime();
            return dateB - dateA;
        });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

/**
 * Returns all parsed problem posts, sorted by date descending.
 * Deduped per request via React cache() so multiple callers within one
 * render pass (e.g. generateMetadata + page component) share a single parse.
 */
export const getAllProblems = cache(memoizeInProduction(readAllProblems));

export async function getProblemBySlug(slug: string): Promise<ProblemPost> {
    const posts = await getAllProblems();
    const post = posts.find((entry) => entry.slug === slug);

    if (!post) {
        throw new Error(`Problem post with slug "${slug}" not found`);
    }

    return post;
}

async function getProblemByPath(filePath: string): Promise<ProblemPost> {
    const fileContents = await readFile(filePath, "utf-8");
    const { data, content } = matter(fileContents);
    const frontmatter = validateProblemFrontmatter(data);

    return {
        ...frontmatter,
        content,
        filePath,
    };
}

async function readAllBlogPosts(): Promise<BlogPost[]> {
    const contentDir = join(process.cwd(), "content", "blog");
    const posts: BlogPost[] = [];

    try {
        const files = await findContentFiles(contentDir, [".md"]);

        for (const filePath of files) {
            const post = await getBlogPostByPath(filePath);
            posts.push(post);
        }

        assertUniqueSlugs(posts, "blog");
        return posts.sort((a, b) => {
            const dateA = new Date(a.datePublished).getTime();
            const dateB = new Date(b.datePublished).getTime();
            return dateB - dateA;
        });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

/**
 * Returns all parsed blog posts, sorted by date descending.
 * Deduped per request via React cache() so multiple callers within one
 * render pass (e.g. generateMetadata + page component) share a single parse.
 */
export const getAllBlogPosts = cache(memoizeInProduction(readAllBlogPosts));

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const posts = await getAllBlogPosts();
    const post = posts.find((entry) => entry.slug === slug);

    if (!post) {
        throw new Error(`Blog post with slug "${slug}" not found`);
    }

    return post;
}

async function getBlogPostByPath(filePath: string): Promise<BlogPost> {
    const fileContents = await readFile(filePath, "utf-8");
    const { data, content } = matter(fileContents);
    const frontmatter = validateBlogFrontmatter(data);

    return {
        ...frontmatter,
        content,
        filePath,
    };
}

async function findContentFiles(
    dir: string,
    extensions: string[]
): Promise<string[]> {
    const files: string[] = [];
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            const subFiles = await findContentFiles(fullPath, extensions);
            files.push(...subFiles);
        } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
            files.push(fullPath);
        }
    }

    return files;
}

function assertUniqueSlugs(
    posts: Array<{ slug: string; filePath: string }>,
    contentType: "blog" | "problem"
): void {
    const fileBySlug = new Map<string, string>();

    for (const post of posts) {
        const existingFile = fileBySlug.get(post.slug);

        if (existingFile) {
            throw new Error(
                `Duplicate ${contentType} slug "${post.slug}" in ${existingFile} and ${post.filePath}`
            );
        }

        fileBySlug.set(post.slug, post.filePath);
    }
}
