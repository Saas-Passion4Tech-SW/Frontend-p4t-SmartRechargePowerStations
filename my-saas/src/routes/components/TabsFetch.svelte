<script>
  import { onMount } from 'svelte';
  import StationGrid1 from './StationGrid1.svelte';
  export let nets;

  let data = [];
  let loading = false;
  let error = null;

  const datax = {
		fruits: ["pomme", "banane", "orange"],
		legumes: ["carotte", "brocoli", "tomate"],
		boissons: ["eau", "jus", "lait"]
	};

	// Liste complète des onglets avec "home" en premier
	const tabs = ["home", ...Object.keys(nets)];

	let activeTab = "home";
  
  console.log("++++++++0000++++");
  console.log(nets);
  console.log("/////////////");

  // Fonction pour charger les données de l'API
  async function fetchData(table) {
    
    activeTab=table;

    if (table==tabs[0]) {
      data=[]; 
    }
    else {
      console.log("999999999");
      console.log(table);
      console.log(nets[table]);
      data=nets[table];
      console.log("888888888");
    }
  }

  // Charger les données du premier onglet au démarrage
  onMount(() => {
    fetchData(activeTab);
  });
</script>

<style>
  .tabs {
    display: flex;
    border-bottom: 2px solid #ccc;
  }

  .tab {
    padding: 10px 20px;
    cursor: pointer;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-weight: bold;
  }

  .tab:hover {
    border-bottom: 2px solid #aaa;
  }

  .active {
    border-bottom: 2px solid #007BFF;
    color:rgb(44, 68, 202);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th, td {
    padding: 0.5rem;
    border: 1px solid #ddd;
  }
</style>

<div class="tabs">
  {#each tabs as tab}
    <button
      class="tab {tab === activeTab ? 'active' : ''}"
      on:click={() => fetchData(tab)}
    >
      {tab}
    </button>
  {/each}
</div>
<br />
{#if loading}
  <p>Chargement...</p>
{:else if error}
  <p style="color: red;">Erreur : {error}</p>
{:else if data.length > 0}
  <StationGrid1 stations={data}/>
{:else}
  <p>Aucune donnée à afficher.</p>
{/if}
