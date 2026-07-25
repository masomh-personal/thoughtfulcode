import {
    getPublishedBlogPostBySlug,
    listPublishedBlogPosts,
} from "@/lib/content/blog";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const posts = await listPublishedBlogPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

interface OpengraphImageProps {
    params: Promise<{ slug: string }>;
}

export default async function OpengraphImage({
    params,
}: OpengraphImageProps): Promise<Response> {
    const { slug } = await params;
    const post = await getPublishedBlogPostBySlug(slug);

    return renderOgImage({
        eyebrow: "Blog",
        title: post.title,
        meta: post.tags ?? [],
    });
}
