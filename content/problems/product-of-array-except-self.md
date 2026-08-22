---
title: "Product of Array Except Self"
slug: "product-of-array-except-self"
source: "leetcode"
difficulty: "medium"
datePublished: "2026-08-22"
timeComplexity: "O(n)"
spaceComplexity: "O(1)"
excerpt: "Return each position's product of every other array value in linear time without division."
---

# Problem

Given an integer array `nums`, return an array where each position contains the product of every value in `nums` except the value at that position.

The algorithm must run in `O(n)` time without division.

## Constraints

- `2 <= nums.length <= 100,000`
- `-30 <= nums[i] <= 30`
- Every answer fits in a 32-bit integer
- The output array does not count as extra space

## Examples

```text
Input: nums = [1, 2, 3, 4]
Output: [24, 12, 8, 6]
```

```text
Input: nums = [-1, 1, 0, -3, 3]
Output: [0, 0, 9, 0, 0]
```

## Approach

Each answer is the product of two groups:

- Every value to the left of the current index
- Every value to the right of the current index

Build those groups in two passes.

The left-to-right pass stores the running prefix product directly in the output array. At index `i`, that running value contains every number before `i`, but not `nums[i]`.

The right-to-left pass keeps one running suffix product. Multiply it into the prefix already stored at each index, then include the current number before moving left.

This avoids division, so zero values do not need special branches. One zero naturally leaves only its own position nonzero. Two zeroes naturally make every result zero.

JavaScript can produce `-0` when a negative running product meets zero. The final assignment normalizes that representation to the ordinary integer `0` expected by the problem.

## Implementation

```typescript
export function productExceptSelf(nums: readonly number[]): number[] {
    const products = Array<number>(nums.length).fill(1);
    let prefix = 1;

    for (let index = 0; index < nums.length; index++) {
        products[index] = prefix;
        prefix *= nums[index] ?? 1;
    }

    let suffix = 1;

    for (let index = nums.length - 1; index >= 0; index--) {
        const product = (products[index] ?? 1) * suffix;
        products[index] = product === 0 ? 0 : product;
        suffix *= nums[index] ?? 1;
    }

    return products;
}
```

## Complexity

- **Time O(n):** One pass builds prefix products and one pass applies suffix products.
- **Space O(1):** Only the two running products use extra space when the required output array is excluded.

## Edge Cases Checklist

- Two-element input
- One zero
- Multiple zeroes
- Negative values
- Products equal to one
- Maximum input length
- Input array remains unchanged

## Test Coverage

The test suite covers both baseline examples, two-element input, one and multiple zeroes, negative values, repeated ones, input immutability, and a deterministic 100,000-element case.

## Source

- [LeetCode 238: Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
