/**
 * LRU Cache
 * Difficulty: Medium
 * Topics: Design, Hash Table, Linked List, Doubly-Linked List
 *
 * Time: O(1) per operation
 * Space: O(capacity)
 *
 * Serve a fixed-capacity cache in constant time and evict the least
 * recently used key when it overflows.
 */
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
