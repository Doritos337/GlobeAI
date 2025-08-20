"use client";

import { useStore, Country } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AIDescriptionDisplay from "../ai/AIDescriptionDisplay";

/**
 * Компонент модального окна для отображения детальной информации о выбранной стране.
 */
const CountryModal = () => {
  const isModalOpen = useStore((state) => state.isModalOpen);
  const selectedCountry = useStore((state) => state.selectedCountry);
  const toggleModal = useStore((state) => state.toggleModal);

  if (!selectedCountry) {
    return null;
  }

  return (
    // Этот компонент отвечает за логику открытия/закрытия и фон
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      {/* Этот компонент отвечает за внешний вид самого окна */}
      <DialogContent className="bg-gray-900 bg-opacity-90 border-gray-700 text-white max-w-2xl z-50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-green-400">
            {selectedCountry.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Capital: {selectedCountry.capital || 'N/A'}
          </DialogDescription>
        </DialogHeader>

        {/* Контейнер для отображения метрик с улучшенной вёрсткой */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between items-center bg-black bg-opacity-30 p-3 rounded-md">
                <p className="font-semibold text-gray-300">Population</p>
                <p className="text-lg font-mono">{selectedCountry.population?.toLocaleString('en-US') || 'N/A'}</p>
            </div>
             <div className="flex justify-between items-center bg-black bg-opacity-30 p-3 rounded-md">
                <p className="font-semibold text-gray-300">Quality of Life</p>
                <p className="text-lg font-mono">{selectedCountry.quality_of_life_score ?? 'N/A'} / 10</p>
            </div>
            <div className="flex justify-between items-center bg-black bg-opacity-30 p-3 rounded-md">
                <p className="font-semibold text-gray-300">Happiness Level</p>
                <p className="text-lg font-mono">{selectedCountry.happiness_level_score ?? 'N/A'} / 10</p>
            </div>
            <div className="flex justify-between items-center bg-black bg-opacity-30 p-3 rounded-md">
                <p className="font-semibold text-gray-300">Cost of Living</p>
                <p className="text-lg font-mono">{selectedCountry.cost_of_country_score ?? 'N/A'} / 10</p>
            </div>
        </div>

        {/* Раздел для AI-описания */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-green-400 mb-2">AI Summary</h3>
          <AIDescriptionDisplay country={selectedCountry} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountryModal;