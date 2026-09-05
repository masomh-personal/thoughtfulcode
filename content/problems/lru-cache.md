---
title: "LRU Cache"
slug: "lru-cache"
source: "leetcode"
difficulty: "medium"
datePublished: "2026-09-05"
timeComplexity: "O(1)"
spaceComplexity: "O(capacity)"
excerpt: "Design a fixed-capacity cache with constant-time reads and writes that evicts the least recently used key once it runs out of room."
---

# Problem

Design an `LRUCache` class that holds at most `capacity` key-value pairs and supports both operations in `O(1)` time:

- `get(key)` returns the stored value, or `-1` when the key is absent.
- `put(key, value)` inserts or overwrites a key. When the cache is already full, it evicts the least recently used key first.

Both `get` and `put` count as a use, so either one makes a key the most recently used.

## Constraints

- `1 <= capacity <= 3000`
- `0 <= key <= 10^4`
- `0 <= value <= 10^5`
- At most `2 * 10^5` calls to `get` and `put`.

## Example

```text
const cache = new LRUCache(2);

cache.put(1, 1);
cache.put(2, 2);
cache.get(1); // 1
cache.put(3, 3); // evicts key 2
cache.get(2); // -1
cache.put(4, 4); // evicts key 1
cache.get(1); // -1
cache.get(3); // 3
cache.get(4); // 4
```

## Why A Map Is Not Enough

A `Map` gives average `O(1)` lookup, which covers `get` and half of `put`. What it does not give is the answer to "which key has gone the longest without being touched."

JavaScript's `Map` does preserve insertion order, and you can lean on that: delete a key and re-insert it to move it to the back, then evict `map.keys().next().value` when you overflow. That solution is short and it works.

I went with the explicit linked list anyway, because the point of this problem is the structure underneath. Relying on insertion order hides the recency list instead of showing it, and every cache you will actually operate in production implements that list on purpose. Tracking recency with a timestamp per entry is the other tempting option, and it fails for a different reason: finding the minimum timestamp means scanning every entry, which turns a constant-time eviction into a linear one.

## Approach

Use two structures that cover each other's weakness:

1. A `Map` from key to node, for constant-time lookup.
2. A doubly linked list ordered by recency, most recent first.

The list is where recency lives. Every access unlinks the node from its current position and relinks it directly after the head, so the node nearest the tail is always the eviction candidate. A doubly linked list matters here because removing a node from the middle needs its predecessor, and a singly linked list would make you walk the list to find one.

Sentinel head and tail nodes remove the special cases. There is no "am I removing the first node" branch and no null checks at the ends, because every real node always has a node on both sides.

```text
Map: { 1 -> nodeA, 2 -> nodeB, 3 -> nodeC }

head <-> nodeC <-> nodeA <-> nodeB <-> tail
        (newest)          (eviction candidate)
```

## Invariants

The implementation rests on four promises:

- The map and the list hold exactly the same set of keys.
- The list stays ordered by recency, newest behind the head.
- Every real node has a valid node on both sides.
- The list never holds more than `capacity` real nodes.

This is the case for putting the whole thing behind a class. Callers can ask for a valid transition, but they cannot relink one pointer, forget the matching map update, and leave a node that is reachable from the list yet invisible to lookup.

## Implementation

```typescript
class CacheNode {
    previous: CacheNode;
    next: CacheNode;

    constructor(
        readonly key: number,
        public value: number
    ) {
        this.previous = this;
        this.next = this;
    }
}

export class LRUCache {
    private readonly nodes = new Map<number, CacheNode>();
    private readonly head = new CacheNode(0, 0);
    private readonly tail = new CacheNode(0, 0);

    constructor(private readonly capacity: number) {
        this.head.next = this.tail;
        this.tail.previous = this.head;
    }

    get(key: number): number {
        const node = this.nodes.get(key);

        if (node === undefined) {
            return -1;
        }

        this.unlink(node);
        this.linkAsMostRecent(node);

        return node.value;
    }

    put(key: number, value: number): void {
        const existing = this.nodes.get(key);

        if (existing !== undefined) {
            existing.value = value;
            this.unlink(existing);
            this.linkAsMostRecent(existing);
            return;
        }

        // A capacity of zero would evict the node we just inserted, so refuse
        // the write outright rather than corrupting the list.
        if (this.capacity < 1) {
            return;
        }

        const node = new CacheNode(key, value);

        this.nodes.set(key, node);
        this.linkAsMostRecent(node);

        if (this.nodes.size > this.capacity) {
            this.evictLeastRecent();
        }
    }

    private linkAsMostRecent(node: CacheNode): void {
        const previousMostRecent = this.head.next;

        node.previous = this.head;
        node.next = previousMostRecent;
        this.head.next = node;
        previousMostRecent.previous = node;
    }

    private unlink(node: CacheNode): void {
        node.previous.next = node.next;
        node.next.previous = node.previous;
    }

    private evictLeastRecent(): void {
        const leastRecent = this.tail.previous;

        this.unlink(leastRecent);
        this.nodes.delete(leastRecent.key);
    }
}
```

Storing the key on the node is what keeps eviction constant time. When you evict from the tail you have a node and need to delete the matching map entry, and without the key on the node you would have to search the map for it.

## Complexity

- **Time O(1):** `Map` get, set, and delete are average constant time, and both link operations touch a fixed number of pointers regardless of how many entries the cache holds.
- **Space O(capacity):** One node and one map entry per live key, and the cache never exceeds its capacity.

## Edge Cases Checklist

- Reading a key that was never stored
- A read that misses, which must not reorder anything
- Capacity of one, where every insert evicts
- Overwriting an existing key, which updates the value and promotes it without changing the size
- Values of `0` and negative values, which must not be mistaken for the `-1` miss signal
- A capacity below one, which the constraints exclude but the class should not corrupt itself over
- Refilling after every original key has been evicted
- A hot key that survives churn far larger than the capacity

## Test Coverage

The suite covers the LeetCode example sequence, promotion on read and on overwrite, a missed read leaving eviction order untouched, interleaved reads and writes evicting in the right order, capacity of one, zero and negative values, the defensive zero-capacity case, a full turnover of keys, and two deterministic stress runs: 50,000 writes into a 1,000-entry cache checked at the eviction boundary, and a repeatedly read key surviving 10,000 competing writes.

## Source

- [LeetCode 146: LRU Cache](https://leetcode.com/problems/lru-cache/)
