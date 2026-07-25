import { PaginationNav } from "@/components/ui";

function mockHref(_page: number): string {
    return "#";
}

export function PaginationShowcase() {
    return (
        <section>
            <h2 className="font-bold text-white">Pagination</h2>
            <p className="text-content-muted mb-4">
                Server-rendered nav used on listing pages. Previous and Next use
                Button variants; page slots are inline links with active
                highlighting and smart ellipsis for large ranges.
            </p>

            <div className="space-y-8">
                <div>
                    <h3 className="text-content-subtle mb-4 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        First page — Previous disabled
                    </h3>
                    <PaginationNav
                        currentPage={1}
                        totalPages={5}
                        getPageHref={mockHref}
                    />
                </div>

                <div>
                    <h3 className="text-content-subtle mb-4 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Middle page — both active
                    </h3>
                    <PaginationNav
                        currentPage={3}
                        totalPages={5}
                        getPageHref={mockHref}
                    />
                </div>

                <div>
                    <h3 className="text-content-subtle mb-4 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Last page — Next disabled
                    </h3>
                    <PaginationNav
                        currentPage={5}
                        totalPages={5}
                        getPageHref={mockHref}
                    />
                </div>

                <div>
                    <h3 className="text-content-subtle mb-4 border-t border-surface-outline/40 pt-4 font-mono text-sm">
                        Large range — ellipsis active
                    </h3>
                    <PaginationNav
                        currentPage={6}
                        totalPages={12}
                        getPageHref={mockHref}
                    />
                </div>
            </div>
        </section>
    );
}
