import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllBuildings,
  getBuildingById,
  getNearbyBuildings,
} from "@/lib/buildings";
import { formatDistance } from "@/lib/geo";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ c?: string }>;
}

export async function generateStaticParams() {
  const buildings = getAllBuildings();
  return buildings.map((building) => ({
    id: building.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const building = getBuildingById(id);

  if (!building) {
    return {
      title: "Building Not Found — Brutalist Britain",
    };
  }

  return {
    title: `${building.name} — Brutalist Britain`,
    description: building.shortBlurb,
    openGraph: {
      title: `${building.name} — Brutalist Britain`,
      description: building.shortBlurb,
      type: "website",
    },
  };
}

export default async function BuildingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { c: collectionId } = await searchParams;
  const building = getBuildingById(id);

  if (!building) {
    notFound();
  }

  const nearbyBuildings = getNearbyBuildings(building, 3);
  const backToMapUrl = collectionId ? `/map?c=${collectionId}` : "/map";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div className="bb-container" style={{ maxWidth: "900px" }}>
        {/* Back link */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href={backToMapUrl} className="bb-button bb-button--small">
            ← BACK TO MAP
          </Link>
        </div>

        {/* Header */}
        <header style={{ marginBottom: "2rem" }}>
          <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
            {building.area.toUpperCase()}
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem" }}>
            {building.name}
          </h1>
          <p
            className="bb-mono"
            style={{
              fontSize: "1rem",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            {building.shortBlurb}
          </p>
        </header>

        {/* Hero Image */}
        {building.image && (
          <section style={{ marginBottom: "2rem" }}>
            <p
              className="bb-mono"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
                opacity: 0.7,
              }}
            >
              PHOTO
            </p>
            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 9",
                border: "2px solid var(--bb-ink)",
                overflow: "hidden",
              }}
            >
              <Image
                src={building.image}
                alt={building.imageAlt || `Photo of ${building.name}`}
                fill
                style={{
                  objectFit: "cover",
                }}
                sizes="(max-width: 900px) 100vw, 900px"
                priority
              />
            </div>
          </section>
        )}

        <hr className="bb-divider" />

        {/* Facts Grid */}
        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "0.875rem",
              marginBottom: "1rem",
              letterSpacing: "0.1em",
            }}
          >
            KEY FACTS
          </h2>
          <div
            className="bb-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1px",
              backgroundColor: "var(--bb-ink)",
            }}
          >
            <div style={{ padding: "1rem", backgroundColor: "var(--bb-paper)" }}>
              <p className="bb-label">YEAR</p>
              <p className="bb-mono" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                {building.year ?? "UNKNOWN"}
              </p>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "var(--bb-paper)" }}>
              <p className="bb-label">TYPE</p>
              <p
                className="bb-mono"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {building.type.replace("_", " ")}
              </p>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "var(--bb-paper)" }}>
              <p className="bb-label">STATUS</p>
              <p
                className="bb-mono"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {building.status}
              </p>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "var(--bb-paper)" }}>
              <p className="bb-label">ARCHITECT</p>
              <p className="bb-mono" style={{ fontSize: "1rem", fontWeight: 600 }}>
                {building.architect ?? "UNKNOWN"}
              </p>
            </div>
          </div>
        </section>

        {/* Tags */}
        {building.tags.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "0.875rem",
                marginBottom: "1rem",
                letterSpacing: "0.1em",
              }}
            >
              TAGS
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {building.tags.map((tag, idx) => (
                <span key={idx} className="bb-chip" style={{ cursor: "default" }}>
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <hr className="bb-divider" />

        {/* Photos */}
        {building.photos.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "0.875rem",
                marginBottom: "1rem",
                letterSpacing: "0.1em",
              }}
            >
              PHOTOS
            </h2>
            <div
              className="bb-panel"
              style={{ padding: "1.5rem" }}
            >
              {building.photos.map((photo, idx) => (
                <div key={idx} style={{ marginBottom: idx < building.photos.length - 1 ? "1rem" : 0 }}>
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bb-button"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    VIEW PHOTOS ON WIKIMEDIA →
                  </a>
                  <p
                    className="bb-mono"
                    style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.5rem" }}
                  >
                    {photo.credit} • {photo.license}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sources */}
        {building.sources.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "0.875rem",
                marginBottom: "1rem",
                letterSpacing: "0.1em",
              }}
            >
              SOURCES
            </h2>
            <div className="bb-panel" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {building.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bb-mono"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {source.label} →
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <hr className="bb-divider" />

        {/* Nearby Buildings */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "0.875rem",
              marginBottom: "1rem",
              letterSpacing: "0.1em",
            }}
          >
            NEARBY
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {nearbyBuildings.map(({ building: nearby, distance }) => (
              <Link
                key={nearby.id}
                href={collectionId ? `/b/${nearby.id}?c=${collectionId}` : `/b/${nearby.id}`}
                className="bb-card"
                style={{ textDecoration: "none" }}
              >
                <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                  {nearby.name}
                </h3>
                <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
                  {nearby.area}
                </p>
                <p
                  className="bb-mono"
                  style={{ fontSize: "0.75rem", color: "var(--bb-accent)" }}
                >
                  {formatDistance(distance)} AWAY
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "var(--bb-border)",
            paddingTop: "2rem",
            textAlign: "center",
          }}
        >
          <Link href={backToMapUrl} className="bb-button bb-button--accent">
            ← BACK TO MAP
          </Link>
        </footer>
      </div>
    </main>
  );
}
