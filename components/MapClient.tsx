"use client";

import dynamic from "next/dynamic";
import type { Building } from "@/lib/types";

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="bb-map-sheet" style={{ background: "var(--bb-paper)" }}>
      <div className="bb-map-header">
        <div className="bb-map-header-left">MAP — BRITAIN</div>
        <div className="bb-map-header-right">LOADING...</div>
      </div>
      <div className="bb-map-frame">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="bb-skeleton" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  ),
});

interface MapClientProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
}

export default function MapClient({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: MapClientProps) {
  return (
    <MapView
      buildings={buildings}
      selectedBuilding={selectedBuilding}
      onSelectBuilding={onSelectBuilding}
    />
  );
}
