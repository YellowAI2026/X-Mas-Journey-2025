import { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { weatherService, type WeatherData } from '../../services/weatherService';
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind as WindIcon,
  Loader2,
  Thermometer,
  Wind,
  Droplets,
} from 'lucide-react';

interface WeatherCardProps {
  date: Date;
  hasInfants: boolean;
}

const getWeatherIcon = (condition: WeatherData['condition'], size = 24) => {
  const icons = {
    sunny: <Sun size={size} className="text-yellow-500" />,
    cloudy: <Cloud size={size} className="text-gray-400" />,
    rainy: <CloudRain size={size} className="text-blue-500" />,
    snowy: <CloudSnow size={size} className="text-blue-300" />,
    windy: <WindIcon size={size} className="text-gray-500" />,
  };
  return icons[condition];
};

export function WeatherCard({ date, hasInfants }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [clothingRecs, setClothingRecs] = useState<string[]>([]);

  useEffect(() => {
    loadWeather();
  }, [date]);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await weatherService.getWeather(date);
      setWeather(data);

      const recommendations = weatherService.getClothingRecommendation(data, hasInfants);
      setClothingRecs(recommendations);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="text-center py-8">
        <Loader2 className="mx-auto animate-spin text-christmas-red mb-2" size={32} />
        <p className="text-sm text-gray-600">Wetter wird geladen...</p>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* Weather Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition, 48)}
            <div>
              <h3 className="text-2xl font-bold text-christmas-green">
                {weather.temp}°C
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {weather.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {date.toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <Droplets size={20} className="mx-auto mb-1 text-blue-500" />
            <p className="text-xs text-gray-600">Luftfeuchtigkeit</p>
            <p className="font-semibold">{weather.humidity}%</p>
          </div>
          <div className="text-center">
            <Wind size={20} className="mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-600">Wind</p>
            <p className="font-semibold">{weather.windSpeed} km/h</p>
          </div>
          <div className="text-center">
            <Thermometer size={20} className="mx-auto mb-1 text-christmas-red" />
            <p className="text-xs text-gray-600">Gefühlt</p>
            <p className="font-semibold">{weather.temp - 2}°C</p>
          </div>
        </div>

        {/* Clothing Recommendations */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <CloudRain size={20} className="text-christmas-red" />
            <h4 className="font-semibold text-christmas-green">
              Kleidungsempfehlungen
            </h4>
          </div>
          <ul className="space-y-2">
            {clothingRecs.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-christmas-gold mt-1">✓</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
