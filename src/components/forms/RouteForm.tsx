import { useState } from 'react';
import { Calendar, Users, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PersonManager } from './PersonManager';
import { PreferencesSection } from './PreferencesSection';
import type { Person, RoutePreferences, RouteGenerationRequest } from '../../types';

interface RouteFormProps {
  onSubmit: (request: RouteGenerationRequest) => void;
  isLoading?: boolean;
}

export function RouteForm({ onSubmit, isLoading }: RouteFormProps) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [date, setDate] = useState<Date>(new Date('2025-12-24'));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [transportMode, setTransportMode] = useState<'foot' | 'public' | 'car' | 'mixed'>('mixed');
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(100);
  const [indoorPreference, setIndoorPreference] = useState(false);
  const [childFriendly, setChildFriendly] = useState(false);
  const [additionalWishes, setAdditionalWishes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (persons.length === 0) {
      alert('Bitte fügen Sie mindestens eine Person hinzu!');
      return;
    }

    const preferences: RoutePreferences = {
      date,
      startTime,
      endTime,
      transportMode,
      budgetMin,
      budgetMax,
      indoorPreference,
      childFriendly,
      additionalWishes,
    };

    onSubmit({ persons, preferences });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date and Time Section */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-christmas-red" size={24} />
          <h3 className="text-xl font-semibold text-christmas-green">
            Datum & Zeit
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Datum auswählen
            </label>
            <input
              type="date"
              value={date.toISOString().split('T')[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
              min="2025-12-24"
              max="2025-12-26"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Startzeit
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Endzeit
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Person Management */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-christmas-red" size={24} />
          <h3 className="text-xl font-semibold text-christmas-green">
            Personen verwalten
          </h3>
        </div>
        <PersonManager persons={persons} onChange={setPersons} />
      </Card>

      {/* Preferences */}
      <PreferencesSection
        transportMode={transportMode}
        onTransportModeChange={setTransportMode}
        budgetMin={budgetMin}
        onBudgetMinChange={setBudgetMin}
        budgetMax={budgetMax}
        onBudgetMaxChange={setBudgetMax}
        indoorPreference={indoorPreference}
        onIndoorPreferenceChange={setIndoorPreference}
        childFriendly={childFriendly}
        onChildFriendlyChange={setChildFriendly}
        additionalWishes={additionalWishes}
        onAdditionalWishesChange={setAdditionalWishes}
      />

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || persons.length === 0}
          className="w-full md:w-auto min-w-[250px]"
        >
          {isLoading ? (
            <>
              <Sparkles className="animate-spin inline mr-2" size={20} />
              Route wird erstellt...
            </>
          ) : (
            <>
              <Sparkles className="inline mr-2" size={20} />
              Magische Route erstellen
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
