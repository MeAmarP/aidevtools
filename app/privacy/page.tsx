export default function Privacy() {
  return (
    <article className="prose">
      <div className="eyebrow">PRIVACY</div>
      <h1>Your calculations stay in your browser.</h1>
      <p>
        This initial version processes calculator inputs locally. The
        application does not submit or persist your inputs, and has no login or
        database.
      </p>
      <h2>Hosting and external links</h2>
      <p>
        Your hosting provider may process ordinary request information,
        including IP addresses and browser details, to serve and secure the
        website. Visiting GitHub or another linked site is subject to that
        service’s privacy policy.
      </p>
      <h2>Analytics and advertising</h2>
      <p>
        No application analytics, advertising scripts, or tracking cookies are
        included in this version. This page will need updating, along with any
        applicable consent controls, before those services are enabled.
      </p>
      <h2>Questions</h2>
      <p>
        Raise a privacy question in the{" "}
        <a href="https://github.com/MeAmarP/aidevtools/issues">
          project issue tracker
        </a>
        . Avoid including private information in public issues.
      </p>
    </article>
  );
}
