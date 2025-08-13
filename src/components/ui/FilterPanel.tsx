"use client";

import { useStore, Filters } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const filterConfig = [
  {
    id: 'happiness-slider',
    label: 'Happiness Level',
    key: 'happiness_level_score' as keyof Filters,
    min: 0,
    max: 10,
    step: 1,
  },
  {
    id: 'cost-slider',
    label: 'Cost of Living',
    key: 'cost_of_country_score' as keyof Filters,
    min: 0,
    max: 10,
    step: 1,
  },
  {
    id: 'safety-slider',
    label: 'Traffic Safety',
    key: 'traffic_safety_score' as keyof Filters,
    min: 0,
    max: 10,
    step: 1,
  },
  {
    id: 'winter-temp-slider',
    label: 'Min. Winter Temp (°C)',
    key: 'avg_temp_winter_c' as keyof Filters,
    min: -30,
    max: 30,
    step: 1,
  },
];

const FilterPanel = () => {
  const filters = useStore((state) => state.filters);
  const setFilter = useStore((state) => state.setFilter);

  // Логика isMounted удалена для простоты.
  // Проблема решается более высоким z-index.

  return (
    // ✅ ИЗМЕНЕНИЕ: z-10 заменен на z-30 для гарантии
    <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-6 rounded-lg w-80 shadow-lg text-white z-30 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-6">Filters</h2>
      
      <div className="space-y-8">
        {filterConfig.map(config => (
          <div key={config.id} className="grid gap-3">
            <Label htmlFor={config.id}>{config.label}: {filters[config.key] !== null ? filters[config.key] : 'N/A'}</Label>
            <Slider
              id={config.id}
              min={config.min}
              max={config.max}
              step={config.step}
              value={[filters[config.key] ?? config.min]} 
              onValueChange={(value) => setFilter(config.key, value[0])}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;