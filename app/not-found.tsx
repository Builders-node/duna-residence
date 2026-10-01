import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "160rem", paddingBottom: "120rem" }}>
      <div className="eyebrow">404</div>
      <h1 className="fn-h2" style={{ marginTop: "20rem", maxWidth: "18ch" }}>
        This page has drifted out to sea.
      </h1>
      <p style={{ marginTop: "24rem", color: "var(--gray-3)", fontSize: "18rem", maxWidth: "44ch" }}>
        The page you’re looking for doesn’t exist or has moved. Let’s get you back to the residence.
      </p>
      <div className="flex" style={{ gap: "12rem", marginTop: "40rem" }}>
        <Link href="/" className="btn btn--filled">← Back home</Link>
        <Link href="/apartments" className="btn">View residences</Link>
      </div>
    </main>
  );
}
