/**
 * Product of Array Except Self
 * Difficulty: Medium
 * Topics: Array, Prefix Product
 *
 * Time: O(n)
 * Space: O(1) excluding the output array
 *
 * Return the product of every element except the current one without division.
 */
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
