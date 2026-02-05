"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Building, Collection, BuildingType, BuildingStatus } from "@/lib/types";
import FilterChips from "./FilterChips";
import CollectionList from "./CollectionList";
import BuildingCard from "./BuildingCard";

interface SidebarProps {
  buildings: Building[];
  allBuildings: Building[];
  collections: Collection[];
  search: string;
  selectedTypes: BuildingType[];
  selectedStatuses: BuildingStatus[];
  selectedDecades: number[];
  selectedCollectionId: string | null;
  selectedBuilding: Building | null;
  onSearchChange: (search: string) => void;
  onTypeChange: (types: BuildingType[]) => void;
  onStatusChange: (statuses: BuildingStatus[]) => void;
  onDecadeChange: (decades: number[]) => void;
  onSelectCollection: (collectionId: string | null) => void;
  onSelectBuilding: (building: Building) => void;
}

export default function Sidebar({
  buildings,
  allBuildings,
  collections,
  search,
  selectedTypes,
  selectedStatuses,
  selectedDecades,
  selectedCollectionId,
  selectedBuilding,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onDecadeChange,
  onSelectCollection,
  onSelectBuilding,
}: SidebarProps) {
  // Create a Set of all building IDs for collection count calculation
  const allBuildingIds = useMemo(() => {
    return new Set(allBuildings.map((b) => b.id));
  }, [allBuildings]);
  const hasActiveFilters = useMemo(() => {
    return (
      selectedTypes.length > 0 ||
      selectedStatuses.length > 0 ||
      selectedDecades.length > 0 ||
      selectedCollectionId !== null ||
      search.length > 0
    );
  }, [selectedTypes, selectedStatuses, selectedDecades, selectedCollectionId, search]);

  const clearFilters = () => {
    onSearchChange("");
    onTypeChange([]);
    onStatusChange([]);
    onDecadeChange([]);
    onSelectCollection(null);
  };

  return (
    <aside
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
        <Link
          href="/"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "block",
          }}
          className="bb-header-link"
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            BRUTALIST BRITAIN
          </h2>
          <p className="bb-mono" style={{ fontSize: "0.7rem", opacity: 0.7 }}>
            BRITAIN'S CONCRETE LANDMARKS
          </p>
        </Link>
      </div>

      {/* Search */}
      <div style={{ padding: "1rem", borderBottom: "var(--bb-border)" }}>
        <input
          type="text"
          className="bb-input"
          placeholder="SEARCH NAME OR AREA..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Filters */}
        <div style={{ padding: "1rem", borderBottom: "var(--bb-border)" }}>
          <FilterChips
            selectedTypes={selectedTypes}
            selectedStatuses={selectedStatuses}
            selectedDecades={selectedDecades}
            onTypeChange={onTypeChange}
            onStatusChange={onStatusChange}
            onDecadeChange={onDecadeChange}
          />
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bb-button bb-button--small"
              style={{ marginTop: "1rem", width: "100%" }}
            >
              CLEAR ALL FILTERS
            </button>
          )}
        </div>

        {/* Collections */}
        <div style={{ padding: "1rem", borderBottom: "var(--bb-border)" }}>
          <CollectionList
            collections={collections}
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={onSelectCollection}
            allBuildingIds={allBuildingIds}
            totalBuildingCount={allBuildings.length}
          />
        </div>

        {/* Building List */}
        <div style={{ padding: "1rem", flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <p className="bb-label">
              {buildings.length} BUILDING{buildings.length !== 1 ? "S" : ""}
            </p>
          </div>

          {buildings.length === 0 ? (
            <div
              style={{
                padding: "2rem 1rem",
                textAlign: "center",
                border: "var(--bb-border)",
                borderStyle: "dashed",
              }}
            >
              <p className="bb-mono" style={{ fontSize: "0.8rem" }}>
                NO RESULTS.
                <br />
                RELAX FILTERS.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {buildings.map((building) => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  isSelected={selectedBuilding?.id === building.id}
                  onClick={() => onSelectBuilding(building)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
