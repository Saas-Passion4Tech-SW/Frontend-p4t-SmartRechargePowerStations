// Simulez l'API jusqu'à ce que vous intégriez votre backend
export async function fetchStations() {
  // Simulation d'un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Données de démonstration
  return [
    {
      id: '1',
      name: 'Station Centre-Ville',
      address: '123 Rue de Paris, 75001 Paris',
      isAvailable: true,
      distance: 1.2,
      connectors: [
        { type: 'Type 2', power: 22 },
        { type: 'CCS', power: 50 }
      ]
    },
    {
      id: '2',
      name: 'SuperCharge Nord',
      address: '45 Avenue des Champs, 75008 Paris',
      isAvailable: false,
      distance: 3.5,
      connectors: [
        { type: 'CHAdeMO', power: 50 },
        { type: 'CCS', power: 150 }
      ]
    },
    // Ajoutez plus de stations pour tester
  ];
}

export async function fetchStationDetails1(stationId) {
  // Simulation d'un délai d'API
  await new Promise(resolve => setTimeout(resolve, 700));

  // On simule la recherche d'une station par ID
  const stations = {
    '1': {
      id: '1',
      name: 'Station Centre-Ville',
      address: '123 Rue de Paris, 75001 Paris',
      isAvailable: true,
      distance: 1.2,
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
    '2': {
      id: '2',
      name: 'SuperCharge Nord',
      address: '45 Avenue des Champs, 75008 Paris',
      isAvailable: false,
      distance: 3.5,
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
    }
  };

  const station = stations[stationId];

  if (!station) {
    throw new Error('Station non trouvée');
  }

  return station;
}

// lib/services/stationService.js

// Simulez un stockage en mémoire pour les stations
let stationsData = [
  {
    id: '1',
    name: 'Station Centre-Ville',
    address: '123 Rue de Paris, 75001 Paris',
    isAvailable: true,
    distance: 1.2,
    connectors: [
      { id: 'c1', type: 'Type 2', power: 22, isAvailable: true },
      { id: 'c2', type: 'CCS', power: 50, isAvailable: false }
    ],
    operator: 'ChargeCo',
    pricePerKwh: 0.35,
    openingHours: '24h/24',
    hasParkingFee: false,
    isAccessible: true,
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    }
  },
  // Autres stations...
];

// Fonction pour obtenir toutes les stations
export async function fetchStations1() {
  // Simulez un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...stationsData];
}

// Obtenir les détails d'une station
export async function fetchStationDetails(stationId) {
  await new Promise(resolve => setTimeout(resolve, 500));

  const station = stationsData.find(s => s.id === stationId);

  if (!station) {
    throw new Error('Station non trouvée');
  }

  return { ...station };
}

// Créer une nouvelle station
export async function createStation(stationData) {
  await new Promise(resolve => setTimeout(resolve, 700));

  // Génère un ID unique
  const newStation = {
    ...stationData,
    id: `station-${Date.now()}`,
  };

  stationsData.push(newStation);
  return { ...newStation };
}

// Mettre à jour une station existante
export async function updateStation(stationId, stationData) {
  await new Promise(resolve => setTimeout(resolve, 700));

  const index = stationsData.findIndex(s => s.id === stationId);

  if (index === -1) {
    throw new Error('Station non trouvée');
  }

  stationsData[index] = {
    ...stationData,
    id: stationId // Préserve l'ID original
  };

  return { ...stationsData[index] };
}

// Supprimer une station
export async function deleteStation(stationId) {
  await new Promise(resolve => setTimeout(resolve, 500));

  const initialLength = stationsData.length;
  stationsData = stationsData.filter(s => s.id !== stationId);

  if (stationsData.length === initialLength) {
    throw new Error('Station non trouvée');
  }

  return { success: true };
}