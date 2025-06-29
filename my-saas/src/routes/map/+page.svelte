<!-- map/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  //import { fetchAllStations } from '$lib/services/stationService1';
  //import StationMarker from '$lib/components/StationMarker.svelte';
  import FilterPanel from '$lib/components/FilterPanel.svelte';
  import { goto } from '$app/navigation';
  import { userPosition } from '$lib/stores/locationStore';
  import { stations_for_maps } from '../../variable-store';

  let mapContainer;
  let map;
  let stations = [];
  let isLoading = true;
  let error = null;
  let searchRadius = 30; // en km
  let filters = {
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
  let showSidebar = false;

  let isMobile = false;

  onMount(() => {
    isMobile = window.innerWidth <= 768;
  });


  export async function fetchAllStations() {
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Récupérer le token depuis le localStorage (ou un store)
    //const token = localStorage.getItem('token'); // assure-toi qu’il est bien stocké sous ce nom
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUzMDQzMTE0LCJpYXQiOjE3NDkxNTUxMTQsImp0aSI6ImNjZjcwOTM4ZmE4NzQyZDRiMmU1MDY4ZmQ4NjlhNTUzIiwidXNlcl9pZCI6M30.n2fOF8aBkPnBPch7VYvMZIMbrPt0t8Z0yG7VIC-JXgQ"

    if (!token) {
      throw new Error('Aucun token d’authentification trouvé.');
    }

    try {
      const response = await fetch('http://89.117.63.24:8005/api/smartrecharge/stations/reviews/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (err) {
      console.error('Erreur lors du fetch des stations :', err);
      throw err;
    }
  }


  onMount(async () => {
    if (typeof window !== 'undefined') {
      // Importation dynamique de Leaflet (évite les erreurs SSR)
      const L = await import('leaflet');

      // Charger le CSS de Leaflet
      const leafletStylesheet = document.createElement('link');
      leafletStylesheet.rel = 'stylesheet';
      leafletStylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.css';
      document.head.appendChild(leafletStylesheet);

      try {
        // Récupérer les stations
        stations = await fetchAllStations();
        console.log("---------AAAAAAA-------");
        console.log(stations);
        console.log("--------SSSSSSSSSSS--------");

        // Initialiser la carte
        //map = L.map(mapContainer).setView([3.848, 11.502], 6);
        map = L.map(mapContainer).setView([5.9631, 10.1591], 6);


        // Ajout des tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        // Position de l'utilisateur si disponible
        if ($userPosition) {
          L.marker([$userPosition.lat, $userPosition.lng], {
            icon: L.divIcon({
              className: 'user-position-marker',
              html: '<div class="pulse"></div>',
              iconSize: [15, 15]
            })
          }).addTo(map);

          // Cercle pour montrer le rayon de recherche
          L.circle([$userPosition.lat, $userPosition.lng], {
            radius: searchRadius * 1000, // conversion en mètres
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.1,
            weight: 1
          }).addTo(map);

          // Centrer la carte sur la position de l'utilisateur
          map.setView([$userPosition.lat, $userPosition.lng], 12);
        }

        // Ajouter les marqueurs pour chaque station
        addStationMarkers();

      } catch (err) {
        error = err.message;
      } finally {
        isLoading = false;
      }
    }
  });

  // Fonction pour ajouter les marqueurs de stations sur la carte
  function addStationMarkers() {
    if (!map) return;

    // Supprimer les marqueurs existants si nécessaire
    map.eachLayer(layer => {
      if (layer._icon && layer._icon.className.includes('station-marker')) {
        map.removeLayer(layer);
      }
    });

    // Filtrer les stations selon les critères
    const filteredStations = stations;
    
    // Ajouter les marqueurs pour les stations filtrées
    filteredStations.forEach(station => {
      const L = window.L; // Utiliser L depuis le scope global

      console.log("--------***station***--------");
      console.log(station);
      console.log("--------***station end***--------");

      // Créer l'élément du marqueur
      const el = document.createElement('div');
      el.className = 'station-marker';
      el.innerHTML = `
        <div class="marker ${station.isAccessible ? 'available' : 'busy'}"></div>
      `;

      // Créer le marqueur
      const marker = L.marker([station.latitude, station.longitude], {
        icon: L.divIcon({
          className: 'station-marker-container',
          html: el.outerHTML,
          iconSize: [1, 1]
        })
      }).addTo(map);

      // Ajouter un popup au marqueur
      marker.bindPopup(`
        <div class="station-popup">
          <h3>${station.name}</h3>
          <p>${station.address}</p>
          <p class="status ${station.isAccessible ? 'available' : 'busy'}">
            ${station.isAccessible ? 'Disponible' : 'Occupée'}
          </p>
          
          <button class="view-details-btn" onclick="window.location.href='/stations/${station.id}'">
            Voir détails
          </button>
        </div>
      `);

      // Événement de clic sur le marqueur
      marker.on('click', () => {
        //map.setView([station.latitude, station.longitude], 14);
      });
    });
  }

  // Calculer la distance en km entre deux points géographiques
  /*function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }*/

  // Réagir aux changements de filtres
  $: {
    // Dès que les filtres changent et que la carte est chargée
    if (map && !isLoading) {
      addStationMarkers();
    }
  }

  // Mettre à jour le rayon de recherche
  function updateSearchRadius(radius) {
    searchRadius = radius;

    // Mettre à jour le cercle de rayon sur la carte
    if (map && $userPosition) {
      map.eachLayer(layer => {
        if (layer._radius) { // C'est un cercle
          map.removeLayer(layer);
        }
      });

      const L = window.L;
      L.circle([$userPosition.lat, $userPosition.lng], {
        radius: searchRadius * 1000, // conversion en mètres
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.1,
        weight: 1
      }).addTo(map);
    }

    // Rafraîchir les marqueurs
    addStationMarkers();
  }
</script>

<svelte:head>
  <title>Carte des bornes de recharge</title>
</svelte:head>

{#if isMobile}
  <button class="toggle-sidebar-btn" on:click={() => showSidebar = !showSidebar}>
    {showSidebar ? 'Cacher les filtres' : 'Afficher les filtres'}
  </button>
{/if}

<div class="map-page">
  <div class="sidebar" class:hidden={!showSidebar && isMobile}>
    <h2>Filtres</h2>

    {#if isLoading}
      <p>Chargement des stations...</p>
    {:else if error}
      <p class="error">{error}</p>
    {:else}
      <FilterPanel bind:filters />

      <div class="search-radius">
        <!-- <label>Rayon de recherche : {searchRadius} km</label> -->
        <label for="search">Rayon de recherche : {searchRadius} km</label>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          bind:value={searchRadius}
          on:change={() => updateSearchRadius(searchRadius)}
        />
      </div>

      <div class="stats">
        <p>{stations.filter(s => s.isAvailable).length} stations disponibles sur {stations.length}</p>
      </div>

      <button
        class="locate-me-btn"
        on:click={() => {
          // Demander la géolocalisation
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              // Mettre à jour le store de position
              userPosition.set({ lat, lng });

              // Centrer la carte
              if (map) {
                map.setView([lat, lng], 13);

                // Rafraîchir les marqueurs
                addStationMarkers();
              }
            });
          }
        }}
      >
        Me localiser
      </button>

      <div class="station-list">
        <h3>Stations à proximité</h3>
        {#each stations.filter(s => {
          // Appliquer les mêmes filtres que pour les marqueurs
          if (filters.onlyAvailable && !s.isAvailable) return false;
          // ... ajouter les autres filtres
          return true;
        }).slice(0, 5) as station (station.id)}
          <div
            class="station-list-item"
            class:available={station.isAvailable}
            on:click={() => goto(`/stations/${station.id}`)}
          >
            <h4>{station.name}</h4>
            <p class="address">{station.address}</p>
            <div class="station-list-info">
              <span class="status {station.isAvailable ? 'available' : 'busy'}">
                {station.isAvailable ? 'Disponible' : 'Occupée'}
              </span>
              {#if $userPosition}
                <span class="distance">
                  {calculateDistance(
                    $userPosition.lat,
                    $userPosition.lng,
                    station.coordinates.lat,
                    station.coordinates.lng
                  ).toFixed(1)} km
                </span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
  .map-page {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: calc(100vh - 60px); /* Hauteur totale moins la hauteur de la navbar */
  }

  .sidebar {
    background-color: white;
    padding: 20px;
    overflow-y: auto;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    z-index: 10;
  }

  .map-container {
    width: 100%;
    height: 100%;
  }

  .search-radius {
    margin: 20px 0;
  }

  .stats {
    margin: 15px 0;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
  }

  .locate-me-btn {
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    margin-bottom: 20px;
    width: 100%;
  }

  .station-list {
    margin-top: 20px;
  }

  .station-list-item {
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .station-list-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }

  .station-list-item.available {
    border-left: 4px solid green;
  }

  .station-list-item h4 {
    margin: 0 0 5px 0;
  }

  .address {
    font-size: 0.9em;
    color: #555;
    margin: 0 0 5px 0;
  }

  .station-list-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
  }

  .status.available {
    color: green;
    font-weight: bold;
  }

  .status.busy {
    color: #e74c3c;
    font-weight: bold;
  }

  /* Styles pour les marqueurs sur la carte */
  :global(.station-marker-container) {
    background: transparent;
  }

  :global(.station-marker .marker) {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #e74c3c;
    border: 2px solid white;
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
  }

  :global(.station-marker .marker.available) {
    background: #2ecc71;
  }

  :global(.user-position-marker) {
    background: transparent;
  }

  :global(.pulse) {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #3498db;
    box-shadow: 0 0 0 rgba(52, 152, 219, 0.4);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
    }
  }

  /* Styles pour les popups des stations */
  :global(.station-popup) {
    padding: 5px;
  }

  :global(.station-popup h3) {
    margin: 0 0 5px 0;
  }

  :global(.station-popup .connectors) {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 10px 0;
  }

  :global(.station-popup .connector) {
    font-size: 0.8em;
    padding: 3px 6px;
    border-radius: 3px;
    background: #f0f0f0;
  }

  :global(.station-popup .connector.available) {
    background: #e8f8f5;
    color: #27ae60;
  }

  :global(.station-popup .connector.busy) {
    background: #fde8e8;
    color: #e74c3c;
  }

  :global(.station-popup .view-details-btn) {
    background: #3498db;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 5px 10px;
    font-size: 0.9em;
    cursor: pointer;
    width: 100%;
  }

.hidden {
  display: none !important;
}

.toggle-sidebar-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
}


</style>