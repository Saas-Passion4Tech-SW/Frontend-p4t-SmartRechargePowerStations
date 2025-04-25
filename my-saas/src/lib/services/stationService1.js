// lib/services/stationService.js

// Données de test pour les stations (à remplacer par une API réelle)
const mockStations = [
  {
    id: '1',
    name: 'Station Centre-Ville',
    address: '123 Rue de Paris, 75001 Paris',
    isAvailable: true,
    connectors: [
      { id: 'c1', type: 'Type 2', power: 22, isAvailable: true },
      { id: 'c2', type: 'CCS', power: 50, isAvailable: false }
    ],
    operator: 'ChargeCo',
    pricePerKwh: 0.35,
    openingHours: '24h/24',
    hasParkingFee: false,
    isAccessible: true,
    isFavorite: false,
    reviews: [
      {
        author: 'Jean D.',
        rating: 4,
        content: 'Bonne station, facile daccès et connecteurs en bon état.'
      },
      {
        author: 'Marie L.',
        rating: 5,
        content: 'Excellente station, toujours disponible quand jen ai besoin.'
      }
    ],
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    }
  },
  {
    id: '2',
    name: 'SuperCharge Nord',
    address: '45 Avenue des Champs, 75008 Paris',
    isAvailable: false,
    connectors: [
      { id: 'c3', type: 'CHAdeMO', power: 50, isAvailable: false },
      { id: 'c4', type: 'CCS', power: 150, isAvailable: false }
    ],
    operator: 'EnergieRecharge',
    pricePerKwh: 0.42,
    openingHours: '6h-22h',
    hasParkingFee: true,
    isAccessible: false,
    isFavorite: true,
    reviews: [],
    coordinates: {
      lat: 48.8738,
      lng: 2.2950
    }
  },
  {
    id: '3',
    name: 'EcoCharge Est',
    address: '78 Boulevard de Belleville, 75020 Paris',
    isAvailable: true,
    connectors: [
      { id: 'c5', type: 'Type 2', power: 11, isAvailable: true },
      { id: 'c6', type: 'Type 2', power: 22, isAvailable: true }
    ],
    operator: 'EcoPower',
    pricePerKwh: 0.30,
    openingHours: '7h-23h',
    hasParkingFee: false,
    isAccessible: true,
    isFavorite: false,
    reviews: [
      {
        author: 'Sophie M.',
        rating: 3,
        content: 'Station correcte mais un peu difficile à trouver.'
      }
    ],
    coordinates: {
      lat: 48.8651,
      lng: 2.3781
    }
  },
  {
    id: '4',
    name: 'Tesla Supercharger',
    address: '22 Avenue de la Grande Armée, 75017 Paris',
    isAvailable: true,
    connectors: [
      { id: 'c7', type: 'Tesla', power: 150, isAvailable: true },
      { id: 'c8', type: 'Tesla', power: 150, isAvailable: true },
      { id: 'c9', type: 'Tesla', power: 150, isAvailable: true }
    ],
    operator: 'Tesla',
    pricePerKwh: 0.40,
    openingHours: '24h/24',
    hasParkingFee: false,
    isAccessible: true,
    isFavorite: false,
    reviews: [
      {
        author: 'Marc T.',
        rating: 5,
        content: 'Superchargers toujours efficaces et fiables.'
      }
    ],
    coordinates: {
      lat: 48.8748,
      lng: 2.2853
    }
  },
  {
    id: '5',
    name: 'ChargePoint Sud',
    address: '56 Rue de Tolbiac, 75013 Paris',
    isAvailable: true,
    connectors: [
      { id: 'c10', type: 'CCS', power: 50, isAvailable: true },
      { id: 'c11', type: 'CHAdeMO', power: 50, isAvailable: true }
    ],
    operator: 'ChargePoint',
    pricePerKwh: 0.38,
    openingHours: '24h/24',
    hasParkingFee: true,
    isAccessible: true,
    isFavorite: false,
    reviews: [],
    coordinates: {
      lat: 48.8266,
      lng: 2.3656
    }
  }
];

// Récupérer toutes les stations
export async function fetchAllStations() {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockStations;
}

// Réc