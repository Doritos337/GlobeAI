// Импортируем функцию 'create' из библиотеки zustand для создания нашего хранилища.
import { create } from 'zustand';

// Определяем тип для данных о стране, чтобы обеспечить типобезопасность.
// Этот тип должен соответствовать структуре данных, получаемых из вашей базы данных.
export type Country = {
    id: number;
    name: string;
    iso_alpha2: string;
    capital: string | null;
    population: number | null;
    best_cities_career_ids: string | null;
    best_cities_life_ids: string | null;
    best_cities_tourism_ids: string | null;
    economy_score: number | null;
    quality_of_life_score: number | null;
    english_proficiency_score: number | null;
    career_opportunities_score: number | null;
    education_level_score: number | null;
    medicine_level_score: number | null;
    traffic_safety_score: number | null;
    friendly_to_foreigners_score: number | null;
    freedom_of_speech_score: number | null;
    happiness_level_score: number | null;
    cost_of_country_score: number | null;
    avg_temp_summer_c: number | null;
    avg_temp_winter_c: number | null;
    tourist_infrastructure_score: number | null;
};

// Определяем интерфейс для наших фильтров.
// Для числовых показателей мы будем использовать диапазон [min, max].
export interface Filters {
  happiness_level_score: number;
  cost_of_country_score: number;
  traffic_safety_score: number;
  avg_temp_winter_c: number;
}

// Определяем полный тип состояния нашего приложения.
interface AppState {
  filters: Filters;
  selectedCountry: Country | null;
  isModalOpen: boolean;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setSelectedCountry: (country: Country | null) => void;
  toggleModal: (isOpen?: boolean) => void;
  resetFilters: () => void;
}

// Задаем начальные значения для фильтров.
// Здесь мы устанавливаем максимально широкие диапазоны.
const initialFilters: Filters = {
  happiness_level_score: 5,
  cost_of_country_score: 5,
  traffic_safety_score: 5,
  avg_temp_winter_c: 0,
};

/**
 * Создаем и экспортируем наше хранилище Zustand.
 * `useStore` - это хук, который мы будем использовать в компонентах для доступа к состоянию и действиям.
 */
export const useStore = create<AppState>((set) => ({
  // --- Начальное состояние (Initial State) ---
  filters: initialFilters,
  selectedCountry: null,
  isModalOpen: false,

  // --- Действия (Actions) ---

  // Функция для обновления конкретного фильтра.
  // Она принимает ключ фильтра и новое значение.
  setFilter: (key, value) => set((state) => ({
    filters: {...state.filters, [key]: value }
  })),

  // Функция для установки или сброса выбранной страны.
  setSelectedCountry: (country) => set({ selectedCountry: country }),

  // Функция для открытия/закрытия модального окна.
  toggleModal: (isOpen) => set((state) => ({
    isModalOpen: isOpen!== undefined? isOpen :!state.isModalOpen
  })),
  
  // Функция для сброса всех фильтров к их начальным значениям.
  resetFilters: () => set({ filters: initialFilters }),
}));