"use client";

import {
  BUILDING_TYPES,
  BUILDING_STATUSES,
  DECADES,
  type BuildingType,
  type BuildingStatus,
} from "@/lib/types";

interface FilterChipsProps {
  selectedTypes: BuildingType[];
  selectedStatuses: BuildingStatus[];
  selectedDecades: number[];
  onTypeChange: (types: BuildingType[]) => void;
  onStatusChange: (statuses: BuildingStatus[]) => void;
  onDecadeChange: (decades: number[]) => void;
}

export default function FilterChips({
  selectedTypes,
  selectedStatuses,
  selectedDecades,
  onTypeChange,
  onStatusChange,
  onDecadeChange,
}: FilterChipsProps) {
  const toggleType = (type: BuildingType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const toggleStatus = (status: BuildingStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const toggleDecade = (decade: number) => {
    if (selectedDecades.includes(decade)) {
      onDecadeChange(selectedDecades.filter((d) => d !== decade));
    } else {
      onDecadeChange([...selectedDecades, decade]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Type Filter */}
      <div>
        <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
          TYPE
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {BUILDING_TYPES.map(({ value, label }) => (
            <button
              key={value}
              className={`bb-chip ${selectedTypes.includes(value) ? "bb-chip--active" : ""}`}
              onClick={() => toggleType(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
          STATUS
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {BUILDING_STATUSES.map(({ value, label }) => (
            <button
              key={value}
              className={`bb-chip ${selectedStatuses.includes(value) ? "bb-chip--active" : ""}`}
              onClick={() => toggleStatus(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Decade Filter */}
      <div>
        <p className="bb-label" style={{ marginBottom: "0.5rem" }}>
          DECADE
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {DECADES.map((decade) => (
            <button
              key={decade}
              className={`bb-chip ${selectedDecades.includes(decade) ? "bb-chip--active" : ""}`}
              onClick={() => toggleDecade(decade)}
            >
              {decade}S
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
