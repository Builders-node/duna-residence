import ApartmentCard from "@/components/ApartmentCard";
import { getStoredApartments } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ApartmentsPage() {
  const types = await getStoredApartments();
  const available = types.reduce((s, t) => s + t.available, 0);

  return (
    <main style={{ paddingTop: "144rem", paddingBottom: "40rem" }}>
      <div className="wrap">
        <div className="eyebrow">Catalogue</div>
        <h1 className="fn-h2" style={{ marginTop: "16rem" }}>
          Three home types
        </h1>
        <p
          className="serif"
          style={{ marginTop: "16rem", maxWidth: "34em", color: "var(--gray-3)", fontSize: "18rem" }}
        >
          Choose a type — the price is simply per m². Only {available} residences
          still available.
        </p>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3"
          style={{ marginTop: "48rem", gap: "24rem" }}
        >
          {types.map((a) => (
            <ApartmentCard key={a.id} a={a} />
          ))}
        </div>
      </div>
    </main>
  );
}
