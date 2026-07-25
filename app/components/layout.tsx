import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Components Showcase",
    description:
        "A live component lab for the reusable UI primitives used across hamadeh.io.",
    alternates: {
        canonical: "/components",
    },
    robots: {
        index: false,
        follow: false,
    },
};

interface ComponentsLayoutProps {
    children: React.ReactNode;
}

export default function ComponentsLayout({
    children,
}: ComponentsLayoutProps): React.ReactElement {
    return <>{children}</>;
}
