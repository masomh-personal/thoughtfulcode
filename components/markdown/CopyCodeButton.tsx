"use client";

import { useCallback, useState } from "react";
import { HiCheck, HiClipboard } from "react-icons/hi";

interface CopyCodeButtonProps {
    code: string;
    language?: string;
}

export function CopyCodeButton({ code, language }: CopyCodeButtonProps) {
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
        "idle"
    );

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopyStatus("copied");
        } catch {
            setCopyStatus("failed");
        }

        setTimeout(() => setCopyStatus("idle"), 2000);
    }, [code]);
    const ariaLabel =
        copyStatus === "copied"
            ? "Copied"
            : copyStatus === "failed"
              ? "Copy failed, try again"
              : "Copy code";
    // The label alone changes silently for screen readers, so mirror the
    // result into a live region.
    const statusMessage =
        copyStatus === "copied"
            ? "Code copied to clipboard"
            : copyStatus === "failed"
              ? "Copy failed, try again"
              : "";

    return (
        <>
            <button
                type="button"
                onClick={handleCopy}
                aria-label={ariaLabel}
                className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 text-slate-400 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu hover:scale-105 hover:border-primary/40 hover:bg-primary/10 hover:text-primary-hover active:scale-90 active:duration-150 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
                {language ? (
                    <span className="font-mono text-[0.7rem] tracking-wide select-none">
                        {language}
                    </span>
                ) : null}
                {copyStatus === "copied" ? (
                    <HiCheck className="h-3.5 w-3.5 text-green-400" />
                ) : (
                    <HiClipboard
                        className={
                            copyStatus === "failed"
                                ? "h-3.5 w-3.5 text-red-300"
                                : "h-3.5 w-3.5"
                        }
                    />
                )}
            </button>
            <span role="status" aria-live="polite" className="sr-only">
                {statusMessage}
            </span>
        </>
    );
}
