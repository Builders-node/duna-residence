"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="wrap" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "160rem", paddingBottom: "120rem" }}>
      <div className="eyebrow">Something went wrong</div>
      <h1 className="fn-h2" style={{ marginTop: "20rem", maxWidth: "18ch" }}>
        We hit an unexpected error.
      </h1>
      <p style={{ marginTop: "24rem", color: "var(--gray-3)", fontSize: "18rem", maxWidth: "44ch" }}>
        Please try again. If it keeps happening, contact our team and we’ll help right away.
      </p>
      <div className="flex" style={{ gap: "12rem", marginTop: "40rem" }}>
        <button onClick={reset} className="btn btn--filled">Try again</button>
        <Link href="/" className="btn">Back home</Link>
      </div>
    </main>
  );
}
