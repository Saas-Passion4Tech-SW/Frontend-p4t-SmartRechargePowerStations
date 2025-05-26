<script>
  export let stations = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
  {#each stations as station}
    <div class="border rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer bg-white">
      <h2 class="text-xl font-bold mb-2">{station.name}</h2>
      <p class="text-gray-600 text-sm mb-4">{station.address}</p>

      <div class="grid grid-cols-2 gap-2 text-sm">
        <div><strong>Total :</strong> {station.total}</div>
        <div><strong>En ligne :</strong> {station.online ? 'Oui' : 'Non'}</div>
        <div><strong>Actives :</strong> {station.active}</div>
        <div><strong>Maintenance :</strong> {station.maintenance}</div>
        <div><strong>Défaut :</strong> {station.fault}</div>
      </div>

      {#if station.link}
        <div class="mt-4">
          <a href={station.link} target="_blank" class="text-blue-600 hover:underline text-sm">
            Voir la station →
          </a>
        </div>
      {/if}
    </div>
  {/each}
</div>
