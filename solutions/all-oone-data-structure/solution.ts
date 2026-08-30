/**
 * All O`one Data Structure
 * Difficulty: Hard
 * Topics: Design, Hash Table, Linked List
 *
 * Time: O(1) average per operation
 * Space: O(n)
 *
 * Track string frequencies with constant-time updates and min/max lookup.
 */
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
