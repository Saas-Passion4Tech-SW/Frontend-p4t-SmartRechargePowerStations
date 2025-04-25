<!-- src/routes/dashboard/UpcomingReservations.svelte -->
<script>
  export let reservations = [];

  // Formater la date et l'heure
  function formatDateTime(date, time) {
    return `${date} à ${time}`;
  }

  // Obtenir la classe CSS pour le statut
  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case 'confirmé':
        return 'status-confirmed';
      case 'en attente':
        return 'status-pending';
      case 'annulé':
        return 'status-canceled';
      default:
        return '';
    }
  }

  // Gérer la modification d'une réservation
  function modifyReservation(reservationId) {
    // Navigation vers la page de modification
    console.log(`Modifier la réservation ID: ${reservationId}`);
  }

  // Gérer l'annulation d'une réservation
  function cancelReservation(reservationId) {
    // Logique pour annuler la réservation
    console.log(`Annuler la réservation ID: ${reservationId}`);
  }
</script>

<div class="upcoming-reservations">
  {#if reservations.length === 0}
    <div class="empty-state">
      <p>Aucune réservation à venir.</p>
      <a href="/reservations/new" class="btn-make-reservation">Faire une réservation</a>
    </div>
  {:else}
    <ul class="reservations-list">
      {#each reservations as reservation}
        <li class="reservation-item">
          <div class="reservation-header">
            <h4 class="station-name">{reservation.stationName}</h4>
            <span class="status {getStatusClass(reservation.status)}">
              {reservation.status}
            </span>
          </div>

          <div class="reservation-details">
            <div class="datetime">
              {formatDateTime(reservation.date, reservation.time)}
            </div>
            <div class="reservation-actions">
              <button
                on:click={() => modifyReservation(reservation.id)}
                class="btn-action modify">
                Modifier
              </button>
              {#if reservation.status !== 'annulé'}
                <button
                  on:click={() => cancelReservation(reservation.id)}
                  class="btn-action cancel">
                  Annuler
                </button>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>

    <div class="all-reservations-link">
      <a href="/reservations" class="btn-link">Toutes les réservations</a>
      <a href="/reservations/new" class="btn-new">Nouvelle réservation</a>
    </div>
  {/if}
</div>

<style>
  .upcoming-reservations {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .reservations-list {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
  }

  .reservation-item {
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }

  .reservation-item:last-child {
    border-bottom: none;
  }

  .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .station-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }

  .status {
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 500;
  }

  .status-confirmed {
    background-color: #d1f5d6;
    color: #0f5724;
  }

  .status-pending {
    background-color: #fef6d8;
    color: #856404;
  }

  .status-canceled {
    background-color: #fee8e7;
    color: #aa2e26;
  }

  .reservation-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .datetime {
    font-size: 0.9rem;
    color: #666;
  }

  .reservation-actions {
    display: flex;
    gap: 8px;
  }

  .btn-action {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .modify {
    color: #2a5caa;
  }

  .cancel {
    color: #dc3545;
  }

  .btn-action:hover {
    text-decoration: underline;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    color: #666;
    gap: 12px;
  }

  .btn-make-reservation {
    background-color: #2a5caa;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .all-reservations-link {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    margin-top: auto;
  }

  .btn-link {
    color: #2a5caa;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .btn-link:hover {
    text-decoration: underline;
  }

  .btn-new {
    background-color: #2a5caa;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.85rem;
  }
</style>