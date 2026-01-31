export type BuildingType = 
  | 'housing' 
  | 'civic' 
  | 'mixed_use' 
  | 'education' 
  | 'transport' 
  | 'commercial' 
  | 'other';

export type BuildingStatus = 
  | 'standing' 
  | 'altered' 
  | 'threatened' 
  | 'demolished';

export interface Photo {
  url: string;
  credit: string;
  license: string;
}

export interface Source {
  label: string;
  url: string;
}

export interface Building {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  type: BuildingType;
  year: number | null;
  architect: string | null;
  status: BuildingStatus;
  shortBlurb: string;
  tags: string[];
  photos: Photo[];
  sources: Source[];
  image?: string;      // Path under /public, e.g. "/buildings/barbican_estate.webp"
  imageAlt?: string;   // Alt text for the image
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  buildingIds: string[];
}

export interface FilterState {
  search: string;
  types: BuildingType[];
  statuses: BuildingStatus[];
  decades: number[];
  collectionId: string | null;
}

export const BUILDING_TYPES: { value: BuildingType; label: string }[] = [
  { value: 'housing', label: 'HOUSING' },
  { value: 'civic', label: 'CIVIC' },
  { value: 'mixed_use', label: 'MIXED USE' },
  { value: 'education', label: 'EDUCATION' },
  { value: 'transport', label: 'TRANSPORT' },
  { value: 'commercial', label: 'COMMERCIAL' },
  { value: 'other', label: 'OTHER' },
];

export const BUILDING_STATUSES: { value: BuildingStatus; label: string }[] = [
  { value: 'standing', label: 'STANDING' },
  { value: 'altered', label: 'ALTERED' },
  { value: 'threatened', label: 'THREATENED' },
  { value: 'demolished', label: 'DEMOLISHED' },
];

export const DECADES = [1950, 1960, 1970, 1980];
