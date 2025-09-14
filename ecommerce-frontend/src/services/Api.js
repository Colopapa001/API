// Configuración base de la API
const API_BASE_URL = 'http://localhost:3001';
const API_DELAY = 500; // Simular delay de red

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return response.json();
};

// Función helper para simular delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============= PRODUCTOS =============

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products`);
    return await handleResponse(response);
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
    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    throw error;
  }
};

// Obtener productos por usuario
export const getProductsByUser = async (userId) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products?userId=${userId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo productos del usuario:', error);
    throw error;
  }
};

// Crear nuevo producto
export const createProduct = async (productData, userId) => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...productData,
        userId: userId, // Incluir el userId del usuario autenticado
        id: Date.now(), // ID temporal
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      method: 'DELETE'
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
    const product = await getProductById(id);
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock: newStock,
        updatedAt: new Date().toISOString()
      })
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
    
    return { success: true, message: 'Stock actualizado correctamente' };
  } catch (error) {
    console.error('Error actualizando stock después de compra:', error);
    return { success: false, error: error.message };
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
    const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
    const users = await handleResponse(response);
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      return { success: true, user: { ...user, password: undefined } };
    } else {
      return { success: false, error: 'Credenciales inválidas' };
    }
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
export default {
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