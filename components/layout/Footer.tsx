import { SiGithub } from "react-icons/si";
import packageJson from "@/package.json";

const GITHUB_REPO = "masomh-personal/hamadeh-io";

export function Footer() {
    const version = packageJson.version ?? "?.?.?";
    const gitBranch = process.env.NEXT_PUBLIC_GIT_BRANCH;
    const gitSha = process.env.NEXT_PUBLIC_GIT_SHA;
    const shaShort = gitSha ? gitSha.slice(0, 7) : null;
    const repoUrl = `https://github.com/${GITHUB_REPO}`;
    const branchUrl = gitBranch ? `${repoUrl}/tree/${gitBranch}` : repoUrl;
    const title = [
        gitBranch && `Branch: ${gitBranch}`,
        gitSha && `SHA: ${gitSha}`,
    ]
        .filter(Boolean)
        .join("\n");

    return (
        <footer className="w-full border-t border-(--border) bg-(--background)">
            <div className="mx-auto max-w-6xl px-6 py-4">
                <div className="flex flex-col items-center gap-1.5">
                    {/* Compact GitHub badge keeps build metadata available but subtle */}
                    <a
                        href={branchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={title || "View repository"}
                        aria-label="View GitHub repository"
                        className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-md border-[0.5px] border-white/95 bg-[color-mix(in_srgb,var(--color-slate-800)_80%,transparent)] px-3 py-1.5 font-baloo text-[0.75rem] font-semibold tracking-[0.02em] text-content shadow-[0_2px_10px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] transform-gpu transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.01] hover:shadow-[0_4px_14px_rgba(0,0,0,0.34),0_0_12px_rgba(56,189,248,0.16),inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-[0.995] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-(--background)"
                    >
                        <SiGithub
                            className="relative -top-px size-3.5 shrink-0 text-slate-200"
                            aria-hidden
                        />
                        <span className="text-secondary">v{version}</span>
                        <span aria-hidden>·</span>
                        <span>{gitBranch ?? "---"}</span>
                        <span aria-hidden>·</span>
                        <span>SHA</span>
                        <span className="font-mono text-[0.6875rem] leading-none tracking-normal text-content">
                            {shaShort ?? "-------"}
                        </span>
                    </a>

                    {/* Line 2: Copyright and tagline */}
                    <p className="text-content-subtle flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-xs leading-tight">
                        {/* No year: a static build would freeze it until the next deploy. */}
                        <span>
                            © <strong>hamadeh.io</strong>. All rights reserved.
                        </span>
                        <span aria-hidden>·</span>
                        <span className="font-baloo font-bold">
                            Made with
                            <span className="mx-0.5" aria-hidden>
                                ❤️
                            </span>
                            in ATL
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
