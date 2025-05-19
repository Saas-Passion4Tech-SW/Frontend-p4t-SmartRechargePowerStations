<script>
	// @ts-ignore
	import { onMount } from 'svelte';
	import axios from 'axios';
	import StationGrid from '../components/StationGrid.svelte';
	import TabsFetch from '../components/TabsFetch.svelte';
	import { goto } from '$app/navigation';
	
	import { Networks, all_datas, stations_for_maps } from '../../variable-store';
	let networks = [];
	const datas = [];

	onMount(async () => {
		const token = localStorage.getItem('access_token');
		try {
			const response = await axios.get('http://89.117.63.24:8005/api/smartrecharge/get-stations-by-user/', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			//datas = response.data;
			const tempNetworks = [];

			//const result = await response.json();
			all_datas.set(response.data.data); // accessible partout dans le script après
			stations_for_maps.set(response.data.data);
			console.log('Données récupérées :', response.data);

			for (let key in response.data.data) {
				tempNetworks.push({
					nom: key,
					description: "Éditeur de photos professionnel avec de nombreux filtres et outils",
					image: "/api/placeholder/200/200",
					details: `${key} est une application complète d'édition d'images...`
				});
			}
			Networks.set(tempNetworks); // 👈 Important : mise à jour du store
		} catch (err) {
			console.error("Erreur d'authentification", err);
		}
	});

	console.log("==============");
	console.log($Networks);
	console.log($all_datas);
	console.log("==============");

    let selectedApp = null;

	let selectedAppName = null;

	let showDetailsSection = false;

	let filteredData;

	function showDetails(nom) {
		selectedAppName = nom;
		//alert(selectedAppName);
		// Réactif : met à jour filteredData quand selectedKey ou $all_datas change
		$: filteredData = $all_datas[selectedAppName] || [];
		//alert(filteredData);
		console.log("===++++==");
		console.log(filteredData);
		console.log("***+++***")
		console.log($all_datas);
		console.log("***+++**????*")
		showDetailsSection = true;
	}

	function set_stations_for_maps() {
		goto('http://89.117.63.24:2901/map');
	}


</script>
  
    <div class="container bg-red-100">
        <h1>Catalogue d'Applications</h1>
        
        <div class="app-grid">
            {#each $Networks as app}
                <div class="app-card rounded shadow cursor-pointer" on:click={() => showDetails(app.nom)}>
					<img class="app-image" src={app.image} alt={app.nom} />
					<div class="app-info">
						<div class="app-name">{app.nom}</div>
						<div class="app-description">{app.description}</div>
					</div>
                </div>
            {/each}
        </div>
    </div>
    <br />

    <!-- Conteneur affiché après clic -->
	{#if showDetailsSection}
		<StationGrid stations={filteredData} net_name={selectedAppName}/>
		<button class="mt-4 bg-red-500 text-white px-4 py-2 rounded" on:click={closeContainer}>
			Fermer
		</button>
	{/if}
	<p>****************************</p>
	<button class="mt-4 bg-green-500 text-white px-4 py-2 rounded" on:click={set_stations_for_maps}>
		Fermer
	</button>
	<TabsFetch />

  

  <style>
	.container {
	  max-width: 1200px;
	  margin: 0 auto;
	  padding: 20px;
	  font-family: Arial, sans-serif;
	}
  
	h1 {
	  text-align: center;
	  margin-bottom: 30px;
	  color: #333;
	}
  
	.app-grid {
	  display: grid;
	  //grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	  grid-template-columns: repeat(4, 1fr); /* 4 colonnes égales */
	  gap: 20px;
	}
  
	.app-card {
	  background-color: #f8f9fa;
	  border-radius: 8px;
	  overflow: hidden;
	  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	  transition: transform 0.2s, box-shadow 0.2s;
	  cursor: pointer;
	}
  
	.app-card:hover {
	  transform: translateY(-5px);
	  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}
  
	.app-image {
	  width: 100%;
	  height: 200px;
	  object-fit: cover;
	}
  
	.app-info {
	  padding: 15px;
	}
  
	.app-name {
	  font-size: 18px;
	  font-weight: bold;
	  margin-bottom: 8px;
	  color: #333;
	}
  
	.app-description {
	  color: #666;
	  line-height: 1.4;
	}
  </style>