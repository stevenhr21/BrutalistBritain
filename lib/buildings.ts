import { Building, Collection, FilterState } from './types';
import { haversineDistance } from './geo';
import buildingsData from '@/data/buildings.json';
import collectionsData from '@/data/collections.json';

export function getAllBuildings(): Building[] {
  return buildingsData as Building[];
}

export function getAllCollections(): Collection[] {
  return collectionsData as Collection[];
}

export function getBuildingById(id: string): Building | undefined {
  return getAllBuildings().find((b) => b.id === id);
}

export function getCollectionById(id: string): Collection | undefined {
  return getAllCollections().find((c) => c.id === id);
}

export function getDecade(year: number | null): number | null {
  if (year === null) return null;
  return Math.floor(year / 10) * 10;
}

export function filterBuildings(
  buildings: Building[],
  filters: FilterState
): Building[] {
  return buildings.filter((building) => {
    // Search filter (name or area)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = building.name.toLowerCase().includes(searchLower);
      const areaMatch = building.area.toLowerCase().includes(searchLower);
      if (!nameMatch && !areaMatch) return false;
    }

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(building.type)) {
      return false;
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(building.status)) {
      return false;
    }

    // Decade filter
    if (filters.decades.length > 0) {
      const decade = getDecade(building.year);
      if (decade === null || !filters.decades.includes(decade)) {
        return false;
      }
    }

    // Collection filter
    if (filters.collectionId) {
      const collection = getCollectionById(filters.collectionId);
      if (collection && !collection.buildingIds.includes(building.id)) {
        return false;
      }
    }

    return true;
  });
}

export function getNearbyBuildings(
  building: Building,
  count: number = 3
): { building: Building; distance: number }[] {
  const allBuildings = getAllBuildings();
  
  const withDistances = allBuildings
    .filter((b) => b.id !== building.id)
    .map((b) => ({
      building: b,
      distance: haversineDistance(building.lat, building.lng, b.lat, b.lng),
    }))
    .sort((a, b) => a.distance - b.distance);

  return withDistances.slice(0, count);
}

export function getBuildingsByCollection(collectionId: string): Building[] {
  const collection = getCollectionById(collectionId);
  if (!collection) return [];
  
  const allBuildings = getAllBuildings();
  return allBuildings.filter((b) => collection.buildingIds.includes(b.id));
}
