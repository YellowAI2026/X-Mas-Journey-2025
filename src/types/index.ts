export type AgeGroup = 'infant' | 'child' | 'teen' | 'adult' | 'senior';

export type Interest =
  | 'culinary'
  | 'culture'
  | 'shopping'
  | 'relaxation'
  | 'action'
  | 'nature';

export type TransportMode = 'foot' | 'public' | 'car' | 'mixed';

export type District =
  | 'all'
  | 'altstadt-lehel'
  | 'maxvorstadt'
  | 'ludwigsvorstadt-isarvorstadt'
  | 'schwabing-west'
  | 'schwabing-freimann'
  | 'au-haidhausen'
  | 'sendling'
  | 'obergiesing';

export interface Person {
  id: string;
  ageGroup: AgeGroup;
  interests: Interest[];
  mobilityRestrictions?: string;
}

export interface RoutePreferences {
  date: Date;
  startTime: string;
  endTime: string;
  transportMode: TransportMode;
  budgetMin: number;
  budgetMax: number;
  district?: District;
  indoorPreference?: boolean;
  childFriendly?: boolean;
  additionalWishes?: string;
}

export interface RoutePoint {
  id: string;
  name: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  duration: number; // in minutes
  suitableFor: AgeGroup[];
  christmasFeatures: string[];
  category: 'market' | 'culture' | 'nature' | 'gastronomy' | 'attraction' | 'rest';
  openingHours?: string;
  estimatedCost?: number;
}

export interface Route {
  id: string;
  createdAt: Date;
  persons: Person[];
  preferences: RoutePreferences;
  points: RoutePoint[];
  totalDuration: number; // in minutes
  totalDistance: number; // in kilometers
  estimatedCost: number;
}

export interface RouteGenerationRequest {
  persons: Person[];
  preferences: RoutePreferences;
}
