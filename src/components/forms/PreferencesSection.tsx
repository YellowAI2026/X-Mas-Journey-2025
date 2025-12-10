import React from 'react';
import { Car, Bus, Footprints, Shuffle, DollarSign, Settings } from 'lucide-react';
import { Card } from '../common/Card';
import type { TransportMode } from '../../types';

interface PreferencesSectionProps {
  transportMode: TransportMode;
  onTransportModeChange: (mode: TransportMode) => void;
  budgetMin: number;
  onBudgetMinChange: (value: number) => void;
  budgetMax: number;
  onBudgetMaxChange: (value: number) => void;
  indoorPreference: boolean;
  onIndoorPreferenceChange: (value: boolean) => void;
  childFriendly: boolean;
  onChildFriendlyChange: (value: boolean) => void;
  additionalWishes: string;
  onAdditionalWishesChange: (value: string) => void;
}

const TRANSPORT_MODES: {
  value: TransportMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: 'foot', label: 'Zu Fuß', icon: <Footprints size={20} /> },
  { value: 'public', label: 'ÖPNV', icon: <Bus size={20} /> },
  { value: 'car', label: 'Auto', icon: <Car size={20} /> },
  { value: 'mixed', label: 'Gemischt', icon: <Shuffle size={20} /> },
];

export function PreferencesSection({
  transportMode,
  onTransportModeChange,
  budgetMin,
  onBudgetMinChange,
  budgetMax,
  onBudgetMaxChange,
  indoorPreference,
  onIndoorPreferenceChange,
  childFriendly,
  onChildFriendlyChange,
  additionalWishes,
  onAdditionalWishesChange,
}: PreferencesSectionProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="text-christmas-red" size={24} />
        <h3 className="text-xl font-semibold text-christmas-green">
          Präferenzen
        </h3>
      </div>

      <div className="space-y-6">
        {/* Transport Mode */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Verkehrsmittel
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRANSPORT_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => onTransportModeChange(mode.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  transportMode === mode.value
                    ? 'border-christmas-red bg-christmas-red/10 text-christmas-red'
                    : 'border-gray-300 hover:border-christmas-red/50'
                }`}
              >
                {mode.icon}
                <span className="text-sm font-medium">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-3">
            <DollarSign size={16} className="inline mr-1" />
            Budget pro Person
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Minimum
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => onBudgetMinChange(Number(e.target.value))}
                  min="0"
                  step="5"
                  className="w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Maximum
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => onBudgetMaxChange(Number(e.target.value))}
                  min={budgetMin}
                  step="5"
                  className="w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="200"
              value={budgetMax}
              onChange={(e) => onBudgetMaxChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-christmas-red"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={indoorPreference}
              onChange={(e) => onIndoorPreferenceChange(e.target.checked)}
              className="w-5 h-5 text-christmas-red border-gray-300 rounded focus:ring-christmas-red"
            />
            <span className="text-sm">
              Bevorzugt Indoor-Aktivitäten (wetterunabhängig)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={childFriendly}
              onChange={(e) => onChildFriendlyChange(e.target.checked)}
              className="w-5 h-5 text-christmas-red border-gray-300 rounded focus:ring-christmas-red"
            />
            <span className="text-sm">
              Kinderfreundliche Route erforderlich
            </span>
          </label>
        </div>

        {/* Additional Wishes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Besondere Wünsche (optional)
          </label>
          <textarea
            value={additionalWishes}
            onChange={(e) => onAdditionalWishesChange(e.target.value)}
            placeholder="z.B. vegetarische Restaurants, barrierefreie Orte, ruhige Atmosphäre..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent resize-none"
          />
        </div>
      </div>
    </Card>
  );
}
