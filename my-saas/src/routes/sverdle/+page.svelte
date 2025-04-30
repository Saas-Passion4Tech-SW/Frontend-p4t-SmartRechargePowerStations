<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	
	// État pour contrôler l'affichage du modal
	let showModal = false;
	
	// États du formulaire
	let email = '';
	let password = '';
	let rememberMe = false;
	let currentView = 'login'; // 'login', 'reset', ou 'resetSent'
	let resetEmail = '';
	let errorMessage = '';
	let isLoading = false;
	
	// Fonction pour ouvrir le modal
	function openLoginModal() {
	  showModal = true;
	  // Réinitialiser l'état du formulaire
	  currentView = 'login';
	  errorMessage = '';
	}
	
	// Fonction pour fermer le modal
	function closeLoginModal() {
	  showModal = false;
	}
	
	// Fonction de connexion
	async function handleLogin(e) {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';
		
		try {
			// Requête POST réelle avec Axios
			const response = await axios.post('http://89.117.63.24:8006/api/user/login/', {
			email: email,
			password: password,
			//rememberMe: rememberMe
			});
			
			// Traitement de la réponse réussie
			console.log('Connexion réussie:', response.data);
			
			// Si l'API renvoie un token, vous pouvez le stocker
			/*if (response.data.token) {
				// Stocker dans localStorage ou sessionStorage selon rememberMe
				if (rememberMe) {
					localStorage.setItem('authToken', response.data.token);
				} else {
					sessionStorage.setItem('authToken', response.data.token);
				}
			}*/

			// Fermer le modal après une connexion réussie
			closeLoginModal();
			
		} catch (error) {
			// Gestion des erreurs
			console.error('Erreur de connexion:', error);
			
			// Afficher un message d'erreur approprié selon la réponse
			/*if (error.response) {
			// Le serveur a répondu avec un code d'erreur
			errorMessage = error.response.data.message || 'Identifiants incorrects.';
			} else if (error.request) {
			// La requête a été envoyée mais pas de réponse
			errorMessage = 'Serveur inaccessible. Vérifiez votre connexion internet.';
			} else {
			// Erreur lors de la configuration de la requête
			errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
			}*/
		} 
		finally {
			isLoading = false;
		}
	}
	
	// Fonction de demande de réinitialisation de mot de passe
	function handleResetRequest(e) {
	  e.preventDefault();
	  isLoading = true;
	  errorMessage = '';
	  
	  // Simulation d'envoi d'email de réinitialisation
	  setTimeout(() => {
		isLoading = false;
		// Dans une application réelle, vous appelleriez votre API ici
		console.log('Demande de réinitialisation pour:', resetEmail);
		currentView = 'resetSent';
	  }, 1000);
	}
	
	// Navigation entre les vues
	function showLogin() {
	  currentView = 'login';
	  errorMessage = '';
	}
	
	function showReset() {
	  currentView = 'reset';
	  errorMessage = '';
	}
	
	// Empêcher la propagation des clics du formulaire au modal
	function stopPropagation(e) {
	  e.stopPropagation();
	}
</script>
  
