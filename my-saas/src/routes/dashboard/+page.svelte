<!-- src/routes/dashboard/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import ChargingHistory from './ChargingHistory.svelte';
  import FavoriteStations from './FavoriteStations.svelte';
  import UpcomingReservations from './UpcomingReservations.svelte';
  import UsageStats from './UsageStats.svelte';
  import NearbyStations from './NearbyStations.svelte';

  let userData = {
    name: 'Thomas Dubois',
    totalSessions: 28,
    energyConsumed: 562, // kWh
    savedCO2: 315, // kg
    favoriteStations: [
      { id: 1, name: 'Station Voltalis Lyon', address: '45 Rue de la République, Lyon', lastUsed: '2025-04-15' },
      { id: 2, name: 'SuperCharge Paris Nord', address: '12 Avenue des Ternes, Paris', lastUsed: '2025-04-10' },
      { id: 3, name: 'EcoWatt Marseille', address: '8 Boulevard Michelet, Marseille', lastUsed: '2025-03-30' }
    ],
    upcomingReservations: [
      { id: 101, stationName: 'GreenPower Nantes', date: '2025-04-27', time: '14:30', status: 'confirmé' },
      { id: 102, stationName: 'Voltalis Lyon', date: '2025-05-03', time: '10:00', status: 'en attente' }
    ],
    chargingSessions: [
      { date: '2025-04-22', stationName: 'Station Voltalis Lyon', duration: 45, energy: 28, cost: 15.40 },
      { date: '2025-04-15', stationName: 'Station Voltalis Lyon', duration: 32, energy: 19, cost: 10.20 },
      { date: '2025-04-10', stationName: 'SuperCharge Paris Nord', duration: 58, energy: 35, cost: 18.75 },
      { date: '2025-04-05', stationName: 'EcoWatt Marseille', duration: 40, energy: 25, cost: 13.50 }
    ],
    monthlyStats: [
      { month: 'Jan', energy: 95 },
      { month: 'Fév', energy: 85 },
      { month: 'Mar', energy: 110 },
      { month: 'Avr', energy: 75 }
    ]
  };

  let nearbyStations = [];
  let userPosition = null;

  onMount(async () => {
    // Simuler la récupération de la position de l'utilisateur
    try {
      userPosition = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
      // Dans une application réelle, utilisez la géolocalisation du navigateur
      // Avec navigator.geolocation.getCurrentPosition()

      // Simuler l'appel à l'API pour récupérer les stations à proximité
      await fetchNearbyStations(userPosition);
    } catch (error) {
      console.error("Erreur lors de la récupération de la position:", error);
    }
  });

  async function fetchNearbyStations(position) {
    // Dans une application réelle, ceci serait un appel API
    // Données simulées pour l'exemple
    nearbyStations = [
      { id: 11, name: 'ChargeCity République', distance: 0.8, available: 3, total: 4, power: '150kW' },
      { id: 12, name: 'ElectraDrive Centre', distance: 1.2, available: 0, total: 2, power: '50kW' },
      { id: 13, name: 'GreenWatt Gare', distance: 1.5, available: 2, total: 6, power: '100kW' },
      { id: 14, name: 'PowerCharge Marais', distance: 2.3, available: 1, total: 2, power: '22kW' }
    ];

    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
</script>

<svelte:head>
  <title>Tableau de bord - EcoCharge</title>
</svelte:head>

<div class="dashboard bg-green-100">
  <header>
    <h1>Tableau de bord</h1>
    <p>Bienvenue, {userData.name}</p>
    <div class="last-update">Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</div>
  </header>

  <section class="summary-cards">
    <div class="card">
      <h3>Sessions de recharge</h3>
      <div class="value">{userData.totalSessions}</div>
    </div>
    <div class="card">
      <h3>Énergie consommée</h3>
      <div class="value">{userData.energyConsumed} kWh</div>
    </div>
    <div class="card">
      <h3>CO2 économisé</h3>
      <div class="value">{userData.savedCO2} kg</div>
    </div>
    <div class="card action">
      <h3>Trouver une borne</h3>
      <a href="/map" class="btn-primary">Carte</a>
    </div>
  </section>

  <div class="dashboard-grid">
    <section class="nearby-stations">
      <h2>Bornes à proximité</h2>
      <NearbyStations {nearbyStations} />
    </section>

    <section class="upcoming-reservations">
      <h2>Réservations à venir</h2>
      <UpcomingReservations reservations={userData.upcomingReservations} />
    </section>

    <section class="usage-stats">
      <h2>Statistiques d'utilisation</h2>
      <UsageStats monthlyData={userData.monthlyStats} />
    </section>

    <section class="favorite-stations">
      <h2>Stations favorites</h2>
      <FavoriteStations stations={userData.favoriteStations} />
    </section>

    <section class="charging-history">
      <h2>Historique des recharges</h2>
      <ChargingHistory sessions={userData.chargingSessions} />
    </section>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    margin-bottom: 2rem;
    position: relative;
  }

  header h1 {
    margin-bottom: 0.5rem;
    color: #2a5caa;
  }

  .last-update {
    font-size: 0.8rem;
    color: #777;
    position: absolute;
    right: 0;
    top: 0;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .card h3 {
    margin: 0;
    font-size: 1rem;
    color: #666;
  }

  .card .value {
    font-size: 2rem;
    font-weight: bold;
    color: #2a5caa;
    margin-top: 0.5rem;
  }

  .card.action {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .btn-primary {
    background: #2a5caa;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  .btn-primary:hover {
    background: #1d4080;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  section h2 {
    margin-top: 0;
    font-size: 1.2rem;
    color: #2a5caa;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  .nearby-stations, .charging-history {
    grid-column: span 2;
  }

  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .nearby-stations, .charging-history {
      grid-column: span 1;
    }
  }
</style>