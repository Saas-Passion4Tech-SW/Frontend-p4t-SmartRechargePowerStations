<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation'; // si tu es en SvelteKit
	import { writable } from 'svelte/store';

	export const all_datas = writable(null);
	export const stations_for_maps = writable([]);
	let isLoading = true;
	let error = null;

	onMount(async () => {
		const token = localStorage.getItem('access_token');
		if (!token) {
			error = "Aucun token trouvé";
			goto('http://89.117.63.24:2901/'); // redirection si pas de token
			return;
		}

		try {
			const response = await axios.get('http://89.117.63.24:8005/api/smartrecharge/get-stations-by-user/', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (response.data && response.data.data) {
                console.log("1111");
                if (response.data && response.data.data) {
                    console.log("2222");
                    all_datas.set(response.data.data);
                    console.log($all_datas);
                    console.log("2222.3");
                } else {
                    console.log("3333");
                    console.warn("response.data.data est null :", response.data);
                }
				//all_datas.set(response.data.data);
				//stations_for_maps.set(response.data.data);
				//console.log('Données récupérées :', response.data);
			} else {
                console.log("4444");
				error = "Réponse invalide";
				goto('http://89.117.63.24:2901/'); // ou affiche un message d'erreur
			}
		} catch (err) {
            console.log("5555");
			console.error("Erreur API :", err);
			error = "Erreur d'authentification ou API";
			goto('http://89.117.63.24:2901/'); // redirection vers une page de login
		} finally {
            console.log("6666");
			isLoading = true;
		}
	});

    console.log("-------1111--------");
    console.log($all_datas);
    console.log($all_datas);
    console.log("--------3333-------");
</script>

<!-- Gestion de l'affichage -->
{#if isLoading}
	<p>Chargement des données...</p>
{:else if error}
	<p>Erreur : {error}</p>
{:else}
	<!-- Ta page principale -->
	<p>Erreur : Ta page principale</p>
{/if}
