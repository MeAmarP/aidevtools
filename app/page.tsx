import Link from "next/link";
import { tools, plannedTools } from "@/lib/tools";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">
          <span className="dot" /> SMALL TOOLS. BETTER DECISIONS.
        </div>
        <h1>
          Less guesswork.
          <br />
          <span>More building.</span>
        </h1>
        <p>
          Free calculators & utilities for LLMs, GPUs, RAG and local AI.
          Understand the numbers before you run the model.
        </p>
        <div className="actions">
          <a className="button" href="#tools">
            Explore the toolkit <span>↗</span>
          </a>
          <span className="quiet">No account. No API keys.</span>
        </div>
        <div className="hero-meta">
          <span>01 / Browser-based calculations</span>
          <span>02 / Transparent formulas</span>
          <span>03 / Open source</span>
        </div>
      </section>
      <section id="tools">
        <div className="section-head">
          <div>
            <div className="eyebrow">YOUR ENGINEERING TOOLKIT</div>
            <h2>Make the next decision.</h2>
          </div>
          <span className="quiet">06 tools available</span>
        </div>
        <div className="grid">
          {tools.map((t) => (
            <Link className="card" href={`/tools/${t.slug}`} key={t.slug}>
              <div className="card-top">
                <span className="number">{t.mark}</span>
                <span className="tag">{t.category}</span>
              </div>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <div className="card-bottom">
                Open calculator <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="roadmap">
        <div>
          <div className="eyebrow">NEXT IN THE TOOLKIT</div>
          <h2>
            A focused start.
            <br />
            Room to grow.
          </h2>
          <p>
            We’re building the foundation for ten practical tools. These four
            are on the roadmap.
          </p>
        </div>
        <ul>
          {plannedTools.map((t) => (
            <li key={t}>
              <span>{t}</span>
              <span className="tag">Planned</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
