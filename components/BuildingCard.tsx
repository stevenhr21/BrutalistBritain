"use client";

import type { Building } from "@/lib/types";

interface BuildingCardProps {
  building: Building;
  isSelected: boolean;
  onClick: () => void;
}

export default function BuildingCard({
  building,
  isSelected,
  onClick,
}: BuildingCardProps) {
  return (
    <article
      className={`bb-card ${isSelected ? "bb-card--selected" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <h3
        style={{
          fontSize: "0.95rem",
          marginBottom: "0.25rem",
          lineHeight: 1.2,
        }}
      >
        {building.name}
      </h3>
      <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
        {building.area}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          fontSize: "0.7rem",
        }}
        className="bb-mono"
      >
        <span>{building.year ?? "UNKNOWN"}</span>
        <span>•</span>
        <span style={{ textTransform: "uppercase" }}>
          {building.type.replace("_", " ")}
        </span>
      </div>
    </article>
  );
}
