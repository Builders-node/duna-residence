"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#000" }}>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 20, padding: "48px" }}>
          <div style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: "#929292" }}>Error</div>
          <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#555", fontSize: 18, maxWidth: "44ch", margin: 0 }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{ padding: "13px 24px", background: "#000", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, cursor: "pointer" }}
          >
            Try again
          </button>
          {error?.digest && <div style={{ fontSize: 12, color: "#bbb" }}>Ref: {error.digest}</div>}
        </main>
      </body>
    </html>
  );
}
