import { useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { RouteForm } from './components/forms/RouteForm';
import { RouteMap } from './components/map/RouteMap';
import { RouteTimeline } from './components/route/RouteTimeline';
import { RouteSummary } from './components/route/RouteSummary';
import { Card } from './components/common/Card';
import { Button } from './components/common/Button';
import { claudeRouteService } from './services/claudeApi';
import { saveRoute, getSavedRoutes } from './utils/storage';
import type { RouteGenerationRequest, Route } from './types';
import { Sparkles, History } from 'lucide-react';

const queryClient = new QueryClient();

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>();
  const [showSavedRoutes, setShowSavedRoutes] = useState(false);
  const [savedRoutes] = useState<Route[]>(getSavedRoutes());

  const generateRouteMutation = useMutation({
    mutationFn: (request: RouteGenerationRequest) =>
      claudeRouteService.generateRoute(request),
    onSuccess: (route) => {
      setCurrentRoute(route);
      saveRoute(route);
      // Scroll to route section
      setTimeout(() => {
        document.getElementById('route-display')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    },
    onError: (error) => {
      console.error('Error generating route:', error);
      alert(
        'Fehler beim Erstellen der Route. Bitte versuchen Sie es erneut.'
      );
    },
  });

  const handleFormSubmit = (request: RouteGenerationRequest) => {
    generateRouteMutation.mutate(request);
  };

  const handleLoadRoute = (route: Route) => {
    setCurrentRoute(route);
    setShowSavedRoutes(false);
    setTimeout(() => {
      document.getElementById('route-display')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 max-w-7xl">
        {/* Form Section */}
        <div className="mb-12">
          <RouteForm
            onSubmit={handleFormSubmit}
            isLoading={generateRouteMutation.isPending}
          />
        </div>

        {/* Loading State */}
        {generateRouteMutation.isPending && (
          <Card className="text-center py-12">
            <Sparkles
              className="mx-auto text-christmas-gold animate-spin mb-4"
              size={48}
            />
            <h3 className="text-2xl font-bold text-christmas-green mb-2">
              Magische Route wird erstellt...
            </h3>
            <p className="text-gray-600">
              Claude AI plant Ihre perfekte Weihnachtsroute durch München
            </p>
          </Card>
        )}

        {/* Route Display */}
        {currentRoute && !generateRouteMutation.isPending && (
          <div id="route-display" className="space-y-8">
            {/* Summary */}
            <RouteSummary route={currentRoute} />

            {/* Map and Timeline Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="order-2 lg:order-1">
                <RouteMap
                  route={currentRoute}
                  selectedPointId={selectedPointId}
                  onPointSelect={setSelectedPointId}
                />
              </div>

              {/* Timeline */}
              <div className="order-1 lg:order-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <RouteTimeline
                  route={currentRoute}
                  selectedPointId={selectedPointId}
                  onPointSelect={setSelectedPointId}
                />
              </div>
            </div>

            {/* New Route Button */}
            <div className="text-center pt-8">
              <Button
                onClick={() => {
                  setCurrentRoute(null);
                  setSelectedPointId(undefined);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                variant="secondary"
                size="lg"
              >
                <Sparkles className="inline mr-2" size={20} />
                Neue Route erstellen
              </Button>
            </div>
          </div>
        )}

        {/* Saved Routes Section */}
        {savedRoutes.length > 0 && !currentRoute && (
          <div className="mt-12">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="text-christmas-red" size={24} />
                  <h3 className="text-xl font-semibold text-christmas-green">
                    Gespeicherte Routen
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavedRoutes(!showSavedRoutes)}
                >
                  {showSavedRoutes ? 'Verbergen' : 'Anzeigen'}
                </Button>
              </div>

              {showSavedRoutes && (
                <div className="space-y-3">
                  {savedRoutes.map((route) => (
                    <div
                      key={route.id}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleLoadRoute(route)}
                    >
                      <div>
                        <div className="font-medium text-christmas-green">
                          {new Date(route.preferences.date).toLocaleDateString(
                            'de-DE'
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {route.points.length} Stationen •{' '}
                          {route.persons.length} Personen • {route.totalDistance}{' '}
                          km
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Laden
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Info Section */}
        {!currentRoute && !generateRouteMutation.isPending && (
          <Card className="mt-12 bg-gradient-to-br from-christmas-red/5 to-christmas-green/5">
            <div className="text-center">
              <h3 className="text-xl font-bold text-christmas-green mb-3">
                So funktioniert's
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-3xl mb-2">📝</div>
                  <h4 className="font-semibold mb-1">1. Eingaben machen</h4>
                  <p className="text-gray-600">
                    Datum wählen, Personen hinzufügen und Präferenzen festlegen
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-semibold mb-1">2. KI arbeitet</h4>
                  <p className="text-gray-600">
                    Claude erstellt eine optimale Route basierend auf Ihren
                    Wünschen
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎄</div>
                  <h4 className="font-semibold mb-1">3. Route genießen</h4>
                  <p className="text-gray-600">
                    Exportieren und Ihre perfekte Weihnachtsroute erleben
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-gray-500">
        <p>
          Erstellt mit ❤️ und Claude AI • Weihnachts-Routen-Planer München 2025
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
