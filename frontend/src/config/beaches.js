// StrandWetter Deutschland - Beach Configuration
// Hier können Strände und ihre Bewertungen gepflegt werden

export const BEACH_CONFIG = {
  'Binz': {
    name: 'Binz',
    emoji: '🏖️',
    coordinates: { latitude: 54.40, longitude: 13.61 },
    description: 'Berühmter Badeort mit historischer Bäderarchitektur',
    backgroundImage: 'https://images.unsplash.com/photo-1649047516494-65af2c7bcd2a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxnZXJtYW4lMjBiZWFjaHxlbnwwfHx8Ymx1ZXwxNzUyNzMyODQ4fDA&ixlib=rb-4.1.0&q=85',
    userRating: 4.5,
    features: ['Seebrücke', 'Promenade', 'Restaurants', 'Bäderarchitektur'],
    windProtection: 'gut',
    beachType: 'Sandstrand',
    accessibility: 'excellent'
  },
  'Sellin': {
    name: 'Sellin',
    emoji: '🌊',
    coordinates: { latitude: 54.38, longitude: 13.69 },
    description: 'Romantischer Strand mit berühmter Seebrücke',
    backgroundImage: 'https://images.unsplash.com/photo-1582524072730-90ec37441310?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzZWFzaWRlfGVufDB8fHxibHVlfDE3NTI3MzI4NTV8MA&ixlib=rb-4.1.0&q=85',
    userRating: 4.3,
    features: ['Seebrücke', 'Steilküste', 'Tauchgondel', 'Bernstein'],
    windProtection: 'mittel',
    beachType: 'Sandstrand',
    accessibility: 'good'
  },
  'Göhren': {
    name: 'Göhren',
    emoji: '⛵',
    coordinates: { latitude: 54.34, longitude: 13.74 },
    description: 'Familienfreundlicher Strand im Südosten',
    backgroundImage: 'https://images.unsplash.com/photo-1568798330489-8beeab223c65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBiZWFjaHxlbnwwfHx8Ymx1ZXwxNzUyNzMyODQ4fDA&ixlib=rb-4.1.0&q=85',
    userRating: 4.2,
    features: ['Familienfreundlich', 'Mönchgut', 'Wanderwege', 'Dünen'],
    windProtection: 'gut',
    beachType: 'Sandstrand',
    accessibility: 'good'
  },
  'Baabe': {
    name: 'Baabe',
    emoji: '🏄',
    coordinates: { latitude: 54.36, longitude: 13.71 },
    description: 'Ruhiger Strand zwischen Sellin und Göhren',
    backgroundImage: 'https://images.pexels.com/photos/96389/pexels-photo-96389.jpeg',
    userRating: 4.1,
    features: ['Ruhig', 'Naturstrand', 'Kitesurfen', 'Dünenlandschaft'],
    windProtection: 'schwach',
    beachType: 'Sandstrand',
    accessibility: 'moderate'
  }
};

// Bewertungskriterien für Strände
export const RATING_CRITERIA = {
  temperature: {
    excellent: { min: 24, max: 28, weight: 0.3 },
    good: { min: 20, max: 32, weight: 0.2 },
    acceptable: { min: 16, max: 35, weight: 0.1 }
  },
  wind: {
    excellent: { min: 5, max: 15, weight: 0.2 },
    good: { min: 0, max: 25, weight: 0.1 },
    acceptable: { min: 0, max: 35, weight: 0.05 }
  },
  precipitation: {
    excellent: { max: 10, weight: 0.25 },
    good: { max: 30, weight: 0.15 },
    acceptable: { max: 50, weight: 0.05 }
  },
  uv: {
    excellent: { min: 3, max: 6, weight: 0.15 },
    good: { min: 1, max: 8, weight: 0.1 },
    acceptable: { min: 0, max: 10, weight: 0.05 }
  },
  clouds: {
    excellent: { max: 30, weight: 0.1 },
    good: { max: 60, weight: 0.05 },
    acceptable: { max: 100, weight: 0.02 }
  }
};

// Empfehlungen basierend auf Aktivitäten
export const ACTIVITY_RECOMMENDATIONS = {
  sunbathing: {
    minTemp: 22,
    maxWind: 20,
    maxPrecipitation: 20,
    minUV: 4,
    maxClouds: 40
  },
  swimming: {
    minTemp: 18,
    minWaterTemp: 16,
    maxWind: 25,
    maxPrecipitation: 30,
    maxWaves: 1.5
  },
  surfing: {
    minWind: 15,
    maxWind: 35,
    minWaves: 0.8,
    maxPrecipitation: 50
  },
  family: {
    minTemp: 20,
    maxWind: 20,
    maxPrecipitation: 20,
    maxUV: 7
  }
};