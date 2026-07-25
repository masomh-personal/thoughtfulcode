import { HiArrowRight, HiCheckCircle, HiHome } from "react-icons/hi";
import { getBlogTagPresentation } from "@/components/blog/blog-tags";
import { Badge } from "@/components/ui";

export function BadgeShowcase() {
    const blogTagExamples = [
        "engineering",
        "nextjs",
        "markdown",
        "methodology",
        "async",
    ] as const;

    return (
        <section>
            <h2 className="font-bold text-white">Badge</h2>
            <p className="text-content-muted mb-4">
                Label density, color clarity, and context usage.
            </p>

            <div className="space-y-6">
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Variants
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="primary" text="Primary" />
                        <Badge variant="secondary" text="Secondary" />
                        <Badge variant="tertiary" text="Tertiary" />
                        <Badge variant="brand" text="Brand" />
                        <Badge variant="error" text="Error" />
                    </div>
                </div>
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Tones
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="primary" tone="soft" text="Soft" />
                        <Badge
                            variant="primary"
                            tone="outline"
                            text="Outline"
                        />
                        <Badge variant="primary" tone="solid" text="Solid" />
                    </div>
                </div>
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Sizes
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge size="sm" text="Small" />
                        <Badge size="md" text="Medium" />
                        <Badge size="lg" text="Large" />
                    </div>
                </div>
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        With Icons
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge
                            variant="secondary"
                            icon={<HiCheckCircle />}
                            text="Verified"
                        />
                        <Badge
                            variant="primary"
                            icon={<HiArrowRight />}
                            iconPosition="right"
                            text="Continue"
                        />
                        <Badge variant="brand" icon={<HiHome />} text="Home" />
                    </div>
                </div>
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        In context (LeetCode difficulty tags)
                    </h3>
                    <p className="text-content flex flex-wrap items-center gap-2">
                        <Badge size="sm" variant="leetcode-easy" text="Easy" />
                        <Badge
                            size="sm"
                            variant="leetcode-medium"
                            text="Medium"
                        />
                        <Badge size="sm" variant="leetcode-hard" text="Hard" />
                    </p>
                </div>
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Blog tags (mapped colors)
                    </h3>
                    <p className="text-content flex flex-wrap items-center gap-2">
                        {blogTagExamples.map((tag) => {
                            const { text, color, bgColor } =
                                getBlogTagPresentation(tag);

                            return (
                                <Badge
                                    key={tag}
                                    size="sm"
                                    text={text}
                                    isBlogTag
                                    tagColor={color}
                                    tagBackgroundColor={bgColor}
                                />
                            );
                        })}
                    </p>
                </div>
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Font Comparison
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge
                            variant="primary"
                            className="font-baloo"
                            text="Baloo"
                        />
                        <Badge
                            variant="secondary"
                            className="font-heading"
                            text="Heading"
                        />
                        <Badge
                            variant="brand"
                            className="font-sans"
                            text="Sans"
                        />
                        <Badge
                            variant="error"
                            className="font-mono"
                            text="Mono"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-content-subtle mb-3 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Long Label
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge
                            variant="secondary"
                            text="Open to opportunities"
                        />
                        <Badge
                            variant="primary"
                            text="Portfolio in active development"
                        />
                        <Badge
                            className="max-w-[220px] truncate"
                            text="This label intentionally truncates in narrow layouts"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
