<!-- lib/components/FilterPanel.svelte -->
<script>
  export let filters = {
    onlyAvailable: false,
    minPower: 0,
    connectorTypes: {
      type2: true,
      chademo: true,
      ccs: true,
      tesla: true
    },
    freeParking: false
  };

  const powerOptions = [
    { value: 0, label: 'Tous' },
    { value: 11, label: '> 11 kW' },
    { value: 22, label: '> 22 kW' },
    { value: 50, label: '> 50 kW' },
    { value: 100, label: '> 100 kW' }
  ];
</script>

<div class="filter-panel">
  <div class="filter-item">
    <label class="switch-label">
      <input type="checkbox" bind:checked={filters.onlyAvailable}>
      <span class="label-text">Bornes disponibles uniquement</span>
    </label>
  </div>

  <div class="filter-item">
    <label>Puissance minimale</label>
    <div class="power-selector">
      {#each powerOptions as option}
        <button
          class="power-btn"
          class:active={filters.minPower === option.value}
          on:click={() => filters.minPower = option.value}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="filter-item">
    <label>Types de connecteurs</label>
    <div class="connector-checkboxes">
      <label class="switch-label">
        <input type="checkbox" bind:checked={filters.connectorTypes.type2}>
        <span class="label-text">Type 2</span>
      </label>

      <label class="switch-label">
        <input type="checkbox" bind:checked={filters.connectorTypes.chademo}>
        <span class="label-text">CHAdeMO</span>
      </label>

      <label class="switch-label">
        <input type="checkbox" bind:checked={filters.connectorTypes.ccs}>
        <span class="label-text">CCS</span>
      </label>

      <label class="switch-label">
        <input type="checkbox" bind:checked={filters.connectorTypes.tesla}>
        <span class="label-text">Tesla</span>
      </label>
    </div>
  </div>

  <div class="filter-item">
    <label class="switch-label">
      <input type="checkbox" bind:checked={filters.freeParking}>
      <span class="label-text">Parking gratuit uniquement</span>
    </label>
  </div>

  <button
    class="reset-filters-btn"
    on:click={() => {
      filters = {
        onlyAvailable: false,
        minPower: 0,
        connectorTypes: {
          type2: true,
          chademo: true,
          ccs: true,
          tesla: true
        },
        freeParking: false
      };
    }}
  >
    Réinitialiser les filtres
  </button>
</div>

<style>
  .filter-panel {
    margin-bottom: 20px;
  }

  .filter-item {
    margin-bottom: 15px;
  }

  .filter-item label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  .switch-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .switch-label input[type="checkbox"] {
    margin-right: 8px;
  }

  .power-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
  }

  .power-btn {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.2s;
  }

  .power-btn.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
  }

  .connector-checkboxes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 5px;
  }

  .reset-filters-btn {
    width: 100%;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    margin-top: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .reset-filters-btn:hover {
    background: #e0e0e0;
  }
</style>