# TypeScript Conventions

Practical TypeScript conventions for this project. Keep this document lightweight and use it as a quick reference while coding.

---

## Core Rule

- Use `interface` for object-shaped contracts (especially component props)
- Use `type` for unions, aliases, mapped/conditional helper types

This gives us readable component APIs plus flexible type composition.

---

## Tooling

- `bun run type-check` and `bun run type-check:tests` both run TypeScript 7 through `tsc --noEmit`.
- TypeScript 7 is installed as `@typescript/native`, an npm alias for `typescript@7`. The scripts call its binary by path (`./node_modules/@typescript/native/bin/tsc`) because TypeScript 6 ships a competing `tsc` binary, and which one wins the `node_modules/.bin` link depends on install order.
- The `typescript` package stays pinned to 6.x. TypeScript 7 does not ship a programmatic API yet, and `next build` loads `typescript/lib/typescript.js` to run its own type check. Removing TypeScript 6 breaks the build.
- Do not alias `typescript` to `@typescript/typescript6`. Bun applies the alias to that package's own nested `typescript` dependency, so it resolves to itself and exports nothing.
- For editor support in Cursor or VS Code, install the TypeScript 7 extension. The Native Preview extension and its `typescript.experimental.useTsgo` setting are obsolete.
- Once TypeScript 7.1 ships the new API and Next.js adopts it, drop the alias and the 6.x pin and install `typescript@7` directly.

---

## Quick Decision Guide

- **Component props object?** -> `interface`
- **String union / variant union?** -> `type`
- **Alias for primitive/tuple/function?** -> `type`
- **Need declaration merging (library authoring)?** -> `interface`
- **Unsure?** -> use readability first, then consistency with nearby code

---

## Common Patterns

### 1) Props Interface + Variant Type

```ts
type BadgeColor = "primary" | "secondary" | "tertiary" | "default";

interface BadgeProps extends React.ComponentProps<"span"> {
    color?: BadgeColor;
    size?: "sm" | "md" | "lg";
}
```

### 2) DOM Wrapper Props with `ComponentProps`

Prefer this for wrappers around native HTML elements:

```ts
interface ButtonProps extends React.ComponentProps<"button"> {
    variant?: "primary" | "secondary";
}
```

When you need to reshape props:

```ts
interface LinkButtonProps extends Omit<
    React.ComponentProps<"button">,
    "children"
> {
    href?: string;
    children?: React.ReactNode;
}
```

### 3) Type-Safe Variant Maps with `as const`

```ts
const variantClasses = {
    primary: "bg-sky-500",
    secondary: "bg-slate-800",
    outline: "border border-slate-500",
} as const;

type Variant = keyof typeof variantClasses;
```

Use `as const` when you want exact literal keys/values and readonly behavior at type level.

### 4) Discriminated Union for State

```ts
type FetchState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: T };
```

Great for UI state where each branch has different fields.

### 5) Utility Type Example

```ts
type WithId<T> = T & { id: string };
```

Use utility aliases when they improve reuse and readability.

---

## `interface` vs `type` Notes

- Both can model object shapes
- `type` is more flexible for unions/composition
- `interface` is excellent for named object contracts and can be merged
- Prefer consistency over dogma

Project standard: **interface for props, type for unions/helpers**.

---

## Anti-Patterns to Avoid

- Using `any` unless absolutely unavoidable
- Over-abstracting types too early
- Massive nested generic types with poor readability
- Mixing conventions randomly in the same module

---

## Review Checklist

Before committing:

- Is props typing an `interface`?
- Are variants/unions modeled as `type`?
- Are DOM wrappers using `ComponentProps<"...">` or a clear equivalent?
- Are helper types named clearly and scoped to actual need?
- Is the code easier to read with these types than without them?
