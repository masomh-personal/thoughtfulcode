#!/usr/bin/env bun

/**
 * Problem publisher
 *
 * Generates public markdown from a completed local solution.
 *
 * Generation is one-way: the published markdown is the source of truth once it
 * exists, because authors add the problem statement, approach, and analysis by
 * hand. Republishing therefore requires --force.
 *
 * Usage:
 *   bun run publish:problem two-sum
 *   bun run publish:problem two-sum --force
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
    type ProblemFrontmatter,
    validateProblemFrontmatter,
} from "@/lib/schemas";
import { stripSolutionHeaderComment } from "@/lib/solution-code";

async function readSolutionFiles(slug: string): Promise<{
    metadata: ProblemFrontmatter;
    solution: string;
}> {
    const solutionDir = join(process.cwd(), "solutions", slug);

    if (!existsSync(solutionDir)) {
        throw new Error(
            `Solution folder not found: solutions/${slug}/\nRun: bun run new:problem ${slug}`
        );
    }

    const metadataPath = join(solutionDir, "metadata.json");
    const solutionPath = join(solutionDir, "solution.ts");

    if (!existsSync(metadataPath)) {
        throw new Error(`metadata.json not found in solutions/${slug}/`);
    }

    if (!existsSync(solutionPath)) {
        throw new Error(`solution.ts not found in solutions/${slug}/`);
    }

    const metadata = validateProblemFrontmatter(
        JSON.parse(await readFile(metadataPath, "utf-8"))
    );
    const solution = await readFile(solutionPath, "utf-8");

    return { metadata, solution };
}

function validateMetadata(
    metadata: ProblemFrontmatter,
    expectedSlug: string
): void {
    const errors: string[] = [];

    if (metadata.slug !== expectedSlug) {
        errors.push(
            `metadata slug "${metadata.slug}" does not match folder slug "${expectedSlug}"`
        );
    }

    if (metadata.timeComplexity === "O(?)") {
        errors.push("timeComplexity is not filled in (still O(?))");
    }

    if (metadata.spaceComplexity === "O(?)") {
        errors.push("spaceComplexity is not filled in (still O(?))");
    }

    if (errors.length > 0) {
        throw new Error(
            `Please update metadata.json:\n  - ${errors.join("\n  - ")}`
        );
    }
}

function generateMarkdown(
    metadata: ProblemFrontmatter,
    solution: string
): string {
    const frontmatter = `---
title: ${JSON.stringify(metadata.title)}
slug: ${JSON.stringify(metadata.slug)}
source: ${JSON.stringify(metadata.source)}
difficulty: ${JSON.stringify(metadata.difficulty)}
datePublished: ${JSON.stringify(metadata.datePublished)}
timeComplexity: ${JSON.stringify(metadata.timeComplexity)}
spaceComplexity: ${JSON.stringify(metadata.spaceComplexity)}
excerpt: ${JSON.stringify(metadata.excerpt)}
---`;

    const solutionCode = stripSolutionHeaderComment(solution);

    return `${frontmatter}

# Problem

[Write the problem statement in 2-4 concise lines.]

## Approach

[Explain your solution approach briefly.]

## Implementation

\`\`\`typescript
${solutionCode}
\`\`\`

## Complexity

- **Time ${metadata.timeComplexity}:** [add a one-line explanation]
- **Space ${metadata.spaceComplexity}:** [add a one-line explanation]
`;
}

async function publish(slug: string, force: boolean): Promise<void> {
    console.log(`Reading solution files for: ${slug}...`);

    try {
        const { metadata, solution } = await readSolutionFiles(slug);
        validateMetadata(metadata, slug);

        const contentDir = join(process.cwd(), "content", "problems");
        const markdownPath = join(contentDir, `${slug}.md`);

        if (existsSync(markdownPath) && !force) {
            throw new Error(
                `content/problems/${slug}.md already exists.\n` +
                    `Publishing regenerates the template and would discard the problem statement,\n` +
                    `approach, and analysis written since. Edit the file directly, or pass --force\n` +
                    `to overwrite it.`
            );
        }

        const markdownContent = generateMarkdown(metadata, solution);
        await mkdir(contentDir, { recursive: true });
        await writeFile(markdownPath, markdownContent);

        console.log(`\nPublished: content/problems/${slug}.md`);
        console.log("\nNext steps:");
        console.log(`  1. Refine content/problems/${slug}.md`);
        console.log(`  2. Preview: http://localhost:3000/problems/${slug}`);
    } catch (error) {
        console.error(
            `\nError: ${error instanceof Error ? error.message : String(error)}`
        );
        process.exit(1);
    }
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const slug = args.find((arg) => !arg.startsWith("--"));

if (!slug) {
    console.error("Usage: bun run publish:problem <slug> [--force]");
    console.error("\nExample:");
    console.error("  bun run publish:problem two-sum");
    process.exit(1);
}

await publish(slug, force);
