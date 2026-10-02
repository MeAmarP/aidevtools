import Link from "next/link";
export default function NotFound() {
  return (
    <div className="prose">
      <div className="eyebrow">404</div>
      <h1>This tool isn’t here.</h1>
      <p>
        <Link href="/">Return to the toolkit →</Link>
      </p>
    </div>
  );
}
