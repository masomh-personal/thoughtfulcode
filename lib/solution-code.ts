/**
 * Helpers for keeping a published problem post and its tested solution in sync.
 *
 * `solutions/<slug>/solution.ts` is the implementation the test suite runs, and
 * the post shows that same code in a fenced block. Both the publish script and
 * the content check need one shared notion of "the code" to compare.
 */

const TYPESCRIPT_FENCE = /^```(?:typescript|ts)\s*$\n([\s\S]*?)^```\s*$/gm;

/**
 * Drops the leading JSDoc block that documents the exported function, so the
 * published fence starts at the implementation itself.
 */
export function stripSolutionHeaderComment(source: string): string {
    const trimmed = source.trimStart();

    // Only a comment that opens the file is a header. Scanning for the first
    // block comment anywhere would swallow the code above a method's JSDoc.
    if (!trimmed.startsWith("/**")) {
        return source.trim();
    }

    const commentEnd = trimmed.indexOf("*/");

    if (commentEnd === -1) {
        return source.trim();
    }

    return trimmed.slice(commentEnd + 2).trim();
}

/**
 * Every TypeScript fence in a post.
 *
 * Posts are free to show extra snippets (a naive first pass, a helper), and
 * heading structure varies, so the contract is only that the tested
 * implementation appears verbatim in one of them.
 */
export function findTypeScriptFences(markdown: string): string[] {
    const fences: string[] = [];

    for (const match of markdown.matchAll(TYPESCRIPT_FENCE)) {
        const body = match[1]?.trim();

        if (body) {
            fences.push(body);
        }
    }

    return fences;
}
