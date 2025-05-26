<script>
  import AppCard from './AppCard.svelte';
  export let apps = []; // Liste d'applications à afficher

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleSelect(app) {
    dispatch('select', app);  // remonter vers le parent
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {#each apps as app}
    <AppCard {app} on:select={(e) => handleSelect(e.detail)} />
  {/each}
</div>
