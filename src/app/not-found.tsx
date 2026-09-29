import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="wrap not-found">
      <p className="micro">404 / CONNECTION NOT FOUND</p>
      <h1>
        THIS PATH
        <br />
        ENDS HERE.
      </h1>
      <p>The page may have moved, or the project isn’t published yet.</p>
      <Link className="button button-dark" href="/work">
        <span className="cta-label">Explore the work library</span>
      </Link>
    </main>
  );
}
