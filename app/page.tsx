import Link from "next/link";
import { getAllCollections } from "@/lib/buildings";

// TODO: Replace with your actual GitHub repo URL
const GITHUB_ISSUE_URL = "https://github.com/YOUR_USER/YOUR_REPO/issues/new/choose";

export default function HomePage() {
  const collections = getAllCollections();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-4xl">
          {/* Logo / Title */}
          <h1 className="mb-4" style={{ lineHeight: 0.9 }}>
            BRUTALIST
            <br />
            <span style={{ color: "var(--bb-accent)" }}>BRITAIN</span>
          </h1>

          {/* Subtitle */}
          <p
            className="bb-mono mb-8"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
              maxWidth: "500px",
              margin: "0 auto 2rem",
              opacity: 0.8,
            }}
          >
            BRITAIN&apos;S CONCRETE LANDMARKS.
            <br />
            MAPPED. DOCUMENTED. PRESERVED.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/map" className="bb-button bb-button--accent">
              ENTER MAP
            </Link>
            <a
              href={GITHUB_ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bb-button"
            >
              SUGGEST A BUILDING
            </a>
          </div>

          {/* Divider */}
          <hr className="bb-divider" style={{ maxWidth: "200px", margin: "0 auto 2rem" }} />

          {/* Collections */}
          <div className="mb-8">
            <p className="bb-label mb-4">EXPLORE COLLECTIONS</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/map?c=${collection.id}`}
                  className="bb-chip bb-chip--accent"
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "var(--bb-border)",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <p className="bb-mono" style={{ fontSize: "0.7rem", opacity: 0.6 }}>
          NO LOGIN. NO TRACKING. OPEN DATA ONLY.
        </p>
      </footer>
    </main>
  );
}
