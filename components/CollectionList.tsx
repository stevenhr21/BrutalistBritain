"use client";

import type { Collection } from "@/lib/types";

interface CollectionListProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (collectionId: string | null) => void;
}

export default function CollectionList({
  collections,
  selectedCollectionId,
  onSelectCollection,
}: CollectionListProps) {
  return (
    <div>
      <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
        COLLECTIONS
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        {/* All buildings option */}
        <button
          className={`bb-chip ${selectedCollectionId === null ? "bb-chip--active bb-chip--accent" : ""}`}
          onClick={() => onSelectCollection(null)}
          style={{ justifyContent: "flex-start" }}
        >
          ALL BUILDINGS
        </button>

        {collections.map((collection) => (
          <button
            key={collection.id}
            className={`bb-chip ${selectedCollectionId === collection.id ? "bb-chip--active bb-chip--accent" : ""}`}
            onClick={() => onSelectCollection(collection.id)}
            style={{ justifyContent: "flex-start" }}
            title={collection.description}
          >
            {collection.name}
          </button>
        ))}
      </div>
    </div>
  );
}
