"use client";

import React, { useState, useEffect } from "react";
import { WeatherData } from "@/types/weather";
import { Card } from "@/components/ui/card";
import {
  Shirt,
  Loader2,
  AlertCircle,
  Thermometer,
  CloudRain,
  Sun,
  Wind,
} from "lucide-react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import clsx from "clsx";

interface RecommendationProps {
  weatherData: WeatherData;
  unit: "metric" | "imperial";
}

const Recommendation: React.FC<RecommendationProps> = ({
  weatherData,
  unit,
}) => {
  const [recommendations, setRecommendations] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      const { currentWeather } = weatherData;
      const temp = Math.round(currentWeather.main.temp);
      const feelsLike = Math.round(currentWeather.main.feels_like);
      const condition = currentWeather.weather[0].main;
      const description = currentWeather.weather[0].description;
      const humidity = currentWeather.main.humidity;
      const windSpeed = Math.round(currentWeather.wind.speed);
      const city = currentWeather.name;
      const unitStr = unit === "metric" ? "C" : "F";
      const windUnit = unit === "metric" ? "m/s" : "mph";

      const prompt = `
        You are a professional fashion stylist. Current weather in ${city}:
        - Temperature: ${temp}°${unitStr} (feels like ${feelsLike}°${unitStr})
        - Weather: ${condition} (${description})
        - Humidity: ${humidity}% 
        - Wind: ${windSpeed} ${windUnit}

        Suggest **3 outfit ideas for men** and **3 for women**. Each outfit should be practical, seasonal, and stylish, with layered options if needed for the weather. Format exactly like this, ensuring each outfit has a title and a list of components:

        ### Men's Outfits
        - **Casual Chic**: 
          - Lightweight hoodie
          - Slim-fit jeans
          - White sneakers
          - Denim jacket
        - **Smart Layered**: 
          - Oxford shirt
          - Wool sweater
          - Chinos
          - Leather boots
        - **Sporty Comfort**: 
          - Moisture-wicking tee
          - Joggers
          - Windbreaker
          - Running shoes

        ### Women's Outfits
        - **Effortless Elegance**: 
          - Oversized blouse
          - High-waist jeans
          - Trench coat
          - Ankle boots
        - **Cozy & Cute**: 
          - Knit sweater
          - Pleated skirt
          - Tights
          - Loafers
        - **Athleisure Glow**: 
          - Cropped hoodie
          - Leggings
          - Puffer vest
          - Chunky sneakers
      `;

      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
              max_tokens: 600,
            }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("API Error:", response.status, text);
          throw new Error("AI service temporarily unavailable");
        }

        const data = await response.json();
        setRecommendations(data.choices[0].message.content);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Outfit ideas unavailable right now. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [weatherData, unit]);

  const getWeatherIcon = () => {
    const condition = weatherData.currentWeather.weather[0].main.toLowerCase();
    const iconClass = "w-6 h-6 text-primary";
    if (condition.includes("rain")) return <CloudRain className={iconClass} />;
    if (condition.includes("clear")) return <Sun className={iconClass} />;
    if (condition.includes("wind")) return <Wind className={iconClass} />;
    return <Thermometer className={iconClass} />;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background/95 via-background/85 to-background/95 backdrop-blur-3xl border border-border/50 shadow-2xl h-full rounded-3xl">
      {/* Dynamic Aurora Glow */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-pink-500/20 animate-pulse" />
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl backdrop-blur-md shadow-lg">
              <Shirt className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                AI Fashion Stylist
              </h3>
              <p className="text-xs text-muted-foreground">
                Dressed for the Weather
              </p>
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {unit === "metric" ? "°C" : "°F"}
          </div>
        </div>

        {/* Weather Context */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/5 rounded-full border border-primary/30 flex items-center gap-3 w-fit"
        >
          {getWeatherIcon()}
          <span className="text-sm font-medium text-foreground">
            {Math.round(weatherData.currentWeather.main.temp)}°
            {unit === "metric" ? "C" : "F"} •{" "}
            {weatherData.currentWeather.weather[0].description}
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium text-foreground">
                Crafting your stylish outfits...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-red-400"
            >
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
              className="h-full grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Split Men's and Women's Outfits */}
              {["Men's Outfits", "Women's Outfits"].map((section, index) => {
                const isMen = section.includes("Men");
                const sectionContent =
                  recommendations
                    .split(/###\s*(Men's Outfits|Women's Outfits)/)
                    .find((part, i, arr) => arr[i - 1] === section) || "";

                return (
                  <div key={section} className="flex flex-col h-full">
                    <div
                      className={clsx(
                        "text-xl font-bold mb-4 sticky top-0 z-10 py-3 px-4 rounded-xl backdrop-blur-xl border",
                        isMen
                          ? "bg-gradient-to-r from-blue-600/25 to-indigo-600/25 border-blue-400/40 text-blue-200"
                          : "bg-gradient-to-r from-pink-600/25 to-rose-600/25 border-pink-400/40 text-pink-200"
                      )}
                    >
                      {section}
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted/40 pr-2">
                      <Markdown
                        components={{
                          ul: ({ children }) => (
                            <ul className="space-y-3">{children}</ul>
                          ),
                          li: ({ children, ...props }) => {
                            const text = children?.toString() || "";
                            const isOutfitTitle =
                              text.includes("**") && text.includes(":");
                            if (isOutfitTitle) {
                              const cleaned = text.replace(
                                /\*\*(.*?)\*\*/g,
                                "$1"
                              );
                              const [title, items] = cleaned
                                .split(":")
                                .map((s) => s.trim());
                              return (
                                <motion.div
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  className="group relative p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-lg border border-border/30 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <div>
                                      <p className="font-semibold text-foreground text-base">
                                        {title}
                                      </p>
                                      {items && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {items}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                              );
                            }
                            return (
                              <li className="ml-8 text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                {children}
                              </li>
                            );
                          },
                        }}
                      >
                        {sectionContent}
                      </Markdown>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Recommendation;
