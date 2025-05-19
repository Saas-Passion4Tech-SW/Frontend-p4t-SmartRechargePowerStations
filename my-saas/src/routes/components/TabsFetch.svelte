<script>
  import { onMount } from 'svelte';

  let activeTab = 'users';
  let data = [];
  let loading = false;
  let error = null;

  const tabs = ['users', 'products', 'orders'];

  // Fonction pour charger les données de l'API
  async function fetchData(table) {
    activeTab = table;
    loading = true;
    error = null;
    data = [];

    try {
      const res = await fetch(`https://api.example.com/${table}`);
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      data = await res.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
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
    color: #007BFF;
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

{#if loading}
  <p>Chargement...</p>
{:else if error}
  <p style="color: red;">Erreur : {error}</p>
{:else if data.length > 0}
  <table>
    <thead>
      <tr>
        {#each Object.keys(data[0]) as key}
          <th>{key}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>
          {#each Object.values(row) as value}
            <td>{value}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>Aucune donnée à afficher.</p>
{/if}
