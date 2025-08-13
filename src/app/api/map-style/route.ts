// Путь к файлу: src/app/api/map-style/route.ts

import { NextResponse } from 'next/server';

/**
 * Этот обработчик GET-запросов работает как безопасный прокси для API MapTiler.
 * Он извлекает API-ключ из переменных окружения на сервере,
 * запрашивает файл стиля у MapTiler и передает его клиенту.
 * Это предотвращает утечку API-ключа в браузер пользователя.
 */
export async function GET() {
  // 1. Безопасно получаем API-ключ из переменных окружения на сервере.
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  // 2. Проверяем, что ключ был предоставлен.
  if (!apiKey) {
    console.error('Ошибка: API-ключ MapTiler не настроен на сервере.');
    return NextResponse.json(
      { error: 'API-ключ для карты не настроен' },
      { status: 500 }
    );
  }

  // 3. Формируем URL для запроса стиля у MapTiler.
  const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;

  try {
    // 4. Выполняем запрос к API MapTiler.
    const response = await fetch(styleUrl);

    // 5. Если MapTiler вернул ошибку (например, ключ невалиден), передаем ее дальше.
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Ошибка от MapTiler API: ${response.status}`, errorBody);
      return NextResponse.json(
        { error: 'Не удалось загрузить стиль карты от провайдера' },
        { status: response.status }
      );
    }

    // 6. Если все успешно, получаем JSON стиля и отправляем его клиенту.
    const styleJson = await response.json();
    return NextResponse.json(styleJson);

  } catch (error) {
    console.error('Внутренняя ошибка при запросе стиля карты:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера при запросе стиля карты' },
      { status: 500 }
    );
  }
}