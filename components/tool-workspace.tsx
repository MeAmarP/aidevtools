"use client";
import Link from "next/link";
import { useState } from "react";
import Calculator from "@/components/calculator";
import { tools, type ToolSlug } from "@/lib/tools";

export default function ToolWorkspace({ initialSlug = tools[0].slug }: { initialSlug?: ToolSlug }) {
  const [selected, setSelected] = useState<ToolSlug>(initialSlug);
  const tool = tools.find((item) => item.slug === selected)!;
  return (
    <div className="workspace" id="tools">
      <nav className="tool-list" aria-label="Calculators">
        {tools.map((item) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={selected === item.slug}
            onClick={() => setSelected(item.slug)}
          >
            {item.title}
          </button>
        ))}
      </nav>
      <section className="tool-pane" aria-labelledby="tool-title">
        <header className="tool-header">
          {"question" in tool ? (
            <p className="tool-question">{tool.question}</p>
          ) : null}
          <h1 id="tool-title">{tool.title}</h1>
          <p className="intro">{tool.description}</p>
        </header>
        <Calculator key={`calculator-${tool.slug}`} slug={tool.slug} />
        <details className="method" key={`method-${tool.slug}`}>
          <summary>Formula & limitations</summary>
          <code>{tool.formula}</code>
          <p>{tool.detail}</p>
          <p>{tool.caveat}</p>
          <Link className="quiet" href={`/tools/${tool.slug}`}>Permanent link ↗</Link>
        </details>
      </section>
    </div>
  );
}
