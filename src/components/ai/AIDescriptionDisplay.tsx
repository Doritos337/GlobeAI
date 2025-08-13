"use client"; // Директива, объявляющая этот компонент клиентским.

// Импортируем хуки useState и useEffect из React для управления состоянием и выполнения сайд-эффектов.
import { useState, useEffect } from "react";
// Импортируем тип Country из нашего хранилища, чтобы знать структуру данных о стране.
import { Country } from "@/lib/store";

// Определяем типы для пропсов, которые компонент получает.
interface AIDescriptionDisplayProps {
  country: Country;
}

/**
 * Компонент для запроса и отображения AI-сгенерированного описания страны.
 * @param {AIDescriptionDisplayProps} props - Пропсы, содержащие данные о выбранной стране.
 */
const AIDescriptionDisplay: React.FC<AIDescriptionDisplayProps> = ({ country }) => {
  // --- Шаг 1: Управление состоянием компонента ---
  // Состояние для хранения текста описания.
  const [summary, setSummary] = useState<string>("");
  // Состояние для отслеживания процесса загрузки.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Состояние для хранения возможных ошибок.
  const [error, setError] = useState<string | null>(null);

  // --- Шаг 2: Запрос данных при изменении страны ---
  // useEffect будет запускаться каждый раз, когда пропс 'country' изменяется.
  useEffect(() => {
    // Функция для асинхронного запроса описания.
    const fetchDescription = async () => {
      // Сбрасываем состояния перед новым запросом.
      setIsLoading(true);
      setError(null);
      setSummary("");

      try {
        // Отправляем POST-запрос на наш серверный маршрут /api/describe-location.
        const response = await fetch('/api/describe-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // В теле запроса передаем полные данные о стране.
          body: JSON.stringify({ countryData: country }),
        });

        // Если ответ не успешный (статус не 2xx), выбрасываем ошибку.
        if (!response.ok) {
          throw new Error('Failed to fetch AI description');
        }

        // Парсим JSON из ответа.
        const data = await response.json();
        // Устанавливаем полученное описание в состояние.
        setSummary(data.summary);
      } catch (err) {
        // В случае ошибки, сохраняем ее сообщение в состояние.
        setError(err instanceof Error? err.message : "An unknown error occurred");
      } finally {
        // Вне зависимости от результата (успех или ошибка), завершаем загрузку.
        setIsLoading(false);
      }
    };

    // Вызываем функцию запроса.
    fetchDescription();
  }, [country]); // Зависимость от 'country' гарантирует перезапуск эффекта при выборе новой страны.

  // --- Шаг 3: Условный рендеринг в зависимости от состояния ---

  // Если данные загружаются, показываем анимированный плейсхолдер (скелет).
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse h-4 bg-gray-700 rounded w-full"></div>
        <div className="animate-pulse h-4 bg-gray-700 rounded w-full"></div>
        <div className="animate-pulse h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  // Если произошла ошибка, показываем сообщение об ошибке.
  if (error) {
    return <p className="text-red-400">Error: {error}</p>;
  }

  // Если все успешно, отображаем сгенерированное описание.
  return <p className="text-gray-300 leading-relaxed">{summary}</p>;
};

export default AIDescriptionDisplay;