#!/usr/bin/env bun

// The root tsconfig covers `scripts/` but does not pull in Bun's globals the
// way tsconfig.tests.json does, and widening that config would change type
// resolution for the whole app to serve one file.
/// <reference types="bun" />

/**
 * Enforces the toolchain contract declared in package.json.
 *
 * Bun reads neither `engines` nor `packageManager`, so nothing stops a stale
 * local install from running every script in this repo. When that happens the
 * failure surfaces inside whichever tool needed the newer Bun, worded as that
 * tool's problem, with no mention of a version. Checking here trades a pile of
 * confusing downstream errors for one instruction.
 *
 * Runs from `preinstall` and from `scripts/check-toolchain.sh`, which together
 * cover installs, dev, builds, commits, pushes, and `bun run healthcheck`.
 */

import packageJson from "../package.json";

const supportedRange = packageJson.engines.bun;
const pinnedVersion = packageJson.packageManager.replace(/^bun@/, "");

/** Only populated when a package manager spawned this script. */
const userAgent = process.env.npm_config_user_agent ?? "";

/**
 * Vercel provisions its own Bun for production builds, which this repo treats
 * as a runtime it does not own. The supported range exists for local and CI
 * tooling, so enforcing it during a deploy would take the site down over a
 * requirement that only development tools have.
 */
const isManagedDeploy = process.env.VERCEL !== undefined;

function fail(lines: string[]): never {
    console.error(lines.join("\n"));
    process.exit(1);
}

if (userAgent !== "" && !userAgent.startsWith("bun/")) {
    fail(["This project uses Bun exclusively. Run `bun install`."]);
}

if (isManagedDeploy) {
    process.exit(0);
}

if (!Bun.semver.satisfies(Bun.version, supportedRange)) {
    fail([
        `This project needs Bun ${supportedRange}, but ${Bun.version} is running.`,
        "",
        "  bun upgrade",
        "",
        "Every script here runs on Bun, so an unsupported version usually fails",
        "somewhere unrelated instead of pointing at itself.",
    ]);
}

// The pin is what CI installs. If it drifts outside the supported range, local
// machines and CI are running toolchains this project never agreed to support.
if (!Bun.semver.satisfies(pinnedVersion, supportedRange)) {
    fail([
        `package.json disagrees with itself. packageManager pins bun@${pinnedVersion},`,
        `which does not satisfy engines.bun (${supportedRange}).`,
    ]);
}
