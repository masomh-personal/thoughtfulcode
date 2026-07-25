---
title: "3Sum"
slug: "three-integer-sum"
source: "leetcode"
difficulty: "medium"
datePublished: "2026-05-14"
timeComplexity: "O(n^2)"
spaceComplexity: "O(n)"
excerpt: "Given an integer array, return all unique triplets where the three values sum to zero."
---

# Problem

Given an integer array `nums`, return every unique triplet `[a, b, c]` where `a + b + c === 0`.

Each triplet must use three distinct indices from the input. The output can be returned in any order, but duplicate triplets should not appear.

## Constraints

- `3 <= nums.length <= 1000`
- `-10^5 <= nums[i] <= 10^5`

## Examples

**Example 1:**

```text
Input:  nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
```

**Example 2:**

```text
Input:  nums = [0,1,1]
Output: []
```

**Example 3:**

```text
Input:  nums = [0,0,0]
Output: [[0,0,0]]
```

## Approach

The brute force version checks every possible triplet. That is simple, but it costs O(n^3), which is too slow for `nums.length <= 1000`.

Sorting gives the array structure. Once values are in ascending order, we can fix one value and solve the remaining two-value problem with two pointers.

For each index `i`, treat `nums[i]` as the anchor value. The other two values must sum to `-nums[i]`. Put `left` just after `i` and `right` at the end of the sorted array:

- If the sum is too small, move `left` right to increase it.
- If the sum is too large, move `right` left to decrease it.
- If the sum is zero, record the triplet, then move both pointers past duplicates.

Duplicates are the main detail. Skip repeated anchor values so the same first number does not start the same triplet twice. After recording a match, skip repeated `left` and `right` values before continuing. That keeps the output unique without needing a `Set` of serialized triplets.

This implementation uses `toSorted()` so the incoming array is not mutated. LeetCode-style solutions often sort in place to get O(1) extra working space, excluding the output. In this repo, the function keeps the caller's array unchanged, so the sorted copy costs O(n) space.

## Implementation

```typescript
export function threeSum(nums: number[]): number[][] {
    const sorted = nums.toSorted((a, b) => a - b);
    const triplets: number[][] = [];

    for (let i = 0; i < sorted.length - 2; i++) {
        const pivot = sorted[i]!;

        if (i > 0 && pivot === sorted[i - 1]) {
            continue;
        }

        let left = i + 1;
        let right = sorted.length - 1;

        while (left < right) {
            const leftValue = sorted[left]!;
            const rightValue = sorted[right]!;
            const sum = pivot + leftValue + rightValue;

            if (sum === 0) {
                triplets.push([pivot, leftValue, rightValue]);
                left++;
                right--;

                while (left < right && sorted[left] === sorted[left - 1]) {
                    left++;
                }

                while (left < right && sorted[right] === sorted[right + 1]) {
                    right--;
                }
                continue;
            }

            if (sum < 0) {
                left++;
                continue;
            }

            right--;
        }
    }

    return triplets;
}
```

## Binary Search Variant

Sorting also gives us a binary search option. We can fix two values, compute the third value needed to reach zero, then binary search the remaining suffix for that target.

That approach is useful to understand because it uses the same sorted-array structure, but it runs in O(n^2 log n). The two-pointer version is better here because each anchor scans the remaining range once, giving O(n^2) time with simpler duplicate handling.

## Complexity

- **Time O(n^2):** sorting costs O(n log n), then each anchor runs a linear two-pointer scan. The O(n^2) scan dominates.
- **Space O(n):** the sorted copy stores all input values. The returned triplets are output space.

## Test Coverage

The test suite validates:

- NeetCode baseline examples
- No-solution cases
- Unsorted input
- All-positive and all-negative inputs
- Duplicate zeros
- Duplicate anchors and pointer values
- Multiple unique triplets from repeated values
- Input array non-mutation
- Larger deterministic cases with and without heavy duplicates

## Wrap Up

3Sum becomes manageable once the array is sorted. Fix one value, solve the remaining pair with two pointers, and skip duplicates at the anchor and pointer levels. That gives a readable O(n^2) solution with unique triplets and no extra serialization step.
