"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import Calculator from "@/components/calculator";
import { tools, type ToolSlug } from "@/lib/tools";

export default function ToolWorkspace({ initialSlug = tools[0].slug }: { initialSlug?: ToolSlug }) {
  const [selected, setSelected] = useState<ToolSlug>(initialSlug);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tool = tools.find((item) => item.slug === selected)!;
  return (
    <div className="workspace" id="tools">
      <div className="tool-list" role="tablist" aria-label="Calculators" aria-orientation="horizontal">
        {tools.map((item) => (
          <button
            key={item.slug}
            ref={(element) => {
              tabRefs.current[tools.indexOf(item)] = element;
            }}
            type="button"
            id={`calculator-tab-${item.slug}`}
            role="tab"
            aria-selected={selected === item.slug}
            aria-controls={`calculator-panel-${item.slug}`}
            tabIndex={selected === item.slug ? 0 : -1}
            onClick={() => setSelected(item.slug)}
            onKeyDown={(event) => {
              const currentIndex = tools.findIndex(({ slug }) => slug === item.slug);
              let nextIndex: number | undefined;
              if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tools.length;
              if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tools.length) % tools.length;
              if (event.key === "Home") nextIndex = 0;
              if (event.key === "End") nextIndex = tools.length - 1;
              if (nextIndex !== undefined) {
                event.preventDefault();
                const nextTool = tools[nextIndex];
                setSelected(nextTool.slug);
                tabRefs.current[nextIndex]?.focus();
                tabRefs.current[nextIndex]?.scrollIntoView({ block: "nearest", inline: "nearest" });
              }
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
      <section
        className="tool-pane"
        id={`calculator-panel-${tool.slug}`}
        role="tabpanel"
        aria-labelledby={`calculator-tab-${tool.slug}`}
        tabIndex={0}
      >
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
