import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { NextResponse } from "next/server";

// ✅ КОРРЕКТНО: Конструктор теперь принимает объект конфигурации.
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { countryData } = await req.json();

    if (!countryData) {
      return NextResponse.json(
        { error: "Country data is required" },
        { status: 400 }
      );
    }

    // Промпт остается без изменений
    const prompt = `
     You are an expert travel advisor and geopolitical analyst. Your tone must be strictly objective, neutral, and analytical. Do not use appealing or engaging language. Your goal is to provide a realistic overview for a digital nomad.

  Based on the comprehensive data below for ${countryData.name}, write a detailed, multi-paragraph summary (minimum 100 words).

  Your analysis MUST cover these specific aspects in separate paragraphs:
  1.  **Lifestyle and Quality of Life:** Analyze happiness, safety, and overall quality of life.
  2.  **Economic Environment:** Analyze the cost of living, career opportunities, and the general economy score.
  3.  **Social Environment:** Analyze English proficiency and friendliness to foreigners.
  4.  **Climate:** Briefly mention the climate based on the provided winter temperatures.

  Crucially, highlight both significant advantages AND notable disadvantages (cons). Do not try to "sell" the country or be overly positive. Base your entire analysis ONLY on the data provided.

  Data:
  - Name: ${countryData.name}
  - Quality of Life Score: ${countryData.quality_of_life_score ?? 'N/A'} / 10
  - Cost of Living Score: ${countryData.cost_of_country_score ?? 'N/A'} / 10
  - Happiness Level: ${countryData.happiness_level_score ?? 'N/A'} / 10
  - English Proficiency Score: ${countryData.english_proficiency_score ?? 'N/A'} / 10
  - Safety Score: ${countryData.traffic_safety_score ?? 'N/A'} / 10
  - Career Opportunities Score: ${countryData.career_opportunities_score ?? 'N/A'} / 10
  - Economy Score: ${countryData.economy_score ?? 'N/A'} / 10
  - Friendliness to Foreigners Score: ${countryData.friendly_to_foreigners_score ?? 'N/A'} / 10
  - Average Winter Temperature: ${countryData.avg_temp_winter_c ?? 'N/A'}°C
  - Average Summer Temperature: ${countryData.avg_temp_summer_c ?? 'N/A'}°C
    `;

    // ✅ КОРРЕКТНО: Вызов generateContent непосредственно на экземпляре клиента.
    // Модель указывается как часть объекта запроса.
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash", // Рекомендуется рассмотреть более новые модели, например, "gemini-1.5-pro"
      contents: [{ role: "user", parts: [{ text: prompt }] }], // Использование структурированного формата для ясности
      config: {
        thinkingConfig: {
          thinkingBudget: 3, // Disables thinking
        },
      }
    });

    const text = result.text;

    return NextResponse.json({ summary: text });

  } catch (error) {
    console.error("Error in Gemini API route:", error);
    // Улучшенная обработка ошибок будет рассмотрена в Части 3
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}