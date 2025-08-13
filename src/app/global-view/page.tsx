// Импортируем наш единый экземпляр пула соединений.
import pool from '@/lib/db';
// Импортируем встроенные модули Node.js для работы с файловой системой и путями.
import fs from 'fs/promises';
import path from 'path';
// Импортируем клиентский компонент.
import GlobalViewClient from './GlobalViewClient';

// Определяем тип для данных страны для лучшей читаемости и поддержки кода.
// Этот тип должен соответствовать структуре вашей таблицы 'countries'.
type CountryData = {
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

/**
 * Асинхронная функция для загрузки и ОБЪЕДИНЕНИЯ данных.
 */
async function getData() {
  try {
    // --- Шаг 1: Загрузка данных о странах из PostgreSQL ---
    const countriesResult = await pool.query('SELECT * FROM countries');
    const countriesData: CountryData = countriesResult.rows;

    // Создаем карту для быстрого доступа к данным по ISO коду (O(1) сложность поиска)
    const countriesDataMap = new Map(
      countriesData.map(country => [country.iso_alpha2, country])
    );

    // --- Шаг 2: Загрузка географических данных из файла GeoJSON ---
    const geoJsonPath = path.join(process.cwd(), 'public/data/countries.geojson');
    const geoJsonFile = await fs.readFile(geoJsonPath, 'utf-8');
    const countriesGeoJson = JSON.parse(geoJsonFile);

    // --- Шаг 3 (НОВЫЙ): Обогащение GeoJSON данными из базы ---
    // Мы проходим по каждому объекту (feature) в GeoJSON и добавляем ему нужные свойства.
    countriesGeoJson.features.forEach((feature: any) => {
      const countryData = countriesDataMap.get(feature.properties.ISO_A2);
      if (countryData) {
        // Добавляем все необходимые для карты поля в properties
        feature.properties.name = countryData.name;
        feature.properties.capital = countryData.capital;
        feature.properties.population = countryData.population;
        feature.properties.happiness_level_score = countryData.happiness_level_score;
        feature.properties.cost_of_country_score = countryData.cost_of_country_score;
        feature.properties.traffic_safety_score = countryData.traffic_safety_score;
        feature.properties.avg_temp_winter_c = countryData.avg_temp_winter_c;
        feature.properties.quality_of_life_score = countryData.quality_of_life_score;
      }
    });

    // Возвращаем ОДИН обогащенный GeoJSON.
    return { countriesGeoJson };

  } catch (error) {
    console.error('Failed to get data:', error);
    throw new Error('Failed to load view data.');
  }
}

/**
 * Главный компонент страницы.
 */
export default async function GlobalViewPage() {
  // Получаем единый, обогащенный набор данных.
  const { countriesGeoJson } = await getData();

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Передаем в клиентский компонент только один пропс */}
      <GlobalViewClient
        countriesGeoJson={countriesGeoJson}
      />
    </main>
  );
}