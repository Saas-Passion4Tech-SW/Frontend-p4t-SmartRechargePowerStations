<script>
  export let location;
  export let address;
  export let online;
  export let total;
  export let active;
  export let maintenance;
  export let fault;
  export let link;
</script>

<div
  class="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-none shadow-medium rounded-large transition-transform-background hover:scale-105 max-w-[400px] grow bg-green-100"
  tabindex="-1"
  style="touch-action: pan-x pan-y pinch-zoom;"
>
  <!-- Header -->
  <div class="p-3 z-10 w-full justify-start items-center shrink-0 flex gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plug-zap">
      <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
      <path d="m2 22 3-3" />
      <path d="M7.5 13.5 10 11" />
      <path d="M10.5 16.5 13 14" />
      <path d="m18 3-4 4h6l-4 4" />
    </svg>
    <div class="flex flex-col">
      <p class="text-md font-bold">{location}</p>
      <p class="text-sm">{address}</p>
      <div class="flex flex-row gap-8 mt-1">
        {#if online}
          <div class="inline-flex items-center px-1 h-7 text-small rounded-full bg-success/20 text-success-700">
            <span class="px-2">Online</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <hr class="shrink-0 bg-divider border-none w-full h-divider" />

  <!-- Body -->
  <div class="relative flex w-full p-3 flex-col text-left overflow-y-auto">
    <div class="flex justify-between items-start">
      <p>4 Colonnine</p>
      <p class="text-xs text-primary-200">Stazione pubblica</p>
    </div>

    <div class="flex flex-row gap-1 justify-between items-end mt-2">
      <div class="flex gap-2 items-center">
        <p class="text-xs text-primary">attive</p>
        <div class="inline-flex items-center px-1 h-7 text-small rounded-full bg-success/20 text-success-700">
          <span class="px-2">{active}</span>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <p class="text-xs text-primary">manutenzione</p>
        <div class="inline-flex items-center px-1 h-7 text-small rounded-full bg-warning/20 text-warning-700">
          <span class="px-2">{maintenance}</span>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <p class="text-xs text-primary">fault</p>
        <div class="inline-flex items-center px-1 h-7 text-small rounded-full bg-danger/20 text-danger-600">
          <span class="px-2">{fault}</span>
        </div>
      </div>
    </div>
  </div>

  <hr class="shrink-0 bg-divider border-none w-full h-divider" />

  <!-- Footer -->
  <div class="p-3 h-auto flex w-full items-center overflow-hidden rounded-b-large">
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center text-medium text-secondary-800 hover:opacity-80 transition-opacity"
    >
      Dettagli
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="1em" class="ml-1">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
        <path d="M15 3h6v6"></path>
        <path d="M10 14L21 3"></path>
      </svg>
    </a>
  </div>
</div>