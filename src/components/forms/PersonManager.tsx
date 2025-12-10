import { Plus, Trash2, User } from 'lucide-react';
import { Button } from '../common/Button';
import type { Person, AgeGroup, Interest } from '../../types';

interface PersonManagerProps {
  persons: Person[];
  onChange: (persons: Person[]) => void;
}

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'infant', label: 'Kleinkind (0-3 Jahre)' },
  { value: 'child', label: 'Kind (4-12 Jahre)' },
  { value: 'teen', label: 'Jugendlicher (13-17 Jahre)' },
  { value: 'adult', label: 'Erwachsener (18-64 Jahre)' },
  { value: 'senior', label: 'Senior (65+ Jahre)' },
];

const INTERESTS: { value: Interest; label: string; emoji: string }[] = [
  { value: 'culinary', label: 'Kulinarik', emoji: '🍽️' },
  { value: 'culture', label: 'Kultur', emoji: '🎭' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'relaxation', label: 'Ruhe', emoji: '🧘' },
  { value: 'action', label: 'Action', emoji: '⚡' },
  { value: 'nature', label: 'Natur', emoji: '🌲' },
];

export function PersonManager({ persons, onChange }: PersonManagerProps) {
  const addPerson = () => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      ageGroup: 'adult',
      interests: [],
      mobilityRestrictions: '',
    };
    onChange([...persons, newPerson]);
  };

  const removePerson = (id: string) => {
    onChange(persons.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    onChange(
      persons.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const toggleInterest = (personId: string, interest: Interest) => {
    const person = persons.find((p) => p.id === personId);
    if (!person) return;

    const interests = person.interests.includes(interest)
      ? person.interests.filter((i) => i !== interest)
      : [...person.interests, interest];

    updatePerson(personId, { interests });
  };

  return (
    <div className="space-y-4">
      {persons.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User size={48} className="mx-auto mb-2 opacity-50" />
          <p>Noch keine Personen hinzugefügt</p>
          <p className="text-sm">Fügen Sie Personen hinzu, um zu starten</p>
        </div>
      )}

      {persons.map((person, index) => (
        <div
          key={person.id}
          className="bg-white/50 rounded-lg p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-christmas-green">
              Person {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removePerson(person.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Person entfernen"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Age Group */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Altersgruppe
              </label>
              <select
                value={person.ageGroup}
                onChange={(e) =>
                  updatePerson(person.id, {
                    ageGroup: e.target.value as AgeGroup,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent text-sm"
              >
                {AGE_GROUPS.map((ag) => (
                  <option key={ag.value} value={ag.value}>
                    {ag.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Interessen
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest.value}
                    type="button"
                    onClick={() => toggleInterest(person.id, interest.value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      person.interests.includes(interest.value)
                        ? 'bg-christmas-red text-white shadow-md'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-christmas-red'
                    }`}
                  >
                    <span className="mr-1">{interest.emoji}</span>
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobility Restrictions */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Mobilitätseinschränkungen (optional)
              </label>
              <input
                type="text"
                value={person.mobilityRestrictions || ''}
                onChange={(e) =>
                  updatePerson(person.id, {
                    mobilityRestrictions: e.target.value,
                  })
                }
                placeholder="z.B. Rollstuhl, Kinderwagen"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addPerson}
        variant="outline"
        className="w-full"
      >
        <Plus size={18} className="inline mr-2" />
        Person hinzufügen
      </Button>
    </div>
  );
}
