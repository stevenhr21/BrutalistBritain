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
import KoFiButton from "@/components/KoFiWidget";
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

  // Lock body scroll when mobile drawer or sidebar is open
  useEffect(() => {
    const isOpen = isMobileDrawerOpen || isMobileSidebarOpen;
    if (isOpen) {
      document.body.classList.add("bb-mobile-scroll-lock");
    } else {
      document.body.classList.remove("bb-mobile-scroll-lock");
    }
    return () => {
      document.body.classList.remove("bb-mobile-scroll-lock");
    };
  }, [isMobileDrawerOpen, isMobileSidebarOpen]);

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
      className="bb-map-page-container"
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Mobile Toggle Button - positioned in the title strip area */}
      <div
        className="mobile-controls"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1100,
          display: "none",
        }}
      >
        <button
          className="bb-button bb-button--small bb-mobile-menu-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? "✕" : "☰"}
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
              isMobile={false}
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

      {/* Mobile Drawer Sheet - Bottom Sheet */}
      <div
        className="mobile-drawer-sheet"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "70dvh",
          backgroundColor: "var(--bb-paper)",
          borderTop: "3px solid var(--bb-ink)",
          zIndex: 1001,
          transform: isMobileDrawerOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.2s ease",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {/* Mobile Sheet Handle */}
        <div className="bb-mobile-sheet-header">
          <div className="bb-mobile-sheet-handle" />
          <button
            className="bb-button bb-button--small bb-mobile-sheet-close"
            onClick={handleCloseDrawer}
          >
            ✕ CLOSE
          </button>
        </div>
        <BuildingDrawer
          building={selectedBuilding}
          collectionId={selectedCollectionId}
          onClose={handleCloseDrawer}
          isMobile={true}
        />
      </div>

      {/* Ko-Fi Support Button - Floating */}
      <KoFiButton variant="floating" drawerOpen={!!selectedBuilding} />

      <style jsx>{`
        @media (max-width: 900px) {
          .drawer-container {
            display: none !important;
          }
          .mobile-drawer-overlay,
          .mobile-drawer-sheet {
            display: block !important;
          }
          .sidebar-container {
            position: fixed !important;
            left: 0;
            top: 0;
            z-index: 1001;
            transform: ${isMobileSidebarOpen ? "translateX(0)" : "translateX(-100%)"};
            transition: transform 0.2s ease;
            width: min(320px, 85vw) !important;
            height: 100% !important;
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
