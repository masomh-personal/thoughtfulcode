import { HiCode, HiEye } from "react-icons/hi";
import { Badge } from "@/components/ui";
import { PostCard } from "@/components/ui/PostCard";
import type { ProblemSummary } from "@/lib/content/problems";

interface ProblemPostCardProps {
    problem: ProblemSummary;
}

export function ProblemPostCard({ problem }: ProblemPostCardProps) {
    const title =
        problem.source === "leetcode"
            ? `${problem.title} (LeetCode)`
            : problem.title;
    const difficultyVariant = `leetcode-${problem.difficulty}` as const;

    return (
        <PostCard
            href={`/problems/${problem.slug}`}
            icon={
                <HiCode
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-sky-300"
                />
            }
            datePublished={problem.datePublished}
            title={title}
            titleClassName="min-h-[3.5rem]"
            excerpt={problem.excerpt}
            overlayMessage="Loading solution..."
            headerTrailing={
                <Badge
                    text={problem.difficulty}
                    variant={difficultyVariant}
                    size="sm"
                />
            }
            action={
                <>
                    <HiEye className="h-4 w-4" aria-hidden="true" />
                    See Solution
                </>
            }
        />
    );
}
