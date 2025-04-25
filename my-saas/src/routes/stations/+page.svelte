<script>
  //import Header from '../components/Header.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  // Importez vos services ou stores
  import { fetchStations } from '$lib/services/stationService';

  let stations = [];
  let isLoading = true;
  let error = null;
  let searchQuery = '';
  let filters = {
    available: false,
    fastCharging: false,
    maxDistance: 50
  };

  onMount(async () => {
    try {
      stations = await fetchStations();
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  });

  function handleStationClick(stationId) {
    goto(`/stations/${stationId}`);
  }

  $: filteredStations = stations.filter(station => {
    if (searchQuery && !station.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filters.available && !station.isAvailable) {
      return false;
    }

    if (filters.fastCharging && !station.hasFastCharging) {
      return false;
    }

    // Ajoutez d'autres filtres selon vos besoins

    return true;
  });
</script>

<svelte:head>
  <title>Stations de recharge</title>
</svelte:head>

<div class="stations-container bg-green-100">
  <h1>Stations de recharge</h1>

  <div class="search-filters">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Rechercher une station..."
    />

    <div class="filters">
      <label>
        <input type="checkbox" bind:checked={filters.available} />
        Disponibles uniquement
      </label>

      <label>
        <input type="checkbox" bind:checked={filters.fastCharging} />
        Recharge rapide
      </label>

      <div class="distance-filter">
        <span>Distance max: {filters.maxDistance}km</span>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          bind:value={filters.maxDistance}
        />
      </div>
    </div>
  </div>

  {#if isLoading}
    <p>Chargement des stations...</p>
  {:else if error}
    <p class="error">Erreur: {error}</p>
  {:else if filteredStations.length === 0}
    <p>Aucune station ne correspond à vos critères.</p>
  {:else}
    <div class="stations-grid">
      {#each filteredStations as station}
        <div
          class="station-card"
          class:available={station.isAvailable}
        >
          <h3>{station.name}</h3>
          <p class="address">{station.address}</p>
          <div class="station-info">
            <span class="status {station.isAvailable ? 'available' : 'busy'}">
              {station.isAvailable ? 'Disponible' : 'Occupée'}
            </span>
            <span class="distance">{station.distance}km</span>
          </div>
          <div class="chargers">
            {#each station.connectors as connector}
              <div class="connector-type">
                <span class="type">{connector.type}</span>
                <span class="power">{connector.power}kW</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .stations-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .search-filters {
    margin-bottom: 20px;
  }

  input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }

  .stations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .station-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .station-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .station-card.available {
    border-left: 4px solid green;
  }

  .station-info {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }

  .status {
    font-weight: bold;
  }

  .status.available {
    color: green;
  }

  .status.busy {
    color: #e74c3c;
  }

  .chargers {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .connector-type {
    background: #f5f5f5;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9em;
    display: flex;
    gap: 5px;
  }
</style>