---
title: "Find First Occurrence in a String"
slug: "find-the-index-of-the-first-occurrence-in-a-string"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-03-03"
timeComplexity: "O(n * m)"
spaceComplexity: "O(1)"
excerpt: "Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 when needle is not part of haystack."
---

# Problem

Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`.
If `needle` does not occur in `haystack`, return `-1`.

## Constraints

- `1 <= haystack.length, needle.length <= 10^4`
- `haystack` and `needle` consist of lowercase English characters.

## Examples

### Example 1

- Input: `haystack = "sadbutsad", needle = "sad"`
- Output: `0`
- Explanation: `"sad"` appears first at index `0` and again at index `6`; return the first index.

### Example 2

- Input: `haystack = "leetcode", needle = "leeto"`
- Output: `-1`
- Explanation: `"leeto"` is not a substring of `"leetcode"`.

### Example 3

- Input: `haystack = "aaaaa", needle = "bba"`
- Output: `-1`
- Explanation: No matching window exists.

## Edge-Case Checklist

- `needle` appears at the beginning of `haystack`
- `needle` appears at the end of `haystack`
- `needle` appears multiple times; first index must be returned
- no occurrence exists
- `needle` is longer than `haystack`
- repeated-character strings (e.g. `"aaaaa"` with `"aaa"` or `"bba"`)

## Test Coverage Plan

The scaffolded tests should validate:

- LeetCode baseline examples
- Basic exact-match and no-match behavior
- Overlapping and repeated substring patterns
- Boundary placement (start/end)
- Cases where `needle.length > haystack.length`
- Deterministic larger inputs
- Defensive contract behavior (string input immutability)

## Approach

Use a fixed-length window scan with character-by-character comparison:

1. Compute the last valid start index (`haystack.length - needle.length`).
2. For each start index, compare `needle` against the aligned window in `haystack`.
3. On the first full match, return that start index.
4. If no windows match, return `-1`.

Why this works:

- Each candidate start position is validated exactly against `needle`.
- Returning on the first full match guarantees the first occurrence index.

## Implementation

```typescript
export function strStr(haystack: string, needle: string): number {
    // Last index where a full needle-sized window can start.
    const maxAnchor = haystack.length - needle.length;

    // If needle is longer, a match is impossible.
    if (maxAnchor < 0) return -1;

    // Try every possible starting position in haystack.
    for (let anchor = 0; anchor <= maxAnchor; anchor++) {
        // Assume this window matches until we find a mismatch.
        let matches = true;

        // Compare needle characters to the current haystack window.
        for (let offset = 0; offset < needle.length; offset++) {
            if (haystack[anchor + offset] !== needle[offset]) {
                matches = false;
                break;
            }
        }

        // First full match is the answer.
        if (matches) return anchor;
    }

    // No window matched needle.
    return -1;
}
```

## Complexity

- **Time O((n - m + 1) \* m):** up to `n - m + 1` windows, each comparing up to `m` characters.
- **Space O(1):** only constant extra variables are used.
