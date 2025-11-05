import React from "react";
import { Card } from "@/components/ui/card";
import {
  Wind,
  Compass,
  Gauge,
  Waves,
  Mountain,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { CurrentWeatherResponse } from "@/types/weather";
import { motion } from "framer-motion";

interface WindPressureCardProps {
  currentWeather: CurrentWeatherResponse;
  unit: "metric" | "imperial";
}

const WindPressureCard: React.FC<WindPressureCardProps> = ({
  currentWeather,
  unit,
}) => {
  const getWindDirection = (deg: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  const windSpeed = Math.round(currentWeather.wind.speed);
  const windUnit = unit === "metric" ? "km/h" : "mph";
  const direction = getWindDirection(currentWeather.wind.deg);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background/80 via-background to-background/60 backdrop-blur-xl border border-border/50 shadow-xl h-full">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 animate-pulse" />
      </div>

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Wind className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground tracking-tight">
            Wind & Pressure
          </h3>
        </div>

        <div className="space-y-5">
          {/* WIND SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-500" />
                Wind
              </h4>
              <span className="text-xs text-muted-foreground">Direction</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/40 backdrop-blur-sm rounded-xl p-3 border border-border/20">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 text-blue-400" />
                  <span className="text-lg font-bold text-foreground">
                    {windSpeed}{" "}
                    <span className="text-sm font-normal">{windUnit}</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Speed</p>
              </div>

              <div className="bg-muted/40 backdrop-blur-sm rounded-xl p-3 border border-border/20">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span className="text-lg font-bold text-foreground">
                    {direction}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentWeather.wind.deg}°
                </p>
              </div>
            </div>

            {currentWeather.wind.gust && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg py-2 px-3">
                <ArrowDown className="w-3 h-3 text-orange-400" />
                <span>
                  Gust:{" "}
                  <strong>
                    {Math.round(currentWeather.wind.gust)} {windUnit}
                  </strong>
                </span>
              </div>
            )}
          </motion.div>

          {/* DIVIDER */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* PRESSURE SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Gauge className="w-4 h-4 text-red-500" />
              Pressure
            </h4>

            <div className="space-y-2">
              <div className="bg-muted/40 backdrop-blur-sm rounded-xl p-3 border border-border/20">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    {currentWeather.main.pressure}{" "}
                    <span className="text-sm font-normal">hPa</span>
                  </span>
                  <Gauge className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Surface Level
                </p>
              </div>

              {currentWeather.main.sea_level && (
                <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-400">
                      {currentWeather.main.sea_level} hPa
                    </span>
                    <Waves className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sea Level
                  </p>
                </div>
              )}

              {currentWeather.main.grnd_level && (
                <div className="bg-green-500/5 rounded-xl p-3 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-400">
                      {currentWeather.main.grnd_level} hPa
                    </span>
                    <Mountain className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ground Level
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};

export default WindPressureCard;
