// pages/api/recommendation.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Payload = {
  weather: any;
  dailyForecast?: any[];
  unit?: "metric" | "imperial";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing OpenRouter API key" });
  }

  const { weather, dailyForecast, unit } = req.body as Payload;

  const prompt = `
You are an assistant that recommends clothing given current weather and a short forecast.
Return JSON only with keys:
  - "recommendations": { top_layer:[], mid_layer:[], base_layer:[], bottoms:[], footwear:[], accessories:[] }
  - "summary": string

CURRENT:
${JSON.stringify(
  {
    temp: weather?.temp ?? weather?.main?.temp,
    feels_like: weather?.feels_like ?? weather?.main?.feels_like,
    weather_main: weather?.weather?.[0]?.main,
    description: weather?.weather?.[0]?.description,
    precipitation: weather?.rain ?? weather?.snow,
    wind_speed: weather?.wind?.speed,
    humidity: weather?.humidity ?? weather?.main?.humidity,
    uv: weather?.uvi,
  },
  null,
  2
)}

DAILY_FORECAST (first entry if available):
${JSON.stringify(dailyForecast?.[0] ?? {}, null, 2)}

Constraints:
- Output valid JSON only (no extra commentary).
- Keep 1-3 items per group.
`;

  try {
    const openRouterResp = await fetch(
      "https://api.openrouter.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // choose a model available to you
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 400,
        }),
      }
    );

    if (!openRouterResp.ok) {
      const text = await openRouterResp.text();
      return res
        .status(openRouterResp.status)
        .json({ error: "OpenRouter error", details: text });
    }

    const data = await openRouterResp.json();
    const assistantMessage =
      data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? null;

    if (!assistantMessage) {
      return res.status(500).json({ error: "No content from OpenRouter" });
    }

    // Return raw assistantMessage; client will parse JSON
    return res.status(200).json({ result: assistantMessage });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
}
