"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Apartment } from "@/lib/types";
import { formatPrice, formatRate, unitPrice, planTypeLabel } from "@/lib/data";
import type { SiteContent, Testimonial, Feature } from "@/lib/site";
import type { Enquiry } from "@/lib/enquiries";

const TOKEN_KEY = "duna-admin-token";
const FONT = "var(--font-inter), system-ui, sans-serif";
const BORDER = "#e2e2e2";

type Draft = Pick<
  Apartment,
  "name" | "pricePerM2" | "available" | "area" | "livingArea" | "terrace" | "ceiling" | "rooms" | "orientation" | "view" | "blurb"
>;

type Tab = "types" | "leads" | "content" | "settings";

const newId = () =>
  (globalThis.crypto?.randomUUID?.() ?? String(Date.now() + Math.random()));

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<Tab>("types");
  const [toast, setToast] = useState("");

  // home types
  const [types, setTypes] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Apartment | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  // leads
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // site content (settings / testimonials / features)
  const [site, setSite] = useState<SiteContent | null>(null);
  const [siteSaving, setSiteSaving] = useState(false);

  const authHeaders = useCallback(
    () => ({ "content-type": "application/json", "x-admin-token": token || "" }),
    [token]
  );

  const loadTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/apartments", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTypes(Array.isArray(data.apartments) ? data.apartments : []);
    } catch {
      setToast("Could not load home types");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSite = useCallback(async () => {
    try {
      const res = await fetch("/api/site", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.content) setSite(data.content);
    } catch {
      setToast("Could not load site content");
    }
  }, []);

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/enquiry", { cache: "no-store", headers: { "x-admin-token": token || "" } });
      if (res.status === 401) { setToast("Session expired — please sign in again"); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []);
    } catch {
      setToast("Could not load enquiries");
    } finally {
      setLeadsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    setToken(t);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!token) return;
    loadTypes();
    loadSite();
    loadLeads();
  }, [token, loadTypes, loadSite, loadLeads]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      } else setLoginErr("Wrong password");
    } catch {
      setLoginErr("Network error — try again");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setTypes([]);
    setEnquiries([]);
    setSite(null);
  };

  // ── type editor ──
  const openEditor = (a: Apartment) => {
    setEditing(a);
    setDraft({
      name: a.name, pricePerM2: a.pricePerM2, available: a.available, area: a.area,
      livingArea: a.livingArea, terrace: a.terrace, ceiling: a.ceiling, rooms: a.rooms,
      orientation: a.orientation, view: a.view, blurb: a.blurb,
    });
  };

  const save = async () => {
    if (!editing || !draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/apartments/${editing.id}`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify(draft),
      });
      if (res.status === 401) { setToast("Session expired — please sign in again"); logout(); return; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setToast(data.error || "Could not save changes"); return; }
      if (data.apartment) {
        setTypes((prev) => prev.map((a) => (a.id === data.apartment.id ? data.apartment : a)));
        setToast(`${data.apartment.name} saved`);
        setEditing(null); setDraft(null);
      } else setToast("Could not save changes");
    } catch {
      setToast("Network error — changes not saved");
    } finally {
      setSaving(false);
    }
  };

  const resetDemo = async () => {
    if (!confirm("Reset home types AND site content to the original demo data?")) return;
    try {
      const res = await fetch("/api/admin/reset", { method: "POST", headers: { "x-admin-token": token || "" } });
      if (res.status === 401) { setToast("Session expired — please sign in again"); logout(); return; }
      const data = await res.json().catch(() => ({}));
      if (data.apartments) setTypes(data.apartments);
      if (data.content) setSite(data.content);
      if (data.apartments) setToast("Reset to demo data");
      else setToast("Could not reset");
    } catch {
      setToast("Network error — could not reset");
    }
  };

  // ── leads actions ──
  const toggleHandled = async (e: Enquiry) => {
    try {
      const res = await fetch(`/api/enquiry/${e.id}`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify({ handled: !e.handled }),
      });
      if (res.status === 401) { setToast("Session expired — please sign in again"); logout(); return; }
      const data = await res.json().catch(() => ({}));
      if (data.enquiry) setEnquiries((prev) => prev.map((x) => (x.id === e.id ? data.enquiry : x)));
      else setToast("Could not update");
    } catch { setToast("Network error"); }
  };

  const deleteLead = async (e: Enquiry) => {
    if (!confirm(`Delete the enquiry from ${e.name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/enquiry/${e.id}`, { method: "DELETE", headers: { "x-admin-token": token || "" } });
      if (res.status === 401) { setToast("Session expired — please sign in again"); logout(); return; }
      if (res.ok) { setEnquiries((prev) => prev.filter((x) => x.id !== e.id)); setToast("Enquiry deleted"); }
      else setToast("Could not delete");
    } catch { setToast("Network error"); }
  };

  // ── site content save ──
  const saveSite = async (partial: Partial<Pick<SiteContent, "settings" | "testimonials" | "features">>, label: string) => {
    setSiteSaving(true);
    try {
      const res = await fetch("/api/site", { method: "PATCH", headers: authHeaders(), body: JSON.stringify(partial) });
      if (res.status === 401) { setToast("Session expired — please sign in again"); logout(); return; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setToast(data.error || "Could not save"); return; }
      if (data.content) { setSite(data.content); setToast(`${label} saved`); }
    } catch {
      setToast("Network error — not saved");
    } finally {
      setSiteSaving(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const available = types.reduce((s, a) => s + a.available, 0);
    const avgRate = types.length ? Math.round(types.reduce((s, a) => s + a.pricePerM2, 0) / types.length) : 0;
    const from = types.length ? Math.min(...types.map(unitPrice)) : 0;
    return { count: types.length, available, avgRate, from };
  }, [types]);

  const newLeads = enquiries.filter((e) => !e.handled).length;

  if (!ready) return null;

  // ── LOGIN ──
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: FONT, color: "#000", background: "#fff", fontSize: 16 }}>
        <form onSubmit={login} style={{ width: 360, maxWidth: "90vw" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 20V6L11 2l9 4v14" stroke="#000" strokeWidth="1.6" />
              <path d="M2 20l9-6 9 6" stroke="#000" strokeWidth="1.6" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 17 }}>Duna Residence · Admin</span>
          </div>
          <label style={{ display: "block", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11, color: "#929292", marginBottom: 8 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus placeholder="••••••••"
            style={{ width: "100%", padding: "13px 14px", border: "1px solid #000", borderRadius: 6, fontSize: 15, fontFamily: FONT, outline: "none" }} />
          {loginErr && <div style={{ color: "#c00", fontSize: 13, marginTop: 8 }}>{loginErr}</div>}
          <button type="submit" style={{ marginTop: 16, width: "100%", padding: "14px", background: "#000", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: FONT }}>Sign in</button>
        </form>
      </div>
    );
  }

  const TABS: [Tab, string, number | null][] = [
    ["types", "Home types", null],
    ["leads", "Leads", newLeads || null],
    ["content", "Content", null],
    ["settings", "Settings", null],
  ];

  // ── DASHBOARD ──
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: FONT, fontSize: 16 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M2 20V6L11 2l9 4v14" stroke="#000" strokeWidth="1.6" /><path d="M2 20l9-6 9 6" stroke="#000" strokeWidth="1.6" /></svg>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Duna Residence · Admin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <Link href="/" style={{ padding: "8px 14px", border: `1px solid ${BORDER}`, borderRadius: 6, color: "#000", textDecoration: "none" }}>View site</Link>
            <button onClick={resetDemo} style={{ padding: "8px 14px", border: `1px solid ${BORDER}`, borderRadius: 6, background: "#fff", cursor: "pointer", fontFamily: FONT }}>Reset demo</button>
            <button onClick={logout} style={{ padding: "8px 14px", border: "1px solid #000", background: "#000", color: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: FONT }}>Log out</button>
          </div>
        </div>
        {/* tabs */}
        <div style={{ display: "flex", gap: 4, padding: "0 20px" }}>
          {TABS.map(([key, label, badge]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                position: "relative", padding: "12px 16px", border: "none", background: "none", cursor: "pointer",
                fontFamily: FONT, fontSize: 14, color: tab === key ? "#000" : "#929292",
                fontWeight: tab === key ? 600 : 400, borderBottom: tab === key ? "2px solid #000" : "2px solid transparent",
              }}>
              {label}
              {badge ? <span style={{ marginLeft: 7, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 999 }}>{badge}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 96px" }}>
        {/* ══ HOME TYPES ══ */}
        {tab === "types" && (
          <>
            <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>Home types</h1>
            <p style={{ color: "#929292", marginTop: 8, fontSize: 15 }}>Manage the three home types. Price is per m² — total updates automatically.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 28 }}>
              {[
                ["Types", stats.count], ["Available", stats.available],
                ["Avg € / m²", formatPrice(stats.avgRate)], ["From", formatPrice(stats.from)],
              ].map(([label, value]) => (
                <div key={label as string} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292" }}>{label}</div>
                  <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6, letterSpacing: "-0.02em" }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
              {loading && <div style={{ color: "#929292", fontSize: 14 }}>Loading…</div>}
              {types.map((a) => (
                <div key={a.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "20px 22px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ minWidth: 200 }}>
                    <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{a.name}</div>
                    <div style={{ fontSize: 13, color: "#929292", marginTop: 4 }}>{planTypeLabel(a.planType)} · {a.area} m² · {a.available} available</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292" }}>Price / m²</div>
                      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 3 }}>{formatRate(a.pricePerM2)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292" }}>From</div>
                      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 3 }}>{formatPrice(unitPrice(a))}</div>
                    </div>
                    <button onClick={() => openEditor(a)} style={{ padding: "9px 16px", border: "1px solid #000", background: "#000", color: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 14, fontFamily: FONT }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ LEADS ══ */}
        {tab === "leads" && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>Leads</h1>
                <p style={{ color: "#929292", marginTop: 8, fontSize: 15 }}>Enquiries submitted through the contact form. {enquiries.length} total · {newLeads} new.</p>
              </div>
              <button onClick={loadLeads} style={{ padding: "9px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 14 }}>Refresh</button>
            </div>

            <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
              {leadsLoading && <div style={{ color: "#929292", fontSize: 14 }}>Loading…</div>}
              {!leadsLoading && enquiries.length === 0 && (
                <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: "40px", textAlign: "center", color: "#929292", fontSize: 15 }}>
                  No enquiries yet.
                </div>
              )}
              {enquiries.map((e) => (
                <div key={e.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "18px 20px", background: e.handled ? "#fafafa" : "#fff" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 220 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>{e.name}</span>
                        {e.handled
                          ? <span style={{ fontSize: 11, color: "#0a7d33", background: "#e7f6ec", padding: "2px 8px", borderRadius: 999 }}>Handled</span>
                          : <span style={{ fontSize: 11, color: "#fff", background: "var(--accent)", padding: "2px 8px", borderRadius: 999 }}>New</span>}
                        <span style={{ fontSize: 11, color: "#929292", background: "#f2f2f2", padding: "2px 8px", borderRadius: 999 }}>{e.interest}</span>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 14, display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                        <a href={`mailto:${e.email}`} style={{ color: "#000" }}>{e.email}</a>
                        {e.phone && <a href={`tel:${e.phone.replace(/[^0-9+]/g, "")}`} style={{ color: "#000" }}>{e.phone}</a>}
                      </div>
                      {e.message && <p style={{ marginTop: 10, fontSize: 14, color: "#444", lineHeight: 1.45, maxWidth: "60ch" }}>{e.message}</p>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "#929292" }}>{new Date(e.createdAt).toLocaleString()}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => toggleHandled(e)} style={{ padding: "7px 12px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 13 }}>
                          {e.handled ? "Mark new" : "Mark handled"}
                        </button>
                        <button onClick={() => deleteLead(e)} style={{ padding: "7px 12px", border: "1px solid #e7c9c4", background: "#fff", color: "#b3271b", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 13 }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ CONTENT (testimonials + features) ══ */}
        {tab === "content" && site && (
          <>
            <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>Content</h1>
            <p style={{ color: "#929292", marginTop: 8, fontSize: 15 }}>Testimonials and feature highlights shown on the homepage.</p>

            {/* Testimonials */}
            <SectionHeader title="Testimonials" onAdd={() =>
              setSite({ ...site, testimonials: [...site.testimonials, { id: newId(), quote: "", author: "", role: "" }] })
            } />
            <div style={{ display: "grid", gap: 12 }}>
              {site.testimonials.map((t, i) => (
                <ListCard key={t.id} index={i} onRemove={() => setSite({ ...site, testimonials: site.testimonials.filter((x) => x.id !== t.id) })}>
                  <FieldRow label="Quote">
                    <textarea value={t.quote} rows={2}
                      onChange={(ev) => setSite({ ...site, testimonials: patch(site.testimonials, i, { quote: ev.target.value }) })}
                      style={inputStyle} />
                  </FieldRow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FieldRow label="Author"><input value={t.author}
                      onChange={(ev) => setSite({ ...site, testimonials: patch(site.testimonials, i, { author: ev.target.value }) })} style={inputStyle} /></FieldRow>
                    <FieldRow label="Role"><input value={t.role}
                      onChange={(ev) => setSite({ ...site, testimonials: patch(site.testimonials, i, { role: ev.target.value }) })} style={inputStyle} /></FieldRow>
                  </div>
                </ListCard>
              ))}
            </div>

            {/* Features */}
            <SectionHeader title="Features" onAdd={() =>
              setSite({ ...site, features: [...site.features, { id: newId(), title: "", text: "" }] })
            } />
            <div style={{ display: "grid", gap: 12 }}>
              {site.features.map((f, i) => (
                <ListCard key={f.id} index={i} onRemove={() => setSite({ ...site, features: site.features.filter((x) => x.id !== f.id) })}>
                  <FieldRow label="Title"><input value={f.title}
                    onChange={(ev) => setSite({ ...site, features: patch(site.features, i, { title: ev.target.value }) })} style={inputStyle} /></FieldRow>
                  <FieldRow label="Text"><textarea value={f.text} rows={2}
                    onChange={(ev) => setSite({ ...site, features: patch(site.features, i, { text: ev.target.value }) })} style={inputStyle} /></FieldRow>
                </ListCard>
              ))}
            </div>

            <SaveBar saving={siteSaving} onSave={() => saveSite({ testimonials: site.testimonials, features: site.features }, "Content")} />
          </>
        )}

        {/* ══ SETTINGS ══ */}
        {tab === "settings" && site && (
          <>
            <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>Settings</h1>
            <p style={{ color: "#929292", marginTop: 8, fontSize: 15 }}>Building name, contact details and map location — used across the site.</p>

            <div style={{ marginTop: 28, maxWidth: 640, display: "grid", gap: 16 }}>
              <FieldRow label="Building name"><input value={site.settings.name} onChange={(e) => setSet(site, setSite, { name: e.target.value })} style={inputStyle} /></FieldRow>
              <FieldRow label="Tagline"><input value={site.settings.tagline} onChange={(e) => setSet(site, setSite, { tagline: e.target.value })} style={inputStyle} /></FieldRow>
              <FieldRow label="Description (footer)"><textarea value={site.settings.description} rows={3} onChange={(e) => setSet(site, setSite, { description: e.target.value })} style={inputStyle} /></FieldRow>
              <FieldRow label="Address"><input value={site.settings.address} onChange={(e) => setSet(site, setSite, { address: e.target.value })} style={inputStyle} /></FieldRow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldRow label="Phone"><input value={site.settings.phone} onChange={(e) => setSet(site, setSite, { phone: e.target.value })} style={inputStyle} /></FieldRow>
                <FieldRow label="Email"><input value={site.settings.email} onChange={(e) => setSet(site, setSite, { email: e.target.value })} style={inputStyle} /></FieldRow>
              </div>
              <FieldRow label="Opening hours"><input value={site.settings.hours} onChange={(e) => setSet(site, setSite, { hours: e.target.value })} style={inputStyle} /></FieldRow>

              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292", marginTop: 8 }}>Map location</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <FieldRow label="Latitude"><input type="number" step="0.0001" value={site.settings.mapLat} onChange={(e) => setSet(site, setSite, { mapLat: e.target.value === "" ? site.settings.mapLat : Number(e.target.value) })} style={inputStyle} /></FieldRow>
                <FieldRow label="Longitude"><input type="number" step="0.0001" value={site.settings.mapLng} onChange={(e) => setSet(site, setSite, { mapLng: e.target.value === "" ? site.settings.mapLng : Number(e.target.value) })} style={inputStyle} /></FieldRow>
                <FieldRow label="Zoom (1–20)"><input type="number" step="1" min={1} max={20} value={site.settings.mapZoom} onChange={(e) => setSet(site, setSite, { mapZoom: e.target.value === "" ? site.settings.mapZoom : Number(e.target.value) })} style={inputStyle} /></FieldRow>
              </div>
            </div>

            <SaveBar saving={siteSaving} onSave={() => saveSite({ settings: site.settings }, "Settings")} />
          </>
        )}
      </div>

      {/* editor drawer (home types) */}
      {editing && draft && (
        <>
          <div onClick={() => { setEditing(null); setDraft(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />
          <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 460, maxWidth: "94vw", background: "#fff", zIndex: 50, boxShadow: "-20px 0 60px rgba(0,0,0,0.14)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "22px 26px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292" }}>{planTypeLabel(editing.planType)}</div>
                <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>{editing.name}</div>
              </div>
              <button onClick={() => { setEditing(null); setDraft(null); }} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: "22px 26px", overflowY: "auto", flex: 1 }}>
              <TextField label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <NumField label="Price € / m²" value={draft.pricePerM2} step={50} onChange={(v) => setDraft({ ...draft, pricePerM2: v })} />
                <NumField label="Available" value={draft.available} step={1} onChange={(v) => setDraft({ ...draft, available: v })} />
                <NumField label="Total area (m²)" value={draft.area} step={0.1} onChange={(v) => setDraft({ ...draft, area: v })} />
                <NumField label="Living area (m²)" value={draft.livingArea} step={0.1} onChange={(v) => setDraft({ ...draft, livingArea: v })} />
                <NumField label="Terrace (m²)" value={draft.terrace} step={0.1} onChange={(v) => setDraft({ ...draft, terrace: v })} />
                <NumField label="Ceilings (m)" value={draft.ceiling} step={0.1} onChange={(v) => setDraft({ ...draft, ceiling: v })} />
                <NumField label="Rooms (0–4)" value={draft.rooms} step={1} onChange={(v) => setDraft({ ...draft, rooms: v })} />
              </div>
              <div style={{ marginTop: 4, padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: "#929292" }}>
                Total: <b style={{ color: "#000" }}>{formatPrice(Math.round(draft.area * draft.pricePerM2))}</b> ({draft.area} m² × {formatPrice(draft.pricePerM2)}/m²)
              </div>
              <TextField label="Orientation" value={draft.orientation} onChange={(v) => setDraft({ ...draft, orientation: v })} />
              <TextField label="View" value={draft.view} onChange={(v) => setDraft({ ...draft, view: v })} />
              <Field label="Description">
                <textarea value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
              </Field>
            </div>

            <div style={{ padding: "18px 26px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 10 }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: "13px", background: "#000", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: FONT, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "Save changes"}</button>
              <button onClick={() => { setEditing(null); setDraft(null); }} style={{ padding: "13px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 15, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#000", color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 14, zIndex: 60 }}>{toast}</div>
      )}
    </div>
  );
}

// ── helpers ──
function patch<T>(list: T[], i: number, changes: Partial<T>): T[] {
  return list.map((x, idx) => (idx === i ? { ...x, ...changes } : x));
}
function setSet(
  site: SiteContent,
  setSite: (s: SiteContent) => void,
  changes: Partial<SiteContent["settings"]>
) {
  setSite({ ...site, settings: { ...site.settings, ...changes } });
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 6,
  fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", background: "#fff", color: "#000",
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "36px 0 16px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</h2>
      <button onClick={onAdd} style={{ padding: "8px 14px", border: "1px solid #000", background: "#000", color: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 13 }}>+ Add</button>
    </div>
  );
}

function ListCard({ index, onRemove, children }: { index: number; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "18px 20px", display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292" }}>{String(index + 1).padStart(2, "0")}</span>
        <button onClick={onRemove} style={{ border: "none", background: "none", color: "#b3271b", cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Remove</button>
      </div>
      {children}
    </div>
  );
}

function SaveBar({ saving, onSave }: { saving: boolean; onSave: () => void }) {
  return (
    <div style={{ position: "sticky", bottom: 0, marginTop: 32, padding: "16px 0", background: "linear-gradient(to top, #fff 70%, rgba(255,255,255,0))" }}>
      <button onClick={onSave} disabled={saving} style={{ padding: "13px 28px", background: "#000", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: FONT, opacity: saving ? 0.6 : 1 }}>
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#929292", marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}
function NumField({ label, value, step, min = 0, onChange }: { label: string; value: number; step: number; min?: number; onChange: (v: number) => void }) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);
  return (
    <Field label={label}>
      <input
        type="number" value={raw} step={step} min={min}
        onChange={(e) => {
          const s = e.target.value;
          setRaw(s);
          if (s === "") return;
          const n = Number(s);
          if (Number.isFinite(n)) onChange(n);
        }}
        onBlur={() => { if (raw === "" || !Number.isFinite(Number(raw))) setRaw(String(value)); }}
        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontFamily: "inherit", outline: "none" }}
      />
    </Field>
  );
}
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
    </Field>
  );
}
