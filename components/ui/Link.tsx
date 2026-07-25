import { Slot } from "@radix-ui/react-slot";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { FiArrowRight } from "react-icons/fi";
import { HiExternalLink } from "react-icons/hi";
import { cn } from "@/lib/utils";
import {
    mergeRel,
    shouldOpenInNewTab,
    shouldUseNativeAnchor,
} from "./component-utils";

type LinkVariant = "primary" | "secondary" | "tertiary" | "muted";
type LinkIconPosition = "left" | "right";

const variantClasses: Record<LinkVariant, string> = {
    primary:
        "text-primary hover:text-primary-hover hover:underline font-heading font-bold text-[0.9rem]",
    secondary:
        "text-secondary hover:text-secondary-hover hover:underline font-heading font-bold text-[0.9rem]",
    tertiary:
        "text-tertiary hover:text-tertiary-hover hover:underline font-heading font-bold text-[0.9rem]",
    muted: "text-muted hover:text-primary hover:underline font-heading font-bold text-[0.9rem]",
};

interface ThoughtfulLinkBaseProps extends Omit<ComponentProps<"a">, "href"> {
    variant?: LinkVariant;
    external?: boolean;
    showIcon?: boolean;
    icon?: React.ReactNode;
    iconPosition?: LinkIconPosition;
}

/**
 * asChild=true: render via Radix Slot and let the child own href.
 * asChild=false: render internal/native link directly and require href.
 */
type ThoughtfulLinkAsChildProps = ThoughtfulLinkBaseProps & {
    asChild: true;
    href?: string;
};

type ThoughtfulLinkWithHrefProps = ThoughtfulLinkBaseProps & {
    asChild?: false;
    href: string;
};

export type ThoughtfulLinkProps =
    | ThoughtfulLinkAsChildProps
    | ThoughtfulLinkWithHrefProps;

function getDefaultLinkIcon({
    openInNewTab,
    isInternalNavigation,
}: {
    openInNewTab: boolean;
    isInternalNavigation: boolean;
}): React.ReactNode {
    if (openInNewTab) {
        return (
            <HiExternalLink
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
            />
        );
    }

    if (isInternalNavigation) {
        return (
            <FiArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        );
    }

    return null;
}

function getLinkContent({
    children,
    icon,
    iconPosition,
    shouldRenderIcon,
}: {
    children: React.ReactNode;
    icon: React.ReactNode;
    iconPosition: LinkIconPosition;
    shouldRenderIcon: boolean;
}): React.ReactNode {
    return (
        <>
            {iconPosition === "left" && shouldRenderIcon ? icon : null}
            <span>{children}</span>
            {iconPosition === "right" && shouldRenderIcon ? icon : null}
        </>
    );
}

/**
 * Link component for internal (Next.js) and external navigation.
 * Uses Next.js Link for internal routes and anchor tags for external links.
 */
export function Link({
    href,
    variant = "primary",
    external = false,
    asChild = false,
    showIcon = true,
    icon,
    iconPosition = "left",
    className,
    children,
    rel,
    ...props
}: ThoughtfulLinkProps) {
    const baseClasses =
        "relative inline-flex items-center gap-0.75 rounded-sm px-0.5 -mx-0.5 underline-offset-2 transition-[color,background-color,transform,box-shadow] duration-200 ease-out transform-gpu hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";
    const classes = cn(variantClasses[variant], baseClasses, className);
    if (asChild) {
        return (
            <Slot className={classes} {...props}>
                {children}
            </Slot>
        );
    }

    if (!href) {
        return <span className={classes}>{children}</span>;
    }

    const useNativeAnchor = external || shouldUseNativeAnchor(href);
    const openInNewTab = external || shouldOpenInNewTab(href);
    const isInternalNavigation = !useNativeAnchor;
    const shouldRenderIcon = showIcon && !asChild;
    const resolvedIcon =
        icon ?? getDefaultLinkIcon({ openInNewTab, isInternalNavigation });
    const content = getLinkContent({
        children,
        icon: resolvedIcon,
        iconPosition,
        shouldRenderIcon,
    });

    if (useNativeAnchor) {
        return (
            <a
                href={href}
                target={openInNewTab ? "_blank" : undefined}
                rel={openInNewTab ? mergeRel(rel) : rel}
                className={classes}
                {...props}
            >
                {content}
            </a>
        );
    }

    return (
        <NextLink href={href} className={classes} {...props}>
            {content}
        </NextLink>
    );
}
