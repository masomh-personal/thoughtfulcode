---
title: "Trapping Rain Water"
slug: "trapping-rain-water"
source: "leetcode"
difficulty: "hard"
datePublished: "2026-05-29"
timeComplexity: "O(n)"
spaceComplexity: "O(1)"
excerpt: "Given an elevation map of unit-width bars, compute how much rain water is trapped between them."
---

# Problem

You are given an array `height` where each element is the height of a bar of unit width. After it rains, water settles into the dips between taller bars. Return the total units of water trapped.

The key intuition: the water sitting on top of any single bar is bounded by the tallest bar to its left and the tallest bar to its right. The water level at index `i` is `min(maxLeft, maxRight)`, and the trapped amount is that level minus the bar's own height (never negative).

## Constraints

- `n === height.length`
- `1 <= n <= 2 * 10^4`
- `0 <= height[i] <= 10^5`

## Examples

**Example 1:**

```text
Input:  height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```

**Example 2:**

```text
Input:  height = [4,2,0,3,2,5]
Output: 9
```

## Edge Cases

- Empty array or a single bar traps nothing.
- Two bars have no interior, so nothing is trapped.
- Strictly increasing, strictly decreasing, and all-equal arrays trap nothing.
- Leading or trailing zeros sit outside any wall and hold no water.
- A dip is bounded by the shorter of its two walls, not the taller one.
- Multiple basins separated by a tall central peak each fill independently.

## Approach

Start with the one sentence that is the whole problem: the water on top of any bar is capped by `min(maxLeft, maxRight)`, where those are the tallest bars to the left and right of it. Subtract the bar's own height and you have the water it holds.

The brute force version computes those two maxima by scanning outward from every index. That is O(n^2), and at `n = 20000` it is too slow. You can precompute prefix and suffix maxima into two arrays to get O(n) time, but that costs O(n) space.

The two-pointer version gets you O(n) time and O(1) space. Put `left` at the start and `right` at the end, and track the running `maxLeft` and `maxRight` as you walk them toward each other. The trick is deciding which pointer to move.

Move the pointer on the side with the **shorter current bar**. Here is why that is safe. If `height[left] <= height[right]`, then whatever happens in the middle, the bar at `left` is bounded by `maxLeft`, because we already know there is a bar at least as tall as `height[right]` sitting to its right. So we can commit `maxLeft - height[left]` right now and never look back. The taller side stays parked because its water level is not decided yet.

There is one subtle trap worth calling out, because it is the most common way to get this wrong. The comparison that picks the side has to be on the **current bar heights** (`height[left] <= height[right]`), not on the running maxima (`maxLeft <= maxRight`). Comparing the maxima looks reasonable and passes plenty of cases, but it skips the final dip in shapes like `[2, 0, 2]` and quietly undercounts. Compare the bars, not the maxes.

## Implementation

```typescript
export function trap(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxLeft = 0;
    let maxRight = 0;
    let trapped = 0;

    while (left < right) {
        // The shorter bar is the binding wall, so its side can be committed
        // now: a taller-or-equal bar already exists on the other end.
        const leftHeight = height[left] ?? 0;
        const rightHeight = height[right] ?? 0;

        if (leftHeight <= rightHeight) {
            maxLeft = Math.max(maxLeft, leftHeight);
            trapped += maxLeft - leftHeight;
            left++;
            continue;
        }

        maxRight = Math.max(maxRight, rightHeight);
        trapped += maxRight - rightHeight;
        right--;
    }

    return trapped;
}
```

The bar at `left` or `right` is always counted as part of its own update. When it is the new tallest on its side, `max - height` is zero, so it contributes nothing and just raises the wall for later bars. No special casing needed.

## Complexity

- **Time O(n):** each pointer moves inward at most n times total, and the loop ends when they meet.
- **Space O(1):** five numbers, no arrays. The prefix/suffix version trades this for O(n) space to store the precomputed maxima.

## Test Coverage

The test suite validates:

- LeetCode baseline examples
- Empty, single-bar, and two-bar inputs
- Monotonic increasing, decreasing, all-equal, and all-zero arrays
- Symmetric bowls, plateaus, and a tall central peak splitting two basins
- Leading zeros that trap nothing on the outside
- Input array non-mutation
- Larger deterministic cases: repeated bowls, a deep central reservoir, and a wide flat valley

## Wrap Up

The hard part of this problem is not the code, it is convincing yourself the greedy move is safe. Once you believe that the shorter side is fully determined by its own running max, the two-pointer solution falls out in a dozen lines with no extra arrays.

If you only remember one thing, make it this: compare the bar heights to choose a side, not the running maxima. That one line is the difference between a clean pass and a solution that looks correct until `[2, 0, 2]` quietly proves it is not.
