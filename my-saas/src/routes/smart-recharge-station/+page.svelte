<script>
	// @ts-ignore
	import { onMount } from 'svelte';
	import axios from 'axios';
	import StationGrid from '../components/StationGrid.svelte';
	
	import { Networks, all_datas } from '../../variable-store';
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
			console.log('Données récupérées :', response.data);
		} catch (err) {
			console.error("Erreur d'authentification", err);
		}
	});

    console.log('Données récupérées1111 :', $all_datas);

	
</script>
  
    <div class="container bg-red-100">
        <StationGrid stations={$all_datas}/>
    </div>
    <br />

  

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