<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import StationGrid from '../components/StationGrid.svelte';
	import TabsFetch from '../components/TabsFetch.svelte';
	import ChargingStationCard2 from '../components/ChargingStationCard2.svelte';
	import ChargingStationCard from '../components/ChargingStationCard.svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	
	import { Networks, all_datas, stations_for_maps } from '../../variable-store.js';
	let networks = [];
	const datas = [];

	let isLoading = true;
	let isNM = false;
	let isSM = false;

	onMount(async () => {
		const token = localStorage.getItem('access_token');
		try {
			const response = await axios.get('http://89.117.63.24:8005/api/smartrecharge/get-stations-by-user/', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (response.data) {
				console.log("Réponse API complète :", response.data);
				console.log("Réponse role :", response.data.role);
				console.log("Contenu de response.data.data :", response.data.data);
				if (response.data.role == 'Admin') {
					all_datas.set(response.data.data);
					isLoading = false;
					isNM = true;
					console.log("444444");
					console.log(response.data.role + "-" +response.data.data);
				}
				if (response.data.role == 'Network manager') {
					all_datas.set(response.data.data);
					isLoading = false;
					isNM = true;
					console.log("444444");
					console.log(response.data.role + "-" +response.data.data);
				}
				if (response.data.role == 'Station manager') {
					all_datas.set(response.data.data);
					isLoading = false;
					isSM = true;
					console.log("33333");
					console.log(response.data.role);
					console.log(response.data.data);
				}
				console.log("isNM");
				console.log(isNM);
				console.log("isNM");
				console.log(isSM);
			} else {
				console.warn('response.data est null ou vide');
			}
		} catch (err) {
			console.error("Erreur d'authentification", err);
		} finally {
			//isLoading = false;
		}
	});

	console.log("=======444=======");
	console.log($all_datas);
	console.log("======444========");

	const tabs = Object.keys($all_datas);

	console.log("=======555=======");
	console.log(tabs);
	console.log($all_datas[tabs[0]]);
	console.log("======555========");

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

	const stations = [
		{
			location: "Albairate",
			address: "Via Marcatutto, 5/A",
			online: true,
			total: 4,
			active: 4,
			maintenance: 0,
			fault: 0,
			link: "https://github.com/heroui-inc/heroui"
		},
		{
			location: "Milano",
			address: "Corso Buenos Aires, 15",
			online: false,
			total: 6,
			active: 3,
			maintenance: 2,
			fault: 1,
			link: "https://example.com/milano"
		},
		{
			location: "Torino",
			address: "Via Roma, 101",
			online: true,
			total: 8,
			active: 8,
			maintenance: 0,
			fault: 0,
			link: "https://example.com/torino"
		},
		{
			location: "Albairate",
			address: "Via Marcatutto, 5/A",
			online: true,
			total: 4,
			active: 4,
			maintenance: 0,
			fault: 0,
			link: "https://github.com/heroui-inc/heroui"
		},
		{
			location: "Milano",
			address: "Corso Buenos Aires, 15",
			online: false,
			total: 6,
			active: 3,
			maintenance: 2,
			fault: 1,
			link: "https://example.com/milano"
		},
	];

	function logout() {
		localStorage.removeItem('access_token');
		goto('/'); // rediriger après déconnexion
	}
</script>
{#if isLoading}
	<!-- Affiche un loader ou un message -->
	<p>Chargement des données...</p>
{:else}
    <div class="container bg-red-100">
        <h1>Catalogue d'Applications</h1>
		{#if !isNM && isSM}
			<p>isNM: {isNM}, isSM: {isSM} =>NMS</p>
			<ChargingStationCard2 stations={$all_datas}/>
		{:else if isNM && !isSM}
			<p>isNM: {isNM}, isSM: {isSM} => SM</p>
			<TabsFetch nets={$all_datas}/>
		{:else}
			<p>Autre combinaison, le user est un guest</p>
		{/if}
    </div>
	<button on:click={logout}>Se déconnecter</button>
{/if}
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