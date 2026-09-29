"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/site";

const INTERESTS = ["Studio", "Residence", "Penthouse", "Undecided"];

const telHref = (phone: string) => "tel:" + phone.replace(/[^0-9+]/g, "");

const field: React.CSSProperties = {
  width: "100%",
  padding: "15rem 16rem",
  border: "1px solid var(--gray-e2)",
  borderRadius: "6rem",
  fontSize: "15rem",
  fontFamily: "var(--font-inter), sans-serif",
  background: "#fff",
  color: "#000",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11rem",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--gray-3)",
  marginBottom: "8rem",
};

export default function ContactForm({
  defaultInterest,
  settings,
}: {
  defaultInterest?: string;
  settings?: Pick<SiteSettings, "phone" | "email" | "address">;
}) {
  const initialInterest = defaultInterest && INTERESTS.includes(defaultInterest) ? defaultInterest : "Undecided";
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: initialInterest, message: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setErr("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setState("done");
      else { setErr(data.error || "Something went wrong."); setState("error"); }
    } catch {
      setErr("Network error — please try again.");
      setState("error");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* background photo */}
      <Image src="/images/lobby.png" alt="" fill sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(12,7,6,0.86) 0%, rgba(12,7,6,0.62) 45%, rgba(12,7,6,0.35) 100%)" }}
      />

      <div className="wrap relative" style={{ paddingTop: "130rem", paddingBottom: "130rem" }}>
        <div className="grid lg:grid-cols-2 items-center" style={{ gap: "72rem" }}>
          {/* left — text */}
          <div className="text-white">
            <div className="eyebrow" style={{ color: "rgba(244,239,233,0.7)" }}>Enquire</div>
            <h2 className="fn-h2" style={{ marginTop: "20rem", maxWidth: "12ch", color: "#fff" }}>
              Reserve your residence.
            </h2>
            <p style={{ marginTop: "28rem", color: "rgba(244,239,233,0.8)", fontSize: "18rem", lineHeight: 1.5, maxWidth: "38ch" }}>
              Leave your details and our sales team will be in touch within one business day —
              with availability, floor plans and terms. No obligation.
            </p>
            <div style={{ marginTop: "44rem", display: "flex", flexDirection: "column", gap: "14rem", fontSize: "16rem" }}>
              {settings?.phone && <a href={telHref(settings.phone)} className="link" style={{ color: "#fff" }}>{settings.phone}</a>}
              {settings?.email && <a href={`mailto:${settings.email}`} className="link" style={{ color: "#fff" }}>{settings.email}</a>}
              {settings?.address && <span style={{ color: "rgba(244,239,233,0.6)" }}>{settings.address}</span>}
            </div>
          </div>

          {/* right — form card */}
          <div style={{ background: "#fff", borderRadius: "10rem", padding: "48rem" }}>
            {state === "done" ? (
              <div>
                <div style={{ height: "12rem", width: "12rem", borderRadius: "999px", background: "var(--accent)" }} />
                <h3 className="serif" style={{ fontSize: "38rem", marginTop: "22rem", lineHeight: 1 }}>
                  Thank you, {form.name.split(" ")[0] || "there"}.
                </h3>
                <p style={{ marginTop: "16rem", color: "var(--gray-3)", fontSize: "16rem", lineHeight: 1.5 }}>
                  Your enquiry has been received. Our team will contact you shortly at{" "}
                  <span style={{ color: "#000" }}>{form.email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20rem" }}>
                <div className="grid sm:grid-cols-2" style={{ gap: "20rem" }}>
                  <div>
                    <label style={labelStyle}>Full name *</label>
                    <input required value={form.name} onChange={set("name")} style={field} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input required type="email" value={form.email} onChange={set("email")} style={field} placeholder="jane@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2" style={{ gap: "20rem" }}>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input value={form.phone} onChange={set("phone")} style={field} placeholder="+1 …" />
                  </div>
                  <div>
                    <label style={labelStyle}>Interested in</label>
                    <select value={form.interest} onChange={set("interest")} style={{ ...field, cursor: "pointer" }}>
                      {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea value={form.message} onChange={set("message")} rows={3} style={{ ...field, resize: "vertical" }} placeholder="Tell us what you're looking for…" />
                </div>

                {state === "error" && <div style={{ color: "#b3271b", fontSize: "14rem" }}>{err}</div>}

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="btn btn--filled"
                  style={{ alignSelf: "flex-start", opacity: state === "sending" ? 0.6 : 1 }}
                >
                  {state === "sending" ? "Sending…" : "Send enquiry"}
                </button>
                <p style={{ fontSize: "12rem", color: "var(--gray-3)" }}>
                  By submitting you agree to be contacted about Duna Residence.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
