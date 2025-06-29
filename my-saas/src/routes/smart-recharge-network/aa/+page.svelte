<script>
  import { onMount } from 'svelte';
  import FilterPanel from '$lib/components/FilterPanel.svelte';
  import { goto } from '$app/navigation';
  import { userPosition } from '$lib/stores/locationStore';
  import { get } from 'svelte/store';

  let mapContainer;
  let map;
  let stations = [];
  let isLoading = true;
  let error = null;
  let searchRadius = 30;
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
  let isMobile = false;
  let showSidebar = false;

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
        console.log("---------FFFFFF-------");
        console.log(stations);
        console.log("---------FFFFFFF-------");

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
              iconSize: [30, 30]
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
      console.log(station.id);
	  console.log("Station debug:", station.name, station.latitude, station.longitude);
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
          iconSize: [30, 30]
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

  function localizeUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userPosition.set({ lat, lng });

        if (map) {
          map.setView([lat, lng], 13);
          addStationMarkers();
        }
      });
    }
  }

  function updateSearchRadius(radius) {
    searchRadius = radius;
    const pos = get(userPosition);
    if (map && pos) {
      map.eachLayer(layer => {
        if (layer._radius) map.removeLayer(layer);
      });

      const L = window.L;
      L.circle([pos.lat, pos.lng], {
        radius: searchRadius * 1000,
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.1,
        weight: 1
      }).addTo(map);
    }

    addStationMarkers();
  }
</script>

<div class="map-page">
  {#if isMobile}
    <div class="mobile-filters">
      <FilterPanel bind:filters />

      <div class="search-radius">
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

      <button class="locate-me-btn" on:click={localizeUser}>
        Me localiser
      </button>
    </div>
  {/if}

  {#if !isMobile}
    <div class="sidebar">
      <h2>Filtres</h2>
      <FilterPanel bind:filters />

      <div class="search-radius">
        <label>Rayon de recherche : {searchRadius} km</label>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          bind:value={searchRadius}
          on:change={() => updateSearchRadius(searchRadius)}
        />
      </div>

      <button class="locate-me-btn" on:click={localizeUser}>
        Me localiser
      </button>
    </div>
  {/if}

  <div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
	.map-page {
	display: flex;
	height: 100vh;
	}

	.sidebar {
	width: 300px;
	background-color: white;
	padding: 20px;
	overflow-y: auto;
	box-shadow: 2px 0 5px rgba(0,0,0,0.1);
	}

	.map-container {
	flex: 1;
	height: 100%;
	}

	/* --- Responsive mobile layout --- */
	@media (max-width: 768px) {
	.map-page {
		flex-direction: column;
	}

	.mobile-filters {
		padding: 15px;
		background: white;
		box-shadow: 0 2px 5px rgba(0,0,0,0.1);
		z-index: 10;
	}

	.map-container {
		height: 60vh;
	}

	.sidebar {
		display: none;
	}

	.locate-me-btn {
	background: #3498db;
	color: white;
	border: none;
	border-radius: 5px;
	padding: 10px 15px;
	cursor: pointer;
	width: 100%;
	margin-top: 10px;
	}

	.search-radius {
	margin: 15px 0;
	}
	}
</style>