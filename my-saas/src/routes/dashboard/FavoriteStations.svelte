<!-- src/routes/dashboard/FavoriteStations.svelte -->
<script>
  export let stations = [];

  function formatDate(dateString) {
    // Formater la date en format français
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  // Pour accéder à la page de détails d'une station
  function viewStationDetails(stationId) {
    // Navigation vers la page de détails de la station
    console.log(`Naviguer vers la station ID: ${stationId}`);
  }
</script>

<div class="favorite-stations">
  {#if stations.length === 0}
    <div class="empty-state">
      <p>Vous n'avez pas encore de stations favorites.</p>
    </div>
  {:else}
    <ul class="stations-list">
      {#each stations as station}
        <li class="station-item">
          <div class="station-info">
            <h4 class="station-name">{station.name}</h4>
            <p class="station-address">{station.address}</p>
            <p class="last-used">Dernière utilisation: {formatDate(station.lastUsed)}</p>
          </div>
          <div class="station-actions">
            <button
              on:click={() => viewStationDetails(station.id)}
              class="btn-station">
              Détails
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .favorite-stations {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .stations-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .station-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }

  .station-item:last-child {
    border-bottom: none;
  }

  .station-info {
    flex-grow: 1;
  }

  .station-name {
    margin: 0 0 5px 0;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }

  .station-address {
    margin: 0 0 5px 0;
    font-size: 0.85rem;
    color: #666;
  }

  .last-used {
    margin: 0;
    font-size: 0.75rem;
    color: #888;
  }

  .station-actions {
    margin-left: 10px;
  }

  .btn-station {
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 0.85rem;
    color: #444;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-station:hover {
    background-color: #e0e0e0;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: #666;
  }
</style>