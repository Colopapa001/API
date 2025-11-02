// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_DELAY = 500; // Simular delay de red

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    } catch (e) {
      // Si no se puede leer el error, usar el código de estado
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// Función helper para simular delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============= PRODUCTOS =============
// Helper: comprobar si el token tiene formato JWT válido (3 partes, payload decodificable en base64)
const isValidJwt = (token) => {
  if (!token) return false;
  // Quitar prefijo Bearer si existe
  const raw = token.replace(/^Bearer\s+/i, '');
  const parts = raw.split('.');
  if (parts.length !== 3) return false;
  try {
    // Reemplazar URL-safe base64 y decodificar
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    // atob puede lanzar si la cadena no es válida
    const json = atob(payload);
    const obj = JSON.parse(json);
    return typeof obj === 'object' && obj !== null;
  } catch (e) {
    return false;
  }
};

// Helper: quitar token/usuario del localStorage
const clearAuth = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {
    // no-op
  }
};

// Helper para obtener headers con Authorization cuando exista token
const getAuthHeaders = (hasJson = false) => {
  const headers = {};
  const token = localStorage.getItem('token');
  if (hasJson) headers['Content-Type'] = 'application/json';
  if (token) {
    // Validar que el token tenga formato JWT (tres partes base64) para evitar tokens "mock" o malformados
    const isValid = isValidJwt(token);
    if (!isValid) {
      // Limpiar credenciales y notificar a la app
      clearAuth();
      // Disparar un evento para que componentes puedan reaccionar (p.ej. redirigir a login)
      try { window.dispatchEvent(new CustomEvent('auth:invalid')); } catch (e) {}
      // Lanzar error para que el llamado lo maneje (p.ej. MyProducts mostrará mensaje de re-login)
      throw new Error('INVALID_TOKEN');
    }

    // Normalizar valor Authorization: si el token ya contiene "Bearer ", usarlo tal cual
    headers['Authorization'] = (/^Bearer\s+/i.test(token)) ? token : `Bearer ${token}`;
  }
  return headers;
};

 


// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products/all`);
    const data = await handleResponse(response);
    // sanitize images to avoid transient blob: URLs stored in session/local state
    if (Array.isArray(data)) {
      return data.map(product => {
        try {
          if (product.images && Array.isArray(product.images)) {
            product.images = product.images.filter(i => typeof i === 'string' && i && !i.startsWith('blob:'));
          }
          if ((!product.images || product.images.length === 0) && product.image) {
            product.images = [product.image];
          }
                  if (!product.images || product.images.length === 0) {
                    product.images = ['/images/placeholder.svg'];
          }
        } catch (e) {
          product.images = ['/images/placeholder.svg'];
        }
        return product;
      });
    }
    return data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    // Si es 404, retornar null en lugar de lanzar error
    if (response.status === 404) {
      return null;
    }
    
    const product = await handleResponse(response);
    // sanitize single product images
    if (product) {
      try {
        if (product.images && Array.isArray(product.images)) {
          product.images = product.images.filter(i => typeof i === 'string' && i && !i.startsWith('blob:'));
        }
        if ((!product.images || product.images.length === 0) && product.image) {
          product.images = [product.image];
        }
                if (!product.images || product.images.length === 0) {
                  product.images = ['/images/placeholder.svg'];
        }
      } catch (e) {
        product.images = ['/images/placeholder.svg'];
      }
    }
    return product;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    // Si es un error 404, retornar null
    if (error.message.includes('404')) {
      return null;
    }
    throw error;
  }
};

