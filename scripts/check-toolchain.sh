#!/usr/bin/env sh
#
# Fails fast when `bun` inside a package script is not actually Bun.
#
# `bun run` prepends a shared temporary directory to PATH containing `bun` and
# `node` symlinks, so that shebang scripts resolve to Bun. That directory is
# keyed only by Bun's version and reused without revalidation, so a process that
# misidentifies its own executable corrupts it for every shell on the machine.
# When that happens each script launches the wrong program, which exits 0, and
# the whole chain reports success without running a single check.
#
# The test is deliberately behavioral: ask Bun to identify itself through the
# same lookup a package script uses. That avoids encoding the shim's location or
# layout, which differ across Linux, macOS, and Windows and are free to change.
#
# POSIX sh on purpose. A guard written in TypeScript would be started through
# the very lookup it exists to validate. Husky already requires sh for hooks, so
# this adds no new dependency.

set -eu

reported=$(bun --version 2>/dev/null || true)

case $reported in
    [0-9]*.[0-9]*.[0-9]*) exit 0 ;;
esac

resolved=$(command -v bun 2>/dev/null || echo "nothing on PATH")

echo "Toolchain check failed: \`bun\` did not identify itself as Bun." >&2
echo >&2
echo "  bun --version  ->  ${reported:-(no output)}" >&2
echo "  bun resolves to->  ${resolved}" >&2
echo >&2
echo "Package scripts would run that program instead of the real tool. It exits" >&2
echo "successfully, so every check would pass without doing any work." >&2
echo >&2
echo "Bun's shared shim directory is the usual cause. Remove it and retry; Bun" >&2
echo "recreates it on the next run:" >&2
echo >&2
echo "  rm -rf \"\${TMPDIR:-/tmp}\"/bun-node-*" >&2
exit 1
