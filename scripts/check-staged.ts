#!/usr/bin/env bun

import { execFileSync, spawnSync } from "node:child_process";

const FORMAT_EXTENSIONS =
    /\.(cjs|css|cts|html|js|json|jsonc|jsx|less|md|mdx|mjs|mts|scss|ts|tsx|ya?ml)$/i;
const LINT_EXTENSIONS = /\.(cjs|cts|js|jsx|mjs|mts|ts|tsx)$/i;
const bun = process.execPath;

function getStagedFiles() {
    const output = execFileSync(
        "git",
        ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"],
        { encoding: "utf8" }
    );

    return output
        .split("\0")
        .filter(Boolean)
        .filter((file) => FORMAT_EXTENSIONS.test(file));
}

function run(command: string, args: string[]) {
    const result = spawnSync(command, args, { stdio: "inherit" });

    if (result.error) {
        console.error(result.error.message);
        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

const stagedFiles = getStagedFiles();

if (stagedFiles.length === 0) {
    console.log("No staged files need Oxc checks.");
    process.exit(0);
}

const lintFiles = stagedFiles.filter((file) => LINT_EXTENSIONS.test(file));

run(bun, ["run", "oxfmt", "--write", ...stagedFiles]);

if (lintFiles.length > 0) {
    run(bun, [
        "run",
        "oxlint",
        "--fix",
        "--react-plugin",
        "--jsx-a11y-plugin",
        "--nextjs-plugin",
        ...lintFiles,
    ]);
}

run("git", ["add", "--", ...stagedFiles]);
