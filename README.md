# 🎄 Weihnachts-Routen-Planer München

Eine moderne Web-Applikation, die perfekte Weihnachtsrouten für Familien in München plant und dabei die Bedürfnisse aller Generationen berücksichtigt.

![Christmas Route Planner](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Hauptfunktionen

### 🎅 Intelligente Routenplanung
- **KI-gestützte Vorschläge** mit Claude AI (Sonnet 4)
- Berücksichtigung aller Altersgruppen und Interessen
- Optimierte Routen mit Weihnachtsmärkten, Kultur und Gastronomie
- Automatische Berechnung von Dauer, Distanz und Kosten

### 👨‍👩‍👧‍👦 Personenverwaltung
- Mehrere Personen mit individuellen Profilen
- Altersgruppen: Kleinkind, Kind, Jugendlicher, Erwachsener, Senior
- Individuelle Interessen: Kulinarik, Kultur, Shopping, Ruhe, Action, Natur
- Mobilitätseinschränkungen berücksichtigen

### 🗺️ Interaktive Karte
- OpenStreetMap-Integration mit Leaflet.js
- Nummerierte Wegpunkte mit Popup-Informationen
- Visuelle Route zwischen allen Stationen
- Synchronisation mit Timeline

### 📱 Export-Funktionen
- **Google Maps**: Direkter Export für Navigation
- **PDF**: Übersichtliche Routenbeschreibung zum Ausdrucken
- **Kalender (ICS)**: Import in Google Calendar, Apple Calendar, etc.

### 💾 Lokale Speicherung
- Automatisches Speichern aller erstellten Routen
- Schnelles Laden vorheriger Routen
- Keine Anmeldung erforderlich

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ und npm
- Optional: Anthropic API Key für Claude AI

### Schritt 1: Repository klonen
```bash
git clone https://github.com/yourusername/weihnachts-planer-muenchen.git
cd weihnachts-planer-muenchen
```

### Schritt 2: Abhängigkeiten installieren
```bash
npm install
```

### Schritt 3: Umgebungsvariablen konfigurieren
```bash
cp .env.example .env
```

Bearbeiten Sie `.env` und fügen Sie Ihren Anthropic API Key ein:
```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

**Hinweis**: Die App funktioniert auch ohne API Key mit Mock-Daten!

### Schritt 4: Entwicklungsserver starten
```bash
npm run dev
```

Die App ist nun unter `http://localhost:5173` erreichbar.

## 🏗️ Produktions-Build

```bash
npm run build
npm run preview  # Vorschau des Production Builds
```

## 📦 Deployment

### GitHub Pages (Automatisch)

Die App wird automatisch auf GitHub Pages deployed, wenn auf `main` gepusht wird.

**Setup:**

1. **Repository Settings:**
   - Gehe zu Settings → Pages
   - Source: **GitHub Actions** auswählen

2. **Optional - API Key hinzufügen:**
   - Settings → Secrets and variables → Actions
   - New repository secret: `ANTHROPIC_API_KEY`
   - Wert: Dein Claude API Key

3. **Push & Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **App aufrufen:**
   - URL: `https://DEIN-USERNAME.github.io/REPO-NAME/`
   - Im Actions Tab kannst du den Deployment-Status sehen

**Hinweis:** Die App funktioniert auch ohne API-Key mit intelligenten Mock-Daten!

### Vercel
1. Forken Sie das Repository
2. Verbinden Sie es mit [Vercel](https://vercel.com)
3. Fügen Sie `VITE_ANTHROPIC_API_KEY` als Umgebungsvariable hinzu
4. Deployen!

### Netlify
1. Forken Sie das Repository
2. Verbinden Sie es mit [Netlify](https://netlify.com)
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Fügen Sie `VITE_ANTHROPIC_API_KEY` als Umgebungsvariable hinzu

## 🛠️ Technologie-Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Bibliotheken
- **Leaflet.js** - Interaktive Karten
- **React Query** - State Management & API Calls
- **jsPDF** - PDF-Generierung
- **ical-generator** - Kalender-Export
- **date-fns** - Datumsformatierung
- **Anthropic SDK** - Claude AI Integration

### APIs
- **Claude API (Sonnet 4)** - KI-gestützte Routenplanung
- **OpenStreetMap** - Kartenmaterial

## 📁 Projektstruktur

```
src/
├── components/
│   ├── common/          # Wiederverwendbare UI-Komponenten
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── forms/           # Formular-Komponenten
│   │   ├── RouteForm.tsx
│   │   ├── PersonManager.tsx
│   │   └── PreferencesSection.tsx
│   ├── layout/          # Layout-Komponenten
│   │   └── Header.tsx
│   ├── map/             # Karten-Komponenten
│   │   └── RouteMap.tsx
│   └── route/           # Routen-Anzeige-Komponenten
│       ├── RouteTimeline.tsx
│       └── RouteSummary.tsx
├── services/            # API Services
│   └── claudeApi.ts     # Claude AI Integration
├── types/               # TypeScript Type Definitions
│   └── index.ts
├── utils/               # Utility Functions
│   ├── exports.ts       # Export-Funktionen
│   └── storage.ts       # LocalStorage Management
├── App.tsx              # Haupt-App-Komponente
└── main.tsx             # Entry Point
```

## 🎨 Design-System

### Farbschema
- **Weihnachtsrot**: `#C41E3A` - Primärfarbe
- **Tannengrün**: `#165B33` - Sekundärfarbe
- **Gold**: `#FFD700` - Akzentfarbe
- **Creme**: `#FAFAF8` - Hintergrund

### Designprinzipien
- Glasmorphismus-Effekte
- Smooth Animations
- Weihnachtliche Illustrationen (Schneeflocken, Sterne)
- Mobile-First Responsive Design

## 🔑 Umgebungsvariablen

| Variable | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API Key für Claude AI | Nein (Mock-Daten verfügbar) |

## 🧪 Development

### Verfügbare Scripts
```bash
npm run dev          # Development Server
npm run build        # Production Build
npm run preview      # Preview Production Build
npm run lint         # ESLint
```

### Mock-Daten
Ohne API Key verwendet die App automatisch Mock-Daten mit einer vordefinierten Route durch München, die folgende Highlights enthält:
- Marienplatz Christkindlmarkt
- Münchner Spielzeugmuseum
- Viktualienmarkt
- Christkindlmarkt am Chinesischen Turm
- Café Frischhut

## 🌟 Features im Detail

### Personalisierte Routenplanung
Die KI berücksichtigt automatisch:
- Altersgerechte Aktivitäten
- Individuelle Interessen
- Mobilitätseinschränkungen
- Zeitliche Präferenzen
- Budget-Vorgaben
- Wetterbedingungen (Indoor-Präferenz)

### Weihnachtliche Highlights
Jede Route enthält:
- Traditionelle Weihnachtsmärkte
- Kulturelle Sehenswürdigkeiten
- Kinderfreundliche Attraktionen
- Gastronomische Empfehlungen
- Ruhepausen und praktische Stopps

### Export-Optionen
- **Google Maps**: Öffnet Route direkt in Google Maps für Navigation
- **PDF**: Detaillierte Beschreibung aller Stationen mit Adressen, Zeiten und Kosten
- **ICS-Kalender**: Importierbare Kalenderdatei mit allen Zeitslots

## 🐛 Bekannte Einschränkungen

- API-Aufrufe an Claude benötigen `dangerouslyAllowBrowser: true` (nur für Demo-Zwecke)
- Für Produktion sollte ein Backend-Proxy verwendet werden
- Kartenmaterial erfordert Internetverbindung

## 🤝 Mitwirken

Contributions sind willkommen! Bitte erstellen Sie einen Pull Request oder öffnen Sie ein Issue.

## 📄 Lizenz

MIT License - Siehe LICENSE Datei für Details

## 🙏 Danksagungen

- [Anthropic](https://anthropic.com) für Claude AI
- [OpenStreetMap](https://openstreetmap.org) Contributors
- [Leaflet](https://leafletjs.com) für die Kartenbibliothek

## 📞 Support

Bei Fragen oder Problemen öffnen Sie bitte ein Issue auf GitHub.

---

**Frohe Weihnachten und viel Spaß beim Erkunden von München! 🎄✨**
