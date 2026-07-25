"use client";

import { Slot } from "@radix-ui/react-slot";
import NextLink from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { HiCode } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { shouldUseNativeAnchor } from "./component-utils";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "danger"
    | "danger-soft";
type ButtonSize = "xs" | "sm" | "md" | "lg";
type IconSize = "xs" | "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-primary/95 border border-primary/55 shadow-[0_0_0_1px_rgba(56,189,248,0.2)] hover:border-primary hover:bg-primary text-white font-heading",
    secondary:
        "bg-secondary/95 border border-secondary/55 shadow-[0_0_0_1px_rgba(16,185,129,0.24)] hover:border-secondary hover:bg-secondary text-white font-heading",
    tertiary:
        "bg-tertiary/95 border border-tertiary/60 shadow-[0_0_0_1px_rgba(245,158,11,0.24)] hover:border-tertiary hover:bg-tertiary text-white font-heading",
    outline:
        "border border-slate-300/70 bg-slate-900/30 shadow-[0_0_0_1px_rgba(148,163,184,0.2)] text-slate-200 hover:border-primary hover:bg-primary/10 hover:text-primary font-heading",
    danger: "bg-red-500 border border-red-200/80 shadow-[0_0_0_1px_rgba(239,68,68,0.24)] hover:border-red-100 hover:bg-red-400 text-white font-heading",
    "danger-soft":
        "bg-red-500/20 border border-red-300/70 shadow-[0_0_0_1px_rgba(248,113,113,0.24)] text-red-300 hover:border-red-200 hover:bg-red-500/30 font-heading",
};

const sizeClasses: Record<ButtonSize, string> = {
    xs: "text-[0.65625rem] min-h-8 gap-[0.25rem] px-2.5 py-1.25 tracking-[0.028em]",
    sm: "text-[0.6875rem] min-h-9 gap-1 px-3 py-1.5 tracking-[0.03em]",
    md: "text-[0.8125rem] min-h-10 gap-[0.3125rem] px-4 py-2 tracking-[0.045em]",
    lg: "text-[0.9375rem] min-h-11 gap-[0.375rem] px-5 py-2.5 tracking-[0.05em]",
};

const minWidthClasses: Record<ButtonSize, string> = {
    xs: "min-w-22",
    sm: "min-w-24",
    md: "min-w-32",
    lg: "min-w-36",
};

const iconSizeClasses: Record<IconSize, string> = {
    xs: "[&_svg]:h-3 [&_svg]:w-3",
    sm: "[&_svg]:h-3.5 [&_svg]:w-3.5",
    md: "[&_svg]:h-4 [&_svg]:w-4",
    lg: "[&_svg]:h-4.5 [&_svg]:w-4.5",
};

type ButtonClickEvent = MouseEvent<HTMLButtonElement | HTMLAnchorElement>;
type IconPosition = "left" | "right";

export interface ThoughtfulButtonProps extends Omit<
    ComponentProps<"button">,
    "children" | "onClick" | "target" | "rel"
> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    iconOnly?: boolean;
    iconPosition?: IconPosition;
    iconSize?: IconSize;
    isLoading?: boolean;
    loadingText?: string;
    loadingIcon?: React.ReactNode;
    asChild?: boolean;
    enforceMinWidth?: boolean;
    target?: string;
    rel?: string;
    onClick?: (event: ButtonClickEvent) => void;
}

const baseClasses = `relative rounded-sm font-black uppercase transition-all duration-200 inline-flex items-center justify-center transform-gpu
hover:scale-[1.015] active:scale-[0.99] motion-reduce:transform-none data-[disabled]:hover:scale-100 data-[disabled]:active:scale-100
[&_svg]:block [&_svg]:shrink-0
after:pointer-events-none after:absolute after:inset-[-1px] after:rounded-[inherit] after:opacity-0 after:transition-[opacity,box-shadow] after:duration-200 after:content-[''] hover:after:opacity-100 hover:after:shadow-[0_0_0_1px_rgba(125,211,252,0.55),0_0_14px_rgba(56,189,248,0.24)] data-[disabled]:hover:after:opacity-0
cursor-pointer disabled:cursor-not-allowed disabled:opacity-60
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900`;

function getButtonClasses({
    variant,
    size,
    iconSize,
    isLoading,
    isDisabled,
    enforceMinWidth,
    iconOnly,
    className,
}: {
    variant: ButtonVariant;
    size: ButtonSize;
    iconSize: IconSize;
    isLoading: boolean;
    isDisabled: boolean;
    enforceMinWidth: boolean;
    iconOnly: boolean;
    className?: string;
}): string {
    const iconOnlySizeClasses: Record<ButtonSize, string> = {
        xs: "size-8 p-0 gap-0",
        sm: "size-9 p-0 gap-0",
        md: "size-10 p-0 gap-0",
        lg: "size-11 p-0 gap-0",
    };

    return cn(
        variantClasses[variant],
        sizeClasses[size],
        enforceMinWidth && !iconOnly && minWidthClasses[size],
        iconSizeClasses[iconSize],
        iconOnly && iconOnlySizeClasses[size],
        baseClasses,
        isLoading && "cursor-wait",
        isDisabled && "pointer-events-none",
        className
    );
}

