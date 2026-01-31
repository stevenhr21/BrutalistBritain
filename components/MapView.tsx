"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap, ScaleControl, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Building } from "@/lib/types";

// ============================================
// CONFIGURATION
// ============================================

// Toggle for engineering grid overlay
const SHOW_GRID = true;

// Set to true to try CartoDB Positron first (may fail without proper CORS)
// Set to false to always use reliable OSM tiles
const USE_PRIMARY_TILES = false;

// Tile providers
const TILE_PROVIDERS = {
  // Primary: CartoDB Positron (clean, may have CORS issues)
  positron: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
  },
  // Fallback: OpenStreetMap Standard (always works, no API key)
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ["a", "b", "c"],
  },
} as const;

// ============================================
// TYPES
// ============================================

interface MapViewProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
}

// ============================================
// TILE LAYER WITH FALLBACK
// ============================================

interface TileLayerWithFallbackProps {
  usePrimary: boolean;
}

function TileLayerWithFallback({ usePrimary }: TileLayerWithFallbackProps) {
  const [useOsmFallback, setUseOsmFallback] = useState(!usePrimary);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const errorCountRef = useRef(0);

  const currentProvider = useOsmFallback ? TILE_PROVIDERS.osm : TILE_PROVIDERS.positron;

  // Handle tile errors - switch to OSM fallback after a few errors
  const handleTileError = useCallback(() => {
    errorCountRef.current += 1;
    if (errorCountRef.current >= 3 && !useOsmFallback) {
      console.warn("Tile errors detected, switching to OSM fallback");
      setUseOsmFallback(true);
    }
  }, [useOsmFallback]);

  // Attach error handler when tile layer is ready
  useEffect(() => {
    const layer = tileLayerRef.current;
    if (layer) {
      layer.on("tileerror", handleTileError);
      return () => {
        layer.off("tileerror", handleTileError);
      };
    }
  }, [handleTileError, useOsmFallback]);

  return (
    <TileLayer
      ref={tileLayerRef}
      url={currentProvider.url}
      attribution={currentProvider.attribution}
      subdomains={currentProvider.subdomains as unknown as string}
      crossOrigin="anonymous"
    />
  );
}

// ============================================
// NUMBERED MARKERS WITH TOOLTIPS
// ============================================

