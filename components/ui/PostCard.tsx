import Link from "next/link";
import type { ReactNode } from "react";
import { NavigationOverlay } from "@/components/layout/NavigationOverlay";
import { cn } from "@/lib/utils";
import { formatPublishedDate } from "@/lib/date";

interface PostCardProps {
    href: string;
    /** Small icon shown beside the published date. */
    icon: ReactNode;
    datePublished: string;
    title: string;
    excerpt: string;
    /** Shown when a click starts navigating, from inside the link. */
    overlayMessage: string;
    /** Optional right-aligned slot in the meta row, such as a difficulty badge. */
    headerTrailing?: ReactNode;
    /** Optional block above the call to action, such as tag badges. */
    footer?: ReactNode;
    /** Call-to-action content, for example "Read Post" with an arrow. */
    action: ReactNode;
    /**
     * Problem titles reserve two lines so cards line up across the grid. Blog
     * titles do not, because their length varies far more.
     */
    titleClassName?: string;
}

/**
 * Shared shell for the blog and problem list cards: an entire card that is one
 * link, with a meta row, title, excerpt, and a footer call to action.
 */
export function PostCard({
    href,
    icon,
    datePublished,
    title,
    excerpt,
    overlayMessage,
    headerTrailing,
    footer,
    action,
    titleClassName,
}: PostCardProps): React.ReactElement {
    return (
        <Link
            href={href}
            prefetch={false}
            className="surface-card radius-card card-chrome card-hover flex h-full flex-col p-4 text-content transition-all sm:p-5"
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                    {icon}
                    <p className="text-content-subtle font-mono text-xs uppercase tracking-wide">
                        {formatPublishedDate(datePublished)}
                    </p>
                </div>
                {headerTrailing}
            </div>

            <h2
                className={cn(
                    "font-heading mt-2 text-xl font-semibold text-white",
                    titleClassName
                )}
            >
                {title}
            </h2>

            <div className="my-3 border-b border-surface-outline/80" />

            <p className="text-content-subtle text-sm leading-relaxed">
                {excerpt}
            </p>

            <div className="mt-auto pt-5">
                {footer}
                <div className="flex justify-center border-t border-surface-outline/70 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-sky-200">
                        {action}
                    </span>
                </div>
            </div>
            <NavigationOverlay message={overlayMessage} />
        </Link>
    );
}
