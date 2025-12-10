import Anthropic from '@anthropic-ai/sdk';
import type { RouteGenerationRequest, Route, RoutePoint } from '../types';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export class ClaudeRouteService {
  private client: Anthropic;

  constructor() {
    if (!API_KEY) {
      console.warn('Anthropic API key not found. Using mock data.');
    }
    this.client = new Anthropic({
      apiKey: API_KEY || 'dummy-key',
      dangerouslyAllowBrowser: true, // Only for demo purposes
    });
  }

  async generateRoute(request: RouteGenerationRequest): Promise<Route> {
    if (!API_KEY) {
      return this.getMockRoute(request);
    }

    const prompt = this.buildPrompt(request);

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return this.parseClaudeResponse(content.text, request);
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error generating route:', error);
      return this.getMockRoute(request);
    }
  }

  private buildPrompt(request: RouteGenerationRequest): string {
    const { persons, preferences } = request;
    const dateStr = preferences.date.toLocaleDateString('de-DE');

    const ageGroups = persons
      .map((p) => this.translateAgeGroup(p.ageGroup))
      .join(', ');
    const interests = [
      ...new Set(persons.flatMap((p) => p.interests)),
    ]
      .map((i) => this.translateInterest(i))
      .join(', ');

    return `Erstelle eine ausgewogene Weihnachtsroute für ${dateStr} in München für ${persons.length} Personen mit folgenden Eigenschaften:

Altersgruppen: ${ageGroups}
Interessen: ${interests}
Zeitrahmen: ${preferences.startTime} bis ${preferences.endTime} Uhr
Verkehrsmittel: ${this.translateTransport(preferences.transportMode)}
Budget: ${preferences.budgetMin}€ - ${preferences.budgetMax}€
${preferences.district && preferences.district !== 'all' ? `Stadtviertel: ${this.translateDistrict(preferences.district)} (bevorzugt, aber nicht zwingend)` : 'Gebiet: Ganz München'}
${preferences.indoorPreference ? 'Bevorzugt indoor-Aktivitäten' : ''}
${preferences.childFriendly ? 'Muss kinderfreundlich sein' : ''}
${preferences.additionalWishes ? `Zusätzliche Wünsche: ${preferences.additionalWishes}` : ''}

Die Route soll weihnachtliche Highlights, altersgerechte Aktivitäten und praktische Pausen beinhalten.${preferences.district && preferences.district !== 'all' ? ` Fokussiere bevorzugt auf Orte im Stadtviertel ${this.translateDistrict(preferences.district)}, aber schließe auch nahegelegene Highlights ein, wenn sie gut passen.` : ''}

WICHTIG: Antworte NUR mit einem JSON-Array von Routenpunkten in folgendem Format:
[
  {
    "name": "Name des Ortes",
    "address": "Vollständige Adresse",
    "description": "Beschreibung (max. 2 Sätze)",
    "lat": 48.1351,
    "lng": 11.5820,
    "duration": 60,
    "suitableFor": ["adult", "child"],
    "christmasFeatures": ["Weihnachtsmarkt", "Glühwein"],
    "category": "market",
    "openingHours": "10:00-22:00",
    "estimatedCost": 15
  }
]

Gib konkrete Münchner Orte mit echten Koordinaten und realistischen Zeitangaben an.`;
  }

  private parseClaudeResponse(
    text: string,
    request: RouteGenerationRequest
  ): Route {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const points: RoutePoint[] = JSON.parse(jsonMatch[0]).map(
        (p: any, index: number) => ({
          id: `point-${index}`,
          ...p,
        })
      );

      const totalDuration = points.reduce((sum, p) => sum + p.duration, 0);
      const totalDistance = this.calculateTotalDistance(points);
      const estimatedCost = points.reduce(
        (sum, p) => sum + (p.estimatedCost || 0),
        0
      );

      return {
        id: `route-${Date.now()}`,
        createdAt: new Date(),
        persons: request.persons,
        preferences: request.preferences,
        points,
        totalDuration,
        totalDistance,
        estimatedCost,
      };
    } catch (error) {
      console.error('Error parsing Claude response:', error);
      return this.getMockRoute(request);
    }
  }

  private calculateTotalDistance(points: RoutePoint[]): number {
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      total += this.haversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
    }
    return Math.round(total * 10) / 10;
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private translateAgeGroup(ageGroup: string): string {
    const translations: Record<string, string> = {
      infant: 'Kleinkind',
      child: 'Kind',
      teen: 'Jugendlicher',
      adult: 'Erwachsener',
      senior: 'Senior',
    };
    return translations[ageGroup] || ageGroup;
  }

  private translateInterest(interest: string): string {
    const translations: Record<string, string> = {
      culinary: 'Kulinarik',
      culture: 'Kultur',
      shopping: 'Shopping',
      relaxation: 'Ruhe',
      action: 'Action',
      nature: 'Natur',
    };
    return translations[interest] || interest;
  }

  private translateTransport(mode: string): string {
    const translations: Record<string, string> = {
      foot: 'zu Fuß',
      public: 'ÖPNV',
      car: 'Auto',
      mixed: 'Gemischt',
    };
    return translations[mode] || mode;
  }

  private translateDistrict(district: string): string {
    const translations: Record<string, string> = {
      all: 'Ganz München',
      'altstadt-lehel': 'Altstadt-Lehel',
      maxvorstadt: 'Maxvorstadt',
      'ludwigsvorstadt-isarvorstadt': 'Ludwigsvorstadt-Isarvorstadt',
      'schwabing-west': 'Schwabing-West',
      'schwabing-freimann': 'Schwabing-Freimann',
      'au-haidhausen': 'Au-Haidhausen',
      sendling: 'Sendling',
      obergiesing: 'Obergiesing-Fasangarten',
    };
    return translations[district] || district;
  }

  private getMockRoute(request: RouteGenerationRequest): Route {
    const mockPoints: RoutePoint[] = [
      {
        id: 'point-1',
        name: 'Marienplatz Christkindlmarkt',
        address: 'Marienplatz, 80331 München',
        description:
          'Der traditionelle Christkindlmarkt am Marienplatz mit über 140 Ständen. Ein Muss für jeden München-Besuch zur Weihnachtszeit!',
        lat: 48.137154,
        lng: 11.575524,
        duration: 90,
        suitableFor: ['infant', 'child', 'teen', 'adult', 'senior'],
        christmasFeatures: [
          'Christbaum',
          'Glühweinstand',
          'Handwerkskunst',
          'Krippe',
        ],
        category: 'market',
        openingHours: '10:00-21:00',
        estimatedCost: 20,
      },
      {
        id: 'point-2',
        name: 'Münchner Spielzeugmuseum',
        address: 'Marienplatz 15, 80331 München',
        description:
          'Historisches Spielzeugmuseum im Alten Rathaus mit Spielzeugen aus zwei Jahrhunderten. Perfekt für Kinder und nostalgische Erwachsene.',
        lat: 48.137,
        lng: 11.576,
        duration: 60,
        suitableFor: ['infant', 'child', 'teen', 'adult'],
        christmasFeatures: ['Historisches Spielzeug', 'Nostalgische Atmosphäre'],
        category: 'culture',
        openingHours: '10:00-17:30',
        estimatedCost: 12,
      },
      {
        id: 'point-3',
        name: 'Viktualienmarkt',
        address: 'Viktualienmarkt 3, 80331 München',
        description:
          'Münchens berühmter Lebensmittelmarkt mit weihnachtlicher Dekoration und köstlichen lokalen Spezialitäten. Ideal für eine Mittagspause.',
        lat: 48.135125,
        lng: 11.576179,
        duration: 75,
        suitableFor: ['child', 'teen', 'adult', 'senior'],
        christmasFeatures: ['Weihnachtsdeko', 'Regionale Spezialitäten'],
        category: 'gastronomy',
        openingHours: '08:00-18:00',
        estimatedCost: 25,
      },
      {
        id: 'point-4',
        name: 'Christkindlmarkt am Chinesischen Turm',
        address: 'Englischer Garten 3, 80538 München',
        description:
          'Romantischer Weihnachtsmarkt im Englischen Garten mit traditionellem Ambiente und Live-Musik. Wunderschön beleuchtet!',
        lat: 48.1644,
        lng: 11.5975,
        duration: 90,
        suitableFor: ['child', 'teen', 'adult', 'senior'],
        christmasFeatures: [
          'Pagode beleuchtet',
          'Live-Musik',
          'Feuerzangenbowle',
        ],
        category: 'market',
        openingHours: '12:00-22:00',
        estimatedCost: 18,
      },
      {
        id: 'point-5',
        name: 'Café Frischhut',
        address: 'Prälat-Zistl-Straße 8, 80331 München',
        description:
          'Traditionelle Münchner Schmalzgebäck-Bäckerei. Perfekt für eine süße Pause mit den berühmten "Auszogene".',
        lat: 48.1349,
        lng: 11.5731,
        duration: 30,
        suitableFor: ['infant', 'child', 'teen', 'adult', 'senior'],
        christmasFeatures: ['Traditionelles Gebäck', 'Gemütliche Atmosphäre'],
        category: 'gastronomy',
        openingHours: '08:00-19:00',
        estimatedCost: 8,
      },
    ];

    const totalDuration = mockPoints.reduce((sum, p) => sum + p.duration, 0);
    const totalDistance = this.calculateTotalDistance(mockPoints);
    const estimatedCost = mockPoints.reduce(
      (sum, p) => sum + (p.estimatedCost || 0),
      0
    );

    return {
      id: `route-${Date.now()}`,
      createdAt: new Date(),
      persons: request.persons,
      preferences: request.preferences,
      points: mockPoints,
      totalDuration,
      totalDistance,
      estimatedCost,
    };
  }
}

export const claudeRouteService = new ClaudeRouteService();
