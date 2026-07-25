import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import {
    AccessibilityShowcase,
    BadgeShowcase,
    BlogShowcase,
    ButtonShowcase,
    CardShowcase,
    LinkShowcase,
    LoadingShowcase,
    PaginationShowcase,
} from "./sections";

const triggerBaseClasses =
    "shrink-0 justify-center rounded-md border border-transparent px-3 py-1.5 text-sm data-[state=active]:border-sky-400 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-300 data-[state=active]:[&_span.tab-trigger-subtitle]:text-sky-100/80 md:relative md:w-full md:justify-start md:px-4 md:py-2 md:pl-7 md:text-left md:text-base md:before:pointer-events-none md:before:absolute md:before:left-2 md:before:top-1/2 md:before:h-6 md:before:w-1 md:before:-translate-y-1/2 md:before:rounded-full md:before:bg-sky-400 md:before:opacity-0 md:data-[state=active]:before:opacity-100 md:data-[state=active]:before:shadow-[0_0_8px_rgba(56,189,248,0.45)]";

const showcaseSections = [
    { value: "button", label: "Button", subtitle: "Actions and states" },
    { value: "link", label: "Link", subtitle: "Navigation patterns" },
    { value: "card", label: "Card", subtitle: "Content containers" },
    { value: "badge", label: "Badge", subtitle: "Labels and status" },
    { value: "blog", label: "Blog", subtitle: "Cards and post meta" },
    { value: "loading", label: "Loading", subtitle: "Overlays and shimmer" },
    { value: "pagination", label: "Pagination", subtitle: "Page navigation" },
    { value: "qa", label: "A11y QA", subtitle: "Keyboard and focus" },
] as const;

const tabContentClasses =
    "surface-card radius-card min-h-0 p-5 md:min-h-[520px] md:p-8";

/**
 * Component showcase page for testing and iterating on UI components.
 * Visit /components to see all components and their variants.
 */
export default function ComponentsPage() {
    return (
        <PageContainer>
            <PageHeader
                title="Components Showcase"
                description="This page is a living component lab for our UI system. We use a wrapper-first approach: Radix primitives provide accessible behavior and interaction patterns, while our own components define styling, spacing, and visual identity. The goal is to iterate quickly, validate UX and keyboard behavior, and keep a clean, maintainable design system without locking ourselves into heavy opinionated UI kits."
            />

            <Tabs
                defaultValue="button"
                className="space-y-4 md:grid md:grid-cols-[260px_minmax(0,1fr)] md:items-start md:gap-6 md:space-y-0"
            >
                <TabsList
                    aria-label="Component showcase sections"
                    className="flex w-full items-center gap-2 overflow-x-auto rounded-lg border border-surface-card bg-slate-900/40 p-2 md:sticky md:top-20 md:h-auto md:self-start md:flex-col md:items-stretch md:justify-start md:gap-2 md:rounded-xl md:border md:border-surface-card md:bg-linear-to-b md:from-slate-800/90 md:to-slate-900/90 md:p-3 md:shadow-[0_8px_20px_rgba(2,6,23,0.35)]"
                >
                    {showcaseSections.map((section) => (
                        <TabsTrigger
                            key={section.value}
                            value={section.value}
                            className={triggerBaseClasses}
                        >
                            <span className="flex flex-col items-start leading-tight">
                                <span className="whitespace-nowrap">
                                    {section.label}
                                </span>
                                <span className="tab-trigger-subtitle text-content-subtle hidden text-xs font-normal transition-colors duration-200 md:inline">
                                    {section.subtitle}
                                </span>
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div>
                    <TabsContent value="button" className={tabContentClasses}>
                        <ButtonShowcase />
                    </TabsContent>

                    <TabsContent value="link" className={tabContentClasses}>
                        <LinkShowcase />
                    </TabsContent>

                    <TabsContent value="card" className={tabContentClasses}>
                        <CardShowcase />
                    </TabsContent>

                    <TabsContent value="badge" className={tabContentClasses}>
                        <BadgeShowcase />
                    </TabsContent>

                    <TabsContent value="blog" className={tabContentClasses}>
                        <BlogShowcase />
                    </TabsContent>

                    <TabsContent value="loading" className={tabContentClasses}>
                        <LoadingShowcase />
                    </TabsContent>

                    <TabsContent
                        value="pagination"
                        className={tabContentClasses}
                    >
                        <PaginationShowcase />
                    </TabsContent>

                    <TabsContent value="qa" className={tabContentClasses}>
                        <AccessibilityShowcase />
                    </TabsContent>
                </div>
            </Tabs>
        </PageContainer>
    );
}
