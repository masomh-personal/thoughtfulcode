import { describe, expect, test } from "bun:test";
import { AllOne } from "./solution";

describe("AllOne", () => {
    describe("Basics", () => {
        test("returns empty strings before any keys are added", () => {
            const counts = new AllOne();

            const expected = "";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expected);
            expect(maxResult).toBe(expected);
        });

        test("tracks one key as both minimum and maximum", () => {
            const counts = new AllOne();
            counts.inc("hello");
            counts.inc("hello");

            const expected = "hello";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expected);
            expect(maxResult).toBe(expected);
        });

        test("solves the LeetCode example sequence", () => {
            const counts = new AllOne();
            counts.inc("hello");
            counts.inc("hello");
            counts.inc("leet");

            const expectedMin = "leet";
            const expectedMax = "hello";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expectedMin);
            expect(maxResult).toBe(expectedMax);
        });
    });

    describe("Frequency Movement", () => {
        test("moves keys through existing and newly created buckets", () => {
            const counts = new AllOne();
            counts.inc("alpha");
            counts.inc("beta");
            counts.inc("gamma");
            counts.inc("alpha");
            counts.inc("beta");
            counts.inc("alpha");

            const expectedMin = "gamma";
            const expectedMax = "alpha";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expectedMin);
            expect(maxResult).toBe(expectedMax);

            counts.dec("alpha");

            const expectedMaxAfterDecrement = new Set(["alpha", "beta"]);
            const maxAfterDecrement = counts.getMaxKey();
            expect(expectedMaxAfterDecrement.has(maxAfterDecrement)).toBe(true);
        });

        test("removes a key when its count reaches zero", () => {
            const counts = new AllOne();
            counts.inc("temporary");
            counts.inc("persistent");
            counts.inc("persistent");
            counts.dec("temporary");

            const expected = "persistent";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expected);
            expect(maxResult).toBe(expected);
        });

        test("recreates a removed frequency bucket when needed later", () => {
            const counts = new AllOne();
            counts.inc("first");
            counts.inc("first");
            counts.inc("second");
            counts.inc("second");
            counts.dec("first");
            counts.dec("first");
            counts.dec("second");

            const expected = "second";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expected);
            expect(maxResult).toBe(expected);
        });
    });

    describe("Ties and Defensive Behavior", () => {
        test("returns any valid key when minimum and maximum counts tie", () => {
            const counts = new AllOne();
            counts.inc("alpha");
            counts.inc("beta");
            counts.inc("gamma");

            const expected = new Set(["alpha", "beta", "gamma"]);
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(expected.has(minResult)).toBe(true);
            expect(expected.has(maxResult)).toBe(true);
        });

        test("leaves the structure unchanged when decrementing a missing key", () => {
            const counts = new AllOne();
            counts.inc("existing");
            counts.dec("missing");

            const expected = "existing";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expected);
            expect(maxResult).toBe(expected);
        });

        test("returns to the empty state after all keys are removed", () => {
            const counts = new AllOne();
            counts.inc("alpha");
            counts.inc("beta");
            counts.dec("alpha");
            counts.dec("beta");

            const expected = "";
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expected);
            expect(maxResult).toBe(expected);
        });
    });

    describe("Stress Tests", () => {
        test("handles fifty thousand updates with stable extrema", () => {
            const counts = new AllOne();

            for (let index = 0; index < 20_000; index++) {
                counts.inc("alpha");
            }

            for (let index = 0; index < 15_000; index++) {
                counts.inc("beta");
            }

            for (let index = 0; index < 10_000; index++) {
                counts.inc("gamma");
            }

            for (let index = 0; index < 5_000; index++) {
                counts.dec("alpha");
            }

            const expectedMin = "gamma";
            const expectedMax = new Set(["alpha", "beta"]);
            const minResult = counts.getMinKey();
            const maxResult = counts.getMaxKey();

            expect(minResult).toBe(expectedMin);
            expect(expectedMax.has(maxResult)).toBe(true);
        });
    });
});
