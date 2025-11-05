// import React, { useMemo, useCallback } from 'react';
// import { Card } from '@/components/ui/card';
// import { Calendar, Cloud, CloudRain, CloudSnow, Sun, Zap } from 'lucide-react';
// import { motion } from 'framer-motion';
// import clsx from 'clsx';

// import { ClearSky, Cloudy, Rainy, Sunny } from '@/public/svgs/weather';

// interface DailyForecast {
//   date: string;
//   dayName: string;
//   high: number;
//   low: number;
//   weather: string;
//   precipitation?: number;
// }

// interface EnhancedDailyForecastProps {
//   forecast: DailyForecast[];
//   unit: 'metric' | 'imperial';
// }

// const EnhancedDailyForecast: React.FC<EnhancedDailyForecastProps> = React.memo(
//   function EnhancedDailyForecast({ forecast, unit }) {
//     const getWeatherIcon = useCallback((weather: string, isSunny: boolean) => {
//       const iconClass = 'w-9 h-9 drop-shadow-md';
//       const icon = (() => {
//         switch (weather.toLowerCase()) {
//           case 'clear':
//             return isSunny ? (
//               <Sunny className={iconClass} />
//             ) : (
//               <ClearSky className={iconClass} />
//             );
//           case 'clouds':
//             return <Cloudy className={iconClass} />;
//           case 'rain':
//             return <Rainy className={iconClass} />;
//           case 'snow':
//             return <CloudSnow className={iconClass} />;
//           case 'thunderstorm':
//             return <Zap className={iconClass} />;
//           default:
//             return <Sun className={iconClass} />;
//         }
//       })();

//       return (
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
//           className="relative"
//         >
//           {icon}
//           {weather.toLowerCase().includes('rain') && (
//             <motion.div
//               className="absolute inset-0"
//               animate={{ y: [0, 3, 0] }}
//               transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
//             >
//               <CloudRain className="w-4 h-4 text-blue-400 absolute -top-1 -right-1 opacity-70" />
//             </motion.div>
//           )}
//         </motion.div>
//       );
//     }, []);

//     const memoizedForecast = useMemo(() => forecast.slice(0, 5), [forecast]);

//     const formatDate = (dateStr: string, dayName: string) => {
//       const today = new Date();
//       const isToday = dateStr.includes(
//         today.toLocaleDateString('en-US', { weekday: 'short' }),
//       );
//       return (
//         <div className="flex flex-col">
//           <span className="text-xs text-muted-foreground">{dayName}</span>
//           <span className={clsx('text-sm font-semibold', isToday && 'text-primary')}>
//             {dateStr}
//           </span>
//         </div>
//       );
//     };

//     return (
//       <Card className="relative overflow-hidden bg-gradient-to-br from-background/80 via-background to-background/60 backdrop-blur-xl border border-border/50 shadow-xl h-full">
//         {/* Subtle animated background gradient */}
//         <div className="absolute inset-0 opacity-30">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 animate-pulse" />
//         </div>

//         <div className="relative z-10 p-5 pb-4">
//           <div className="flex items-center justify-center gap-2 mb-5">
//             <div className="p-2 bg-primary/10 rounded-full">
//               <Calendar className="h-4 w-4 text-primary" />
//             </div>
//             <h3 className="font-semibold text-foreground tracking-tight">
//               5-Day Forecast
//             </h3>
//           </div>

//           <div className="space-y-3">
//             {memoizedForecast.map((day, index) => {
//               const isToday = day.date.includes(
//                 new Date().toLocaleDateString('en-US', { weekday: 'short' }),
//               );
//               const precip = day.precipitation ?? 0;

//               return (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.08 }}
//                   className={clsx(
//                     'group relative overflow-hidden rounded-xl p-4 transition-all duration-300',
//                     'bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm',
//                     'border border-border/30 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
//                     isToday && 'ring-2 ring-primary/20 bg-primary/5',
//                   )}
//                 >
//                   {/* Hover glow effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

//                   <div className="relative flex items-center justify-between gap-4">
//                     {/* Date + Day */}
//                     <div className="flex items-center gap-4 flex-1 min-w-0">
//                       <div className="w-16 text-left">
//                         {formatDate(day.date, day.dayName)}
//                       </div>

//                       {/* Weather Icon */}
//                       <div className="flex-shrink-0">
//                         {getWeatherIcon(day.weather, day.date.includes('clear'))}
//                       </div>

//                       {/* Weather Label */}
//                       <div className="hidden sm:block text-sm text-muted-foreground capitalize font-medium">
//                         {day.weather}
//                       </div>
//                     </div>

//                     {/* Temps + Precipitation */}
//                     <div className="flex items-center gap-4 text-right">
//                       {/* Precipitation */}
//                       {precip > 0 && (
//                         <div className="hidden md:flex items-center gap-1 text-xs text-blue-400">
//                           <Cloud className="w-3 h-3" />
//                           <span>{precip}%</span>
//                         </div>
//                       )}

