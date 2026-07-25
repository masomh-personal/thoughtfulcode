import { FaTag } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import { cn } from "@/lib/utils";

export interface TagFilterOption {
    /** Raw tag value used as the key and passed back to handlers. */
    value: string;
    /** Display label (e.g. uppercased, formatted). */
    label: string;
    /** Foreground hex color for border and text. */
    color: string;
    /** Background hex color (semi-transparent). */
    bgColor: string;
}

interface TagFilterBarProps {
    tags: TagFilterOption[];
    activeTags: string[];
    onTagToggle: (tag: string) => void;
    onClearAll: () => void;
}

/**
 * Generic tag filter bar. Renders a row of toggleable tag pills.
 * Callers are responsible for resolving tag presentation (label/color) before passing `tags`.
 */
export function TagFilterBar({
    tags,
    activeTags,
    onTagToggle,
    onClearAll,
}: TagFilterBarProps) {
    if (tags.length === 0) {
        return null;
    }

    const hasActiveTags = activeTags.length > 0;

    return (
        <div className="mb-4">
            <div className="surface-card radius-card w-full px-4 py-3">
                <div className="mb-2.5 flex items-center gap-2.5">
                    <span className="text-content-subtle font-mono text-[0.65rem] uppercase tracking-widest">
                        Filter by tag
                    </span>
                    <button
                        type="button"
                        onClick={onClearAll}
                        inert={hasActiveTags ? undefined : true}
                        className={cn(
                            "text-content-subtle hover:text-content inline-flex min-h-8 cursor-pointer items-center gap-1 rounded border border-surface-outline/50 bg-surface-outline/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide transition-all duration-150 hover:border-surface-outline hover:bg-surface-outline/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                            !hasActiveTags && "invisible"
                        )}
                    >
                        <HiX aria-hidden="true" className="h-2.5 w-2.5" />
                        Clear all
                    </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {tags.map(({ value, label, color, bgColor }) => {
                        const isActive = activeTags.includes(value);

                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onTagToggle(value)}
                                aria-pressed={isActive}
                                aria-label={`Filter by ${label}`}
                                className={cn(
                                    "inline-flex min-h-8 cursor-pointer items-center gap-[0.28rem] rounded-md border px-3 py-1.5 font-baloo text-[0.6875rem] font-semibold leading-none uppercase tracking-[0.03em] whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                                    isActive
                                        ? "opacity-100 shadow-sm"
                                        : hasActiveTags
                                          ? "opacity-50 hover:opacity-70"
                                          : "opacity-100 hover:opacity-70"
                                )}
                                style={{
                                    borderColor: color,
                                    color: color,
                                    backgroundColor: bgColor,
                                    outline: isActive
                                        ? `2px solid ${color}`
                                        : undefined,
                                    outlineOffset: isActive ? "2px" : undefined,
                                }}
                            >
                                <FaTag
                                    aria-hidden="true"
                                    className="h-2.75 w-2.75 shrink-0"
                                />
                                {label}
                                {isActive && (
                                    <HiX
                                        aria-hidden="true"
                                        className="ml-0.5 h-3 w-3 shrink-0"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
