<script>
	import { onMount } from 'svelte';
	let isMenuOpen = false;

	let links = [
		{ name: 'Accueil', href: '/' },
		{ name: 'Produits', href: '/produits' },
		{ name: 'À propos', href: '/a-propos' },
		{ name: 'Contact', href: '/contact' }
	];
</script>

<header class="bg-gray-200 shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2">
			<img src="" alt="Logo" class="h-8 w-auto" />
			<span class="text-xl font-bold text-gray-800">MonSite</span>
		</a>

		<!-- Desktop nav -->
		<nav class="hidden md:flex space-x-6">
			{#each links as link}
				<a href={link.href} class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
					{link.name}
				</a>
			{/each}
		</nav>

		<!-- Mobile toggle button -->
		<button class="md:hidden" on:click={() => (isMenuOpen = !isMenuOpen)}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				{#if isMenuOpen}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile nav links -->
	{#if isMenuOpen}
		<nav class="md:hidden px-4 pb-4 space-y-2 bg-white border-t">
			{#each links as link}
				<a href={link.href} class="block text-gray-700 hover:text-blue-600 font-medium">
					{link.name}
				</a>
			{/each}
		</nav>
	{/if}
</header>