//                       {/* High / Low */}
//                       <div className="flex items-center gap-2 text-sm">
//                         <span className="font-bold text-foreground text-lg">
//                           {Math.round(day.high)}°
//                         </span>
//                         <span className="text-muted-foreground">
//                           {Math.round(day.low)}°{unit === 'metric' ? 'C' : 'F'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Mobile Precipitation */}
//                   {precip > 0 && (
//                     <div className="md:hidden mt-2 flex items-center justify-end gap-1 text-xs text-blue-400">
//                       <Cloud className="w-3 h-3" />
//                       <span>{precip}%</span>
//                     </div>
//                   )}
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </Card>
//     );
//   },
// );

// export default EnhancedDailyForecast;
import React, { useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import {
  Calendar,
  CloudSnow,
  Sun,
  Zap,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ClearSky, Cloudy, Rainy, Sunny } from '@/public/svgs/weather';

interface DailyForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  weather: string;
  description: string;
  precipitation: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  uv_index: number;
  sunrise: string; // "06:30"
  sunset: string; // "18:45"
}

interface EnhancedDailyForecastProps {
  forecast: DailyForecast[];
  unit: 'metric' | 'imperial';
}

const EnhancedDailyForecast: React.FC<EnhancedDailyForecastProps> = React.memo(
  function EnhancedDailyForecast({ forecast, unit }) {
    const getWeatherIcon = useCallback((weather: string) => {
      const iconClass = 'w-11 h-11 drop-shadow-lg';
      switch (weather.toLowerCase()) {
        case 'clear':
          return <Sunny className={iconClass} />;
        case 'clouds':
          return <Cloudy className={iconClass} />;
        case 'rain':
          return <Rainy className={iconClass} />;
        case 'snow':
          return <CloudSnow className={iconClass} />;
        case 'thunderstorm':
          return <Zap className={iconClass} />;
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
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-blue-500/15 to-purple-600/20 animate-pulse" />
        </div>

        <div className="relative z-10 p-5 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/15 rounded-full backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                Upcoming Days OutLook
              </h3>
            </div>
            <div className="text-xs text-muted-foreground">
              {unit === 'metric' ? '°C' : '°F'}
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted/50 pr-1">
            <div className="space-y-3">
              {memoizedForecast.map((day, index) => {
                const isToday =
                  day.date ===
                  new Date().toLocaleDateString('en-US', { weekday: 'short' });
                const windDir = getWindDirection(day.wind_deg);
                const uvLevel =
                  day.uv_index > 7 ? 'High' : day.uv_index > 5 ? 'Mod' : 'Low';
                const uvColor =
                  day.uv_index > 7
                    ? 'text-orange-500'
                    : day.uv_index > 5
                      ? 'text-yellow-500'
                      : 'text-green-500';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className={clsx(
                      'group relative p-4 rounded-2xl transition-all duration-400 cursor-pointer',
                      'bg-gradient-to-r from-muted/50 via-muted/20 to-muted/10 backdrop-blur-xl',
                      'border border-border/30 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10',
                      isToday &&
                        'ring-2 ring-primary/30 bg-primary/10 border-primary/30 shadow-lg shadow-primary/20',
                    )}
                  >
                    {/* Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                    <div className="relative flex items-center justify-between gap-3">
                      {/* LEFT: Date + Day + Today Badge */}
                      <div className="flex flex-col items-start min-w-[70px]">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            {day.dayName}
                          </span>
                          <span
                            className={clsx(
                              'text-sm font-bold',
                              isToday && 'text-primary',
                            )}
                          >
                            {day.date}
                          </span>
                        </div>
                        {isToday && (
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium mt-1"
                          >
                            Today
                          </motion.span>
                        )}
                      </div>

                      {/* CENTER: Icon + Precip Bar */}
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-shrink-0">{getWeatherIcon(day.weather)}</div>

                        {day.precipitation > 0 && (
                          <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 rounded-full shadow-sm"
                              initial={{ width: 0 }}
                              animate={{ width: `${day.precipitation}%` }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* RIGHT: Temps + Details */}
                      <div className="flex flex-col items-end gap-1 text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {Math.round(day.high)}°
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(day.low)}°
                          </span>
                        </div>

                        {/* Mini Stats */}
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <div className="flex items-center gap-1">
                            <Wind className="w-3 h-3 text-blue-400" />
                            <span>{Math.round(day.wind_speed)}</span>
                            <span className="text-muted-foreground">{windDir}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-cyan-400" />
                            <span>{day.humidity}%</span>
                          </div>
                          <div className={clsx('flex items-center gap-1', uvColor)}>
                            <Sun className="w-3 h-3" />
                            <span>{uvLevel}</span>
                          </div>
                        </div>

                        {/* Sunrise / Sunset */}
                        <div className="flex items-center gap-3 text-xs mt-2 text-amber-600 dark:text-amber-400">
                          <div className="flex items-center gap-1">
                            <Sunrise className="w-3 h-3" />
                            <span>{day.sunrise}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sunset className="w-3 h-3" />
                            <span>{day.sunset}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {day.description}
                        </p>
                      </div>
                    </div>

                    {/* Precip Badge (mobile) */}
                    {day.precipitation > 0 && (
                      <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        {day.precipitation}%
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
  },
);

export default EnhancedDailyForecast;
