import { describe, expect, test } from "bun:test";
import { productExceptSelf } from "./solution";

describe("productExceptSelf", () => {
    describe("Basics", () => {
        test("solves the first LeetCode example", () => {
            const nums = [1, 2, 3, 4];
            const expected = [24, 12, 8, 6];
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });

        test("solves the example containing zero and negatives", () => {
            const nums = [-1, 1, 0, -3, 3];
            const expected = [0, 0, 9, 0, 0];
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });

        test("handles two elements", () => {
            const nums = [7, 11];
            const expected = [11, 7];
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });
    });

    describe("Edge Cases", () => {
        test("returns all zeroes when the input has two zeroes", () => {
            const nums = [4, 0, -2, 0, 3];
            const expected = [0, 0, 0, 0, 0];
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });

        test("returns the nonzero product only at a single zero", () => {
            const nums = [2, -3, 0, 5];
            const expected = [0, 0, -30, 0];
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });

        test("handles an even count of negative values", () => {
            const nums = [-1, -2, -3, -4];
            const expected = [-24, -12, -8, -6];
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });

        test("handles values whose products remain one", () => {
            const nums = [1, 1, 1, 1];
            const expected = [1, 1, 1, 1];
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });

        test("does not mutate the input array", () => {
            const nums = [2, 3, 4, 5];
            const before = [...nums];

            productExceptSelf(nums);

            const expected = before;
            const result = nums;
            expect(result).toEqual(expected);
        });
    });

    describe("Stress Tests", () => {
        test("handles the maximum input length in linear time", () => {
            const nums = Array<number>(100_000).fill(1);
            nums[50_000] = 2;

            const expected = Array<number>(100_000).fill(2);
            expected[50_000] = 1;
            const result = productExceptSelf(nums);

            expect(result).toEqual(expected);
        });
    });
});
