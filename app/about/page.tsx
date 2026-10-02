export default function About() {
  return (
    <article className="prose">
      <div className="eyebrow">ABOUT THE PROJECT</div>
      <h1>Practical tools for AI engineers.</h1>
      <p>
        AI Dev Tools is an open-source collection of focused calculators for
        planning inference, understanding model memory, and estimating API
        workloads.
      </p>
      <p>
        Every tool explains its formula and assumptions. Results are estimates
        to support engineering decisions; measurements with your model and
        runtime are the final check.
      </p>
      <h2>Built to stay lightweight</h2>
      <p>
        Calculations run in the browser. This version requires no accounts,
        databases, external AI services, or API keys.
      </p>
      <h2>Contribute or report a problem</h2>
      <p>
        Find the source and share feedback on{" "}
        <a href="https://github.com/MeAmarP/aidevtools">GitHub</a>. The project
        is licensed under MIT.
      </p>
    </article>
  );
}
