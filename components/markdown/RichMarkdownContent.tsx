/**
 * Rich Markdown Content Renderer
 * Renders markdown content with syntax highlighting via highlight.js.
 * highlight.js has no dynamic imports or WASM, so it works cleanly with
 * Next.js Turbopack and Bun without module aliasing issues.
 */

import bash from "highlight.js/lib/languages/bash";
import http from "highlight.js/lib/languages/http";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import { MarkdownAsync } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

interface RichMarkdownContentProps {
    content: string;
}

const markdownComponents = {
    pre: CodeBlock,
} as const;

/**
 * Registering languages explicitly keeps the default set of 37 out of the
 * bundle. Aliases such as `ts` come from the language definitions themselves.
 * `content:check` fails on fences using a language that is not listed here, so
 * adding one is a deliberate step rather than a silent loss of highlighting.
 */
const highlightLanguages = {
    bash,
    http,
    javascript,
    json,
    typescript,
} as const;

export async function RichMarkdownContent({
    content,
}: RichMarkdownContentProps): Promise<React.ReactElement> {
    return (
        <div className="prose prose-invert prose-content max-w-none">
            <MarkdownAsync
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    [rehypeHighlight, { languages: highlightLanguages }],
                ]}
            >
                {content}
            </MarkdownAsync>
        </div>
    );
}
