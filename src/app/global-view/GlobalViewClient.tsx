"use client";

import React from 'react';
import MapContainer from '@/components/map/MapContainer';
import FilterPanel from '@/components/ui/FilterPanel';
import CountryModal from '@/components/ui/CountryModal';

interface GlobalViewClientProps {
  countriesGeoJson: GeoJSON.FeatureCollection;
  // Пропс countriesData больше не нужен
}

const GlobalViewClient: React.FC<GlobalViewClientProps> = ({ countriesGeoJson }) => {
  return (
    <div className="w-full h-full relative">
      {/* Передаем в карту только один пропс */}
      <MapContainer 
        countriesGeoJson={countriesGeoJson} 
      />
      <FilterPanel />
      <CountryModal />
    </div>
  );
};

export default GlobalViewClient;