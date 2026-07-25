import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, type ThoughtfulButtonProps } from "./Button";

const baseClasses =
    "surface-card radius-card card-chrome card-hover flex h-full flex-col p-3 text-content sm:p-4";
type CardActionBase = Omit<
    ThoughtfulButtonProps,
    "children" | "variant" | "enforceMinWidth" | "asChild"
>;

type CardActionWithTextLabel = CardActionBase & {
    label: string;
};

type CardActionWithCustomLabel = CardActionBase & {
    label: ReactNode;
    "aria-label": string;
};

type CardAction = CardActionWithTextLabel | CardActionWithCustomLabel;

type CardActions = [] | [CardAction] | [CardAction, CardAction];

export interface ThoughtfulCardProps extends Omit<
    ComponentProps<"article">,
    "children" | "title"
> {
    title: ReactNode;
    subtitle?: string;
    icon?: ReactNode;
    iconClassName?: string;
    actions?: CardActions;
    children: ReactNode;
}

/**
 * Generic Card component with fixed structure:
 * title (+ optional icon), optional subtitle, always-on divider, body content,
 * and optional 0-2 actions.
 */
export function Card({
    title,
    subtitle,
    icon,
    iconClassName,
    actions,
    className,
    children,
    ...props
}: ThoughtfulCardProps) {
    const visibleActions = actions ?? [];
    const hasActions = visibleActions.length;
    const hasTwoActions = visibleActions.length === 2;

    return (
        <article className={cn(baseClasses, className)} {...props}>
            <header className="relative z-10 shrink-0">
                <h3 className="font-heading flex items-center gap-1 text-xl font-semibold text-white">
                    {icon ? (
                        <span
                            aria-hidden="true"
                            className={cn(
                                "text-content-muted shrink-0 [&_svg]:h-5 [&_svg]:w-5",
                                iconClassName
                            )}
                        >
                            {icon}
                        </span>
                    ) : null}
                    <span>{title}</span>
                </h3>
                {subtitle ? (
                    <p className="text-content-subtle mt-1.5 text-xs leading-relaxed">
                        {subtitle}
                    </p>
                ) : null}
            </header>

            <div className="relative z-10 my-2.5 border-b border-surface-outline/80" />

            <div className="text-content relative z-10 flex flex-1 items-center">
                {children}
            </div>

            {hasActions ? (
                <div className="relative z-10 pt-3">
                    <div
                        className={cn(
                            hasTwoActions
                                ? "grid grid-cols-2 gap-2"
                                : "flex w-full"
                        )}
                    >
                        {visibleActions.map((action, index) => {
                            const variantForPosition =
                                hasTwoActions && index === 1
                                    ? "secondary"
                                    : "primary";
                            const {
                                label,
                                className: actionClassName,
                                ...actionProps
                            } = action;

                            return (
                                <Button
                                    key={
                                        typeof label === "string"
                                            ? `${label}-${index}`
                                            : `${actionProps["aria-label"]}-${index}`
                                    }
                                    {...actionProps}
                                    size="sm"
                                    enforceMinWidth={false}
                                    asChild={false}
                                    variant={variantForPosition}
                                    className={cn(
                                        "w-full whitespace-nowrap text-center text-[0.75rem] leading-none tracking-[0.038em]",
                                        actionClassName
                                    )}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </article>
    );
}
