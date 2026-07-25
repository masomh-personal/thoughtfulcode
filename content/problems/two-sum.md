---
title: "Two Sum"
slug: "two-sum"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-02-25"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
excerpt: "Given an array of integers and a target, return the indices of two numbers that add up to the target."
---

# Problem

Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.

The same element cannot be used twice, and the problem guarantees exactly one valid answer.
The returned index order does not matter.

## Approach

Use a one-pass hash map:

1. Keep a `Map<number, number>` named `seen` where:
    - key = number value
    - value = index where that number was first seen in the current scan
2. Iterate the array once from left to right.
3. For each number, compute its complement: `target - current`.
4. If the complement already exists in `seen`, return `[seenIndex, currentIndex]`.
5. Otherwise, store the current number and index in `seen`.

Why this works:

- At each index, you ask: "Have I already seen the number that completes this pair?"
- This naturally handles duplicates (for example, `[3, 3]`) because the first `3` is stored before the second `3` is checked.

## Implementation

```typescript
export function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();

    for (let idx = 0; idx < nums.length; idx++) {
        const curr = nums[idx]!;
        const complement = target - curr;
        const complementIndex = seen.get(complement);

        if (complementIndex !== undefined) {
            return [complementIndex, idx];
        }

        seen.set(curr, idx);
    }

    return [];
}
```

## Complexity

- **Time O(n):** single pass over `nums`, with average `O(1)` map lookups/inserts.
- **Space O(n):** in the worst case, the map stores almost all numbers before the match is found.

## Test Coverage

The test suite validates:

- LeetCode baseline examples
- Duplicate-number case (`[3, 3]`)
- Negative and mixed values
- Zero-target case with repeated zero
- A 1000-element deterministic input
- Defensive no-solution behavior (`[]`)
