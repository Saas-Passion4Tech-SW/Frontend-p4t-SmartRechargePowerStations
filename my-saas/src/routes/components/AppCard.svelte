<script>
  import { createEventDispatcher } from 'svelte';
  export let app;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('select', app);  // Envoie l'app sélectionnée au parent
  }
</script>

<div class="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-green-200 border border-gray-300 shadow-md rounded-lg transition-transform hover:scale-105 max-w-[400px]"
     on:click={handleClick}>

  <div class="p-3 flex flex-col justify-between h-full">
    <h3 class="text-lg font-semibold">{app.title}</h3>
    <!-- <img src={app.image} alt={app.title} class="w-full h-48 object-cover rounded-t-lg" /> -->
    <p class="text-sm mt-1">{app.description}</p>
  </div>
</div>
