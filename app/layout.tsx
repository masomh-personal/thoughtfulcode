import type { Metadata, Viewport } from "next";
import { Baloo_2, Fira_Code, Lexend, Quicksand } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AUTHOR_EMAIL, AUTHOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

const quicksand = Quicksand({
    subsets: ["latin"],
    variable: "--font-heading-gf",
    display: "swap",
    weight: ["500", "600", "700"],
});

const lexend = Lexend({
    subsets: ["latin"],
    variable: "--font-body-gf",
    display: "swap",
    weight: ["400", "500", "600"],
});

const baloo2 = Baloo_2({
    subsets: ["latin"],
    variable: "--font-accent-gf",
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

const firaCode = Fira_Code({
    subsets: ["latin"],
    variable: "--font-mono-fira",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: SITE_URL,
    title: {
        default: `${SITE_NAME} | ${AUTHOR_NAME}`,
        template: `%s | ${SITE_NAME}`,
    },
    description:
        "Personal portfolio of Masom Hamadeh — software engineer, technical writer, and builder. System design, engineering craft, and code.",
    applicationName: SITE_NAME,
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    creator: AUTHOR_NAME,
    alternates: {
        canonical: "/",
        types: {
            "application/rss+xml": "/blog/rss.xml",
        },
    },
    openGraph: {
        type: "website",
        url: "/",
        siteName: SITE_NAME,
        title: `${SITE_NAME} | ${AUTHOR_NAME}`,
        description:
            "Software engineering notes, system design, and tested code problems from Masom Hamadeh.",
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} | ${AUTHOR_NAME}`,
        description:
            "Software engineering notes, system design, and tested code problems from Masom Hamadeh.",
    },
    other: {
        "contact:email": AUTHOR_EMAIL,
    },
    icons: {
        icon: "/branding/favicon.svg",
        shortcut: "/branding/favicon.svg",
        apple: "/branding/favicon.svg",
    },
};

export const viewport: Viewport = {
    colorScheme: "dark",
    themeColor: "#0f172a",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${quicksand.variable} ${lexend.variable} ${baloo2.variable} ${firaCode.variable}`}
            suppressHydrationWarning
        >
            <body
                className="min-h-screen antialiased dark"
                suppressHydrationWarning
            >
                <div className="flex min-h-screen flex-col">
                    <a
                        href="#main-content"
                        className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-md bg-sky-500 px-4 py-2 font-bold text-slate-950 transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        Skip to main content
                    </a>
                    <Header />
                    <main id="main-content" className="relative flex-1">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
