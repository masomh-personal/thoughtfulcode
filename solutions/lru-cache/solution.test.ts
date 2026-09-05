import { describe, expect, test } from "bun:test";
import { LRUCache } from "./solution";

describe("LRUCache", () => {
    describe("Basics", () => {
        test("returns -1 for a key that was never stored", () => {
            const cache = new LRUCache(2);

            const expected = -1;
            const result = cache.get(7);

            expect(result).toBe(expected);
        });

        test("reads back a value it just stored", () => {
            const cache = new LRUCache(2);
            cache.put(1, 100);

            const expected = 100;
            const result = cache.get(1);

            expect(result).toBe(expected);
        });

        test("solves the LeetCode example sequence", () => {
            const cache = new LRUCache(2);
            cache.put(1, 1);
            cache.put(2, 2);

            const expectedFirstRead = 1;
            const firstReadResult = cache.get(1);

            expect(firstReadResult).toBe(expectedFirstRead);

            // Key 2 is now the least recently used, so this write evicts it.
            cache.put(3, 3);

            const expectedEvicted = -1;
            const evictedResult = cache.get(2);

            expect(evictedResult).toBe(expectedEvicted);

            // Key 1 is now least recently used, so this write evicts it.
            cache.put(4, 4);

            const expectedSecondEvicted = -1;
            const secondEvictedResult = cache.get(1);

            expect(secondEvictedResult).toBe(expectedSecondEvicted);

            const expectedSurvivors = [3, 4];
            const survivorResults = [cache.get(3), cache.get(4)];

            expect(survivorResults).toEqual(expectedSurvivors);
        });
    });

    describe("Recency Ordering", () => {
        test("a read promotes a key so the untouched key is evicted instead", () => {
            const cache = new LRUCache(2);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.get(1);
            cache.put(3, 3);

            const expected = [1, -1, 3];
            const result = [cache.get(1), cache.get(2), cache.get(3)];

            expect(result).toEqual(expected);
        });

        test("a failed read does not change eviction order", () => {
            const cache = new LRUCache(2);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.get(99);
            cache.put(3, 3);

            const expected = [-1, 2, 3];
            const result = [cache.get(1), cache.get(2), cache.get(3)];

            expect(result).toEqual(expected);
        });

        test("evicts in least recently used order across interleaved reads and writes", () => {
            const cache = new LRUCache(3);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.put(3, 3);
            cache.get(1);
            cache.get(2);
            cache.put(4, 4);

            const expectedAfterFirstEviction = [1, 2, -1, 4];
            const firstEvictionResult = [
                cache.get(1),
                cache.get(2),
                cache.get(3),
                cache.get(4),
            ];

            expect(firstEvictionResult).toEqual(expectedAfterFirstEviction);

            // Reads above left key 1 as the oldest survivor.
            cache.put(5, 5);

            const expectedAfterSecondEviction = [-1, 2, 4, 5];
            const secondEvictionResult = [
                cache.get(1),
                cache.get(2),
                cache.get(4),
                cache.get(5),
            ];

            expect(secondEvictionResult).toEqual(expectedAfterSecondEviction);
        });
    });

    describe("Updating Existing Keys", () => {
        test("overwrites a value without evicting anything", () => {
            const cache = new LRUCache(2);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.put(1, 10);

            const expected = [10, 2];
            const result = [cache.get(1), cache.get(2)];

            expect(result).toEqual(expected);
        });

        test("an overwrite promotes the key it touched", () => {
            const cache = new LRUCache(2);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.put(1, 10);
            cache.put(3, 3);

            const expected = [10, -1, 3];
            const result = [cache.get(1), cache.get(2), cache.get(3)];

            expect(result).toEqual(expected);
        });
    });

    describe("Edge Cases", () => {
        test("a capacity of one keeps only the newest key", () => {
            const cache = new LRUCache(1);
            cache.put(1, 1);
            cache.put(2, 2);

            const expected = [-1, 2];
            const result = [cache.get(1), cache.get(2)];

            expect(result).toEqual(expected);
        });

        test("a capacity of one still overwrites its single key in place", () => {
            const cache = new LRUCache(1);
            cache.put(1, 1);
            cache.put(1, 5);

            const expected = 5;
            const result = cache.get(1);

            expect(result).toBe(expected);
        });

        test("stores negative and zero values without confusing them with a miss", () => {
            const cache = new LRUCache(2);
            cache.put(1, 0);
            cache.put(2, -1);

            const expected = [0, -1];
            const result = [cache.get(1), cache.get(2)];

            expect(result).toEqual(expected);
        });

        test("refuses writes when constructed with no capacity", () => {
            const cache = new LRUCache(0);
            cache.put(1, 1);

            const expected = -1;
            const result = cache.get(1);

            expect(result).toBe(expected);
        });

        test("refills correctly after every key has been evicted", () => {
            const cache = new LRUCache(2);
            cache.put(1, 1);
            cache.put(2, 2);
            cache.put(3, 3);
            cache.put(4, 4);
            cache.put(5, 5);

            const expected = [-1, -1, -1, 4, 5];
            const result = [
                cache.get(1),
                cache.get(2),
                cache.get(3),
                cache.get(4),
                cache.get(5),
            ];

            expect(result).toEqual(expected);
        });
    });

    describe("Stress Tests", () => {
        test("holds the newest window after filling well past capacity", () => {
            const capacity = 1_000;
            const totalWrites = 50_000;
            const cache = new LRUCache(capacity);

            for (let key = 0; key < totalWrites; key += 1) {
                cache.put(key, key * 2);
            }

            const oldestSurvivor = totalWrites - capacity;

            const expected = {
                evictedBoundary: -1,
                oldestSurvivor: oldestSurvivor * 2,
                newest: (totalWrites - 1) * 2,
            };
            const result = {
                evictedBoundary: cache.get(oldestSurvivor - 1),
                oldestSurvivor: cache.get(oldestSurvivor),
                newest: cache.get(totalWrites - 1),
            };

            expect(result).toEqual(expected);
        });

        test("keeps a repeatedly read key alive through heavy churn", () => {
            const cache = new LRUCache(3);
            cache.put(0, 42);

            for (let key = 1; key <= 10_000; key += 1) {
                cache.put(key, key);
                cache.get(0);
            }

            const expected = 42;
            const result = cache.get(0);

            expect(result).toBe(expected);
        });
    });
});
