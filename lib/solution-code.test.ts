import { describe, expect, test } from "bun:test";
import {
    findTypeScriptFences,
    stripSolutionHeaderComment,
} from "./solution-code";

describe("stripSolutionHeaderComment", () => {
    test("removes a leading JSDoc header", () => {
        const source = `/**
 * Two Sum
 */
export function twoSum(): number[] {
    return [];
}`;

        const expected = `export function twoSum(): number[] {
    return [];
}`;
        const result = stripSolutionHeaderComment(source);

        expect(result).toBe(expected);
    });

    test("keeps code intact when the file opens with code", () => {
        const source = `export class StringBuilder {
    /**
     * Appends a chunk.
     */
    append(value: string): void {}
}`;

        const expected = source;
        const result = stripSolutionHeaderComment(source);

        expect(result).toBe(expected);
    });

    test("keeps an unterminated comment rather than dropping the file", () => {
        const source = `/**
 * Never closed
export function broken(): void {}`;

        const expected = source.trim();
        const result = stripSolutionHeaderComment(source);

        expect(result).toBe(expected);
    });

    test("returns an empty string for an empty file", () => {
        const expected = "";
        const result = stripSolutionHeaderComment("   \n  ");

        expect(result).toBe(expected);
    });
});

describe("findTypeScriptFences", () => {
    test("collects both typescript and ts fences", () => {
        const markdown = [
            "# Post",
            "```typescript",
            "const a = 1;",
            "```",
            "prose",
            "```ts",
            "const b = 2;",
            "```",
        ].join("\n");

        const expected = ["const a = 1;", "const b = 2;"];
        const result = findTypeScriptFences(markdown);

        expect(result).toEqual(expected);
    });

    test("ignores fences in other languages", () => {
        const markdown = ["```bash", "bun test", "```"].join("\n");

        const expected: string[] = [];
        const result = findTypeScriptFences(markdown);

        expect(result).toEqual(expected);
    });

    test("returns an empty array when the post has no code", () => {
        const expected: string[] = [];
        const result = findTypeScriptFences("Just prose.");

        expect(result).toEqual(expected);
    });
});
