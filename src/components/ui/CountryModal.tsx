"use client"; // Директива, объявляющая этот компонент клиентским.

// Импортируем хук useStore и тип Country из нашего хранилища Zustand.
import { useStore, Country } from "@/lib/store";
// Импортируем компоненты для модального окна из shadcn/ui.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Импортируем наш компонент для отображения AI-описания.
import AIDescriptionDisplay from "../ai/AIDescriptionDisplay";

/**
 * Компонент модального окна для отображения детальной информации о выбранной стране.
 */
const CountryModal = () => {
  // ИСПРАВЛЕНО: Получаем каждое значение из хранилища отдельным селектором.
  // Это предотвращает создание новых объектов и бесконечный цикл перерисовок.
  const isModalOpen = useStore((state) => state.isModalOpen);
  const selectedCountry = useStore((state) => state.selectedCountry);
  const toggleModal = useStore((state) => state.toggleModal);

  // Если страна не выбрана, компонент ничего не рендерит.
  if (!selectedCountry) {
    return null;
  }

  return (
    // Компонент Dialog из shadcn/ui.
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="bg-brand-surface border-brand-primary text-white max-w-lg">
        <DialogHeader>
          {/* Заголовок окна с названием и столицей страны. */}
          <DialogTitle className="text-2xl font-bold text-brand-highlight">
            {selectedCountry.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Capital: {selectedCountry.capital || 'N/A'}
          </DialogDescription>
        </DialogHeader>

        {/* Контейнер для отображения метрик. */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-brand-dark p-3 rounded-md">
            <p className="font-semibold text-gray-300">Population</p>
            <p className="text-lg">{selectedCountry.population?.toLocaleString('en-US') || 'N/A'}</p>
          </div>
          <div className="bg-brand-dark p-3 rounded-md">
            <p className="font-semibold text-gray-300">Happiness Level</p>
            <p className="text-lg">{selectedCountry.happiness_level_score ?? 'N/A'} / 10</p>
          </div>
          <div className="bg-brand-dark p-3 rounded-md">
            <p className="font-semibold text-gray-300">Quality of Life</p>
            <p className="text-lg">{selectedCountry.quality_of_life_score ?? 'N/A'} / 10</p>
          </div>
          <div className="bg-brand-dark p-3 rounded-md">
            <p className="font-semibold text-gray-300">Cost of Living</p>
            <p className="text-lg">{selectedCountry.cost_of_country_score ?? 'N/A'} / 10</p>
          </div>
        </div>

        {/* Раздел для AI-описания */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-brand-highlight mb-2">AI Summary</h3>
          {/* Вставляем наш компонент AIDescriptionDisplay.
            Он самостоятельно обработает запрос к API и отобразит результат.
          */}
          <AIDescriptionDisplay country={selectedCountry} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountryModal;