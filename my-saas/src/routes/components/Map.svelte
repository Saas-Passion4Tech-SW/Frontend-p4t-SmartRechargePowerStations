<script>
  import { onMount } from 'svelte';

  let mapContainer;

  onMount(async () => {
    // Import dynamique pour éviter que Leaflet soit utilisé côté serveur
    const L = await import('leaflet');

    const lat = 48.8566;
    const lng = 2.3522;
    const zoom = 13;

    const map = L.map(mapContainer).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
      .bindPopup('Vous êtes ici')
      .openPopup();
  });
</script>

<style>
  #map {
    height: 500px;
    width: 100%;
  }
</style>

<div bind:this={mapContainer} id="map"></div>