function getButtonContent({
    isLoading,
    loadingIcon,
    loadingText,
    icon,
    iconPosition = "left",
    iconOnly,
    children,
}: {
    isLoading: boolean;
    loadingIcon?: React.ReactNode;
    loadingText?: string;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    iconOnly: boolean;
    children?: React.ReactNode;
}): React.ReactNode {
    if (isLoading) {
        const loadingIconNode = loadingIcon ?? (
            <HiCode
                className="animate-[spin_1.6s_linear_infinite] motion-reduce:animate-none"
                aria-hidden="true"
            />
        );

        if (iconOnly && !loadingText) {
            return loadingIconNode;
        }

        return (
            <>
                {loadingIconNode}
                <span>{loadingText ?? "Loading..."}</span>
            </>
        );
    }

    const iconNode = icon ? <span aria-hidden="true">{icon}</span> : null;
    if (iconOnly) {
        return iconNode;
    }

    return (
        <>
            {iconPosition === "left" && iconNode}
            {children}
            {iconPosition === "right" && iconNode}
        </>
    );
}

function getLinkAccessibilityProps({
    isDisabled,
    isLoading,
    onClick,
}: {
    isDisabled: boolean;
    isLoading: boolean;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}): {
    "aria-disabled"?: true;
    "aria-busy"?: true;
    "data-disabled"?: "";
    tabIndex?: -1;
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
} {
    return {
        "aria-disabled": isDisabled || undefined,
        "aria-busy": isLoading || undefined,
        "data-disabled": isDisabled ? "" : undefined,
        tabIndex: isDisabled ? -1 : undefined,
        onClick: (event) => {
            if (isDisabled) {
                event.preventDefault();
                return;
            }

            onClick?.(event);
        },
    };
}

/**
 * Button component with hamadeh.io design system.
 * Primary = Sky, Secondary = Emerald, Tertiary = Amber.
 * Pass href to render as a link-style button.
 */
export function Button({
    variant = "primary",
    size = "md",
    className,
    href,
    disabled,
    onClick,
    type = "button",
    icon,
    iconPosition = "left",
    iconSize,
    iconOnly = false,
    isLoading = false,
    loadingText,
    loadingIcon,
    children,
    asChild = false,
    enforceMinWidth = true,
    target,
    rel,
    ...props
}: ThoughtfulButtonProps) {
    const isDisabled = Boolean(disabled || isLoading);
    const resolvedIconSize: IconSize =
        iconSize ?? (size === "xs" ? "xs" : "md");
    // For icon-only buttons, pass an aria-label at call site for accessibility.

    const classes = getButtonClasses({
        variant,
        size,
        iconSize: resolvedIconSize,
        isLoading,
        isDisabled,
        enforceMinWidth,
        iconOnly,
        className,
    });
    const content = getButtonContent({
        isLoading,
        loadingIcon,
        loadingText,
        icon,
        iconPosition,
        iconOnly,
        children,
    });
    const linkAccessibilityProps = getLinkAccessibilityProps({
        isDisabled,
        isLoading,
        onClick: (event) =>
            onClick?.(
                event as MouseEvent<HTMLButtonElement | HTMLAnchorElement>
            ),
    });
    const linkProps = {
        ...linkAccessibilityProps,
        ...(target !== undefined && { target }),
        ...(rel !== undefined && { rel }),
    };

    if (asChild) {
        return (
            <Slot
                className={classes}
                aria-disabled={isDisabled || undefined}
                aria-busy={isLoading || undefined}
                data-disabled={isDisabled ? "" : undefined}
                onClick={(event: MouseEvent<HTMLElement>) => {
                    if (isDisabled) {
                        event.preventDefault();
                        return;
                    }

                    onClick?.(
                        event as MouseEvent<
                            HTMLButtonElement | HTMLAnchorElement
                        >
                    );
                }}
                {...props}
            >
                {children}
            </Slot>
        );
    }

    if (href && !shouldUseNativeAnchor(href)) {
        return (
            <NextLink href={href} className={classes} {...linkProps}>
                {content}
            </NextLink>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} {...linkProps}>
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={isDisabled}
            aria-busy={isLoading || undefined}
            data-disabled={isDisabled ? "" : undefined}
            onClick={(event: MouseEvent<HTMLButtonElement>) => onClick?.(event)}
            {...props}
        >
            {content}
        </button>
    );
}
