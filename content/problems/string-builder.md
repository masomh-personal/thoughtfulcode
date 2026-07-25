---
title: "String Builder"
slug: "string-builder"
source: "custom"
difficulty: "medium"
datePublished: "2026-05-23"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
excerpt: "A class that builds strings efficiently by accumulating chunks in an array and joining once. Avoids the O(n²) cost of repeated string concatenation in a loop."
---

# Problem

Implement a `StringBuilder` class in TypeScript that builds strings efficiently by buffering chunks and materializing the result only when needed.

The class must support the following API:

- `append(value: string): this` — adds a string to the end of the buffer
- `prepend(value: string): this` — adds a string to the front of the buffer
- `clear(): this` — resets the builder to an empty state
- `get length(): number` — returns the total character count without materializing
- `toString(): string` — returns the final assembled string

Mutating methods (`append`, `prepend`, `clear`) must return `this` to support method chaining.

## Why This Matters

Strings in JavaScript are immutable. Every time you write `str += chunk`, the engine allocates a new string, copies all the existing characters, and appends the new ones. In a loop over `n` chunks, that is `1 + 2 + 3 + ... + n` character copies — O(n²) total work.

A `StringBuilder` avoids this by keeping chunks in a mutable array buffer. Each `append` is an O(1) array push. The O(n) cost of assembling the final string is paid once, at the end, when `toString()` calls `.join("")`.

## Constraints

- `value` passed to `append` and `prepend` is always a valid string (including empty string `""`)
- `length` must be O(1), not computed on each call
- `toString()` must return an empty string when the builder is empty
- Mutating methods must return `this` for chaining
- Internal buffer must be private

## Examples

```typescript
const sb = new StringBuilder();
sb.append("Hello").append(", ").append("world");
sb.toString(); // "Hello, world"
sb.length; // 12

sb.prepend(">> ");
sb.toString(); // ">> Hello, world"
sb.length; // 15

sb.clear();
sb.toString(); // ""
sb.length; // 0
```

## Edge Cases Checklist

- Appending an empty string (`""`) should not change `length`
- `toString()` on a fresh builder returns `""`
- `length` is accurate after a mix of `append` and `prepend` calls
- `clear()` followed by `append` works correctly
- Method chaining returns the same instance reference
- Prepending to an empty builder works the same as appending

## Design Notes

**Why `length` is tracked separately and not `_buffer.length`**

`_buffer.length` counts the number of chunks in the array, not the number of characters. A single call to `append("Hello, world")` adds one element to the buffer but twelve characters to the string. Using `_buffer.length` as the `length` getter would return the chunk count, which is meaningless to callers.

Computing the real character count on demand would require summing `chunk.length` across every element — O(n) per call. Tracking it incrementally in `append`, `prepend`, and `clear` keeps the getter O(1).

**The prepend tradeoff**

`prepend` uses `Array.unshift`, which is O(n) because it shifts every existing element one position forward. If prepending in a tight loop is a requirement, a more suitable structure would maintain two arrays (one for front chunks, one for back) and reverse the front half during `toString`. For the scope of this implementation, `prepend` is included as a convenience with the O(n) cost documented.

**Why `join("")` not concatenation in `toString`**

`join("")` is a single allocation. It knows the total size of all chunks upfront and writes them into one contiguous buffer. A naive `reduce` with `+` inside `toString` would recreate the same O(n²) problem we are trying to avoid.

## Approach

1. Store a private `_buffer: string[]` to hold chunks without allocating a new string on each operation.
2. Track `_length: number` separately so the `length` getter is always O(1).
3. `append` pushes to the end of the buffer and increments `_length`.
4. `prepend` unshifts to the front of the buffer and increments `_length`.
5. `clear` reassigns both `_buffer` and `_length` to their zero states.
6. `toString` calls `this._buffer.join("")` — one allocation, one pass.
7. All mutating methods return `this` to enable chaining.

Complexity:

- `append`: O(1) amortized
- `prepend`: O(n) — shifts existing buffer elements
- `clear`: O(1)
- `length`: O(1)
- `toString`: O(n)
- Space: O(n) for the buffer

## Implementation

```typescript
export class StringBuilder {
    private _buffer: string[];
    private _length: number;

    constructor() {
        this._buffer = [];
        this._length = 0;
    }

    /**
     * Appends a string to the end of the buffer. O(1) amortized.
     */
    append(value: string): this {
        this._buffer.push(value);
        this._length += value.length;
        return this;
    }

    /**
     * Prepends a string to the front of the buffer.
     * O(n) due to array unshift — avoid in hot loops.
     */
    prepend(value: string): this {
        this._buffer.unshift(value);
        this._length += value.length;
        return this;
    }

    /**
     * Resets the buffer and length counter. O(1).
     */
    clear(): this {
        this._buffer = [];
        this._length = 0;
        return this;
    }

    /**
     * Total character count across all buffered chunks. O(1).
     * Note: _buffer.length is the number of chunks, not characters.
     * A chunk like "Hello, world" counts as 1 element but 12 characters.
     */
    get length(): number {
        return this._length;
    }

    /**
     * Materializes the buffer into a single string. O(n).
     * This is the only allocation that pays the full O(n) cost.
     */
    toString(): string {
        return this._buffer.join("");
    }
}
```

## Test Coverage

The test suite covers:

- Empty builder returns `""` and `length` of `0`
- Single `append` produces correct string and length
- Multiple chained `append` calls produce correct result
- `prepend` adds to the front correctly
- Mixed `append` and `prepend` calls produce correct ordering
- Appending empty string does not change `length` or output
- `clear()` resets both `toString()` and `length`
- `clear()` followed by new `append` works correctly
- Method chaining returns the same instance
- `length` stays accurate through all operations
- Large deterministic input check for correctness