// Obtener productos por usuario (requiere autenticación SELLER)
export const getProductsByUser = async (userId) => {
  try {
    await delay(API_DELAY);
    // Backend exposes: GET /products/user/{userId} (protected: SELLER or ADMIN)
    const response = await fetch(`${API_BASE_URL}/products/user/${userId}`, {
      headers: getAuthHeaders(true)
    });

    // If forbidden (403) propagate so caller can react (e.g., show login/role error)
    if (!response.ok) {
      // Return empty array on 401/403 to avoid breaking UI, but still surface the error
      if (response.status === 401 || response.status === 403) {
        throw new Error(`HTTP ${response.status}`);
      }
    }

    const pageData = await handleResponse(response);

    // Si es paginación (Page), extraer contenido
    const items = pageData && Array.isArray(pageData.content) ? pageData.content : (Array.isArray(pageData) ? pageData : []);

    // Sanitizar imágenes
    return items.map(p => {
      try {
        if (p.images && Array.isArray(p.images)) p.images = p.images.filter(i => typeof i === 'string' && i && !i.startsWith('blob:'));
        if ((!p.images || p.images.length === 0) && p.image) p.images = [p.image];
        if (!p.images || p.images.length === 0) p.images = ['/images/placeholder.svg'];
        return p;
      } catch (e) {
        return { ...p, images: ['/images/placeholder.svg'] };
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos del usuario:', error);
    // Si es un error de autorización, re-lanzarlo para que la UI lo maneje
    if (error && error.message && (error.message.includes('HTTP 401') || error.message.includes('HTTP 403'))) {
      throw error;
    }
    // Para otros errores, retornar array vacío en lugar de lanzar error
    return [];
  }
};

// Crear nuevo producto
export const createProduct = async (productData, userId) => {
  try {
    await delay(API_DELAY);
    // Adjuntar token si existe
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        ...productData,
        userId: userId // incluir userId si lo necesita el frontend
      })
    });
    const newProduct = await handleResponse(response);
    return { success: true, product: newProduct };
  } catch (error) {
    console.error('Error creando producto:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar producto
export const updateProduct = async (id, productData) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        ...productData,
        updatedAt: new Date().toISOString()
      })
    });
    const updatedProduct = await handleResponse(response);
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar producto
export const deleteProduct = async (id) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    });
    if (response.ok) {
      return { success: true, message: 'Producto eliminado correctamente' };
    }
    throw new Error('Error eliminando producto');
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar stock de producto
export const updateProductStock = async (id, newStock) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ stock: newStock })
    });
    const updatedProduct = await handleResponse(response);
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error('Error actualizando stock:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar stock después de compra
export const updateProductStockAfterPurchase = async (items) => {
  try {
    const updatePromises = items.map(async (item) => {
      const product = await getProductById(item.productId);
      const newStock = Math.max(0, product.stock - item.quantity);
      return updateProductStock(item.productId, newStock);
    });
    
    const results = await Promise.all(updatePromises);
    const failedUpdates = results.filter(result => !result.success);
    
    if (failedUpdates.length > 0) {
      throw new Error('Error actualizando stock de algunos productos');
    }
    
    return results; // Devolver el array de resultados
  } catch (error) {
    console.error('Error actualizando stock después de compra:', error);
    throw error; // Lanzar el error para que sea manejado en el componente
  }
};

// ============= CATEGORÍAS =============

// Obtener todas las categorías
export const getCategories = async () => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/categories`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    throw error;
  }
};

// Obtener categoría por ID
export const getCategoryById = async (id) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    throw error;
  }
};

// ============= USUARIOS =============

// Login de usuario
export const loginUser = async (email, password) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const auth = await handleResponse(response);

    // Guardar token y algunos datos del usuario en localStorage para uso del frontend
    if (auth && auth.token) {
      localStorage.setItem('token', auth.token);
      // Guardar user básico (no sensible)
      const user = {
        id: auth.userId,
        username: auth.username,
        email: auth.email,
        role: auth.role
      };
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Credenciales inválidas' };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: 'Error de conexión' };
  }
};

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    await delay(API_DELAY);
    
    // Verificar si el email ya existe
    const emailResponse = await fetch(`${API_BASE_URL}/users?email=${userData.email}`);
    const existingUsers = await handleResponse(emailResponse);
    
    if (existingUsers.length > 0) {
      return { success: false, error: 'El email ya está registrado' };
    }
    
    // Verificar si el username ya existe
    const usernameResponse = await fetch(`${API_BASE_URL}/users?username=${userData.username}`);
    const existingUsernames = await handleResponse(usernameResponse);
    
    if (existingUsernames.length > 0) {
      return { success: false, error: 'El nombre de usuario ya está en uso' };
    }
    
    // Crear nuevo usuario
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });
    
    const createdUser = await handleResponse(response);
    return { success: true, user: { ...createdUser, password: undefined } };
  } catch (error) {
    console.error('Error en registro:', error);
    return { success: false, error: 'Error de conexión' };
  }
};

// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    const user = await handleResponse(response);
    return { ...user, password: undefined };
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
};

// Obtener perfil del usuario autenticado
export const getCurrentUserProfile = async () => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(true)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const user = await handleResponse(response);
    return { ...user };
  } catch (error) {
    console.error('Error obteniendo perfil actual:', error);
    throw error;
  }
};

// ============= UTILIDADES =============

// Verificar conexión con la API
export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?_limit=1`);
    return response.ok;
  } catch (error) {
    console.error('Error verificando conexión API:', error);
    return false;
  }
};

// Exportar configuración
export const apiConfig = {
  baseUrl: API_BASE_URL,
  delay: API_DELAY
};

// Exportar todas las funciones por defecto
const apiExports = {
  // Productos
  getAllProducts,
  getProductById,
  getProductsByUser,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  updateProductStockAfterPurchase,
  
  // Categorías
  getCategories,
  getCategoryById,
  
  // Usuarios
  loginUser,
  registerUser,
  getUserById,
  
  // Utilidades
  checkApiConnection,
  apiConfig
};

export default apiExports;