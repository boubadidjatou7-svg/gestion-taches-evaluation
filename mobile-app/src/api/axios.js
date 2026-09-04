import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const api = axios.create({ baseURL: API_URL });

// Ajoute automatiquement le token JWT stocké à chaque requête sortante.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AuthContext enregistre ici sa fonction logout au démarrage. Cela permet à
// l'intercepteur (hors de l'arbre React) de déclencher une déconnexion globale
// dès qu'un token expiré/invalide (401) est détecté, sans dépendance circulaire.
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      await onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;
