#!/usr/bin/env sh
#
# Fails fast when Bun's shim directory points at the wrong executable.
#
# `bun run` prepends a shared /tmp/bun-node-<revision> directory to PATH so that
# `bun` and `node` resolve inside package scripts. That directory is keyed only
# by Bun's revision and shared by every process on the machine, so one process
# that misidentifies its own executable corrupts it for every shell. On Linux
# under an AppImage editor the links have been observed pointing at the editor
# binary, which makes each script launch the GUI and exit 0. Checks then pass
# without running, which is far worse than failing.
#
# Written in POSIX sh on purpose: a Bun or Node guard would be launched through
# the very shim it is meant to validate. Targets are inspected, never executed.

set -eu

fail() {
    echo "Toolchain check failed: ${1} resolves to ${2}" >&2
    echo >&2
    echo "Bun's shim directory is corrupted. Package scripts would run that program" >&2
    echo "instead of the real tool and exit successfully without doing any work." >&2
    echo >&2
    echo "Clear the cache and try again:" >&2
    echo >&2
    echo "  rm -rf /tmp/bun-node-*" >&2
    exit 1
}

# A shim is legitimate only when it lands on a bun or node binary. Bun points
# its `node` shim at itself, so both names are valid targets for either link.
verify() {
    name=$1
    link=$2

    [ -e "$link" ] || return 0

    target=$(readlink -f "$link" 2>/dev/null) || target=$link

    case $(basename "$target") in
        bun | bun.exe | node | node.exe) return 0 ;;
        *) fail "$name" "$target" ;;
    esac
}

for dir in /tmp/bun-node-*; do
    [ -d "$dir" ] || continue
    verify "$dir/bun" "$dir/bun"
    verify "$dir/node" "$dir/node"
done

# Covers the in-script case, where the shim directory is already on PATH, plus
# any other stray shim ahead of the real binaries.
for name in bun node; do
    resolved=$(command -v "$name" 2>/dev/null) || continue
    verify "$name" "$resolved"
done
