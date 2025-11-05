"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import {
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Sun,
  Eye,
  Thermometer,
  Sunrise,
  Sunset,
  Activity,
  CloudSnow,
  Navigation,
  Moon,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { CurrentWeatherResponse, ForecastResponse } from "@/types/weather";
import { ClearSky, Cloudy, Rainy, Sunny } from "@/public/svgs/weather";

interface CurrentWeatherCardProps {
  currentWeather: CurrentWeatherResponse;
  forecast: ForecastResponse;
  airPollution?: any;
  unit: "metric" | "imperial";
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  currentWeather,
  forecast,
  airPollution,
  unit,
}) => {
  // === ICONS ===
  const getWeatherIcon = (main: string) => {
    const iconClass = "w-40 h-40 drop-shadow-2xl";
    switch (main.toLowerCase()) {
      case "clear":
        return <Sunny className={iconClass} />;
      case "clouds":
        return <Cloudy className={iconClass} />;
      case "rain":
        return <Rainy className={iconClass} />;
      case "snow":
        return (
          <CloudSnow className="w-40 h-40 text-cyan-400 drop-shadow-2xl" />
        );
      default:
        return <ClearSky className={iconClass} />;
    }
  };

  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // === DATA HELPERS ===
  const aqi = airPollution?.list[0]?.main?.aqi || 0;
  const aqiLabel =
    ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1] || "—";
  const aqiColor = [
    "text-green-500",
    "text-yellow-500",
    "text-orange-500",
    "text-red-500",
    "text-purple-500",
  ][aqi - 1];

  const visibility = currentWeather.visibility
    ? `${(currentWeather.visibility / 1000).toFixed(1)} km`
    : "N/A";
  const dewPoint = currentWeather.dew_point
    ? Math.round(currentWeather.dew_point)
    : "—";
  const rain1h = currentWeather.rain?.["1h"]
    ? `${currentWeather.rain["1h"].toFixed(1)} mm`
    : null;
  const snow1h = currentWeather.snow?.["1h"]
    ? `${currentWeather.snow["1h"].toFixed(1)} mm`
    : null;

  const windDir = (() => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(currentWeather.wind.deg / 45) % 8];
  })();

  const gust = currentWeather.wind.gust
    ? Math.round(currentWeather.wind.gust)
    : null;

  const getMoonPhase = () => {
    const knownNew = new Date("2025-01-13").getTime();
    const diff = (currentWeather.dt * 1000 - knownNew) / (1000 * 3600 * 24);
    const phase = ((diff % 29.53) / 29.53) * 8;
    const phases = [
      "New",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full",
      "Waning Gibbous",
      "Last Quarter",
      "Waning Crescent",
    ];
    return phases[Math.round(phase) % 8];
  };

  const getComfortIndex = () => {
    const t = currentWeather.main.temp;
    const h = currentWeather.main.humidity;
    const w = currentWeather.wind.speed;

    if (t >= 26.7 && h >= 40) {
      const hi =
        -8.784695 +
        1.61139411 * t +
        2.338549 * h -
        0.14611605 * t * h -
        0.012308094 * t * t -
        0.000162523 * h * h +
        0.000012470875 * t * t * h +
        0.0000071532 * t * h * h -
        0.000000195437 * t * t * h * h;
      return `Heat Index: ${Math.round(hi)}°`;
    } else if (t <= 10 && w >= 4.8) {
      const wc =
        13.12 +
        0.6215 * t -
        11.37 * Math.pow(w, 0.16) +
        0.3965 * t * Math.pow(w, 0.16);
      return `Wind Chill: ${Math.round(wc)}°`;
    }
    return null;
  };

  const comfort = getComfortIndex();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-background/95 via-background/80 to-background/95 backdrop-blur-3xl border border-border/70 rounded-3xl shadow-2xl">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
          />
        </div>

        {/* Inner Glow Border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 p-7">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="space-y-1.5">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {currentWeather.name}, {currentWeather.sys.country}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <motion.div
              initial={{ scale: 0.8, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="flex-shrink-0"
            >
              {getWeatherIcon(currentWeather.weather[0].main)}
            </motion.div>
          </div>

          {/* Temperature */}
          <div className="mb-7">
            <div className="flex items-end gap-1.5">
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-9xl font-black tracking-tighter text-foreground"
              >
                {Math.round(currentWeather.main.temp)}°
              </motion.p>
              <p className="text-4xl font-bold mb-4 text-primary">
                {unit === "metric" ? "C" : "F"}
              </p>
            </div>
            <p className="text-xl font-semibold text-primary capitalize mt-1">
              {currentWeather.weather[0].description}
            </p>
            <p className="text-sm text-muted-foreground">
              Feels like {Math.round(currentWeather.main.feels_like)}°
            </p>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-sm">
            <StatItem
              icon={<CloudRain />}
              label="Rain Chance"
              value={`${Math.round(forecast.list[0].pop * 100)}%`}
            />
            <StatItem
              icon={<Wind />}
              label="Wind"
              value={`${Math.round(currentWeather.wind.speed)} ${unit === "metric" ? "km/h" : "mph"}`}
            />
            <StatItem
              icon={<Droplets />}
              label="Humidity"
              value={`${currentWeather.main.humidity}%`}
            />
            <StatItem
              icon={<Gauge />}
              label="Pressure"
              value={`${currentWeather.main.pressure} hPa`}
            />

            <StatItem icon={<Eye />} label="Visibility" value={visibility} />
            <StatItem
              icon={<Thermometer />}
              label="Dew Point"
              value={`${dewPoint}°`}
            />
            <StatItem
              icon={<Sun />}
              label="UV Index"
              value={`${currentWeather.uvi || 0}`}
            />
            <StatItem
              icon={<Activity className={aqiColor} />}
              label="Air Quality"
              value={aqiLabel}
              className={aqiColor}
            />

            <StatItem
              icon={<Sunrise className="animate-pulse" />}
              label="Sunrise"
              value={formatTime(currentWeather.sys.sunrise)}
            />
            <StatItem
              icon={<Sunset className="animate-pulse" />}
              label="Sunset"
              value={formatTime(currentWeather.sys.sunset)}
            />
            <StatItem
              icon={<Navigation className="rotate-[-45deg]" />}
              label="Wind Dir"
              value={windDir}
            />
            {gust && (
              <StatItem
                icon={<Zap />}
                label="Gust"
                value={`${gust} ${unit === "metric" ? "km/h" : "mph"}`}
              />
            )}

            {comfort && (
              <StatItem
                icon={<Thermometer />}
                label="Comfort"
                value={comfort}
                className="sm:col-span-2"
              />
            )}
            <StatItem
              icon={<Moon className="animate-pulse" />}
              label="Moon Phase"
              value={getMoonPhase()}
              className="sm:col-span-2"
            />
          </div>

          {/* Rain / Snow */}
          {(rain1h || snow1h) && (
            <div className="flex justify-center gap-5 mt-5 text-xs font-medium">
              {rain1h && (
                <div className="flex items-center gap-1.5 text-blue-400">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>{rain1h}</span>
                </div>
              )}
              {snow1h && (
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CloudSnow className="w-3.5 h-3.5" />
                  <span>{snow1h}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const StatItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}> = ({ icon, label, value, className }) => (
  <motion.div
    whileHover={{ scale: 1.06, y: -2 }}
    transition={{ type: "spring", stiffness: 400 }}
    className={clsx(
      "bg-background/50 backdrop-blur-xl rounded-2xl p-3.5 border border-border/30 shadow-sm",
      className
    )}
  >
    <div className="flex items-center gap-2.5 mb-1.5">
      {React.cloneElement(icon as any, {
        className: "w-4.5 h-4.5 text-primary",
      })}
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
    <p className={clsx("text-base font-bold text-foreground", className)}>
      {value}
    </p>
  </motion.div>
);

export default CurrentWeatherCard;
