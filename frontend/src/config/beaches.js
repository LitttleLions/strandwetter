// StrandWetter Deutschland - Beach Configuration
// Hier können Strände und ihre Bewertungen gepflegt werden

export const BEACH_CONFIG = {
  'Binz': {
    name: 'Binz',
    emoji: '🏖️',
    coordinates: { latitude: 54.40, longitude: 13.61 },
    shortDescription: 'Berühmter Badeort mit historischer Bäderarchitektur',
    longDescription: 'Binz ist der bekannteste Badeort auf Rügen und besticht durch seine prächtige Bäderarchitektur. Die berühmte Seebrücke und die elegante Promenade machen ihn zum perfekten Ziel für anspruchsvolle Strandbesucher.',
    backgroundImage: 'https://images.unsplash.com/photo-1649047516494-65af2c7bcd2a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxnZXJtYW4lMjBiZWFjaHxlbnwwfHx8Ymx1ZXwxNzUyNzMyODQ4fDA&ixlib=rb-4.1.0&q=85',
    userRating: 4.5,
    features: ['Seebrücke', 'Promenade', 'Restaurants', 'Bäderarchitektur'],
    windProtection: 'gut',
    beachType: 'Sandstrand',
    accessibility: 'excellent',
    region: 'baeder'
  },
  'Sellin': {
    name: 'Sellin',
    emoji: '🌊',
    coordinates: { latitude: 54.38, longitude: 13.69 },
    shortDescription: 'Romantischer Strand mit berühmter Seebrücke',
    longDescription: 'Sellin verzaubert mit seiner romantischen Atmosphäre und der spektakulären Seebrücke. Die Steilküste bietet einzigartige Ausblicke, während die Tauchgondel ein besonderes Erlebnis darstellt.',
    backgroundImage: 'https://images.unsplash.com/photo-1582524072730-90ec37441310?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzZWFzaWRlfGVufDB8fHxibHVlfDE3NTI3MzI4NTV8MA&ixlib=rb-4.1.0&q=85',
    userRating: 4.3,
    features: ['Seebrücke', 'Steilküste', 'Tauchgondel', 'Bernstein'],
    windProtection: 'mittel',
    beachType: 'Sandstrand',
    accessibility: 'good',
    region: 'moenchgut'
  },
  'Göhren': {
    name: 'Göhren',
    emoji: '⛵',
    coordinates: { latitude: 54.34, longitude: 13.74 },
    shortDescription: 'Familienfreundlicher Strand im Südosten',
    longDescription: 'Göhren im Südosten Rügens ist der ideale Familienstrand. Die geschützte Lage im Mönchgut bietet ruhiges Wasser und weitläufige Dünenlandschaften für entspannte Strandtage.',
    backgroundImage: 'https://images.unsplash.com/photo-1568798330489-8beeab223c65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBiZWFjaHxlbnwwfHx8Ymx1ZXwxNzUyNzMyODQ4fDA&ixlib=rb-4.1.0&q=85',
    userRating: 4.2,
    features: ['Familienfreundlich', 'Mönchgut', 'Wanderwege', 'Dünen'],
    windProtection: 'gut',
    beachType: 'Sandstrand',
    accessibility: 'good',
    region: 'baeder'
  },
  'Baabe': {
    name: 'Baabe',
    emoji: '🏄',
    coordinates: { latitude: 54.36, longitude: 13.71 },
    shortDescription: 'Ruhiger Strand zwischen Sellin und Göhren',
    longDescription: 'Baabe besticht durch seine ruhige, naturbelassene Atmosphäre. Zwischen Sellin und Göhren gelegen, bietet er ideale Bedingungen für Kitesurfer und Naturliebhaber.',
    backgroundImage: 'https://images.pexels.com/photos/96389/pexels-photo-96389.jpeg',
    userRating: 4.1,
    features: ['Ruhig', 'Naturstrand', 'Kitesurfen', 'Dünenlandschaft'],
    windProtection: 'schwach',
    beachType: 'Sandstrand',
    accessibility: 'moderate',
    region: 'moenchgut'
  },
    'Sassnitz': {
    name: 'Sassnitz',
    emoji: '⚓',
    coordinates: { latitude: 54.36, longitude: 13.71 },
    shortDescription: 'Ostseebad am Jasmund mit eindrucksvoller Kreideküste',
    longDescription: 'Sassnitz liegt auf der Halbinsel Jasmund im Nordosten Rügens und ist bekannt für seine steilen Kreidefelsen im Nationalpark Jasmund, den historischen Fährhafen Mukran sowie die elegante Bäderarchitektur im Kurviertel.',
    backgroundImage: 'https://images.unsplash.com/photo-1581089781785-083cfc3dc5de?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0NDE5MzV8MHwxfHNlYXJjaHwyfHxqYXNtYW5kJTIwYmVhY2h8ZW58MHx8fGx1eWVzfDE2MjM0OTYxMjV8&ixlib=rb-4.0.3&q=85',
    userRating: 4.0,
    features: ['Kreidefelsen', 'Nationalpark Jasmund', 'Fährhafen', 'Bäderarchitektur'],
    windProtection: 'mittel',
    beachType: 'Kieselstrand',
    accessibility: 'good',
    region: 'nordost'
  },
  'Prora': {
    name: 'Prora',
    emoji: '🏄',
    coordinates: { latitude: 54.36, longitude: 13.71 },
    shortDescription: 'Ruhiger Strand zwischen Sellin und Göhren',
    longDescription: 'Baabe besticht durch seine ruhige, naturbelassene Atmosphäre. Zwischen Sellin und Göhren gelegen, bietet er ideale Bedingungen für Kitesurfer und Naturliebhaber.',
    backgroundImage: 'https://images.pexels.com/photos/96389/pexels-photo-96389.jpeg',
    userRating: 4.1,
    features: ['Ruhig', 'Naturstrand', 'Kitesurfen', 'Dünenlandschaft'],
    windProtection: 'schwach',
    beachType: 'Sandstrand',
    accessibility: 'moderate',
    region: 'moenchgut'
  },
  'Lobbe': {
    name: 'Lobbe',
    emoji: '🌿',
    coordinates: { latitude: 54.36, longitude: 13.71 },
    shortDescription: 'Idyllischer Naturstrand im Südosten Rügens',
    longDescription: 'Lobbe ist ein Dorf auf der Halbinsel Mönchgut mit naturbelassenem Ostseestrand, weitläufigen Dünenlandschaften, dem traditionellen Windschöpfwerk und dem Findling Fritz-Worm-Stein am Kap Lobber Ort.',
    backgroundImage: 'https://www.urlaub-auf-ruegen.de/lobbe/fotos/strand-lobbe-gross.jpg',
    userRating: 4.2,
    features: ['Naturstrand', 'Dünen', 'Windschöpfwerk', 'Fritz-Worm-Stein'],
    windProtection: 'gut',
    beachType: 'Sandstrand',
    accessibility: 'moderate',
    region: 'moenchgut'
  }
};

// Regionale Strand-Konfigurationen für verschiedene Standorte
export const REGION_CONFIG = {
  'default': {
    name: 'Rügen Gesamt',
    description: 'Alle Hauptstrände der Insel Rügen',
    beaches: ['Binz', 'Sellin', 'Göhren', 'Baabe']
  },
  'moenchgut': {
    name: 'Mönchgut',
    description: 'Strände in der Mönchgut-Region',
    beaches: ['Lobbe','Sellin', 'Göhren', 'Baabe']
  },
  'nordost': {
    name: 'Nordost-Rügen',
    description: 'Strände im Nordosten der Insel',
    beaches: ['Binz','Prerow']
  },
  'ost': {
    name: 'Ost-Rügen',
    description: 'Östliche Strände von Rügen',
    beaches: ['Binz', 'Sellin', 'Göhren', 'Baabe']
  },
  'sued': {
    name: 'Süd-Rügen',
    description: 'Südliche Strände der Insel',
    beaches: ['Sellin', 'Göhren', 'Baabe']
  }
};

// Beispiel-URLs:
// https://app.de?region=moenchgut (zeigt nur Mönchgut-Strände)
// https://app.de?region=nordost (zeigt nur Binz)
// https://app.de (zeigt alle Strände)

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
