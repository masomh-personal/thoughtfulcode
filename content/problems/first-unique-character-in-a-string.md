---
title: "First Unique Character in a String"
slug: "first-unique-character-in-a-string"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-02-28"
timeComplexity: "O(n)"
spaceComplexity: "O(1)"
excerpt: "Given a string s, return the index of the first non-repeating character, or -1 if none exists."
---

# Problem

Given a string `s`, return the index of the first non-repeating character.
If no unique character exists, return `-1`.

## Approach

Use a two-pass frequency counting strategy:

1. Count each character occurrence in `s`.
2. Scan `s` from left to right.
3. Return the first index where the character frequency is `1`.
4. If no such character is found, return `-1`.

Why this works:

- A character is unique exactly when its total count is `1`.
- The second pass preserves left-to-right order, so the first match is the required answer.

## Implementation

```typescript
export function firstUniqChar(s: string): number {
    const frequency = new Map<string, number>();

    for (const char of s) {
        frequency.set(char, (frequency.get(char) ?? 0) + 1);
    }

    for (let i = 0; i < s.length; i++) {
        const char = s.charAt(i);
        if (frequency.get(char) === 1) return i;
    }

    return -1;
}
```

## Complexity

- **Time O(n):** one pass to count and one pass to find the first unique index.
- **Space O(1):** bounded alphabet (`'a'` to `'z'`) means constant extra storage.

## Test Coverage

The test suite validates:

- LeetCode baseline examples
- Empty and single-character inputs
- Unique character at start, middle, and end
- All-duplicated strings returning `-1`
- Large deterministic lowercase inputs
