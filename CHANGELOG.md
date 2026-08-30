# Changelog

Notable changes to hamadeh.io are documented here by release.

## 3.6.0 - 2026-08-30

### Added

- Published a practical guide to choosing classes for objects with identity, evolving state, and protected invariants.
- Added a from-scratch `AllOne` frequency tracker with average `O(1)` operations, comprehensive tests, and a Hard problem post.

## 3.5.1 - 2026-08-30

### Security

- Upgraded Next.js to 16.3.3 to patch two critical unauthenticated remote code execution vulnerabilities affecting AVIF image optimization and Windows-hosted servers.

### Changed

- Updated Node and React DOM types, Oxfmt, Oxlint, Sharp, and browser compatibility data to their current stable releases.

## 3.5.0 - 2026-08-22

### Added

- Published a practical dependency-security article covering advisory audits, transitive risk, lifecycle scripts, and residual risk.
- Added a tested `O(n)` solution and problem post for Product of Array Except Self.
- Added distinct presentation colors for every blog tag currently in use.

### Changed

- Upgraded Bun to 1.4.0 and refreshed all direct dependencies to their current stable releases.
- Consolidated local checks and Next.js production builds on TypeScript 7.
- Increased blog-tag background opacity and derived backgrounds from each tag color for consistent contrast.
- Updated runtime, TypeScript, and release documentation for the current toolchain.

### Security

- Removed the high-severity `js-yaml` and `nanoid` advisories from the locked dependency graph.
- Verified the lockfile with Bun's advisory audit and blocked dependency-script report.
