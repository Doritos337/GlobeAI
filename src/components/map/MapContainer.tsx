"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore, Country, Filters } from '@/lib/store';

interface MapContainerProps {
  countriesGeoJson: GeoJSON.FeatureCollection;
}

const MapContainer: React.FC<MapContainerProps> = ({ countriesGeoJson }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  
  const filters = useStore((state) => state.filters);
  const { setSelectedCountry, toggleModal } = useStore();

  const filteredGeoJson = useMemo(() => {
    if (!countriesGeoJson?.features) {
      return { type: 'FeatureCollection', features: [] };
    }

    const geoJsonCopy = JSON.parse(JSON.stringify(countriesGeoJson));
    
    // ✅ ИСПРАВЛЕНИЕ: Используем правильное имя свойства 'ISO3166-1-Alpha-2'
    geoJsonCopy.features = geoJsonCopy.features.filter(
      (feature: GeoJSON.Feature) => feature.properties && feature.properties['ISO3166-1-Alpha-2']
    );
    
    return geoJsonCopy;
  }, [countriesGeoJson]);


  useEffect(() => {
    if (!filteredGeoJson || mapRef.current || !mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=O6DU6yzjjAJwJPHpAVtx`,
      center: [10, 30],
      zoom: 1.5,
    });

    mapRef.current = map;

    map.on('error', (e) => console.error('ОШИБКА MAPLIBRE:', e));

    map.on('load', () => {
      map.addSource('countries-source', {
        type: 'geojson',
        data: filteredGeoJson, 
        // Убеждаемся, что здесь тоже правильное имя
        promoteId: 'ISO3166-1-Alpha-2'
      });

      // Слой заливки стран
      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries-source',
        paint: {
          'fill-color': '#4A69FF',
          'fill-opacity': [ 'case', ['boolean', ['feature-state', 'hover'], false], 0.8, 0.5 ]
        }
      });

      // Слой для границ
      map.addLayer({
        id: 'countries-outline',
        type: 'line',
        source: 'countries-source',
        paint: { 'line-color': '#AFFF5C', 'line-width': 1 }
      });

      let hoveredCountryId: string | number | undefined = undefined;

      // Обработчик наведения мыши
      map.on('mousemove', 'countries-fill', (e) => {
        if (e.features?.length) {
            map.getCanvas().style.cursor = 'pointer';
            if (hoveredCountryId !== e.features[0].id) {
                if (hoveredCountryId) {
                    map.setFeatureState({ source: 'countries-source', id: hoveredCountryId }, { hover: false });
                }
                hoveredCountryId = e.features[0].id;
                map.setFeatureState({ source: 'countries-source', id: hoveredCountryId }, { hover: true });
            }
        }
      });

      // Обработчик, когда мышь уходит с полигона
      map.on('mouseleave', 'countries-fill', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredCountryId) {
          map.setFeatureState({ source: 'countries-source', id: hoveredCountryId }, { hover: false });
        }
        hoveredCountryId = undefined;
      });

      // Обработчик клика по стране
      map.on('click', 'countries-fill', (e) => {
        if (e.features?.length) {
          const countryInfo = e.features[0].properties;
          setSelectedCountry(countryInfo as Country);
          toggleModal(true);
        }
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [filteredGeoJson, setSelectedCountry, toggleModal]);

  // Хук для реакции на изменение фильтров
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const filterExpression: any[] = ['all'];

    (Object.keys(filters) as Array<keyof Filters>).forEach(key => {
      const value = filters[key];
      if (value != null) {
        filterExpression.push(['>=', ['get', key], value]);
      }
    });

    map.setFilter('countries-fill', filterExpression.length > 1 ? filterExpression : null);
    map.setFilter('countries-outline', filterExpression.length > 1 ? filterExpression : null);

  }, [filters]);

  return <div ref={mapContainerRef} className="absolute top-0 bottom-0 w-full h-full" />;
};

export default MapContainer;