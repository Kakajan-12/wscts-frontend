import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Suw Hojalyk",
    icons: {
        icon: [{ url: "/icon.png", type: "image/png" }],
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="tk">
        <body>{children}</body>
        </html>
    );
}
