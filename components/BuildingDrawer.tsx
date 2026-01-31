"use client";

import Link from "next/link";
import Image from "next/image";
import type { Building } from "@/lib/types";

interface BuildingDrawerProps {
  building: Building | null;
  collectionId: string | null;
  onClose: () => void;
}

export default function BuildingDrawer({
  building,
  collectionId,
  onClose,
}: BuildingDrawerProps) {
  if (!building) return null;

  const copyLink = async () => {
    const url = `${window.location.origin}/b/${building.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Link copied!");
    }
  };

  const buildingPageUrl = collectionId
    ? `/b/${building.id}?c=${collectionId}`
    : `/b/${building.id}`;

  return (
    <div
      className="bb-panel"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "var(--bb-border)",
        }}
      >
        <p className="bb-label" style={{ marginBottom: "0.25rem" }}>
          SELECTED BUILDING
        </p>
        <h2 style={{ fontSize: "1.25rem", lineHeight: 1.1 }}>{building.name}</h2>
        <p className="bb-mono" style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          {building.area}
        </p>
      </div>

      {/* Building Image */}
      {building.image && (
        <div
          style={{
            borderBottom: "var(--bb-border)",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 10.5",
              border: "2px solid var(--bb-ink)",
              margin: "1rem",
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
              sizes="380px"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
        }}
      >
        {/* Facts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <p className="bb-label">YEAR</p>
            <p className="bb-mono" style={{ fontSize: "0.9rem" }}>
              {building.year ?? "UNKNOWN"}
            </p>
          </div>
          <div>
            <p className="bb-label">TYPE</p>
            <p
              className="bb-mono"
              style={{ fontSize: "0.9rem", textTransform: "uppercase" }}
            >
              {building.type.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="bb-label">ARCHITECT</p>
            <p className="bb-mono" style={{ fontSize: "0.9rem" }}>
              {building.architect ?? "UNKNOWN"}
            </p>
          </div>
          <div>
            <p className="bb-label">STATUS</p>
            <p
              className="bb-mono"
              style={{ fontSize: "0.9rem", textTransform: "uppercase" }}
            >
              {building.status}
            </p>
          </div>
        </div>

        <hr className="bb-divider" />

        {/* Tags */}
        {building.tags.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
              TAGS
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {building.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bb-chip"
                  style={{ cursor: "default" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {building.photos.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
              PHOTOS
            </p>
            {building.photos.map((photo, idx) => (
              <div key={idx} style={{ marginBottom: "0.5rem" }}>
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bb-mono"
                  style={{ fontSize: "0.8rem" }}
                >
                  VIEW MORE PHOTOS →
                </a>
                <p
                  className="bb-mono"
                  style={{ fontSize: "0.7rem", opacity: 0.6 }}
                >
                  {photo.credit} • {photo.license}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "1rem",
          borderTop: "var(--bb-border)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Link href={buildingPageUrl} className="bb-button bb-button--accent">
          OPEN PAGE
        </Link>
        <button onClick={copyLink} className="bb-button">
          COPY LINK
        </button>
        <button onClick={onClose} className="bb-button">
          BACK TO RESULTS
        </button>
      </div>
    </div>
  );
}