<style>
	/* Styles pour le modal */
	.modal-overlay {
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
	  position: relative;
	  max-width: 400px;
	  width: 90%;
	  max-height: 90vh;
	  overflow-y: auto;
	  background-color: white;
	  border-radius: 8px;
	  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
	  padding: 2rem;
	}
	
	.modal-close {
	  position: absolute;
	  top: 1rem;
	  right: 1rem;
	  background: none;
	  border: none;
	  font-size: 1.5rem;
	  line-height: 1;
	  cursor: pointer;
	  color: #6b7280;
	}
	
	.open-modal-btn {
	  padding: 0.75rem 1.5rem;
	  background-color: #4f46e5;
	  color: white;
	  font-size: 0.875rem;
	  font-weight: 500;
	  border: none;
	  border-radius: 0.375rem;
	  cursor: pointer;
	  transition: background-color 0.15s ease-in-out;
	}
	
	.open-modal-btn:hover {
	  background-color: #4338ca;
	}
	
	/* Styles pour le formulaire de connexion */
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
	
	h1 {
	  text-align: center;
	  color: #111827;
	  font-size: 1.5rem;
	  margin-bottom: 1.5rem;
	}
	
	.form-group {
	  margin-bottom: 1rem;
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
	
	.error-message {
	  padding: 0.75rem;
	  margin-bottom: 1rem;
	  color: #b91c1c;
	  background-color: #fee2e2;
	  border-radius: 0.375rem;
	  font-size: 0.875rem;
	}
	
	.success-message {
	  padding: 0.75rem;
	  margin-bottom: 1rem;
	  color: #065f46;
	  background-color: #d1fae5;
	  border-radius: 0.375rem;
	  font-size: 0.875rem;
	}
	
	.actions {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 1rem;
	}
	
	.spinner {
	  display: inline-block;
	  width: 1rem;
	  height: 1rem;
	  border: 2px solid rgba(255, 255, 255, 0.3);
	  border-radius: 50%;
	  border-top-color: white;
	  animation: spin 1s linear infinite;
	  margin-left: 0.5rem;
	}
	
	@keyframes spin {
	  to {
		transform: rotate(360deg);
	  }
	}
	
	.btn-container {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	
	.demo-container {
	  max-width: 1200px;
	  margin: 2rem auto;
	  padding: 2rem;
	  text-align: center;
	}
</style>
  
<!-- Conteneur de démo pour montrer l'ouverture du modal -->
<div class="demo-container">
	<h2>Démo de connexion dans un modal</h2>
	<p>Cliquez sur le bouton ci-dessous pour ouvrir le formulaire de connexion</p>
	<button class="open-modal-btn" on:click={openLoginModal}>
		Se connecter
	</button>
</div>
  
  <!-- Modal de connexion -->
  {#if showModal}
	<div class="modal-overlay" on:click={closeLoginModal}>
	  <div class="modal" on:click={stopPropagation}>
		<button class="modal-close" on:click={closeLoginModal}>&times;</button>
		
		{#if currentView === 'login'}
		  <div class="logo-container">
			<div class="logo">A</div>
		  </div>
		  <h1>Connexion à votre compte</h1>
		  
		  {#if errorMessage}
			<div class="error-message">
			  {errorMessage}
			</div>
		  {/if}
		  
		  <form on:submit={handleLogin} autocomplete="off">
			<!-- Champs cachés pour tromper le navigateur -->
			<input type="text" class="hidden-field" name="email_fake" id="email_fake" tabindex="-1">
			<input type="password" class="hidden-field" name="password_fake" id="password_fake" tabindex="-1">

			<div class="form-group">
			  <label for="email">Adresse e-mail</label>
			  <input 
				type="email" 
				id="email" 
				bind:value={email} 
				required 
				placeholder="nom@exemple.com"
				autocomplete="new-password" 
              	data-form-type="other"
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
				autocomplete="new-password" 
              	data-form-type="other"
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
		{:else if currentView === 'reset'}
		  <div class="logo-container">
			<div class="logo">A</div>
		  </div>
		  <h1>Réinitialiser votre mot de passe</h1>
		  
		  {#if errorMessage}
			<div class="error-message">
			  {errorMessage}
			</div>
		  {/if}
		  
		  <p style="margin-bottom: 1.5rem; color: #4b5563; font-size: 0.875rem;">
			Entrez l'adresse e-mail associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
		  </p>
		  
		  <form on:submit={handleResetRequest}>
			<div class="form-group">
			  <label for="reset-email">Adresse e-mail</label>
			  <input 
				type="email" 
				id="reset-email" 
				bind:value={resetEmail} 
				required 
				placeholder="nom@exemple.com"
				autocomplete="email"
			  />
			</div>
			
			<button type="submit" class="btn" disabled={isLoading}>
			  <div class="btn-container">
				Envoyer le lien de réinitialisation
				{#if isLoading}
				  <span class="spinner"></span>
				{/if}
			  </div>
			</button>
		  </form>
		  
		  <div class="footer">
			<button type="button" class="btn-link" on:click={showLogin}>
			  Retour à la connexion
			</button>
		  </div>
		{:else if currentView === 'resetSent'}
		  <div class="logo-container">
			<div class="logo">A</div>
		  </div>
		  <h1>E-mail envoyé</h1>
		  
		  <div class="success-message">
			Si un compte existe avec l'adresse e-mail <strong>{resetEmail}</strong>, vous recevrez un e-mail avec les instructions pour réinitialiser votre mot de passe.
		  </div>
		  
		  <div class="footer">
			<button type="button" class="btn-link" on:click={showLogin}>
			  Retour à la connexion
			</button>
		  </div>
		{/if}
	  </div>
	</div>
  {/if}