---
title: "Reverse String"
slug: "reverse-string"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-02-27"
timeComplexity: "O(n)"
spaceComplexity: "O(1)"
excerpt: "Write a function that reverses a string represented as an array of characters in-place with O(1) extra space."
---

# Problem

Given a character array `s`, reverse the order of its characters in-place.
You must modify the input array directly and avoid allocating another array for the result.
Return nothing (`void`) since the mutation happens on `s` itself.

## Approach

1. Initialize two pointers:
    - `l` at the start of the array
    - `r` at the end of the array
2. While `l < r`, swap `s[l]` and `s[r]`.
3. Move both pointers inward (`l++`, `r--`) and continue.
4. Stop when pointers meet or cross; at that point the array is fully reversed.

## Implementation

```typescript
export function reverseString(s: string[]): void {
    function swap(arr: string[], idx1: number, idx2: number): void {
        [arr[idx1], arr[idx2]] = [arr[idx2]!, arr[idx1]!];
    }

    let l = 0;
    let r = s.length - 1;

    while (l < r) {
        swap(s, l, r);

        l++;
        r--;
    }
}
```

## Complexity

- **Time O(n):** Each element is visited at most once as pointers move toward the center.
- **Space O(1):** Reversal is done in-place with constant extra memory.
