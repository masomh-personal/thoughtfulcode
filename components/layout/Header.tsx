"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa";
import {
    HiCode,
    HiCollection,
    HiDocumentText,
    HiHome,
    HiMenu,
    HiUser,
    HiX,
} from "react-icons/hi";
import { Logo } from "@/components/Logo";
import { Link } from "@/components/ui";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!mobileMenuOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === "Escape") {
                setMobileMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileMenuOpen]);

    type NavItem = {
        name: string;
        href: string;
        icon: IconType;
        external?: boolean;
        iconOnlyOnDesktop?: boolean;
    };

    const navigation: NavItem[] = [
        { name: "Home", href: "/", icon: HiHome },
        { name: "Components", href: "/components", icon: HiCollection },
        { name: "Code Problems", href: "/problems", icon: HiCode },
        { name: "Blog", href: "/blog", icon: HiDocumentText },
        { name: "About", href: "/about", icon: HiUser },
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/masomh/",
            icon: FaLinkedin,
            external: true,
            iconOnlyOnDesktop: true,
        },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--background)">
            <nav className="mx-auto max-w-6xl px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Logo size="default" />

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-4 md:flex">
                        {navigation.map((item) => {
                            const isActive =
                                !item.external &&
                                (pathname === item.href ||
                                    (item.href !== "/" &&
                                        pathname?.startsWith(item.href)));
                            const Icon = item.icon;
                            if (item.iconOnlyOnDesktop) {
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        external
                                        variant="muted"
                                        showIcon={false}
                                        className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md p-2 leading-none"
                                        aria-label={item.name}
                                    >
                                        <Icon className="size-(--icon-size-header)" />
                                    </Link>
                                );
                            }
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    icon={<Icon className="h-3.5 w-3.5" />}
                                    iconPosition="left"
                                    className={`text-sm transition-colors ${
                                        isActive
                                            ? "text-primary"
                                            : "text-muted hover:text-primary"
                                    }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-muted transition-colors hover:bg-slate-800 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-(--background)"
                            aria-label={
                                mobileMenuOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-navigation"
                        >
                            {mobileMenuOpen ? (
                                <HiX className="h-5 w-5" />
                            ) : (
                                <HiMenu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div
                        id="mobile-navigation"
                        className="border-t border-surface-card py-4 md:hidden"
                    >
                        <div className="flex flex-col gap-3">
                            {navigation.map((item) => {
                                const isActive =
                                    !item.external &&
                                    (pathname === item.href ||
                                        (item.href !== "/" &&
                                            pathname?.startsWith(item.href)));
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        target={
                                            item.external ? "_blank" : undefined
                                        }
                                        external={item.external}
                                        onClick={() => setMobileMenuOpen(false)}
                                        icon={
                                            <Icon
                                                className={
                                                    item.external
                                                        ? "h-3.5 w-3.5 pr-0.5"
                                                        : "h-4 w-4"
                                                }
                                            />
                                        }
                                        iconPosition="left"
                                        className={`text-sm transition-colors ${
                                            isActive
                                                ? "text-primary"
                                                : "text-muted hover:text-primary"
                                        }`}
                                        aria-current={
                                            isActive ? "page" : undefined
                                        }
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
