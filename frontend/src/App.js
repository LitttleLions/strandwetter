import React, { useState, useEffect } from 'react';
import './App.css';
import { BEACH_CONFIG } from './config/beaches';

// Status-Ampel Komponente
const StatusIndicator = ({ online, size = 'w-3 h-3' }) => (
  <div className={`${size} rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} relative`}>
    <div className={`absolute inset-0 rounded-full ${online ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
  </div>
);

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

const WeatherCard = ({ title, value, unit, icon, color = 'text-blue-600' }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>
          {value}
          <span className="text-sm text-gray-500 ml-1">{unit}</span>
        </p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

const BeachSelector = ({ selectedBeach, onBeachSelect }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-100 mb-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">Strand auswählen</h2>
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(BEACHES).map(([key, beach]) => (
        <button
          key={key}
          onClick={() => onBeachSelect(key)}
          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
            selectedBeach === key
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl">{beach.emoji}</span>
            <span className="font-medium">{beach.name}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const BeachScore = ({ score, bestTime }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Perfekt';
    if (score >= 60) return 'Gut';
    if (score >= 40) return 'Okay';
    return 'Schlecht';
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 shadow-lg text-white mb-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Strand-Bewertung</h2>
        <div className="text-4xl font-bold mb-2">
          {score}/100
        </div>
        <p className="text-xl mb-3">{getScoreText(score)}</p>
        {bestTime && (
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-sm opacity-90">Beste Zeit heute</p>
            <p className="text-xl font-semibold">{bestTime} Uhr</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ForecastCard = ({ day, weather, isToday = false }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border ${
    isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100'
  }`}>
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-2">
        {isToday ? 'Heute' : new Date(day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' })}
      </p>
      <WeatherIcon weatherCode={weather.weather_code} size="w-12 h-12" />
      <div className="mt-2">
        <p className="text-lg font-bold text-gray-800">{Math.round(weather.temperature_2m_max)}°</p>
        <p className="text-sm text-gray-600">{Math.round(weather.temperature_2m_min)}°</p>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <p>UV: {weather.uv_index_max}</p>
        <p>💧 {weather.precipitation_sum}mm</p>
      </div>
    </div>
  </div>
);

function App() {
  const [selectedBeach, setSelectedBeach] = useState('Binz');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Initialisiere die App mit Fallback-Daten
  useEffect(() => {
    // Zeige sofort die Fallback-Daten an
    setWeatherData({
      beach: selectedBeach,
      data: FALLBACK_WEATHER_DATA,
      cached: false
    });
    
    // Versuche dann echte Daten zu laden
    fetchWeatherData(selectedBeach);
  }, []);

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
    if (!offlineMode) {
      fetchWeatherData(selectedBeach);
    } else {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏖️ StrandWetter
          </h1>
          <p className="text-blue-100 text-lg">
            Rügen • Deutschland
          </p>
          {offlineMode && (
            <div className="mt-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <p className="text-yellow-100 text-sm">
                📱 Offline-Modus • Beispieldaten
              </p>
            </div>
          )}
        </div>

        {/* Beach Selector */}
        <BeachSelector
          selectedBeach={selectedBeach}
          onBeachSelect={handleBeachSelect}
        />

        {currentWeather && (
          <>
            {/* Beach Score */}
            <BeachScore
              score={currentWeather.beach_score || 0}
              bestTime={currentWeather.best_time}
            />

            {/* Current Weather Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <WeatherCard
                title="Lufttemperatur"
                value={Math.round(forecast?.hourly?.temperature_2m[0] || 0)}
                unit="°C"
                icon="🌡️"
                color="text-orange-600"
              />
              
              <WeatherCard
                title="Wassertemperatur"
                value={Math.round(marine?.hourly?.sea_surface_temperature[0] || 0)}
                unit="°C"
                icon="🌊"
                color="text-blue-600"
              />
              
              <WeatherCard
                title="Wind"
                value={Math.round(forecast?.hourly?.wind_speed_10m[0] || 0)}
                unit="km/h"
                icon="💨"
                color="text-gray-600"
              />
              
              <WeatherCard
                title="UV-Index"
                value={Math.round(forecast?.hourly?.uv_index[0] || 0)}
                unit=""
                icon="☀️"
                color="text-yellow-600"
              />
              
              <WeatherCard
                title="Niederschlag"
                value={Math.round(forecast?.hourly?.precipitation_probability[0] || 0)}
                unit="%"
                icon="🌧️"
                color="text-blue-600"
              />
              
              <WeatherCard
                title="Wellenhöhe"
                value={(marine?.hourly?.wave_height[0] || 0).toFixed(1)}
                unit="m"
                icon="🌊"
                color="text-cyan-600"
              />
            </div>

            {/* 3-Day Forecast */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">3-Tage Vorhersage</h2>
              <div className="grid grid-cols-3 gap-4">
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
                  />
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleRetry}
                className={`backdrop-blur-sm text-blue-600 px-6 py-3 rounded-xl font-medium transition-colors shadow-lg border border-blue-100 ${
                  loading 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : offlineMode 
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
                      : 'bg-white/90 hover:bg-white'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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