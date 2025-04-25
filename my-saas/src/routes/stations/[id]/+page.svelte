<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fetchStationDetails } from '$lib/services/stationService';
  //import { userStore } from '$lib/stores/userStore';

  const stationId = $page.params.id;

  let station = null;
  let isLoading = true;
  let error = null;
  let selectedConnector = null;
  let showReservationModal = false;

  onMount(async () => {
    try {
      station = await fetchStationDetails(stationId);
      // Si la station a des connecteurs, sélectionner le premier par défaut
      if (station.connectors && station.connectors.length > 0) {
        selectedConnector = station.connectors[0];
      }
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  });

  function toggleFavorite() {
    // Logique pour ajouter/retirer des favoris
    station.isFavorite = !station.isFavorite;
    // Appel API pour mettre à jour le statut favori
  }

  function openReservationModal() {
    // Rediriger vers la page de connexion
    goto('/auth?redirect=/stations/' + stationId);
  }
</script>

<svelte:head>
  <title>{station ? station.name : 'Détails de la station'}</title>
</svelte:head>

{#if isLoading}
  <div class="loading-container">
    <p>Chargement des détails de la station...</p>
  </div>
{:else if error}
  <div class="error-container">
    <p>Erreur: {error}</p>
    <button on:click={() => history.back()}>Retourner aux stations</button>
  </div>
{:else if station}
  <div class="station-details bg-green-100">
    <div class="header">
      <!--<div class="back-button" on:click={() => history.back()}>
        &larr; Retour aux stations
      </div> -->

      <div class="title-section">
        <h1>{station.name}</h1>
        <button class="favorite-btn" on:click={toggleFavorite}>
          {station.isFavorite ? '★ Favori' : '☆ Ajouter aux favoris'}
        </button>
      </div>

      <div class="address">
        <p>{station.address}</p>
        <button class="directions-btn">
          Itinéraire
        </button>
      </div>
    </div>

    <div class="main-content">
      <div class="left-column">
        <div class="station-info-box">
          <h2>Informations</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value status {station.isAvailable ? 'available' : 'busy'}">
                {station.isAvailable ? 'Disponible' : 'Occupée'}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Horaires:</span>
              <span class="value">{station.openingHours || '24h/24'}</span>
            </div>
            <div class="info-item">
              <span class="label">Parking:</span>
              <span class="value">{station.hasParkingFee ? 'Payant' : 'Gratuit'}</span>
            </div>
            <div class="info-item">
              <span class="label">Accessibilité:</span>
              <span class="value">{station.isAccessible ? 'Accessible PMR' : 'Non accessible'}</span>
            </div>
            <div class="info-item">
              <span class="label">Opérateur:</span>
              <span class="value">{station.operator}</span>
            </div>
          </div>
        </div>

        <div class="connectors-box">
          <h2>Points de charge</h2>
          <div class="connectors-list">
            {#each station.connectors as connector}
              <!-- <div
                class="connector-item"
                class:selected={selectedConnector === connector}
                on:click={() => selectedConnector = connector}
              > -->
                <div class="connector-header">
                  <span class="connector-type">{connector.type}</span>
                  <span class="connector-power">{connector.power}kW</span>
                </div>
                <div class="connector-status {connector.isAvailable ? 'available' : 'busy'}">
                  {connector.isAvailable ? 'Disponible' : 'Occupé'}
                </div>
              <!-- </div> -->
            {/each}
          </div>
        </div>

        {#if selectedConnector}
          <div class="reservation-box">
            <h2>Réservation</h2>
            <div class="selected-connector">
              Connecteur sélectionné: {selectedConnector.type} - {selectedConnector.power}kW
            </div>
            <button
              class="reserve-btn"
              disabled={!selectedConnector.isAvailable}
              on:click={openReservationModal}
            >
              Réserver maintenant
            </button>
            <p class="price-info">
              Prix: {station.pricePerKwh} €/kWh
            </p>
          </div>
        {/if}
      </div>

      <div class="right-column">
        <div class="map-container">
          <!-- Ici, intégrez une carte montrant l'emplacement de la station -->
          <div class="map-placeholder">
            Carte de la station
          </div>
        </div>

        <div class="reviews-box">
          <h2>Avis ({station.reviews ? station.reviews.length : 0})</h2>
          {#if station.reviews && station.reviews.length > 0}
            <div class="reviews-list">
              {#each station.reviews.slice(0, 3) as review}
                <div class="review-item">
                  <div class="review-header">
                    <span class="review-author">{review.author}</span>
                    <span class="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p class="review-content">{review.content}</p>
                </div>
              {/each}
              {#if station.reviews.length > 3}
                <button class="view-all-btn">Voir tous les avis</button>
              {/if}
            </div>
          {:else}
            <p>Aucun avis pour le moment.</p>
          {/if}
        </div>
      </div>
    </div>
  </div>

  {#if showReservationModal}
    <div class="modal-overlay">
      <div class="reservation-modal">
        <h2>Réserver un créneau</h2>
        <!-- Formulaire de réservation -->
        <button on:click={() => showReservationModal = false}>Fermer</button>
      </div>
    </div>
  {/if}
{/if}

<style>
  .station-details {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    margin-bottom: 30px;
  }

  /*.back-button {
    margin-bottom: 15px;
    cursor: pointer;
    display: inline-block;
  }*/

  .title-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .address {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .station-info-box,
  .connectors-box,
  .reservation-box,
  .map-container,
  .reviews-box {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  /*.connectors-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .connector-item {
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
  }

  .connector-item.selected {
    border-color: #3498db;
    background: #f0f8ff;
  }*/

  .connector-header {
    display: flex;
    justify-content: space-between;
  }

  .connector-status {
    margin-top: 5px;
    font-weight: bold;
  }

  .connector-status.available {
    color: green;
  }

  .connector-status.busy {
    color: #e74c3c;
  }

  .reserve-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
    margin: 15px 0;
  }

  .reserve-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }

  .map-placeholder {
    height: 300px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
  }

  .reviews-list {
    margin-top: 15px;
  }

  .review-item {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .reservation-modal {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
  }
</style>