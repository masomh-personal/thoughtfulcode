---
title: "When a Class Is the Simplest Design for Stateful Code"
slug: "when-a-class-is-the-simplest-design-for-stateful-code"
datePublished: "2026-08-30"
excerpt: "Functions are a great default, but objects with identity, evolving state, and protected invariants sometimes become clearer when a class owns the whole lifecycle."
tags: ["typescript", "engineering", "methodology"]
---

I prefer functions in TypeScript.

They are easy to test, easy to compose, and honest about what goes in and what comes out. A pure function cannot quietly remember that you called it three minutes ago. That predictability is worth protecting.

But "prefer functions" is a default, not a law.

Sometimes the thing we are modeling has an identity, owns state that changes over time, and must keep several pieces of that state synchronized. In those cases, a class can be the simplest design instead of an object-oriented detour.

## A Class Needs To Earn Its Place

Putting a function inside a class does not make the code better organized.

This is not useful:

```typescript
class PriceCalculator {
    static addTax(price: number, rate: number): number {
        return price * (1 + rate);
    }
}
```

There is no instance, no lifecycle, and no state to protect. The class is acting like a namespace with extra punctuation.

A plain function says the same thing more directly:

```typescript
function addTax(price: number, rate: number): number {
    return price * (1 + rate);
}
```

The class starts earning its keep when three conditions show up together:

1. The object has a meaningful identity.
2. Its state evolves across multiple operations.
3. Those operations must preserve shared invariants.

One condition alone usually is not enough. All three together are a strong signal.

## Identity Changes The Question

Consider a rate limiter. We are not only calculating whether one request is allowed. We are asking a specific limiter instance what it knows about requests it has already observed.

The same is true for a queue, cache, parser cursor, database transaction, game entity, or open connection. Two instances can receive the same operation and return different answers because their histories differ.

That is not accidental impurity. History is part of the model.

## The Real Benefit Is Protecting Invariants

Mutable state is not automatically bad. Uncontrolled mutable state is the problem.

This became obvious while implementing the [All O`one Data Structure](/problems/all-oone-data-structure). It tracks string frequencies and must increment, decrement, and return minimum or maximum keys in average constant time.

The implementation combines:

- A map from each key to its frequency bucket.
- A doubly linked list that keeps buckets ordered by count.
- A set of keys inside each bucket.
- Sentinel nodes at both ends of the list.

Those pieces cannot drift independently.

Every live key must appear in exactly one bucket. The map must point to that same bucket. Buckets must stay ordered and non-empty. The head and tail links must remain valid after insertion and removal.

Exposing those collections and passing them through a group of unrelated functions would not make the design more functional. It would make every caller capable of breaking half the structure while leaving the other half looking valid.

The class creates one mutation boundary:

```typescript
const counts = new AllOne();

counts.inc("typescript");
counts.inc("typescript");
counts.inc("javascript");

counts.getMaxKey(); // "typescript"
```

Callers can request a valid transition. They cannot edit a pointer, forget to update the map, or leave an empty frequency bucket behind.

That is encapsulation doing practical work.

## A Class Does Not Require Inheritance

Classes often get blamed for the inheritance trees people build with them. Fair enough, but inheritance is optional. The useful part here is much smaller:

- One instance owns one stateful lifecycle.
- Public methods describe allowed operations.
- Private methods keep mutation mechanics local.
- Internal fields cannot be changed by callers.

The `AllOne` class does not need a base class, abstract factory, or interface with one implementation. It composes maps, sets, and linked buckets behind a constructor and four public operations.

## Closures Are Still A Real Alternative

You could build a private stateful API with a factory function:

```typescript
function createCounter() {
    const counts = new Map<string, number>();

    return {
        increment(key: string) {
            counts.set(key, (counts.get(key) ?? 0) + 1);
        },
    };
}
```

This is a good design for a small API. I switch toward a class when the factory starts returning many methods that coordinate a larger internal graph. Constructor initialization, private fields, and named methods then communicate the lifecycle better.

## Warning Signs That A Class Is Just Ceremony

I pause when I see:

- A class with only static methods.
- A constructor that merely copies arguments into public fields.
- Methods that never use instance state.
- One implementation hidden behind an interface created "for later."
- Inheritance used only to share a few helper functions.
- A service object passed everywhere even though every method is pure.

These designs often want functions, plain objects, or a small module. A useful stateful class should make ownership obvious. If callers constantly read internal fields or perform half an operation themselves, the boundary is not protecting much.

## A Checklist I Use

Before introducing a class, I ask:

- Does each instance represent one identifiable thing?
- Does its history affect future behavior?
- Must several fields change together to remain valid?
- Can the public methods express every allowed state transition?
- Would a closure be simpler at this size?
- Am I reaching for inheritance when composition would be clearer?

If the answers point to identity, lifecycle, and invariants, a class is probably honest. If the class only groups names together, I delete it and keep the functions.

## Wrap Up

Functions remain my default because most code transforms values or handles one request at a time. Those jobs benefit from explicit inputs and minimal hidden state.

Some code is different. A cache remembers. A queue changes. A linked structure protects relationships that callers should never edit independently.

In those cases, a class is not overengineering. It is a small wall around state that needs an owner.

Use functions until the model proves it has identity, evolving state, and invariants worth protecting. Then let a class earn its place.

## Further Reading

- [TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [LeetCode 432: All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure/)
