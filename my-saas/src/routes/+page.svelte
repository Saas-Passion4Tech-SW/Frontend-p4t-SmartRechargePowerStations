<script>
	// @ts-ignore
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import AppList from './components/AppList.svelte';

	// Exemple de liste d'applications
	let apps = [
		{
		title: 'App 1',
		description: 'Une application géniale pour gérer vos tâches.',
		image: 'https://via.placeholder.com/400x200',
		},
		{
		title: 'App 2',
		description: 'Une autre application pour suivre vos finances.',
		image: 'https://via.placeholder.com/400x200',
		},
		{
		title: 'App 3',
		description: 'Application de suivi de santé et de bien-être.',
		image: 'https://via.placeholder.com/400x200',
		},
	];
	
	let modalVisible = false;
	let selectedApp = null;

	function openModal(app) {
		alert(app.title);
		selectedApp = app.title;
		modalVisible = true;
	}

	function closeModal() {
		modalVisible = false;
  	}

	//const currentUrl = window.location.href;
	let currentUrl;

	onMount(() => {
		currentUrl = window.location.href;
		console.log("URL actuelle :", currentUrl);
	});

	// États du formulaire
	let email = '';
	let username = '';
	let password = '';
	let rememberMe = false;
	let currentView = 'login'; // 'login', 'reset', ou 'resetSent'
	let resetEmail = '';
	let errorMessage = '';
	let isLoading = false;
	let showModal = true;
	let token = '';
	const userRole = 'Station manager';

	// Fonction pour fermer le modal
	function closeLoginModal() {
	  showModal = false;
	}

	// Fonction de connexion
	function handleLogin(e) {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';
		
		console.log('response555555555111');
		console.log(username);
		console.log(password);
		console.log('response555555555555111');
		// Simulation d'une connexion
		axios.post('http://89.117.63.24:8005/api/user/login/', 
            {
                email: email,
                password: password
            }
        )
        .then(function (response) {
            console.log('response555555555');
            console.log(response.data)
            console.log('response555555555555');
			// Récupérer le token dans la réponse
			token = response.data.access_token;
			// Stocker le token dans localStorage
			localStorage.setItem('access_token', token);

			if (response.data.role == 'Admin' || response.data.role == 'Network manager') {
				//window.location.href = currentUrl+'smart-recharge-network';
				goto(currentUrl+'smart-recharge-network');
			} else if (response.data.role == 'Station manager') {
				//window.location.href = currentUrl+'smart-recharge-station';
				goto(currentUrl+'smart-recharge-station');
			} else {
				//window.location.href = currentUrl+'smart-recharge-guest';
				goto(currentUrl+'smart-recharge-guest');
			}
			
        })
        .catch(function (error) {
            console.log(error);
        });
	}

	
  </script>
  
  <p>*****************************</p>
  <div class="container bg-red-100">
	<h1>Catalogue d'Applications</h1>
  	<AppList {apps} on:select={(e) => openModal(e.detail)} />
  </div>
  <p>*****************************</p>
  
  {#if modalVisible && selectedApp}
	<div class="modal-backdrop">
	  <div class="modal">
		<div class="modal-content">
		  <div class="modal-header">
			<div class="modal-title">Login for {selectedApp}</div>
			<button class="close-button" on:click={closeModal}>&times;</button>
		  </div>
		  <div class="logo-container">
			<div class="logo">A</div>
		  </div>
		  <h1>Connexion à votre compte</h1>
		  {#if errorMessage}
			<div class="error-message">
			  {errorMessage}
			</div>
		  {/if}
		  <form on:submit={handleLogin}>
			<div class="form-group">
				<label for="email">Adresse e-mail</label>
				<input 
					type="email" 
					id="email" 
					bind:value={email} 
					required 
					placeholder="Adresse e-mail" 
					autocomplete="email" 
				/>
			</div>

			
			<div class="form-group">
			  <label for="password">Mot de passe</label>
			  <input 
				type="password" 
				id="password" 
				bind:value={password} 
				required 
				placeholder="••••••••"
				autocomplete="current-password"
			  />
			</div>
			
			<div class="actions">
			  <div class="remember-me">
				<input type="checkbox" id="remember-me" bind:checked={rememberMe} />
				<label for="remember-me">Se souvenir de moi</label>
			  </div>
			  
			  <button type="button" class="btn-link" on:click={showReset}>
				Mot de passe oublié?
			  </button>
			</div>
			
			<button type="submit" class="btn" disabled={isLoading}>
			  <div class="btn-container">
				Se connecter
				{#if isLoading}
				  <span class="spinner"></span>
				{/if}
			  </div>
			</button>
		  </form>
		  <div class="footer">
			Pas encore de compte? <a href="/signup">S'inscrire</a>
		  </div>
		</div>
	  </div>
	</div>
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
  
	/* Modal styles */
	.modal-backdrop {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background-color: rgba(0, 0, 0, 0.5);
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  z-index: 1000;
	}
  
	.modal {
	  background-color: white;
	  width: 90%;
	  max-width: 600px;
	  border-radius: 8px;
	  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	  overflow: hidden;
	}
  
	.modal-content {
	  padding: 20px;
	}
  
	.modal-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 15px;
	}
  
	.modal-title {
	  font-size: 24px;
	  font-weight: bold;
	  color: #333;
	}
  
	.close-button {
	  background: none;
	  border: none;
	  font-size: 24px;
	  cursor: pointer;
	  color: #666;
	}
  
	.modal-image {
	  width: 100%;
	  max-height: 300px;
	  object-fit: cover;
	  border-radius: 4px;
	  margin-bottom: 15px;
	}
  
	.modal-description {
	  color: #444;
	  line-height: 1.6;
	  font-size: 16px;
	}

	label {
	  display: block;
	  margin-bottom: 0.5rem;
	  color: #4b5563;
	  font-size: 0.875rem;
	  font-weight: 500;
	}
	
	input[type="email"],
	input[type="password"] {
	  width: 100%;
	  padding: 0.75rem;
	  border: 1px solid #d1d5db;
	  border-radius: 0.375rem;
	  font-size: 1rem;
	  transition: border-color 0.15s ease-in-out;
	}
	
	input[type="email"]:focus,
	input[type="password"]:focus {
	  outline: none;
	  border-color: #4f46e5;
	  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}
	
	.remember-me {
	  display: flex;
	  align-items: center;
	  margin-bottom: 1rem;
	}
	
	.remember-me input {
	  margin-right: 0.5rem;
	}

	.logo-container {
	  text-align: center;
	  margin-bottom: 2rem;
	}

	.logo {
	  width: 80px;
	  height: 80px;
	  background-color: #4f46e5;
	  border-radius: 50%;
	  display: inline-flex;
	  align-items: center;
	  justify-content: center;
	  color: white;
	  font-size: 1.5rem;
	  font-weight: bold;
	}

	.btn {
	  display: block;
	  width: 100%;
	  padding: 0.75rem;
	  background-color: #4f46e5;
	  color: white;
	  font-size: 0.875rem;
	  font-weight: 500;
	  border: none;
	  border-radius: 0.375rem;
	  cursor: pointer;
	  transition: background-color 0.15s ease-in-out;
	}
	
	.btn:hover {
	  background-color: #4338ca;
	}
	
	.btn:disabled {
	  background-color: #9ca3af;
	  cursor: not-allowed;
	}
	
	.btn-link {
	  background: none;
	  border: none;
	  color: #4f46e5;
	  font-size: 0.875rem;
	  cursor: pointer;
	  padding: 0;
	  text-decoration: underline;
	}
	
	.btn-link:hover {
	  color: #4338ca;
	}

	.btn-container {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	.footer {
	  margin-top: 1.5rem;
	  text-align: center;
	  font-size: 0.875rem;
	  color: #6b7280;
	}
	
	.footer a {
	  color: #4f46e5;
	  text-decoration: none;
	}
	
	.footer a:hover {
	  text-decoration: underline;
	}

	.actions {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 1rem;
	}

	.error-message {
	  padding: 0.75rem;
	  margin-bottom: 1rem;
	  color: #b91c1c;
	  background-color: #fee2e2;
	  border-radius: 0.375rem;
	  font-size: 0.875rem;
	}
  </style>