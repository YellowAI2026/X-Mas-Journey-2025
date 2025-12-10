import type { Person, RoutePreferences } from '../types';
import type { WeatherData } from '../services/weatherService';

export interface PackingItem {
  item: string;
  category: 'clothing' | 'food' | 'kids' | 'tech' | 'health' | 'misc';
  essential: boolean;
}

export function generatePackingList(
  persons: Person[],
  preferences: RoutePreferences,
  weather: WeatherData
): PackingItem[] {
  const items: PackingItem[] = [];

  // Check for specific groups
  const hasInfants = persons.some((p) => p.ageGroup === 'infant');
  const hasChildren = persons.some(
    (p) => p.ageGroup === 'infant' || p.ageGroup === 'child'
  );
  const hasSeniors = persons.some((p) => p.ageGroup === 'senior');
  const hasMobilityRestrictions = persons.some(
    (p) => p.mobilityRestrictions && p.mobilityRestrictions.length > 0
  );

  // Essential items for everyone
  items.push(
    {
      item: 'Smartphone mit vollem Akku',
      category: 'tech',
      essential: true,
    },
    {
      item: 'Bargeld und EC-Karte',
      category: 'misc',
      essential: true,
    },
    {
      item: 'Taschentücher',
      category: 'health',
      essential: true,
    },
    {
      item: 'Desinfektionsmittel/Handtücher',
      category: 'health',
      essential: true,
    }
  );

  // Weather-specific items
  if (weather.condition === 'rainy') {
    items.push({
      item: 'Regenschirm oder Regencape',
      category: 'clothing',
      essential: true,
    });
  }

  if (weather.condition === 'snowy') {
    items.push({
      item: 'Ersatz-Handschuhe (werden oft nass)',
      category: 'clothing',
      essential: false,
    });
  }

  if (weather.temp < 5) {
    items.push(
      {
        item: 'Thermoskanne mit heißem Tee',
        category: 'food',
        essential: false,
      },
      {
        item: 'Handwärmer',
        category: 'misc',
        essential: false,
      }
    );
  }

  // Food & Drinks based on duration
  const duration = calculateDuration(preferences);
  if (duration > 2) {
    items.push(
      {
        item: 'Snacks (Nüsse, Schokolade, Obst)',
        category: 'food',
        essential: false,
      },
      {
        item: 'Wasserflasche',
        category: 'food',
        essential: true,
      }
    );
  }

  if (duration > 4) {
    items.push({
      item: 'Brotzeit oder Lunchpaket',
      category: 'food',
      essential: false,
    });
  }

  // Items for infants and small children
  if (hasInfants) {
    items.push(
      {
        item: 'Windeln und Feuchttücher',
        category: 'kids',
        essential: true,
      },
      {
        item: 'Wickelunterlage',
        category: 'kids',
        essential: true,
      },
      {
        item: 'Babyflasche und Milchpulver/Nahrung',
        category: 'kids',
        essential: true,
      },
      {
        item: 'Schnuller (falls verwendet)',
        category: 'kids',
        essential: false,
      },
      {
        item: 'Wechselkleidung (mindestens 1 Set)',
        category: 'kids',
        essential: true,
      },
      {
        item: 'Warme Decke für Kinderwagen',
        category: 'kids',
        essential: true,
      },
      {
        item: 'Lieblingsspielzeug',
        category: 'kids',
        essential: false,
      }
    );
  }

  if (hasChildren) {
    items.push(
      {
        item: 'Kindgerechte Snacks',
        category: 'kids',
        essential: true,
      },
      {
        item: 'Malbuch oder Spielzeug für Wartezeiten',
        category: 'kids',
        essential: false,
      },
      {
        item: 'Feuchttücher',
        category: 'kids',
        essential: true,
      }
    );

    if (weather.condition === 'snowy') {
      items.push({
        item: 'Schlitten oder Schneerutsche',
        category: 'kids',
        essential: false,
      });
    }
  }

  // Items for seniors
  if (hasSeniors) {
    items.push(
      {
        item: 'Persönliche Medikamente',
        category: 'health',
        essential: true,
      },
      {
        item: 'Sitzunterlage oder kleiner Hocker',
        category: 'misc',
        essential: false,
      }
    );
  }

  // Mobility restrictions
  if (hasMobilityRestrictions) {
    items.push(
      {
        item: 'Mobilitätshilfen (Rollstuhl, Gehstock, etc.)',
        category: 'health',
        essential: true,
      },
      {
        item: 'Pausenplan mit Sitzmöglichkeiten',
        category: 'misc',
        essential: false,
      }
    );
  }

  // Tech & Documentation
  items.push(
    {
      item: 'Powerbank für Smartphone',
      category: 'tech',
      essential: false,
    },
    {
      item: 'Kopfhörer (für Kinder)',
      category: 'tech',
      essential: false,
    },
    {
      item: 'Kamera für Fotos',
      category: 'tech',
      essential: false,
    }
  );

  // Transportation specific
  if (preferences.transportMode === 'public') {
    items.push({
      item: 'MVV-Ticket oder MVG-App',
      category: 'misc',
      essential: true,
    });
  }

  if (preferences.transportMode === 'car') {
    items.push({
      item: 'Parkgebühren einplanen',
      category: 'misc',
      essential: true,
    });
  }

  // Christmas market specific
  items.push(
    {
      item: 'Wiederverwendbare Tasse für Glühwein',
      category: 'misc',
      essential: false,
    },
    {
      item: 'Tasche für Einkäufe/Souvenirs',
      category: 'misc',
      essential: false,
    }
  );

  // Health & Safety
  items.push(
    {
      item: 'Pflaster und kleine Erste-Hilfe',
      category: 'health',
      essential: false,
    },
    {
      item: 'Lippenbalsam (bei Kälte)',
      category: 'health',
      essential: false,
    }
  );

  return items;
}

function calculateDuration(preferences: RoutePreferences): number {
  const [startHour, startMinute] = preferences.startTime.split(':').map(Number);
  const [endHour, endMinute] = preferences.endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return (endMinutes - startMinutes) / 60; // Return hours
}
