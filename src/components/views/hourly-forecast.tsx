// import React, { useMemo, useCallback } from 'react';
// import { Card } from '@/components/ui/card';
// import { Clock, CloudSnow } from 'lucide-react';
// import { ClearSky, Cloudy, Rainy, Sunny } from '@/public/svgs/weather';

// interface HourlyForecast {
//   time: string;
//   temperature: number;
//   weather: string;
// }

// interface HourlyForecastProps {
//   forecast: HourlyForecast[];
//   unit: 'metric' | 'imperial';
// }

// const HourlyForecast: React.FC<HourlyForecastProps> = React.memo(function HourlyForecast({
//   forecast,
//   unit,
// }) {
//   const getWeatherIcon = useCallback((weather: string) => {
//     switch (weather.toLowerCase()) {
//       case 'clear':
//         return <Sunny className="w-6 h-6" />;
//       case 'clouds':
//         return <Cloudy className="w-6 h-6" />;
//       case 'rain':
//         return <Rainy className="w-6 h-6" />;
//       case 'snow':
//         return <CloudSnow className="w-6 h-6" />;
//       default:
//         return <ClearSky className="w-6 h-6" />;
//     }
//   }, []);

//   const memoizedForecast = useMemo(() => forecast.slice(0, 5), [forecast]);

//   return (
//     <Card className="flex flex-col h-full">
//       <div className="text-center">
//         <div className="flex items-center justify-center gap-2">
//           <Clock className="h-4 w-4" />
//           Hourly Forecast
//         </div>
//       </div>
//       <div className="flex-1 flex flex-col items-center justify-center">
//         <div className="w-full max-w-lg mx-auto">
//           <div className="flex items-center justify-evenly w-full">
//             {memoizedForecast.map((hour, index) => (
//               <div key={index} className="text-center flex flex-col items-center gap-3">
//                 <p className="text-sm font-medium text-muted-foreground">{hour.time}</p>
//                 <div className="flex justify-center">{getWeatherIcon(hour.weather)}</div>
//                 <p className="text-sm font-semibold">
//                   {Math.round(hour.temperature)}°{unit === 'metric' ? 'C' : 'F'}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// });

// export default HourlyForecast;
import React, { useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Droplets, Wind, Sun, CloudSnow } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ClearSky, Cloudy, Rainy, Sunny } from '@/public/svgs/weather';

interface HourlyForecast {
  time: string;
  temperature: number;
  feels_like: number;
  weather: string;
  description: string;
  precipitation: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  uv_index: number;
}

interface HourlyForecastProps {
  forecast: HourlyForecast[];
  unit: 'metric' | 'imperial';
}

const HourlyForecast: React.FC<HourlyForecastProps> = React.memo(function HourlyForecast({
  forecast,
  unit,
}) {
  const getWeatherIcon = useCallback((weather: string) => {
    const iconClass = 'w-10 h-10 drop-shadow-md';
    switch (weather.toLowerCase()) {
      case 'clear':
        return <Sunny className={iconClass} />;
      case 'clouds':
        return <Cloudy className={iconClass} />;
      case 'rain':
        return <Rainy className={iconClass} />;
      case 'snow':
        return <CloudSnow className={iconClass} />;
      default:
        return <ClearSky className={iconClass} />;
    }
  }, []);

  const getWindDirection = (deg: number) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  const memoizedForecast = useMemo(() => forecast.slice(0, 5), [forecast]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background/90 via-background/70 to-background/90 backdrop-blur-2xl border border-border/60 shadow-2xl h-full rounded-2xl">
      {/* Animated aurora background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-purple-600/30 animate-pulse" />
      </div>

      <div className="relative z-10 p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/15 rounded-full backdrop-blur-sm">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Next Hourly Weathers
            </h3>
          </div>
          <div className="text-xs text-muted-foreground">
            {unit === 'metric' ? '°C' : '°F'}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted/50 pr-1">
          <div className="space-y-3">
            {memoizedForecast.map((hour, index) => {
              const isNow = index === 0;
              const windDir = getWindDirection(hour.wind_deg);
              const uvLevel =
                hour.uv_index > 7 ? 'High' : hour.uv_index > 5 ? 'Moderate' : 'Low';
              const uvColor =
                hour.uv_index > 7
                  ? 'text-orange-500'
                  : hour.uv_index > 5
                    ? 'text-yellow-500'
                    : 'text-green-500';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.015, x: 4 }}
                  className={clsx(
                    'group relative p-4 rounded-2xl transition-all duration-400 cursor-pointer',
                    'bg-gradient-to-r from-muted/40 via-muted/20 to-muted/10 backdrop-blur-xl',
                    'border border-border/30 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10',
                    isNow &&
                      'ring-2 ring-primary/30 bg-primary/10 border-primary/30 shadow-lg shadow-primary/20',
                  )}
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                  <div className="relative flex items-center justify-between gap-3">
                    {/* LEFT: Time + Now Badge */}
                    <div className="flex flex-col items-start min-w-[60px]">
                      <span
                        className={clsx(
                          'text-sm font-bold',
                          isNow ? 'text-primary' : 'text-foreground',
                        )}
                      >
                        {hour.time}
                      </span>
                      {isNow && (
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium"
                        >
                          Live
                        </motion.span>
                      )}
                    </div>

                    {/* CENTER: Icon + Precip + Weather */}
                    <div className="flex-1 flex items-center gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">{getWeatherIcon(hour.weather)}</div>

                      {/* Precip Bar */}
                      {hour.precipitation > 0 && (
                        <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 rounded-full shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: `${hour.precipitation}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* RIGHT: Temp + Details */}
                    <div className="flex flex-col items-end gap-1 text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-foreground">
                          {Math.round(hour.temperature)}°
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Feels {Math.round(hour.feels_like)}°
                        </span>
                      </div>

                      {/* Mini Stats Row */}
                      <div className="flex items-center gap-3 text-xs">
                        {/* Wind */}
                        <div className="flex items-center gap-1">
                          <Wind className="w-3 h-3 text-blue-400" />
                          <span className="font-medium">
                            {Math.round(hour.wind_speed)}
                          </span>
                          <span className="text-muted-foreground">{windDir}</span>
                        </div>

                        {/* Humidity */}
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-cyan-400" />
                          <span>{hour.humidity}%</span>
                        </div>

                        {/* UV */}
                        <div className={clsx('flex items-center gap-1', uvColor)}>
                          <Sun className="w-3 h-3" />
                          <span>{uvLevel}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {hour.description}
                      </p>
                    </div>
                  </div>

                  {/* Precip % Badge (mobile) */}
                  {hour.precipitation > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">
                      {hour.precipitation}%
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
});

export default HourlyForecast;
