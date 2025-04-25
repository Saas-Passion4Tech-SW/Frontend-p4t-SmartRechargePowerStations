// lib/stores/locationStore.js
import { writable } from 'svelte/store';

// Store pour la position de l'utilisateur (null par défaut)
export const userPosition = writable(null);

// Initialiser la géolocalisation si disponible dans le navigateur
export function initUserLocation() {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userPosition.set({ lat, lng });
      },
      error => {
        console.error('Erreur de géolocalisation:', error.message);
        // Définir une position par défaut (Paris)
        userPosition.set({ lat: 48.8566, lng: 2.3522 });
      }
    );
  }
}

// Calculer la distance entre l'utilisateur et un point
export function distanceFromUser(lat, lng, userPos) {
  if (!userPos) return null;

  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat - userPos.lat) * Math.PI / 180;
  const dLon = (lng - userPos.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userPos.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}