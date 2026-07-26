---
title: "Parse, Don't Validate: Making Illegal States Unrepresentable"
slug: "parse-dont-validate-illegal-states"
datePublished: "2026-07-26"
excerpt: "Validation checks a value and throws the knowledge away. Parsing turns unknown input into a type the rest of your code can trust."
tags: ["typescript", "engineering", "ai"]
---

You've seen this function. Maybe you wrote it.

```typescript
function sendWelcomeEmail(user: User) {
    if (!user.email) {
        throw new Error("User has no email");
    }

    mailer.send(user.email, welcomeTemplate);
}
```

It's fine. It works. The problem is that three layers up, someone already checked `user.email`, and two layers down, someone will check it again. The same question gets asked over and over because no single answer sticks.

That repetition isn't a discipline problem. It's a type problem.

## Validating Throws Away What You Learned

A validator answers a yes-or-no question and then forgets it:

```typescript
function isValidUser(input: unknown): boolean {
    return (
        typeof input === "object" &&
        input !== null &&
        "email" in input &&
        typeof input.email === "string"
    );
}
```

Call it and you get `true`. Great, but `true` isn't a value you can pass around. The thing you actually wanted, a user with a guaranteed email, is still sitting there typed as `unknown` or, worse, as some optimistic interface that lies about reality.

A parser answers the same question but hands back proof:

```typescript
function parseUser(input: unknown): User {
    // runtime checks here
    return input as User; // more on this cast in a moment
}
```

Same work at runtime. Completely different consequences. `isValidUser` produces a fact that evaporates. `parseUser` produces a value whose type carries the fact forward, and the compiler enforces it everywhere that value travels.

That's the whole idea, and Alexis King named it well back in 2019: parse, don't validate.

## This Blog Already Does It

The frontmatter loader on this site is a small, real example. Every post starts life as untrusted text on disk. `lib/schemas.ts` turns it into something typed:

```typescript
export const BlogFrontmatterSchema = v.object({
    title: v.pipe(v.string(), v.minLength(1, "Title is required")),
    slug: v.pipe(v.string(), v.regex(/^[a-z0-9-]+$/)),
    datePublished: v.pipe(v.string(), v.isoDate()),
    excerpt: v.pipe(v.string(), v.maxLength(200)),
});

export type BlogFrontmatter = v.InferOutput<typeof BlogFrontmatterSchema>;

export function validateBlogFrontmatter(data: unknown): BlogFrontmatter {
    return v.parse(BlogFrontmatterSchema, data);
}
```

The signature is the interesting part: `unknown` goes in, `BlogFrontmatter` comes out. One function at one boundary. After that, nothing downstream re-checks whether `slug` is a string or whether `excerpt` fits in the card layout, because a `BlogFrontmatter` that failed those rules can't exist.

I'll admit the name is wrong. It's called `validateBlogFrontmatter` and it parses. Naming is hard, and I picked that one before I'd thought about the distinction carefully.

## The Cast Is Where People Cheat

Back to that `as User` I glossed over. TypeScript types vanish at runtime, so a cast is just you telling the compiler to stop asking questions. If the runtime checks above it are wrong or incomplete, you've built a parser that launders bad data into a trusted type. That's worse than no parser, because now everyone downstream believes you.

This is why schema libraries earn their place at the boundary. Valibot, Zod, and friends derive the type from the runtime checks instead of asking you to keep two things in sync by hand. One definition, two outputs. When the schema changes, the type changes, and the compiler goes and finds every call site for you.

Hand-rolled type guards are fine for small shapes. Just make sure the guard and the type can't drift apart.

## Illegal States You Can't Even Type

Parsing at the edge handles untrusted input. The same instinct applies to state you own.

Here's a shape most React codebases have somewhere:

```typescript
interface RequestState {
    isLoading: boolean;
    error: Error | null;
    data: User | null;
}
```

Three independent fields, eight combinations, and maybe three of them are real. What does it mean to be loading with both an error and data? Nothing. But the type allows it, so somewhere in your component you're writing defensive branches for a state that should never exist.

A discriminated union just deletes the impossible ones:

```typescript
type RequestState =
    | { status: "loading" }
    | { status: "error"; error: Error }
    | { status: "success"; data: User };
```

Now `data` only exists when the request succeeded. Not "is probably there," not "we checked earlier." It exists in that branch and nowhere else, and TypeScript will tell you if you forget to handle a case. The null checks don't get moved, they stop being necessary.

## When The Shape Isn't Enough

Sometimes two values have identical types and completely different meanings:

```typescript
function transfer(fromAccount: string, toAccount: string, userId: string) {}
```

Nothing stops a caller from passing those in the wrong order. Branded types close the gap:

```typescript
type AccountId = string & { readonly __brand: "AccountId" };
type UserId = string & { readonly __brand: "UserId" };
```

Now the compiler catches the swap, and the only way to produce an `AccountId` is through the function that parses one.

I'd use this sparingly. Branding every string in your codebase is the overengineering version of this idea, and it makes ordinary code noisy for no benefit. Reach for it when mixing two values up would cause real damage, like moving money to the wrong place. For most primitives, plain types are honest enough.

## Why This Matters More Now

An agent will happily write that `if (!user.email) throw` guard. It's plausible, it's local, it passes the test you asked for, and it'll write another one in the next handler. Guards are easy to generate because they don't require knowing anything about the rest of the system.

Type design is different. Deciding that `RequestState` is a union, or that frontmatter gets parsed once at the file boundary, is a decision about the whole system that then constrains every piece of code written afterward, including the code you didn't write yourself. It's one of the few forms of intent that survives regeneration, because the compiler keeps enforcing it whether or not the next prompt mentions it.

Put another way: reviewing thirty generated null checks is exhausting. Reviewing one type definition that makes them unnecessary is a two-minute job.

## A Checklist I Use

- Does this function take `unknown` and return something specific, or return a boolean?
- Where is the boundary? HTTP handlers, file reads, `JSON.parse`, environment variables, third-party responses.
- Can the core logic be written so untrusted types never reach it?
- Are there fields that only make sense together? Union them.
- Is there a cast pretending to be a parser?
- Am I branding this because it prevents a real bug, or because it feels rigorous?

## Wrap Up

Validation asks a question. Parsing answers it once and gives you something to hold onto.

Push the check to the boundary, return a type that carries the guarantee, and let the compiler do the enforcing everywhere else. The runtime work is the same. What changes is how much of your codebase has to stay suspicious.

The null check you delete is nice. The null check that was never needed is better.

## Further Reading

- [Alexis King: Parse, Don't Validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
- [Valibot documentation](https://valibot.dev/)
- [TypeScript Handbook: Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
