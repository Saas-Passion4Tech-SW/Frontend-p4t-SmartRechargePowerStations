<script>
  import { onMount } from 'svelte';
  import {
    fetchStations,
    createStation,
    updateStation,
    deleteStation
  } from '$lib/services/stationService';

  let stations = [];
  let isLoading = true;
  let error = null;
  let showModal = false;
  let modalMode = 'create'; // 'create' ou 'edit'

  // État pour l'édition/création
  let currentStation = createEmptyStation();
  let currentConnectors = [];
  let newConnector = { type: 'Type 2', power: 22, isAvailable: true };

  // Options pour les types de connecteurs
  const connectorTypes = ['Type 2', 'CCS', 'CHAdeMO', 'Type 1', 'Tesla'];

  // Chargement initial des stations
  onMount(async () => {
    await loadStations();
  });

  async function loadStations() {
    try {
      isLoading = true;
      stations = await fetchStations();
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  function createEmptyStation() {
    return {
      name: '',
      address: '',
      isAvailable: true,
      operator: '',
      pricePerKwh: 0.35,
      openingHours: '24h/24',
      hasParkingFee: false,
      isAccessible: true,
      coordinates: {
        lat: 48.8566,
        lng: 2.3522
      }
    };
  }

  function openCreateModal() {
    modalMode = 'create';
    currentStation = createEmptyStation();
    currentConnectors = [];
    showModal = true;
  }

  function openEditModal(station) {
    modalMode = 'edit';
    currentStation = { ...station };
    currentConnectors = [...(station.connectors || [])];
    showModal = true;
  }

  function addConnector() {
    currentConnectors = [...currentConnectors, { ...newConnector, id: `temp-${Date.now()}` }];
    // Reset le formulaire de connecteur
    newConnector = { type: 'Type 2', power: 22, isAvailable: true };
  }

  function removeConnector(index) {
    currentConnectors = currentConnectors.filter((_, i) => i !== index);
  }

  async function handleSubmit() {
    try {
      const stationData = {
        ...currentStation,
        connectors: currentConnectors
      };

      if (modalMode === 'create') {
        await createStation(stationData);
      } else {
        await updateStation(currentStation.id, stationData);
      }

      showModal = false;
      await loadStations();
    } catch (err) {
      error = err.message;
    }
  }

  async function handleDelete(stationId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette station ?')) {
      try {
        await deleteStation(stationId);
        await loadStations();
      } catch (err) {
        error = err.message;
      }
    }
  }
</script>

<svelte:head>
  <title>Administration des stations</title>
</svelte:head>

<div class="admin-container">
  <div class="header">
    <h1>Administration des stations</h1>
    <button class="add-btn" on:click={openCreateModal}>
      Ajouter une station
    </button>
  </div>

  {#if error}
    <div class="error-message">
      <p>{error}</p>
      <button on:click={() => error = null}>Fermer</button>
    </div>
  {/if}

  {#if isLoading}
    <p>Chargement des stations...</p>
  {:else if stations.length === 0}
    <p>Aucune station disponible. Commencez par en ajouter une.</p>
  {:else}
    <div class="stations-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Disponibilité</th>
            <th>Connecteurs</th>
            <th>Opérateur</th>
            <th>Prix kWh</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each stations as station}
            <tr>
              <td>{station.id}</td>
              <td>{station.name}</td>
              <td>{station.address}</td>
              <td>
                <span class="status-badge {station.isAvailable ? 'available' : 'busy'}">
                  {station.isAvailable ? 'Disponible' : 'Occupée'}
                </span>
              </td>
              <td>
                {#if station.connectors && station.connectors.length > 0}
                  <div class="connectors-preview">
                    {station.connectors.map(c => `${c.type} (${c.power}kW)`).join(', ')}
                  </div>
                {:else}
                  <span class="no-data">Aucun connecteur</span>
                {/if}
              </td>
              <td>{station.operator || '-'}</td>
              <td>{station.pricePerKwh ? `${station.pricePerKwh.toFixed(2)}€` : '-'}</td>
              <td class="actions">
                <button class="edit-btn" on:click={() => openEditModal(station)}>Modifier</button>
                <button class="delete-btn" on:click={() => handleDelete(station.id)}>Supprimer</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if showModal}
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{modalMode === 'create' ? 'Ajouter une station' : 'Modifier une station'}</h2>
          <button class="close-btn" on:click={() => showModal = false}>&times;</button>
        </div>

        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="name">Nom de la station</label>
            <input id="name" type="text" required bind:value={currentStation.name} />
          </div>

          <div class="form-group">
            <label for="address">Adresse</label>
            <input id="address" type="text" required bind:value={currentStation.address} />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="operator">Opérateur</label>
              <input id="operator" type="text" bind:value={currentStation.operator} />
            </div>

            <div class="form-group">
              <label for="price">Prix par kWh (€)</label>
              <input id="price" type="number" step="0.01" min="0" bind:value={currentStation.pricePerKwh} />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="hours">Horaires d'ouverture</label>
              <input id="hours" type="text" bind:value={currentStation.openingHours} />
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" bind:checked={currentStation.isAvailable} />
                Station disponible
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" bind:checked={currentStation.hasParkingFee} />
                Parking payant
              </label>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" bind:checked={currentStation.isAccessible} />
                Accessible PMR
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="lat">Latitude</label>
              <input id="lat" type="number" step="0.0001" bind:value={currentStation.coordinates.lat} />
            </div>

            <div class="form-group">
              <label for="lng">Longitude</label>
              <input id="lng" type="number" step="0.0001" bind:value={currentStation.coordinates.lng} />
            </div>
          </div>

          <h3>Connecteurs</h3>

          {#if currentConnectors.length === 0}
            <p class="no-data">Aucun connecteur ajouté</p>
          {:else}
            <div class="connectors-list">
              {#each currentConnectors as connector, index}
                <div class="connector-item">
                  <div class="connector-info">
                    <span class="connector-type">{connector.type}</span>
                    <span class="connector-power">{connector.power}kW</span>
                    <span class="connector-status {connector.isAvailable ? 'available' : 'busy'}">
                      {connector.isAvailable ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                  <button type="button" class="remove-btn" on:click={() => removeConnector(index)}>
                    Supprimer
                  </button>
                </div>
              {/each}
            </div>
          {/if}

          <div class="add-connector-form">
            <h4>Ajouter un connecteur</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="connector-type">Type</label>
                <select id="connector-type" bind:value={newConnector.type}>
                  {#each connectorTypes as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              </div>

              <div class="form-group">
                <label for="connector-power">Puissance (kW)</label>
                <input id="connector-power" type="number" min="1" step="1" bind:value={newConnector.power} />
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" bind:checked={newConnector.isAvailable} />
                  Disponible
                </label>
              </div>

              <button type="button" class="add-connector-btn" on:click={addConnector}>
                Ajouter
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="cancel-btn" on:click={() => showModal = false}>
              Annuler
            </button>
            <button type="submit" class="submit-btn">
              {modalMode === 'create' ? 'Créer la station' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .add-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stations-table {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  .status-badge {
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 0.85em;
    font-weight: bold;
  }

  .status-badge.available {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .status-badge.busy {
    background: #ffebee;
    color: #c62828;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .edit-btn {
    background: #f0ad4e;
    color: white;
  }

  .delete-btn {
    background: #d9534f;
    color: white;
  }

  .edit-btn, .delete-btn {
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }

  .no-data {
    color: #9e9e9e;
    font-style: italic;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    width: 800px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  form {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 15px;
    flex: 1;
  }

  .form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    margin: 0;
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 8px;
  }

  h3 {
    margin: 25px 0 15px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
  }

  .connectors-list {
    margin-bottom: 20px;
  }

  .connector-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .connector-info {
    display: flex;
    gap: 15px;
  }

  .connector-type {
    font-weight: bold;
  }

  .connector-status {
    font-weight: bold;
  }

  .connector-status.available {
    color: #2e7d32;
  }

  .connector-status.busy {
    color: #c62828;
  }

  .remove-btn {
    background: #d9534f;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }

  .add-connector-form {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .add-connector-btn {
    background: #4caf50;
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 4px;
    cursor: pointer;
    align-self: flex-end;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
  }

  .cancel-btn {
    background: #95a5a6;
    color: white;
  }

  .submit-btn {
    background: #3498db;
    color: white;
  }

  .cancel-btn, .submit-btn {
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
</style>