"use client";

import { useState, useMemo } from "react";
import type { Collection } from "@/lib/types";

interface CollectionListProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (collectionId: string | null) => void;
  allBuildingIds: Set<string>;
  totalBuildingCount: number;
}

export default function CollectionList({
  collections,
  selectedCollectionId,
  onSelectCollection,
  allBuildingIds,
  totalBuildingCount,
}: CollectionListProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate the count of valid buildings for each collection
  const collectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    collections.forEach((collection) => {
      const validCount = collection.buildingIds.filter((id) =>
        allBuildingIds.has(id)
      ).length;
      counts.set(collection.id, validCount);
    });
    return counts;
  }, [collections, allBuildingIds]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bb-label"
        style={{
          marginBottom: isOpen ? "0.5rem" : 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "inherit",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          textTransform: "uppercase",
        }}
      >
        <span>COLLECTIONS</span>
        <span
          style={{
            fontSize: "0.7rem",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {/* All buildings option */}
          <button
            className={`bb-chip ${selectedCollectionId === null ? "bb-chip--active bb-chip--accent" : ""}`}
            onClick={() => onSelectCollection(null)}
            style={{ justifyContent: "space-between" }}
          >
            <span>ALL BUILDINGS</span>
            <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{totalBuildingCount}</span>
          </button>

          {collections.map((collection) => (
            <button
              key={collection.id}
              className={`bb-chip ${selectedCollectionId === collection.id ? "bb-chip--active bb-chip--accent" : ""}`}
              onClick={() => onSelectCollection(collection.id)}
              style={{ justifyContent: "space-between" }}
              title={collection.description}
            >
              <span>{collection.name}</span>
              <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                {collectionCounts.get(collection.id) || 0}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
