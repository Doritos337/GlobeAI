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
      You are an expert travel advisor for digital nomads and remote workers.
      Based on the following data for ${countryData.name}, write a concise, insightful, and appealing summary (3-4 sentences) for a person considering this country for a long-term stay.
      Highlight the key pros and cons based on the provided metrics. The tone should be objective but engaging.

      Data:
      - Quality of Life Score: ${countryData.quality_of_life_score?? 'N/A'}/10
      - Cost of Living Score: ${countryData.cost_of_country_score?? 'N/A'}/10
      - Happiness Level: ${countryData.happiness_level_score?? 'N/A'}/10
      - English Proficiency Score: ${countryData.english_proficiency_score?? 'N/A'}/10
      - Safety Score: ${countryData.traffic_safety_score?? 'N/A'}/10
      - Average Winter Temperature: ${countryData.avg_temp_winter_c?? 'N/A'}°C

      Focus on the lifestyle implications of these numbers. If data for a metric is 'N/A', acknowledge that information is not available for that point.
    `;

    // ✅ КОРРЕКТНО: Вызов generateContent непосредственно на экземпляре клиента.
    // Модель указывается как часть объекта запроса.
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash", // Рекомендуется рассмотреть более новые модели, например, "gemini-1.5-pro"
      contents: [{ role: "user", parts: [{ text: prompt }] }], // Использование структурированного формата для ясности
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
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