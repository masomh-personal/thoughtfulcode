import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { RichMarkdownContent } from "@/components/markdown/RichMarkdownContent";
import {
    getPublishedBlogPostBySlug,
    listPublishedBlogPosts,
} from "@/lib/content/blog";
import { absoluteUrl, AUTHOR_NAME, SITE_NAME } from "@/lib/site";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const posts = await listPublishedBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const post = await getPublishedBlogPostBySlug(slug);
        const canonicalPath = `/blog/${post.slug}`;

        return {
            title: post.title,
            description: post.excerpt,
            alternates: {
                canonical: canonicalPath,
            },
            openGraph: {
                type: "article",
                url: canonicalPath,
                siteName: SITE_NAME,
                title: post.title,
                description: post.excerpt,
                publishedTime: post.datePublished,
                modifiedTime: post.updatedAt,
                authors: [AUTHOR_NAME],
                tags: post.tags,
            },
            twitter: {
                card: "summary_large_image",
                title: post.title,
                description: post.excerpt,
            },
        };
    } catch {
        return {
            title: "Post Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }
}

export default async function BlogPostPage({
    params,
}: PageProps): Promise<React.ReactElement> {
    const { slug } = await params;

    let post: Awaited<ReturnType<typeof getPublishedBlogPostBySlug>>;
    try {
        post = await getPublishedBlogPostBySlug(slug);
    } catch {
        notFound();
    }
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.datePublished,
        dateModified: post.updatedAt ?? post.datePublished,
        author: {
            "@type": "Person",
            name: AUTHOR_NAME,
        },
        publisher: {
            "@type": "Person",
            name: AUTHOR_NAME,
        },
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        url: absoluteUrl(`/blog/${post.slug}`),
        keywords: post.tags?.join(", "),
    };

    return (
        <PageContainer>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <article className="surface-card radius-card card-chrome p-6 md:p-10">
                <BlogPostHeader post={post} />
                <RichMarkdownContent content={post.content} />
            </article>
        </PageContainer>
    );
}
