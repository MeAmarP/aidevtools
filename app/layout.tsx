import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "aidevtools.com — Free AI calculators",
    template: "%s | aidevtools.com",
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
            aidevtools.com
          </Link>
          <p className="tagline">Practical calculators for planning LLM deployments</p>
          <a className="github-link" href="https://github.com/MeAmarP/aidevtools">
            GitHub ↗
          </a>
        </header>
        <main id="main">{children}</main>
        <footer>
          <span>aidevtools.com</span>
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
