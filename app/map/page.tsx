"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MapClient from "@/components/MapClient";
import BuildingDrawer from "@/components/BuildingDrawer";
import {
  getAllBuildings,
  getAllCollections,
  filterBuildings,
  getBuildingById,
} from "@/lib/buildings";
import type { Building, BuildingType, BuildingStatus, FilterState } from "@/lib/types";

function MapPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial values from URL
  const initialCollectionId = searchParams.get("c");
  const initialBuildingId = searchParams.get("b");

  // State
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<BuildingType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<BuildingStatus[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<number[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(
    initialCollectionId
  );
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    initialBuildingId ? getBuildingById(initialBuildingId) ?? null : null
  );
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data
  const allBuildings = useMemo(() => getAllBuildings(), []);
  const collections = useMemo(() => getAllCollections(), []);

  // Filter state
  const filterState: FilterState = useMemo(
    () => ({
      search,
      types: selectedTypes,
      statuses: selectedStatuses,
      decades: selectedDecades,
      collectionId: selectedCollectionId,
    }),
    [search, selectedTypes, selectedStatuses, selectedDecades, selectedCollectionId]
  );

  // Filtered buildings
  const filteredBuildings = useMemo(
    () => filterBuildings(allBuildings, filterState),
    [allBuildings, filterState]
  );

  // Update URL when collection changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCollectionId) {
      params.set("c", selectedCollectionId);
    }
    if (selectedBuilding) {
      params.set("b", selectedBuilding.id);
    }
    const newUrl = params.toString() ? `/map?${params.toString()}` : "/map";
    router.replace(newUrl, { scroll: false });
  }, [selectedCollectionId, selectedBuilding, router]);

  // Handle building selection
  const handleSelectBuilding = useCallback((building: Building) => {
    setSelectedBuilding(building);
    setIsMobileDrawerOpen(true);
  }, []);

  // Handle closing drawer
  const handleCloseDrawer = useCallback(() => {
    setSelectedBuilding(null);
    setIsMobileDrawerOpen(false);
  }, []);

  // Handle collection selection
  const handleSelectCollection = useCallback((collectionId: string | null) => {
    setSelectedCollectionId(collectionId);
    setSelectedBuilding(null);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Mobile Toggle Buttons */}
      <div
        className="mobile-controls"
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1100,
          display: "none",
        }}
      >
        <button
          className="bb-button bb-button--small"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          style={{
            backgroundColor: "var(--bb-paper)",
          }}
        >
          {isMobileSidebarOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* Left Sidebar */}
      <div
        className="sidebar-container"
        style={{
          width: "360px",
          flexShrink: 0,
          borderRight: "var(--bb-border)",
          height: "100%",
        }}
      >
        <Sidebar
          buildings={filteredBuildings}
          collections={collections}
          search={search}
          selectedTypes={selectedTypes}
          selectedStatuses={selectedStatuses}
          selectedDecades={selectedDecades}
          selectedCollectionId={selectedCollectionId}
          selectedBuilding={selectedBuilding}
          onSearchChange={setSearch}
          onTypeChange={setSelectedTypes}
          onStatusChange={setSelectedStatuses}
          onDecadeChange={setSelectedDecades}
          onSelectCollection={handleSelectCollection}
          onSelectBuilding={handleSelectBuilding}
        />
      </div>

      {/* Map */}
      <div style={{ flex: 1, height: "100%", position: "relative" }}>
        <MapClient
          buildings={filteredBuildings}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
        />
      </div>

      {/* Right Drawer - Desktop */}
      <div
        className="drawer-container"
        style={{
          width: selectedBuilding ? "380px" : "0",
          flexShrink: 0,
          borderLeft: selectedBuilding ? "var(--bb-border)" : "none",
          height: "100%",
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >
        {selectedBuilding && (
          <div style={{ width: "380px", height: "100%" }}>
            <BuildingDrawer
              building={selectedBuilding}
              collectionId={selectedCollectionId}
              onClose={handleCloseDrawer}
            />
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className="mobile-sidebar-overlay"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          opacity: isMobileSidebarOpen ? 1 : 0,
          pointerEvents: isMobileSidebarOpen ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Drawer Overlay */}
      <div
        className="mobile-drawer-overlay"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          opacity: isMobileDrawerOpen ? 1 : 0,
          pointerEvents: isMobileDrawerOpen ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
        onClick={handleCloseDrawer}
      />

      {/* Mobile Drawer Sheet */}
      <div
        className="mobile-drawer-sheet"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "70vh",
          backgroundColor: "var(--bb-paper)",
          borderTop: "var(--bb-border)",
          zIndex: 1001,
          transform: isMobileDrawerOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.2s ease",
        }}
      >
        <BuildingDrawer
          building={selectedBuilding}
          collectionId={selectedCollectionId}
          onClose={handleCloseDrawer}
        />
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .drawer-container {
            display: none !important;
          }
          .mobile-drawer-overlay,
          .mobile-drawer-sheet {
            display: block !important;
          }
        }

        @media (max-width: 768px) {
          .sidebar-container {
            position: fixed !important;
            left: 0;
            top: 0;
            z-index: 1001;
            transform: ${isMobileSidebarOpen ? "translateX(0)" : "translateX(-100%)"};
            transition: transform 0.2s ease;
            width: 320px !important;
          }
          .mobile-controls {
            display: block !important;
          }
          .mobile-sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bb-paper)",
          }}
        >
          <p className="bb-mono">LOADING MAP...</p>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
