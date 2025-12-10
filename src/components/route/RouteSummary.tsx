import { Clock, Navigation, Users, Euro, Download, Share2, Calendar } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { Route } from '../../types';
import { generateGoogleMapsUrl, generatePDF, generateICS } from '../../utils/exports';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface RouteSummaryProps {
  route: Route;
}

export function RouteSummary({ route }: RouteSummaryProps) {
  const handleGoogleMapsExport = () => {
    const url = generateGoogleMapsUrl(route);
    window.open(url, '_blank');
  };

  const handlePDFExport = () => {
    generatePDF(route);
  };

  const handleICSExport = () => {
    generateICS(route);
  };

  const totalHours = Math.floor(route.totalDuration / 60);
  const totalMinutes = route.totalDuration % 60;

  return (
    <Card>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-christmas-green mb-2">
          Ihre Weihnachtsroute
        </h2>
        <p className="text-gray-600">
          {format(route.preferences.date, 'EEEE, dd. MMMM yyyy', { locale: de })}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-christmas-red/10 rounded-lg">
          <Clock className="mx-auto mb-2 text-christmas-red" size={24} />
          <div className="text-2xl font-bold text-christmas-green">
            {totalHours}h {totalMinutes}m
          </div>
          <div className="text-xs text-gray-600">Gesamtdauer</div>
        </div>

        <div className="text-center p-4 bg-christmas-green/10 rounded-lg">
          <Navigation className="mx-auto mb-2 text-christmas-green" size={24} />
          <div className="text-2xl font-bold text-christmas-green">
            {route.totalDistance} km
          </div>
          <div className="text-xs text-gray-600">Gesamtstrecke</div>
        </div>

        <div className="text-center p-4 bg-christmas-gold/10 rounded-lg">
          <Euro className="mx-auto mb-2 text-christmas-gold" size={24} />
          <div className="text-2xl font-bold text-christmas-green">
            {route.estimatedCost}€
          </div>
          <div className="text-xs text-gray-600">Geschätzte Kosten</div>
        </div>

        <div className="text-center p-4 bg-christmas-red/10 rounded-lg">
          <Users className="mx-auto mb-2 text-christmas-red" size={24} />
          <div className="text-2xl font-bold text-christmas-green">
            {route.persons.length}
          </div>
          <div className="text-xs text-gray-600">Personen</div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-christmas-green mb-2">
          Route exportieren:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleGoogleMapsExport}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Share2 size={16} className="mr-2" />
            Google Maps
          </Button>

          <Button
            onClick={handlePDFExport}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Download size={16} className="mr-2" />
            PDF Download
          </Button>

          <Button
            onClick={handleICSExport}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Calendar size={16} className="mr-2" />
            Kalender (.ics)
          </Button>
        </div>
      </div>

      {/* Route Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Zeitrahmen:</strong> {route.preferences.startTime} -{' '}
            {route.preferences.endTime} Uhr
          </p>
          <p>
            <strong>Stationen:</strong> {route.points.length}
          </p>
        </div>
      </div>
    </Card>
  );
}
