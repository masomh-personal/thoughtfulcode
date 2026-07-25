/**
 * Shared Open Graph image renderer.
 *
 * Satori (the engine behind ImageResponse) supports a narrow CSS subset:
 * flexbox only, no grid, and every element with multiple children needs an
 * explicit display value. Keep the markup here boring on purpose.
 */

import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

export const OG_SIZE = {
    width: 1200,
    height: 630,
} as const;

export const OG_CONTENT_TYPE = "image/png";

interface OgImageOptions {
    title: string;
    eyebrow: string;
    meta?: string[];
}

export function renderOgImage({
    title,
    eyebrow,
    meta = [],
}: OgImageOptions): ImageResponse {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#0f172a",
                padding: "72px",
                borderTop: "16px solid #0ea5e9",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        display: "flex",
                        fontSize: 28,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#38bdf8",
                    }}
                >
                    {eyebrow}
                </div>
                <div
                    style={{
                        display: "flex",
                        marginTop: 28,
                        fontSize: title.length > 60 ? 64 : 76,
                        fontWeight: 700,
                        lineHeight: 1.15,
                        color: "#f8fafc",
                    }}
                >
                    {title}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{ display: "flex", fontSize: 30, color: "#94a3b8" }}
                >
                    {SITE_NAME}
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                    {meta.map((entry) => (
                        <div
                            key={entry}
                            style={{
                                display: "flex",
                                padding: "10px 22px",
                                borderRadius: 999,
                                border: "2px solid #334155",
                                fontSize: 26,
                                color: "#cbd5e1",
                            }}
                        >
                            {entry}
                        </div>
                    ))}
                </div>
            </div>
        </div>,
        OG_SIZE
    );
}
