#!/usr/bin/env bun

/**
 * Content integrity gate.
 *
 * Frontmatter shape is already enforced by the Valibot schemas during parsing.
 * This script covers the invariants that live between files, where nothing else
 * would notice a break: routing that depends on frontmatter, the layout's
 * dependence on a heading, and the promise that published code is tested code.
 *
 * Every check runs before reporting so one pass lists all the work to do.
 */

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { getAllBlogPosts, getAllProblems } from "@/lib/mdx";
import {
    findTypeScriptFences,
    stripSolutionHeaderComment,
} from "@/lib/solution-code";

interface ContentEntry {
    slug: string;
    filePath: string;
    content: string;
}

const SOLUTIONS_DIR = join(process.cwd(), "solutions");

/**
 * Languages registered in components/markdown/RichMarkdownContent.tsx, plus
 * plain fences. A fence outside this set renders unhighlighted, which is easy
 * to miss in review.
 */
const SUPPORTED_FENCE_LANGUAGES = new Set([
    "bash",
    "http",
    "javascript",
    "json",
    "typescript",
    "ts",
    "text",
    "",
]);

/**
 * Routes are built from frontmatter `slug`, so a filename that says something
 * else sends authors to the wrong URL.
 */
function checkFilenameMatchesSlug(entries: ContentEntry[]): string[] {
    return entries
        .filter((entry) => basename(entry.filePath, ".md") !== entry.slug)
        .map(
            (entry) =>
                `${entry.filePath} declares slug "${entry.slug}"; rename the file to ${entry.slug}.md`
        );
}

/**
 * app/problems/[slug]/page.tsx splits the body on this heading to build the
 * intro panel. Without it the whole post drops below the header grid.
 */
function checkProblemHasProblemHeading(problems: ContentEntry[]): string[] {
    return problems
        .filter((problem) => !/^# Problem\s*$/m.test(problem.content))
        .map(
            (problem) =>
                `${problem.filePath} is missing the "# Problem" heading the problem layout splits on`
        );
}

function checkFenceLanguages(entries: ContentEntry[]): string[] {
    const errors: string[] = [];

    for (const entry of entries) {
        for (const match of entry.content.matchAll(/^```([a-zA-Z0-9]*)/gm)) {
            const language = match[1] ?? "";

            if (!SUPPORTED_FENCE_LANGUAGES.has(language)) {
                errors.push(
                    `${entry.filePath} uses code fence language "${language}", which the markdown renderer does not register, so it will not highlight`
                );
            }
        }
    }

    return [...new Set(errors)];
}

async function checkSolutionParity(
    problems: ContentEntry[]
): Promise<string[]> {
    const errors: string[] = [];
    const publishedSlugs = new Set(problems.map((problem) => problem.slug));

    let solutionSlugs: string[] = [];
    try {
        const entries = await readdir(SOLUTIONS_DIR, { withFileTypes: true });
        solutionSlugs = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
    } catch {
        return ["solutions/ directory is missing"];
    }

    for (const slug of publishedSlugs) {
        if (!solutionSlugs.includes(slug)) {
            errors.push(
                `content/problems/${slug}.md has no solutions/${slug}/ workspace`
            );
        }
    }

    return errors;
}

/**
 * The site presents these solutions as tested. That only holds while the code
 * in the post is the code the test suite runs.
 */
async function checkPublishedCodeIsTested(
    problems: ContentEntry[]
): Promise<string[]> {
    const errors: string[] = [];

    for (const problem of problems) {
        const solutionPath = join(SOLUTIONS_DIR, problem.slug, "solution.ts");

        if (!existsSync(solutionPath)) {
            continue;
        }

        const tested = stripSolutionHeaderComment(
            await readFile(solutionPath, "utf-8")
        );
        const fences = findTypeScriptFences(problem.content);

        if (!fences.includes(tested)) {
            errors.push(
                `${problem.filePath} does not contain solutions/${problem.slug}/solution.ts verbatim; the published code has drifted from the tested code`
            );
        }
    }

    return errors;
}

async function checkContent(): Promise<void> {
    const [posts, problems] = await Promise.all([
        getAllBlogPosts(),
        getAllProblems(),
    ]);
    const allEntries = [...posts, ...problems];

    const errors = [
        ...checkFilenameMatchesSlug(allEntries),
        ...checkFenceLanguages(allEntries),
        ...checkProblemHasProblemHeading(problems),
        ...(await checkSolutionParity(problems)),
        ...(await checkPublishedCodeIsTested(problems)),
    ];

    if (errors.length > 0) {
        throw new Error(`\n  - ${errors.join("\n  - ")}`);
    }

    console.log(
        `Content check passed: ${posts.length} blog posts and ${problems.length} problems`
    );
}

try {
    await checkContent();
} catch (error) {
    console.error(
        `Content check failed: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
}
