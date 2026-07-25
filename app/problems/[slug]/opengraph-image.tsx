import {
    getPublishedProblemBySlug,
    listPublishedProblems,
} from "@/lib/content/problems";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Code problem walkthrough";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const problems = await listPublishedProblems();
    return problems.map((problem) => ({ slug: problem.slug }));
}

interface OpengraphImageProps {
    params: Promise<{ slug: string }>;
}

export default async function OpengraphImage({
    params,
}: OpengraphImageProps): Promise<Response> {
    const { slug } = await params;
    const problem = await getPublishedProblemBySlug(slug);

    return renderOgImage({
        eyebrow: "Code Problem",
        title: problem.title,
        meta: [
            // Difficulty is stored lowercase for the badge variants.
            problem.difficulty.charAt(0).toUpperCase() +
                problem.difficulty.slice(1),
            problem.timeComplexity,
            problem.spaceComplexity,
        ],
    });
}
