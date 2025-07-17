import React, { useState, useEffect } from 'react';
import './App.css';
import { BEACH_CONFIG, REGION_CONFIG } from './config/beaches';

// Status-Ampel Komponente
const StatusIndicator = ({ online, size = 'w-3 h-3' }) => (
  <div className={`${size} rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} relative`}>
    <div className={`absolute inset-0 rounded-full ${online ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
  </div>
);

// URL-Parameter lesen
const getRegionFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('region') || 'default';
};

// Verfügbare Strände für die aktuelle Region
const getAvailableBeaches = (region) => {
  const regionConfig = REGION_CONFIG[region] || REGION_CONFIG['default'];
  return regionConfig.beaches.reduce((acc, beachKey) => {
    if (BEACH_CONFIG[beachKey]) {
      acc[beachKey] = BEACH_CONFIG[beachKey];
    }
    return acc;
  }, {});
};

// Region-Info
const getRegionInfo = (region) => {
  return REGION_CONFIG[region] || REGION_CONFIG['default'];
};

// Fallback-Daten für Offline-Modus
const FALLBACK_WEATHER_DATA = {
  beach_score: 75,
  best_time: "14:00",
  forecast: {
    hourly: {
      temperature_2m: [22, 23, 24, 25, 24, 23, 22, 21, 20, 19, 18, 17, 18, 19, 21, 22, 23, 24, 23, 22, 21, 20, 19, 18],
      weather_code: [1, 1, 2, 2, 3, 3, 2, 1, 1, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2],
      precipitation_probability: [10, 10, 20, 20, 30, 30, 20, 10, 5, 0, 0, 0, 5, 10, 15, 20, 10, 5, 0, 0, 5, 10, 15, 20],
      wind_speed_10m: [12, 13, 14, 15, 16, 15, 14, 13, 12, 11, 10, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 10, 11],
      uv_index: [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0]
    },
    daily: {
      time: [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
        new Date(Date.now() + 48*60*60*1000).toISOString().split('T')[0]
      ],
      weather_code: [1, 2, 1],
      temperature_2m_max: [25, 24, 26],
      temperature_2m_min: [17, 16, 18],
      uv_index_max: [7, 6, 8],
      precipitation_sum: [0, 2, 0]
    }
  },
  marine: {
    hourly: {
      sea_surface_temperature: [19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
      wave_height: [0.8, 0.8, 0.9, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6, 0.7, 0.8]
    }
  }
};

const WeatherIcon = ({ weatherCode, size = 'w-8 h-8' }) => {
  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  };

  return (
    <div className={`${size} flex items-center justify-center text-2xl`}>
      {getWeatherIcon(weatherCode)}
    </div>
  );
};

const WeatherCard = ({ title, value, unit, icon, color = 'text-blue-600', online = true }) => (
  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/25 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-white/90 text-sm font-medium">{title}</p>
          <StatusIndicator online={online} />
        </div>
        <p className={`text-3xl font-bold text-white drop-shadow-lg`}>
          {value}
          <span className="text-lg text-white/80 ml-2">{unit}</span>
        </p>
      </div>
      <div className="text-4xl ml-4 drop-shadow-lg">{icon}</div>
    </div>
  </div>
);

const BeachSelector = ({ selectedBeach, onBeachSelect, availableBeaches }) => (
  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 mb-8">
    <h2 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Strand auswählen</h2>
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(availableBeaches).map(([key, beach]) => (
        <button
          key={key}
          onClick={() => onBeachSelect(key)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
            selectedBeach === key
              ? 'border-white/60 bg-white/30 text-white shadow-lg'
              : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20 text-white/90'
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">{beach.emoji}</span>
            <div className="text-left">
              <div className="font-bold text-lg">{beach.name}</div>
              <div className="text-sm text-white/80">⭐ {beach.userRating}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const BeachScore = ({ score, bestTime, online = true }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Perfekt';
    if (score >= 60) return 'Gut';
    if (score >= 40) return 'Okay';
    return 'Schlecht';
  };

  return (
    <div className={`bg-gradient-to-br ${getScoreColor(score)} rounded-2xl p-8 shadow-2xl text-white mb-8 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      <div className="relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl font-bold drop-shadow-lg">Strand-Bewertung</h2>
            <StatusIndicator online={online} size="w-4 h-4" />
          </div>
          <div className="text-6xl font-black mb-4 drop-shadow-lg">
            {score}/100
          </div>
          <p className="text-2xl font-semibold mb-6 drop-shadow-lg">{getScoreText(score)}</p>
          {bestTime && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <p className="text-white/90 text-sm font-medium mb-1">Beste Zeit heute</p>
              <p className="text-2xl font-bold">{bestTime} Uhr</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ForecastCard = ({ day, weather, isToday = false, online = true }) => (
  <div className={`bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border transition-all duration-300 hover:bg-white/25 ${
    isToday ? 'border-white/60 ring-2 ring-white/30' : 'border-white/30'
  }`}>
    <div className="text-center text-white">
      <div className="flex items-center justify-center gap-2 mb-3">
        <p className="text-sm font-medium">
          {isToday ? 'Heute' : new Date(day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' })}
        </p>
        <StatusIndicator online={online} size="w-2 h-2" />
      </div>
      <WeatherIcon weatherCode={weather.weather_code} size="w-16 h-16" />
      <div className="mt-4">
        <p className="text-2xl font-bold drop-shadow-lg">{Math.round(weather.temperature_2m_max)}°</p>
        <p className="text-lg text-white/80">{Math.round(weather.temperature_2m_min)}°</p>
      </div>
      <div className="mt-4 text-sm text-white/80 space-y-1">
        <div className="flex items-center justify-center gap-1">
          <span>☀️</span>
          <span>{weather.uv_index_max}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span>💧</span>
          <span>{weather.precipitation_sum}mm</span>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [selectedBeach, setSelectedBeach] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  
  // URL-basierte Region
  const currentRegion = getRegionFromUrl();
  const availableBeaches = getAvailableBeaches(currentRegion);
  const regionInfo = getRegionInfo(currentRegion);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Initialisiere mit dem ersten verfügbaren Strand
  useEffect(() => {
    const firstBeach = Object.keys(availableBeaches)[0];
    if (firstBeach && !selectedBeach) {
      setSelectedBeach(firstBeach);
    }
  }, [availableBeaches, selectedBeach]);

  // Initialisiere die App mit Fallback-Daten
  useEffect(() => {
    if (selectedBeach) {
      // Zeige sofort die Fallback-Daten an
      setWeatherData({
        beach: selectedBeach,
        data: FALLBACK_WEATHER_DATA,
        cached: false
      });
      
      // Versuche dann echte Daten zu laden
      fetchWeatherData(selectedBeach);
    }
  }, [selectedBeach]);

  const fetchWeatherData = async (beachName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${backendUrl}/api/weather/${beachName}`, {
        timeout: 10000 // 10 Sekunden Timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeatherData(data);
      setOfflineMode(false);
    } catch (err) {
      console.warn('API nicht verfügbar, verwende Fallback-Daten:', err.message);
      
      // Verwende Fallback-Daten statt Fehler zu zeigen
      setWeatherData({
        beach: beachName,
        data: FALLBACK_WEATHER_DATA,
        cached: false
      });
      
      setError(null); // Keinen Fehler anzeigen
      setOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Nur neue Daten laden, wenn nicht im Offline-Modus
    if (!offlineMode && selectedBeach) {
      fetchWeatherData(selectedBeach);
    } else if (selectedBeach) {
      // Auch im Offline-Modus die Fallback-Daten für den neuen Strand anzeigen
      setWeatherData({
        beach: selectedBeach,
        data: FALLBACK_WEATHER_DATA,
        cached: false
      });
    }
  }, [selectedBeach]);

  const handleBeachSelect = (beachName) => {
    setSelectedBeach(beachName);
  };

  const handleRetry = () => {
    setOfflineMode(false);
    fetchWeatherData(selectedBeach);
  };

  if (loading && !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-gray-800">Wetterdaten werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-md mx-4">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Fehler</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWeather = weatherData?.data;
  const forecast = currentWeather?.forecast;
  const marine = currentWeather?.marine;
  const currentBeach = availableBeaches[selectedBeach];

  if (!currentBeach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <p className="text-lg font-medium text-gray-800">Keine Strände für diese Region konfiguriert.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${currentBeach?.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay für bessere Lesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-cyan-800/50 to-blue-900/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
            🏖️ StrandWetter
          </h1>
          <p className="text-white/90 text-xl font-medium drop-shadow-lg mb-2">
            {currentBeach?.name} • {regionInfo.name}
          </p>
          <p className="text-white/80 text-base drop-shadow-lg mb-2">
            {currentBeach?.shortDescription}
          </p>
          <p className="text-white/70 text-sm drop-shadow-lg max-w-2xl mx-auto">
            {currentBeach?.longDescription}
          </p>
          {offlineMode && (
            <div className="mt-4 bg-yellow-500/20 backdrop-blur-md rounded-xl px-6 py-3 inline-block border border-yellow-400/30">
              <p className="text-yellow-100 font-medium">
                📱 Offline-Modus • Beispieldaten
              </p>
            </div>
          )}
        </div>

        {/* Beach Selector */}
        <BeachSelector
          selectedBeach={selectedBeach}
          onBeachSelect={handleBeachSelect}
          availableBeaches={availableBeaches}
        />

        {currentWeather && (
          <>
            {/* Beach Score */}
            <BeachScore
              score={currentWeather.beach_score || 0}
              bestTime={currentWeather.best_time}
              online={!offlineMode}
            />

            {/* Current Weather Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <WeatherCard
                title="Lufttemperatur"
                value={Math.round(forecast?.hourly?.temperature_2m[0] || 0)}
                unit="°C"
                icon="🌡️"
                online={!offlineMode}
              />
              
              <WeatherCard
                title="Wassertemperatur"
                value={Math.round(marine?.hourly?.sea_surface_temperature[0] || 0)}
                unit="°C"
                icon="🌊"
                online={!offlineMode}
              />
              
              <WeatherCard
                title="Wind"
                value={Math.round(forecast?.hourly?.wind_speed_10m[0] || 0)}
                unit="km/h"
                icon="💨"
                online={!offlineMode}
              />
              
              <WeatherCard
                title="UV-Index"
                value={Math.round(forecast?.hourly?.uv_index[0] || 0)}
                unit=""
                icon="☀️"
                online={!offlineMode}
              />
              
              <WeatherCard
                title="Niederschlag"
                value={Math.round(forecast?.hourly?.precipitation_probability[0] || 0)}
                unit="%"
                icon="🌧️"
                online={!offlineMode}
              />
              
              <WeatherCard
                title="Wellenhöhe"
                value={(marine?.hourly?.wave_height[0] || 0).toFixed(1)}
                unit="m"
                icon="🌊"
                online={!offlineMode}
              />
            </div>

            {/* Strand-Informationen */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Beach Features */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Strand-Features</h3>
                <div className="flex flex-wrap gap-2">
                  {currentBeach?.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/40"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strand-Details */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Strand-Details</h3>
                <div className="space-y-3 text-white/90">
                  <div className="flex justify-between">
                    <span className="font-medium">Strandtyp:</span>
                    <span>{currentBeach?.beachType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Windschutz:</span>
                    <span className="capitalize">{currentBeach?.windProtection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Barrierefreiheit:</span>
                    <span className="capitalize">{currentBeach?.accessibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bewertung:</span>
                    <span>⭐ {currentBeach?.userRating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Day Forecast */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">3-Tage Vorhersage</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {forecast?.daily?.time.slice(0, 3).map((day, index) => (
                  <ForecastCard
                    key={day}
                    day={day}
                    weather={{
                      weather_code: forecast.daily.weather_code[index],
                      temperature_2m_max: forecast.daily.temperature_2m_max[index],
                      temperature_2m_min: forecast.daily.temperature_2m_min[index],
                      uv_index_max: forecast.daily.uv_index_max[index],
                      precipitation_sum: forecast.daily.precipitation_sum[index]
                    }}
                    isToday={index === 0}
                    online={!offlineMode}
                  />
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={handleRetry}
                className={`backdrop-blur-md px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl border ${
                  loading 
                    ? 'bg-gray-400/30 cursor-not-allowed text-gray-300 border-gray-400/30' 
                    : offlineMode 
                      ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50 hover:bg-yellow-500/40 hover:shadow-2xl'
                      : 'bg-white/30 text-white border-white/40 hover:bg-white/40 hover:shadow-2xl'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Laden...</span>
                  </div>
                ) : (
                  <>
                    🔄 {offlineMode ? 'Echte Daten laden' : 'Aktualisieren'}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;