<script>
    //import Header from '../components/Header.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    export let stations;

    console.log("22222dfref2");
    console.log(stations);
    console.log("22222dfref2");

    let homepage = "http://89.117.63.24:2901/";

    onMount(() => {
      if (stations.length === 0) {
        console.log("sil n'est pas loggé, aller à la home");
        //alert("sil n'est pas loggé, aller à la home");
        goto(homepage);
        //window.location.href = homepage;
      }
    });

    let isLoading = false;
    let error = null;
    let searchQuery = '';
    let filters = {
        available: false,
        fastCharging: false,
        maxDistance: 50
    };

    function handleStationClick(stationId) {
        alert(stationId);
        goto(`/stations/${stationId}`);
    }

    console.log("jwef000");
    console.log(stations);

    $: filteredStations = stations.filter(station => {
        if (searchQuery && !station.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
        }

        if (filters.available && !station.isAccessible) {
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

<div class="stations bg-green-100">
    <h1>Stations de recharge reseau 11</h1>

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
                class:available={station.isAccessible}
                on:click={() => handleStationClick(station.id)}
                >
                  <h3><b>{station.name}</b></h3>
                  <p class="address">{station.address}</p>
                  <div class="station-info">
                      <span class="status {station.isAccessible ? 'available' : 'busy'}">
                      {station.isAccessible ? 'Disponible' : 'Occupée'}
                      </span>
                      <span class="distance">{station.openingHours}</span>
                  </div>
                  <div class="chargers">
                      <div class="connector-type">
                          <span class="power">{station.pricePerKwh} £/kw</span>
                      </div>
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
    grid-template-columns: repeat(3, 1fr); 
    gap: 20px;
    margin: 2%;
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