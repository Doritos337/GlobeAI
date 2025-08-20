// Import the shared instance of the connection pool.
import pool from '@/lib/db';
// Import Node.js built-in modules for working with the file system and paths.
import fs from 'fs/promises';
import path from 'path';
// Import the client component.
import GlobalViewClient from './GlobalViewClient';

// Define the type for country data for better readability and code maintenance.
// This type should match the structure of your 'countries' table.
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
 * An asynchronous function to load and MERGE data.
 */
async function getData() {
  try {
    // --- Step 1: Load data from PostgreSQL ---
    const countriesResult = await pool.query('SELECT * FROM countries');
    const countriesData: CountryData[] = countriesResult.rows;

    const countriesDataMap = new Map(
      countriesData.map(country => [country.iso_alpha2, country])
    );

    // --- Step 2: Load GeoJSON data ---
    const geoJsonPath = path.join(process.cwd(), 'public/data/countries.geojson');
    const geoJsonFile = await fs.readFile(geoJsonPath, 'utf-8');
    const countriesGeoJson = JSON.parse(geoJsonFile) as GeoJSON.FeatureCollection;

    // --- Step 3: Enrich GeoJSON with data from the database ---
    countriesGeoJson.features.forEach((feature) => {
      if (feature.properties) {
        const geoJsonIsoCode = feature.properties['ISO3166-1-Alpha-2'];
        const countryDataFromDb = countriesDataMap.get(geoJsonIsoCode);
        
        if (countryDataFromDb) {
          // ✅ FINAL FIX: Manually assign properties and convert numbers
          // This ensures all filterable data is of the correct number type.
          feature.properties.name = countryDataFromDb.name;
          feature.properties.capital = countryDataFromDb.capital;
          feature.properties.population = Number(countryDataFromDb.population);
          feature.properties.happiness_level_score = Number(countryDataFromDb.happiness_level_score);
          feature.properties.cost_of_country_score = Number(countryDataFromDb.cost_of_country_score);
          feature.properties.traffic_safety_score = Number(countryDataFromDb.traffic_safety_score);
          feature.properties.avg_temp_winter_c = Number(countryDataFromDb.avg_temp_winter_c);
          feature.properties.quality_of_life_score = Number(countryDataFromDb.quality_of_life_score);
          // Add any other numerical scores here in the same way
        }
      }
    });

    return { countriesGeoJson };

  } catch (error) {
    console.error('Failed to get data:', error);
    throw new Error('Failed to load view data.');
  }
}

/**
 * The main page component, displayed at the /global-view route.
 */
export default async function GlobalViewPage() {
  // Get the single, enriched dataset.
  const { countriesGeoJson } = await getData();

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Pass only one prop to the client component */}
      <GlobalViewClient
        countriesGeoJson={countriesGeoJson}
      />
    </main>
  );
}