import type { Route } from '../types';

const STORAGE_KEY = 'weihnachts-routes';

export function saveRoute(route: Route): void {
  try {
    const routes = getSavedRoutes();
    routes.push(route);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  } catch (error) {
    console.error('Error saving route:', error);
  }
}

export function getSavedRoutes(): Route[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const routes = JSON.parse(data);
    // Convert date strings back to Date objects
    return routes.map((route: any) => ({
      ...route,
      createdAt: new Date(route.createdAt),
      preferences: {
        ...route.preferences,
        date: new Date(route.preferences.date),
      },
    }));
  } catch (error) {
    console.error('Error loading routes:', error);
    return [];
  }
}

export function deleteRoute(routeId: string): void {
  try {
    const routes = getSavedRoutes();
    const filtered = routes.filter((r) => r.id !== routeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting route:', error);
  }
}

export function clearAllRoutes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing routes:', error);
  }
}
