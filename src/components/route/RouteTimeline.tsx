import { Clock, MapPin, Euro, Star, Navigation } from 'lucide-react';
import { Card } from '../common/Card';
import type { Route } from '../../types';

interface RouteTimelineProps {
  route: Route;
  selectedPointId?: string;
  onPointSelect?: (pointId: string) => void;
}

export function RouteTimeline({
  route,
  selectedPointId,
  onPointSelect,
}: RouteTimelineProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      market: '🎄',
      culture: '🏛️',
      nature: '🌲',
      gastronomy: '🍽️',
      attraction: '🎡',
      rest: '☕',
    };
    return icons[category] || '📍';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      market: 'Weihnachtsmarkt',
      culture: 'Kultur',
      nature: 'Natur',
      gastronomy: 'Gastronomie',
      attraction: 'Attraktion',
      rest: 'Pause',
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-4">
      {route.points.map((point, index) => {
        const isSelected = point.id === selectedPointId;
        const isLast = index === route.points.length - 1;

        return (
          <div key={point.id} className="relative">
            <Card
              className={`cursor-pointer transition-all hover:shadow-2xl ${
                isSelected
                  ? 'ring-2 ring-christmas-red scale-[1.02]'
                  : ''
              }`}
              onClick={() => onPointSelect?.(point.id)}
            >
              <div className="flex gap-4">
                {/* Number Badge */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    isSelected
                      ? 'bg-christmas-red text-white'
                      : 'bg-christmas-green text-white'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-christmas-green">
                        {point.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin size={14} />
                        <span className="truncate">{point.address}</span>
                      </div>
                    </div>
                    <span className="text-2xl flex-shrink-0">
                      {getCategoryIcon(point.category)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">
                    {point.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-christmas-red" />
                      <span className="font-medium">{point.duration} Min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Euro size={16} className="text-christmas-red" />
                      <span className="font-medium">
                        {point.estimatedCost || 0}€
                      </span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-christmas-green/10 text-christmas-green">
                      {getCategoryLabel(point.category)}
                    </span>
                  </div>

                  {/* Christmas Features */}
                  {point.christmasFeatures.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <Star
                          size={16}
                          className="text-christmas-gold flex-shrink-0 mt-0.5"
                        />
                        <div className="flex flex-wrap gap-1">
                          {point.christmasFeatures.map((feature, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 rounded text-xs bg-christmas-gold/20 text-christmas-green"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Opening Hours */}
                  {point.openingHours && (
                    <div className="text-xs text-gray-500">
                      <Clock size={12} className="inline mr-1" />
                      Öffnungszeiten: {point.openingHours}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Connector Line */}
            {!isLast && (
              <div className="flex items-center justify-center h-8">
                <Navigation
                  size={20}
                  className="text-christmas-red rotate-180"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
