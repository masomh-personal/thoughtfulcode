---
title: "Longest Common Prefix"
slug: "longest-common-prefix"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-03-02"
timeComplexity: "O(S)"
spaceComplexity: "O(1)"
excerpt: "Given an array of strings, return the longest common prefix shared by all strings."
---

# Problem

Given an array of strings `strs`, return the longest common prefix among them.

If there is no common prefix, return an empty string `""`.

## Constraints

- `1 <= strs.length <= 200`
- `0 <= strs[i].length <= 200`
- `strs[i]` consists of lowercase English letters

## Clarifying Notes

- A prefix starts at index `0` of a string.
- The result must be shared by **every** string in `strs`.
- If any string is empty, the answer is `""`.

## Examples (LeetCode)

- `["flower","flow","flight"]` -> `"fl"`
- `["dog","racecar","car"]` -> `""`

## Approach

Use **horizontal scanning**:

1. Initialize `prefix` as the first string.
2. Iterate through each remaining word.
3. While the current word does not start with `prefix`, shrink `prefix` by one character from the end.
4. If `prefix` becomes empty, return `""` immediately.
5. After processing all words, return `prefix`.

Why this works:

- The answer must be a prefix of every word.
- Shrinking only when mismatch happens preserves the longest possible valid prefix.
- Early return avoids unnecessary work once no prefix is possible.

Complexity:

- Time: `O(S)` where `S` is the total number of characters examined across all comparisons
- Space: `O(1)` extra space
- Note: `S` is not the number of strings; with `n` strings of average length `m`, this is commonly expressed as `O(n * m)`.

## Implementation

```typescript
export function longestCommonPrefix(strs: string[]): string {
    let prefix = strs[0] ?? "";

    for (let i = 1; i < strs.length; i++) {
        const word = strs[i] ?? "";

        while (!word.startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
            if (prefix === "") return "";
        }
    }

    return prefix;
}
```

## Edge Cases Checklist

- Single-element array (answer is that string)
- Includes empty string
- No shared first character
- Entire shortest string is the prefix
- All strings identical
- Large list with small shared prefix

## Test Coverage

The test suite validates:

- LeetCode baseline examples
- Single-element array behavior
- Empty-string and no-common-prefix outcomes
- Full-string and shortest-string prefix outcomes
- Repeated-character and long-prefix mismatch scenarios
- Deterministic larger input size and near-max length strings
- Defensive behavior (input array is not mutated)
