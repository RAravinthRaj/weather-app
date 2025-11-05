import React, { useMemo } from 'react';
import { WeatherData } from '@/types/weather';
import DayDuration from '@/components/views/day-duration';
import AirPollutionChart from '@/components/views/air-pollution';
import TemperatureHumidityChart from '@/components/views/temp-humidity';
import ClientMap from '@/components/views/client-map';
import CurrentWeatherCard from '@/components/views/current-weather';
import WindPressureCard from '@/components/views/wind-pressure';
import HourlyForecast from '@/components/views/hourly-forecast';
import EnhancedDailyForecast from '@/components/views/daily-forecast'; // Your enhanced component

interface WeatherDashboardProps {
  weatherData: WeatherData;
  unit: 'metric' | 'imperial';
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weatherData, unit }) => {
  const { currentWeather, forecast, airPollution } = weatherData;

  const hourlyForecastData = useMemo(
    () =>
      forecast.list.slice(0, 4).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temperature: item.main.temp,
        feels_like: item.main.feels_like,
        weather: item.weather[0].main,
        description: item.weather[0].description,
        precipitation: item.rain?.['1h']
          ? Math.min(100, Math.round(item.rain['1h'] * 100))
          : item.snow?.['1h']
            ? Math.min(100, Math.round(item.snow['1h'] * 100))
            : 0,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        uv_index: item.uvi || 0, // if available
      })),
    [forecast.list],
  );

  // Daily Forecast: Next 5 days with accurate min/max
  const dailyForecastData = useMemo(() => {
    const daysMap = new Map<
      string,
      {
        high: number;
        low: number;
        weather: string;
        description: string;
        precipitation: number;
        humidity: number;
        wind_speed: number;
        wind_deg: number;
        uv_index: number;
        sunrise: string;
        sunset: string;
        date: Date;
        noonItem?: any; // Store noon-like item for weather details
      }
    >();

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      const hour = date.getHours();

      const high = item.main.temp_max;
      const low = item.main.temp_min;
      const precipitation = (item.rain?.['3h'] || item.snow?.['3h'] || 0) * 100; // Convert to %

      if (!daysMap.has(dayKey)) {
        daysMap.set(dayKey, {
          high,
          low,
          weather: item.weather[0].main,
          description: item.weather[0].description,
          precipitation,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          uv_index: item.uvi || 0,
          sunrise: new Date(forecast.city.sunrise * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sunset: new Date(forecast.city.sunset * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date,
          noonItem: hour >= 10 && hour <= 14 ? item : undefined, // Noon-ish
        });
      } else {
        const existing = daysMap.get(dayKey)!;
        existing.high = Math.max(existing.high, high);
        existing.low = Math.min(existing.low, low);
        existing.precipitation += precipitation;
        if (
          hour >= 10 &&
          hour <= 14 &&
          Math.abs(hour - 12) <
            Math.abs(
              (existing.noonItem?.dt
                ? new Date(existing.noonItem.dt * 1000).getHours()
                : 12) - 12,
            )
        ) {
          existing.noonItem = item;
        }
      }
    });

    return Array.from(daysMap.values())
      .filter((day) => day.date.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0))
      .slice(0, 3)
      .map((day) => ({
        date: day.date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayName: day.date.toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(day.high),
        low: Math.round(day.low),
        weather: day.noonItem?.weather[0].main || day.weather,
        description: day.noonItem?.weather[0].description || day.description,
        precipitation: Math.min(100, Math.round(day.precipitation / 8)), // Average over ~8 3h periods
        humidity: Math.round(day.noonItem?.main.humidity || day.humidity),
        wind_speed: Math.round(day.noonItem?.wind.speed || day.wind_speed),
        wind_deg: Math.round(day.noonItem?.wind.deg || day.wind_deg),
        uv_index: day.noonItem?.uvi || day.uv_index,
        sunrise: day.sunrise,
        sunset: day.sunset,
      }));
  }, [forecast.list]);

  return (
    <div className="bg-inherit min-h-screen flex flex-col">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {/* 1. Current Weather */}
        <CurrentWeatherCard
          currentWeather={currentWeather}
          forecast={forecast}
          unit={unit}
        />

        {/* 2. Wind + Hourly + Daily (stacked) */}
        <div className="grid grid-rows-2 gap-4">
          <WindPressureCard currentWeather={currentWeather} unit={unit} />
          <HourlyForecast forecast={hourlyForecastData} unit={unit} />
        </div>

        {/* 3. Air Pollution */}
        <div className="grid grid-rows-2 gap-4">
          <AirPollutionChart data={airPollution} />
          <EnhancedDailyForecast forecast={dailyForecastData} unit={unit} />
        </div>

        {/* 4. Temp/Humidity Chart */}
        <TemperatureHumidityChart data={forecast} unit={unit} />

        {/* 5. Day Duration */}
        <DayDuration data={currentWeather} />

        {/* 6. Map */}
        <ClientMap
          center={[currentWeather.coord.lat, currentWeather.coord.lon]}
          zoom={10}
          markerPosition={[currentWeather.coord.lat, currentWeather.coord.lon]}
          popupContent={`${currentWeather.name}, ${currentWeather.sys.country}`}
        />
      </div>
    </div>
  );
};

export default WeatherDashboard;
