import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tools } from "@/lib/tools";
import Calculator from "@/components/calculator";
import { siteUrl } from "@/lib/site";
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    ...(siteUrl() ? { alternates: { canonical: `/tools/${slug}` } } : {}),
  };
}
export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();
  return (
    <div className="tool-page">
      <Link className="back" href="/#tools">
        ← All tools
      </Link>
      <div className="eyebrow">{tool.category}</div>
      <h1>{tool.title}</h1>
      <p className="intro">{tool.description}</p>
      <Calculator slug={tool.slug} />
      <section className="method">
        <h2>How it works</h2>
        <code>{tool.formula}</code>
        <p>{tool.detail}</p>
        <h3>Estimate limitations</h3>
        <p>{tool.caveat}</p>
        <h3>Does my input leave the browser?</h3>
        <p>
          Calculator inputs are processed in your browser. No input is sent to
          an API or stored by this application.
        </p>
      </section>
      <section>
        <h2>Keep exploring</h2>
        <div className="related">
          {tools
            .filter((t) => t.slug !== slug)
            .slice(0, 3)
            .map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`}>
                {t.title} ↗
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
