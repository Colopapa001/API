// src/services/apiConfig.js

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3001';

// Endpoints de la API
const ENDPOINTS = {
  USERS: '/users',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ORDERS: '/orders'
};

// Opciones por defecto para fetch
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// Función para construir URLs completas
const buildUrl = (endpoint, id = null, query = null) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (id) {
    url += `/${id}`;
  }
  
  if (query) {
    const queryParams = new URLSearchParams(query).toString();
    url += `?${queryParams}`;
  }
  
  return url;
};

// Funciones para realizar peticiones HTTP
const api = {
  // GET request
  get: async (endpoint, id = null, query = null) => {
    const url = buildUrl(endpoint, id, query);
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // POST request
  post: async (endpoint, data) => {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // PUT request
  put: async (endpoint, id, data) => {
    const url = buildUrl(endpoint, id);
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // PATCH request
  patch: async (endpoint, id, data) => {
    const url = buildUrl(endpoint, id);
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // DELETE request
  delete: async (endpoint, id) => {
    const url = buildUrl(endpoint, id);
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }
};

export { API_BASE_URL, ENDPOINTS, api };