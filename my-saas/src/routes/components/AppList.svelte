<script>
  import AppCard from './AppCard.svelte';
  export let apps = []; // Liste d'applications à afficher
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {#each apps as app}
    <AppCard {app} />
  {/each}
</div>
