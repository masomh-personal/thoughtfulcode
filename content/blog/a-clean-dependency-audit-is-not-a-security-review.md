---
title: "A Clean Dependency Audit Is Not a Security Review"
slug: "a-clean-dependency-audit-is-not-a-security-review"
datePublished: "2026-08-22"
excerpt: "An audit checks known advisories in your lockfile. A useful dependency review also checks release risk, install scripts, maintenance, and whether the fix actually works."
tags: ["security", "dependencies", "bun"]
---

`bun audit` returned two high-severity findings when I refreshed this site's dependencies.

One came from `js-yaml` through the frontmatter parser. The other came from `nanoid` through PostCSS. Neither package appeared in the app's direct dependency list, but both shipped in the lockfile and both needed attention.

After the upgrades, the command printed:

```text
No vulnerabilities found
```

That is good news. It is not the same as "the dependency tree is secure."

## What An Audit Actually Proves

Bun reads package versions from `bun.lock` and sends them to the registry's advisory endpoint. If a locked version falls inside a published vulnerable range, the audit reports it.

That answers one narrow and valuable question:

> Does this dependency graph contain a package version covered by a known advisory?

It does not prove that every package is trustworthy, actively maintained, or safe in the way your application uses it. It also cannot report a vulnerability that nobody has disclosed yet.

The distinction matters because the reassuring output is easy to overread. "No known matches in the advisory database" is accurate. "Nothing here can hurt us" is not.

## Transitive Dependencies Still Belong To You

I did not install `js-yaml` or `nanoid` directly. They arrived because packages I chose depended on them.

That does not make them someone else's problem. Production runs the resolved graph, not the short list in `package.json`.

The useful question is not only "Which package is vulnerable?" It is also "What path brought it here?"

```text
@11ty/gray-matter -> js-yaml
postcss -> nanoid
```

That path tells you where a durable fix belongs. Sometimes updating the parent package is enough. Sometimes its declared range blocks the safe transitive release. An override can help in that case, but it should be a deliberate compatibility decision, not a permanent junk drawer for versions.

For this update, moving the frontmatter parser to its next major release brought in the safe YAML parser. Updating PostCSS moved Nano ID past its affected range. The direct upgrades removed both findings without adding a special exception.

## A Security Fix Can Still Break The App

The Gray Matter update was a good example. Its major release changed the YAML parser, and the new parser changed a few schema defaults. Date-looking values now stay strings instead of becoming `Date` objects.

That behavior happens to match this site's schema because `datePublished` is an ISO string. Still, "the safer version installed" was only half the job. Every existing post had to parse, validate, and build with the new behavior.

This is why I do not separate security work from regression testing. A patch that leaves the application broken is not ready, and a passing application test does not erase a remaining advisory. You need both signals.

My minimum loop is:

1. Read the advisory and identify the dependency path.
2. Read release notes for the proposed upgrade.
3. Update the smallest responsible dependency boundary.
4. Run focused checks for the changed behavior.
5. Run the full audit and production build.

That is slower than blindly applying every suggested fix. It is much faster than debugging an unexplained production regression.

## Supply Chain Risk Starts Before A CVE

A package can be dangerous without having a published vulnerability. A compromised maintainer account, a malicious install script, a typo-squatted package, or a suspicious ownership transfer may never look like an ordinary CVE.

Bun reduces one common risk by blocking arbitrary dependency lifecycle scripts unless the package is trusted. The command `bun pm untrusted` shows packages whose scripts were blocked. That deserves review whenever a new package appears, because install scripts run before your application gets a chance to validate anything.

The lockfile matters too. CI should install from the committed lockfile with `--frozen-lockfile`. Otherwise the same commit can resolve a different transitive release tomorrow, and the code review no longer describes what the build actually installed.

Bun can also reject newly published package versions with a minimum release age. That is useful when immediate adoption is less important than giving the ecosystem time to spot a bad release. It is not a magic safety delay, but it makes "published five minutes ago" an explicit choice instead of an invisible surprise.

## Check Package Health, Not Just Package Age

Old does not automatically mean unsafe, and new does not automatically mean healthy.

When a dependency changes, I check a few boring details:

- Is the package still published by the expected project or organization?
- Does the repository link point where it used to?
- Are releases and security reports receiving maintainer attention?
- Did the license change?
- Did new lifecycle scripts or large transitive trees appear?
- Does the changelog explain the behavior changes I am accepting?

None of these checks proves safety. Together they make a compromised or abandoned package harder to miss.

## Keep Residual Risk Honest

Sometimes the correct fix does not exist yet.

During this update, the current Next.js release was 16.3.2. Vercel had already announced that 16.3.3 would contain a critical security fix on August 26. An audit could not clear an unpublished patch, and pretending otherwise would make the report less useful.

The honest result is: current dependencies are installed, known advisories in the lockfile are resolved, and one announced framework patch still needs follow-up when it becomes available.

Security notes should describe what remains, not only what turned green.

## Wrap Up

Run the audit. Keep it in CI. Treat every high or critical finding as work that needs an owner.

Then keep going.

Trace transitive paths, review major release behavior, inspect lifecycle scripts, keep the lockfile frozen, and build the application with the exact graph you plan to ship. If a patch is announced but not released, write that down and return to it.

A clean audit is a useful checkpoint. A dependency review is the work around it.

## Further Reading

- [Bun audit documentation](https://bun.com/docs/pm/cli/audit)
- [Bun lifecycle script security](https://bun.com/docs/pm/lifecycle)
- [Bun install security and minimum release age](https://bun.com/docs/pm/cli/install)
