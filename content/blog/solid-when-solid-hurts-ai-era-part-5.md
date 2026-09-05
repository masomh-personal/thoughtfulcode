---
title: "SOLID in the AI Era (Part 5): When SOLID Makes Things Worse"
slug: "solid-when-solid-hurts-ai-era-part-5"
datePublished: "2026-09-05"
excerpt: "Four parts on applying SOLID, and now the other half: interfaces with one implementation, strategies for variation that never came, and how to tell earned abstraction from abstraction tax."
tags: ["engineering", "ai", "solid"]
---

Parts 1 through 4 covered SRP, OCP, LSP, ISP, and DIP, and I stand by all of it.

But here's the thing. In the last few years, almost none of the painful code I've reviewed was painful because someone ignored SOLID. It was painful because someone applied it to a problem that hadn't asked for it yet.

So this part is the other half of the series. Not "SOLID is bad," but "abstraction is a loan, and you should know the interest rate before you sign."

## Abstraction Is Not Free

Every seam you add costs something real:

- A reader has to jump through one more file to answer "what actually runs here?"
- A change now touches a contract, an implementation, and a wiring point instead of one function.
- Your test suite grows doubles that assert your mocks work, not that your code works.
- New teammates learn your indirection before they learn your domain.

None of that is a reason to avoid abstraction. It's a reason to make abstraction pay for itself. The problem isn't the seam. It's the seam that was never asked for and now can't be removed without a refactor nobody has time to schedule.

## The Interface With Exactly One Implementation

This is the classic. You have a `UserRepository` interface, and exactly one `PostgresUserRepository` behind it, and there has never been a serious plan for a second one.

Ask what the interface is buying you. Usually one of three answers:

1. "It's for testing." Fair, sometimes. But if you're on Bun or Vitest and can already stub the module, you paid for a contract to get something the test runner gives you for free.
2. "We might swap databases." You won't. And if you somehow do, that migration will break far more than one interface, and you'll redesign the boundary then anyway with actual knowledge of the new system.
3. "It's cleaner." That's not an answer, that's a vibe.

The honest version is usually: import the concrete thing, and extract the interface the day a second implementation shows up. Extracting an interface from working code is a mechanical refactor. Deleting a bad abstraction that six modules already depend on is not.

## Strategy Patterns For Variation That Never Arrived

I've written this handler map. You probably have too:

```typescript
const exportHandlers = {
    csv: exportCsv,
    json: exportJson,
    xlsx: exportXlsx,
} as const;
```

That one's fine, because three real formats exist today. OCP is doing honest work.

The failure mode looks almost identical:

```typescript
const exportHandlers = {
    csv: exportCsv,
} as const;
```

One entry, a registry, a lookup, and a comment about how easy it will be to add more later. Meanwhile the caller does `exportHandlers[format]` and a reader has to trace two hops to discover the only thing that ever happens is CSV.

An `if` statement would have been more honest, and would have been easier to convert into the map on the day format number two landed.

## The Port Around A Dependency You Will Never Swap

DIP says point your policy at abstractions. It does not say wrap every package you install.

I've seen a `Clock` port around `Date.now()`, a `Logger` port around `console`, an `IdGenerator` port around `crypto.randomUUID()`. Sometimes those earn it. A clock port is genuinely useful if you test time-dependent logic a lot. But if you wrote the port, wrote the adapter, wrote the fake, and then used it in one test, you built infrastructure to solve a problem that a single injected parameter would have handled.

The tell is when the abstraction has no second shape it could take. A `MessageSender` from Part 4 has obvious second shapes: email, SMS, push. That's real variation. `Clock` has one shape and one fake.

## Why AI Tips This The Wrong Way

Here's what actually changed. Abstraction used to be self-limiting because it was tedious. Writing a port, an adapter, an interface, and a factory was enough typing that you'd stop and ask whether you needed it.

That friction is gone. Ask a model for "a clean, SOLID-compliant service layer" and you'll get one, complete with interfaces, dependency injection, and a folder structure that looks like it came out of a textbook. It'll be internally consistent and genuinely well-formed. It will also cheerfully generate five layers for a feature that needed one function, because you asked for SOLID and it gave you SOLID.

The cost didn't disappear. It moved. You don't pay at authoring time anymore, you pay at review time, at onboarding time, and six months later when the abstraction turns out to be shaped wrong for the change you actually need.

Which means the judgment call, "does this seam earn its keep," is now the part you have to supply. The typing was never the hard bit.

## The Counter-Example: Abstraction That Earns It

To be clear about where the line sits, the [All O`one Data Structure](/problems/all-oone-data-structure) is a class wrapping a map, a doubly linked list, and a set of keys per bucket. That's a real boundary, and I'd defend it hard.

Not because classes are good design. Because four invariants span those structures, and any caller with direct access could update half of them and leave the rest looking valid. The encapsulation prevents a specific bug you can name.

That's the test. Can you name what breaks without the abstraction? `UserRepository` usually can't answer that. `AllOne` answers it in one sentence.

## Common Misunderstandings

- **Myth:** "Adding the interface now saves time later."
  **Reality:** Extracting an interface later is a safe mechanical refactor. Guessing the wrong shape now is not.

- **Myth:** "If it's testable, the abstraction is justified."
  **Reality:** Modern runners let you stub modules directly. Only build a seam when the test pain is real and current.

- **Myth:** "Senior engineers add abstraction."
  **Reality:** Senior engineers add abstraction reluctantly, and remove it when it stops paying.

## A Checklist Before You Add A Seam

1. Can I name a second implementation that actually exists or is scheduled?
2. Can I name the bug this boundary prevents?
3. Has this code changed for this reason at least twice already?
4. If I delete the abstraction, does anything get harder, or just less symmetrical?
5. Is the contract shaped by real requirements, or by what felt tidy?

If most answers are weak, write the direct version. The refactor stays cheap while the code is still small.

## Wrap Up

The full series lands on one idea: SOLID is a response to change pressure, not a checklist you satisfy up front.

- Apply it where change has actually happened or is clearly coming.
- Skip it where you're guessing, and keep the code easy to change instead.
- Delete abstractions that stopped paying rent.

Generation speed makes both mistakes cheap to commit and expensive to live with. Underabstracted code is annoying and fixable. Overabstracted code is comfortable, looks professional, and quietly makes every future change cost more.

Write the simple thing. Let the second real requirement tell you where the seam goes.

## Further Reading

- [SOLID in the AI Era (Part 1): SRP](/blog/solid-srp-ai-era-part-1)
- [SOLID in the AI Era (Part 4): ISP and DIP](/blog/solid-isp-dip-ai-era-part-4)
- [When a Class Is the Simplest Design for Stateful Code](/blog/when-a-class-is-the-simplest-design-for-stateful-code)
