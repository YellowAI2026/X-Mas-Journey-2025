import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  Package,
  Download,
  CheckSquare,
  Square,
  ShoppingBag,
  Baby,
  Smartphone,
  Heart,
  MoreHorizontal,
} from 'lucide-react';
import type { PackingItem } from '../../utils/packingList';

interface PackingListCardProps {
  items: PackingItem[];
}

const categoryIcons = {
  clothing: ShoppingBag,
  food: Package,
  kids: Baby,
  tech: Smartphone,
  health: Heart,
  misc: MoreHorizontal,
};

const categoryLabels = {
  clothing: 'Kleidung & Accessoires',
  food: 'Essen & Trinken',
  kids: 'Für Kinder',
  tech: 'Technik',
  health: 'Gesundheit',
  misc: 'Sonstiges',
};

export function PackingListCard({ items }: PackingListCardProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const downloadList = () => {
    const text = items
      .map((item) => `${item.essential ? '⭐' : '○'} ${item.item}`)
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Weihnachts-Packliste.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);

  const checkedCount = checkedItems.size;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-christmas-red" size={24} />
            <h3 className="text-xl font-semibold text-christmas-green">
              Packliste
            </h3>
          </div>
          <Button onClick={downloadList} variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fortschritt</span>
            <span className="font-semibold text-christmas-green">
              {checkedCount} von {totalCount}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-christmas-red to-christmas-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items by Category */}
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {Object.entries(groupedItems).map(([category, categoryItems]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const label = categoryLabels[category as keyof typeof categoryLabels];

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-christmas-green">
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
                <div className="space-y-2 ml-6">
                  {categoryItems.map((item, index) => {
                    const isChecked = checkedItems.has(item.item);
                    return (
                      <label
                        key={index}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(item.item)}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {isChecked ? (
                            <CheckSquare
                              size={20}
                              className="text-christmas-green"
                            />
                          ) : (
                            <Square
                              size={20}
                              className="text-gray-400 group-hover:text-christmas-red transition-colors"
                            />
                          )}
                        </button>
                        <span
                          className={`text-sm ${
                            isChecked
                              ? 'line-through text-gray-400'
                              : 'text-gray-700'
                          }`}
                        >
                          {item.item}
                          {item.essential && (
                            <span className="ml-2 text-christmas-gold">⭐</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-christmas-gold">⭐</span>
            = Unverzichtbar
          </p>
        </div>
      </div>
    </Card>
  );
}
