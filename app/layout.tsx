import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "AI Dev Tools — Free AI calculators",
    template: "%s | AI Dev Tools",
  },
  description:
    "Free browser-based calculators for LLM memory, GPU capacity, quantization, API costs, and inference workloads.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="nav">
          <Link className="brand" href="/">
            <span className="logo">ai</span> dev tools
            <span className="beta">BETA</span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/#tools">Tools</Link>
            <Link href="/about">About</Link>
            <a href="https://github.com/MeAmarP/aidevtools">GitHub ↗</a>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer>
          <span>AI Dev Tools · Built for the work behind AI.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <a href="https://github.com/MeAmarP/aidevtools/issues">
              Feedback ↗
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
