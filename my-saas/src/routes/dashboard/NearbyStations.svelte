<!-- src/routes/dashboard/NearbyStations.svelte -->
<script>
  export let nearbyStations = [];

  function getAvailabilityColor(available, total) {
    if (available === 0) return 'var(--color-danger)';
    if (available < total / 3) return 'var(--color-warning)';
    return 'var(--color-success)';
  }
</script>

<div class="stations-list">
  {#if nearbyStations.length === 0}
    <div class="loading">Chargement des stations à proximité...</div>
  {:else}
    <div class="stations-header">
      <span class="name">Nom de la station</span>
      <span class="distance">Distance</span>
      <span class="availability">Disponibilité</span>
      <span class="power">Puissance</span>
      <span class="action"></span>
    </div>

    {#each nearbyStations as station}
      <div class="station-item">
        <span class="name">{station.name}</span>
        <span class="distance">{station.distance} km</span>
        <span class="availability">
          <span class="dot" style="background-color: {getAvailabilityColor(station.available, station.total)}"></span>
          {station.available}/{station.total}
        </span>
        <span class="power">{station.power}</span>
        <span class="action">
          <a href="/stations/{station.id}" class="btn-small">Détails</a>
          {#if station.available > 0}
            <a href="/reservations/new?station={station.id}" class="btn-small btn-reserve">Réserver</a>
          {/if}
        </span>
      </div>
    {/each}
  {/if}
</div>

<style>
  .stations-list {
    overflow-x: auto;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .stations-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    padding: 0.5rem 1rem;
    font-weight: bold;
    color: #666;
    border-bottom: 1px solid #eee;
  }

  .station-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    align-items: center;
  }

  .station-item:hover {
    background-color: #f9f9f9;
  }

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .action {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
    text-decoration: none;
    background-color: #eee;
    color: #333;
  }

  .btn-reserve {
    background-color: #2a5caa;
    color: white;
  }

  .btn-small:hover {
    opacity: 0.9;
  }

  :global(:root) {
    --color-success: #4CAF50;
    --color-warning: #FFC107;
    --color-danger: #F44336;
  }
</style>