function MapMarkers({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: MapViewProps) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  const crosshairRef = useRef<L.LayerGroup | null>(null);
  const focusFrameRef = useRef<L.Rectangle | null>(null);

  // Build a map of building ID to its index in filtered results
  const buildingIndexMap = useMemo(() => {
    const indexMap = new Map<string, number>();
    buildings.forEach((b, index) => {
      indexMap.set(b.id, index + 1); // 1-indexed for display
    });
    return indexMap;
  }, [buildings]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Clear existing crosshair and focus frame
    if (crosshairRef.current) {
      crosshairRef.current.remove();
      crosshairRef.current = null;
    }
    if (focusFrameRef.current) {
      focusFrameRef.current.remove();
      focusFrameRef.current = null;
    }

    // Add new markers
    buildings.forEach((building) => {
      const isSelected = selectedBuilding?.id === building.id;
      const markerNumber = buildingIndexMap.get(building.id) ?? 0;
      const displayNumber = markerNumber.toString().padStart(2, "0");

      const icon = L.divIcon({
        className: "bb-marker-wrapper",
        html: `
          <div class="bb-marker-numbered ${isSelected ? "bb-marker-numbered--selected" : ""}">
            <span class="bb-marker-number">${displayNumber}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([building.lat, building.lng], { icon })
        .addTo(map)
        .on("click", () => onSelectBuilding(building));

      // Add tooltip with building name
      marker.bindTooltip(building.name.toUpperCase(), {
        className: "bb-marker-tooltip",
        direction: "top",
        offset: [0, -16],
      });

      markersRef.current.push(marker);
    });

    // Add crosshair and focus frame for selected building
    if (selectedBuilding) {
      const lat = selectedBuilding.lat;
      const lng = selectedBuilding.lng;

      // Calculate crosshair size based on zoom level
      const zoom = map.getZoom();
      const offset = 0.0015 / Math.pow(2, zoom - 14); // Adjust based on zoom

      // Create crosshair lines
      const crosshairGroup = L.layerGroup();

      // Horizontal line
      const horizontalLine = L.polyline(
        [
          [lat, lng - offset * 2],
          [lat, lng + offset * 2],
        ],
        {
          color: "#FF4D00",
          weight: 1,
          opacity: 0.8,
          dashArray: "4, 4",
        }
      );

      // Vertical line
      const verticalLine = L.polyline(
        [
          [lat - offset * 2, lng],
          [lat + offset * 2, lng],
        ],
        {
          color: "#FF4D00",
          weight: 1,
          opacity: 0.8,
          dashArray: "4, 4",
        }
      );

      crosshairGroup.addLayer(horizontalLine);
      crosshairGroup.addLayer(verticalLine);
      crosshairGroup.addTo(map);
      crosshairRef.current = crosshairGroup;

      // Focus frame (square around marker)
      const frameOffset = offset * 1.5;
      const focusFrame = L.rectangle(
        [
          [lat - frameOffset, lng - frameOffset],
          [lat + frameOffset, lng + frameOffset],
        ],
        {
          color: "#0B0B0B",
          weight: 1,
          fill: false,
          opacity: 0.5,
          dashArray: "2, 2",
        }
      );
      focusFrame.addTo(map);
      focusFrameRef.current = focusFrame;
    }

    // Fit bounds to markers if there are buildings (and not focusing on selected)
    if (buildings.length > 0 && !selectedBuilding) {
      const bounds = L.latLngBounds(
        buildings.map((b) => [b.lat, b.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (crosshairRef.current) {
        crosshairRef.current.remove();
        crosshairRef.current = null;
      }
      if (focusFrameRef.current) {
        focusFrameRef.current.remove();
        focusFrameRef.current = null;
      }
    };
  }, [buildings, selectedBuilding, onSelectBuilding, map, buildingIndexMap]);

  return null;
}

// ============================================
// SELECTED BUILDING HANDLER
// ============================================

function SelectedBuildingHandler({
  selectedBuilding,
}: {
  selectedBuilding: Building | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedBuilding) {
      map.setView([selectedBuilding.lat, selectedBuilding.lng], 15, {
        animate: true,
      });
    }
  }, [selectedBuilding, map]);

  return null;
}

// ============================================
// MAIN MAP VIEW COMPONENT
// ============================================

export default function MapView({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: MapViewProps) {
  // Default center: London
  const defaultCenter: [number, number] = [51.5074, -0.1278];
  const defaultZoom = 12;

  const filteredCount = buildings.length;

  return (
    <div className={`bb-map-sheet ${SHOW_GRID ? "bb-map-sheet--grid" : ""}`}>
      {/* Header strip */}
      <div className="bb-map-header">
        <div className="bb-map-header-left">MAP — BRITAIN</div>
        <div className="bb-map-header-right">
          VERSION: 0.1 · SITES: {filteredCount.toString().padStart(2, "0")}
        </div>
      </div>

      {/* Map container with frame */}
      <div className="bb-map-frame">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          className="bb-map"
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
        >
          {/* Tile layer with automatic fallback */}
          <TileLayerWithFallback usePrimary={USE_PRIMARY_TILES} />
          
          <MapMarkers
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            onSelectBuilding={onSelectBuilding}
          />
          <SelectedBuildingHandler selectedBuilding={selectedBuilding} />
          <ScaleControl position="bottomleft" metric={true} imperial={false} />
        </MapContainer>

        {/* Engineering grid overlay (CSS-based, over the map) */}
        {SHOW_GRID && <div className="bb-map-grid-overlay" />}

        {/* Legend plate */}
        <div className="bb-map-legend">
          <div className="bb-map-legend-title">LEGEND</div>
          <div className="bb-map-legend-item">
            <div className="bb-map-legend-marker"></div>
            <span>SITE</span>
          </div>
          <div className="bb-map-legend-item">
            <div className="bb-map-legend-marker bb-map-legend-marker--selected"></div>
            <span>SELECTED</span>
          </div>
          <div className="bb-map-legend-item">
            <div className="bb-map-legend-marker-example">01</div>
            <span>NOTATION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
