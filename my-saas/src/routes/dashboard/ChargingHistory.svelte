<!-- src/routes/dashboard/ChargingHistory.svelte -->
<script>
  export let sessions = [];

  // Format pour afficher les prix
  function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
  }

  // Format pour afficher la durée en minutes
  function formatDuration(minutes) {
    return `${minutes} min`;
  }

  // Format pour afficher l'énergie en kWh
  function formatEnergy(kWh) {
    return `${kWh} kWh`;
  }

  // Pour voir toutes les sessions (à développer dans une nouvelle page)
  function viewAllSessions() {
    // Navigation vers la page complète d'historique
    // En SvelteKit, utilisez goto de @sveltejs/kit
    console.log("Naviguer vers l'historique complet");
  }
</script>

<div class="charging-history">
  {#if sessions.length === 0}
    <div class="empty-state">
      <p>Aucune session de recharge trouvée.</p>
    </div>
  {:else}
    <div class="table-container">
      <table class="sessions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Station</th>
            <th>Durée</th>
            <th>Énergie</th>
            <th>Coût</th>
          </tr>
        </thead>
        <tbody>
          {#each sessions as session}
            <tr>
              <td>{session.date}</td>
              <td class="station-name">{session.stationName}</td>
              <td>{formatDuration(session.duration)}</td>
              <td>{formatEnergy(session.energy)}</td>
              <td class="price">{formatPrice(session.cost)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="view-all">
      <button on:click={viewAllSessions} class="btn-link">
        Voir tout l'historique →
      </button>
    </div>
  {/if}
</div>

<style>
  .charging-history {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .table-container {
    overflow-x: auto;
    flex-grow: 1;
  }

  .sessions-table {
    width: 100%;
    border-collapse: collapse;
  }

  .sessions-table th,
  .sessions-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  .sessions-table th {
    font-weight: 600;
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
  }

  .sessions-table tr:hover {
    background-color: #f9f9f9;
  }

  .station-name {
    font-weight: 500;
  }

  .price {
    font-weight: 500;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: #666;
  }

  .view-all {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background-color: #f9f9f9;
  }

  .btn-link {
    background: none;
    border: none;
    color: #2a5caa;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 5px;
  }

  .btn-link:hover {
    text-decoration: underline;
  }
</style>