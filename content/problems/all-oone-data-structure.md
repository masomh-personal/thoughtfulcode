---
title: "All O`one Data Structure"
slug: "all-oone-data-structure"
source: "leetcode"
difficulty: "hard"
datePublished: "2026-08-30"
timeComplexity: "O(1)"
spaceComplexity: "O(n)"
excerpt: "Design a frequency tracker with constant-time increments, decrements, and minimum or maximum key lookup."
---

# Problem

Design an `AllOne` class that tracks counts for string keys and supports four operations in average `O(1)` time:

- `inc(key)` increments a key, inserting it with count `1` when it is new.
- `dec(key)` decrements an existing key, removing it when its count reaches `0`.
- `getMaxKey()` returns any key with the largest count, or `""` when empty.
- `getMinKey()` returns any key with the smallest count, or `""` when empty.

## Constraints

- `1 <= key.length <= 10`
- Keys contain lowercase English letters.
- Every key passed to `dec` exists in the data structure.
- At most `50,000` total operations are called.

## Example

```text
allOne.inc("hello")
allOne.inc("hello")
allOne.getMaxKey() // "hello"
allOne.getMinKey() // "hello"
allOne.inc("leet")
allOne.getMaxKey() // "hello"
allOne.getMinKey() // "leet"
```

## Why A Map Is Not Enough

A map gives average `O(1)` access to a key's count. It does not give constant-time access to the smallest or largest count. Finding either one would require scanning every entry.

A sorted array or tree can track the order, but moving a key after every increment or decrement costs more than constant time. We need key lookup and frequency order without repeatedly sorting or scanning.

## Approach

Use two structures together:

1. A `Map` points each key directly to its current frequency bucket.
2. A doubly linked list keeps non-empty frequency buckets in ascending count order.

Each bucket owns a `Set` of keys with the same count. The first real bucket contains the minimum keys, and the last real bucket contains the maximum keys. Sentinel head and tail buckets remove special cases around the ends of the list.

An increment moves a key to the next count. If that bucket does not exist, insert it directly after the current bucket. A decrement performs the mirror operation toward the previous bucket. When a bucket loses its final key, unlink it immediately.

## Invariants

The implementation depends on four promises:

- Frequency buckets stay sorted by count.
- Every real bucket contains at least one key.
- Every live key appears in exactly one bucket.
- The key map always points to that same bucket.

These invariants are why the class boundary helps. Callers can request an operation, but they cannot mutate half of the linked structure and leave the rest inconsistent.

## Implementation

```typescript
class FrequencyBucket {
    readonly keys = new Set<string>();
    previous: FrequencyBucket;
    next: FrequencyBucket;

    constructor(readonly count: number) {
        this.previous = this;
        this.next = this;
    }
}

export class AllOne {
    private readonly keyBuckets = new Map<string, FrequencyBucket>();
    private readonly head = new FrequencyBucket(0);
    private readonly tail = new FrequencyBucket(0);

    constructor() {
        this.head.next = this.tail;
        this.tail.previous = this.head;
    }

    inc(key: string): void {
        const currentBucket = this.keyBuckets.get(key);

        if (currentBucket === undefined) {
            const firstBucket =
                this.head.next === this.tail || this.head.next.count !== 1
                    ? this.insertAfter(this.head, 1)
                    : this.head.next;

            firstBucket.keys.add(key);
            this.keyBuckets.set(key, firstBucket);
            return;
        }

        const nextBucket =
            currentBucket.next === this.tail ||
            currentBucket.next.count !== currentBucket.count + 1
                ? this.insertAfter(currentBucket, currentBucket.count + 1)
                : currentBucket.next;

        this.moveKey(key, currentBucket, nextBucket);
    }

    dec(key: string): void {
        const currentBucket = this.keyBuckets.get(key);

        if (currentBucket === undefined) {
            return;
        }

        if (currentBucket.count === 1) {
            this.keyBuckets.delete(key);
            this.removeKeyFromBucket(key, currentBucket);
            return;
        }

        const previousBucket =
            currentBucket.previous === this.head ||
            currentBucket.previous.count !== currentBucket.count - 1
                ? this.insertAfter(
                      currentBucket.previous,
                      currentBucket.count - 1
                  )
                : currentBucket.previous;

        this.moveKey(key, currentBucket, previousBucket);
    }

    getMaxKey(): string {
        return this.getAnyKey(this.tail.previous);
    }

    getMinKey(): string {
        return this.getAnyKey(this.head.next);
    }

    private insertAfter(
        previousBucket: FrequencyBucket,
        count: number
    ): FrequencyBucket {
        const bucket = new FrequencyBucket(count);
        const nextBucket = previousBucket.next;

        bucket.previous = previousBucket;
        bucket.next = nextBucket;
        previousBucket.next = bucket;
        nextBucket.previous = bucket;

        return bucket;
    }

    private moveKey(
        key: string,
        currentBucket: FrequencyBucket,
        targetBucket: FrequencyBucket
    ): void {
        targetBucket.keys.add(key);
        this.keyBuckets.set(key, targetBucket);
        this.removeKeyFromBucket(key, currentBucket);
    }

    private removeKeyFromBucket(key: string, bucket: FrequencyBucket): void {
        bucket.keys.delete(key);

        if (bucket.keys.size === 0) {
            bucket.previous.next = bucket.next;
            bucket.next.previous = bucket.previous;
        }
    }

    private getAnyKey(bucket: FrequencyBucket): string {
        return bucket.keys.values().next().value ?? "";
    }
}
```

## Complexity

- **Time O(1) average per operation:** `Map` and `Set` operations are average constant time, and each linked-list update touches a fixed number of pointers.
- **Space O(n):** Every live key appears once in the map and once in a bucket set. At most one non-empty bucket exists per distinct count.

## Edge Cases Checklist

- Empty structure
- One key acting as both minimum and maximum
- Several keys tied at the same count
- Moving into an existing frequency bucket
- Creating a missing frequency bucket
- Removing an empty bucket from either end or the middle
- Removing a key when its count reaches zero
- Returning to an empty structure

## Test Coverage

The test suite covers the baseline sequence, empty and single-key states, ties, key removal, bucket creation and deletion, defensive handling of a missing decrement, and a deterministic 50,000-operation case.

## Source

- [LeetCode 432: All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure/)
