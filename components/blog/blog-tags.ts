interface BlogTagPresentation {
    text: string;
    color: string;
    bgColor: string;
}

interface BlogTagColorDefinition {
    color: string;
}

const BLOG_TAG_BACKGROUND_ALPHA = "2E";

const DEFAULT_TAG_COLOR: BlogTagColorDefinition = {
    color: "#94A3B8",
};

/**
 * Central tag color map for blog UI.
 * Add new tags here as content grows.
 */
const BLOG_TAG_COLOR_MAP: Record<string, BlogTagColorDefinition> = {
    engineering: { color: "#FACC15" },
    nextjs: { color: "#60A5FA" },
    markdown: { color: "#F472B6" },
    tooling: { color: "#E879F9" },
    collaboration: { color: "#2DD4BF" },
    typescript: { color: "#38BDF8" },
    backend: { color: "#34D399" },
    async: { color: "#FB7185" },
    ai: { color: "#22D3EE" },
    api: { color: "#22C55E" },
    bun: { color: "#FB923C" },
    cost: { color: "#FDE047" },
    dependencies: { color: "#818CF8" },
    react: { color: "#67E8F9" },
    security: { color: "#F43F5E" },
    dsa: { color: "#93C5FD" },
    methodology: { color: "#C4B5FD" },
    fundamentals: { color: "#6EE7B7" },
    solid: { color: "#F59E0B" },
    "system-design": { color: "#F87171" },
    career: { color: "#A3E635" },
    learning: { color: "#D8B4FE" },
    leadership: { color: "#F97316" },
};

function assertUniqueBlogTagColors(
    tagColors: Record<string, BlogTagColorDefinition>
): void {
    const colorToTags = new Map<string, string[]>();

    for (const [tag, { color }] of Object.entries(tagColors)) {
        const existingTags = colorToTags.get(color) ?? [];
        existingTags.push(tag);
        colorToTags.set(color, existingTags);
    }

    const duplicateColorEntries = Array.from(colorToTags.entries()).filter(
        ([, tags]) => tags.length > 1
    );

    if (duplicateColorEntries.length > 0) {
        const duplicateColorSummary = duplicateColorEntries
            .map(([color, tags]) => `${color}: ${tags.join(", ")}`)
            .join("; ");

        throw new Error(
            `Blog tags must use unique colors. Duplicate assignments found for ${duplicateColorSummary}.`
        );
    }
}

assertUniqueBlogTagColors(BLOG_TAG_COLOR_MAP);

export function getBlogTagPresentation(tag: string): BlogTagPresentation {
    const normalizedTag = tag.trim().toLowerCase();
    const { color } = BLOG_TAG_COLOR_MAP[normalizedTag] ?? DEFAULT_TAG_COLOR;

    return {
        text: normalizedTag.toUpperCase(),
        color,
        bgColor: `${color}${BLOG_TAG_BACKGROUND_ALPHA}`,
    };
}
