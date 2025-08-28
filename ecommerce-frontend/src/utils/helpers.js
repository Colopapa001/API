// Funciones Helper para la aplicación

// Formatear precio en pesos argentinos
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(price);
};

// Formatear precio en dólares (para mostrar el precio original)
export const formatPriceUSD = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
};

// Formatear fecha en español
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Formatear fecha relativa (hace X tiempo)
export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now - date;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Recién publicado';
  } else if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
  } else {
    return formatDate(dateString);
  }
};

// Calcular total del carrito
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

// Generar slug para URLs amigables
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones bajos con guiones
    .replace(/^-+|-+$/g, ''); // Remover guiones del inicio y final
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Capitalizar primera letra
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalizar cada palabra
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Debounce para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validar archivo de imagen
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return {
    isValid: validTypes.includes(file.type) && file.size <= maxSize,
    errors: {
      invalidType: !validTypes.includes(file.type) ? 'Solo se permiten archivos JPG, PNG o WebP' : '',
      tooLarge: file.size > maxSize ? 'El archivo debe ser menor a 5MB' : ''
    }
  };
};

// Convertir archivo a base64 (para preview de imágenes)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Generar ID único temporal (para nuevos productos antes de guardar)
export const generateTempId = () => {
  return 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Formatear números grandes (1000 -> 1K)
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

// Obtener iniciales del nombre
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

// Validar stock disponible
export const isStockAvailable = (product, requestedQuantity = 1) => {
  if (!product) return false;
  return product.stock >= requestedQuantity;
};

// Calcular descuento porcentual
export const calculateDiscount = (originalPrice, discountPrice) => {
  if (originalPrice <= discountPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

// Agrupar productos por categoría
export const groupProductsByCategory = (products, categories) => {
  return categories.map(category => ({
    ...category,
    products: products.filter(product => product.categoryId === category.id)
  }));
};

// Ordenar productos
export const sortProducts = (products, sortBy) => {
  const productsCopy = [...products];
  
  switch (sortBy) {
    case 'name-asc':
      return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return productsCopy.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-asc':
      return productsCopy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return productsCopy.sort((a, b) => b.price - a.price);
    case 'newest':
      return productsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return productsCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'stock-asc':
      return productsCopy.sort((a, b) => a.stock - b.stock);
    case 'stock-desc':
      return productsCopy.sort((a, b) => b.stock - a.stock);
    default:
      return productsCopy;
  }
};

// Filtrar productos por rango de precio
export const filterProductsByPriceRange = (products, minPrice, maxPrice) => {
  return products.filter(product => {
    const price = product.price;
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    return price >= min && price <= max;
  });
};

// Filtrar productos con stock disponible
export const filterProductsInStock = (products) => {
  return products.filter(product => product.stock > 0);
};

// Obtener productos relacionados (misma categoría, excluyendo el actual)
export const getRelatedProducts = (products, currentProductId, categoryId, limit = 4) => {
  return products
    .filter(product => 
      product.id !== parseInt(currentProductId) && 
      product.categoryId === categoryId &&
      product.stock > 0
    )
    .slice(0, limit);
};

// Generar URL de imagen placeholder personalizada
export const getPlaceholderImage = (width = 400, height = 400, text = 'Imagen', bgColor = '333333', textColor = 'FFFFFF') => {
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
};

// Validar datos de producto
export const validateProductData = (productData) => {
  const errors = {};
  
  if (!productData.title || productData.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres';
  }
  
  if (!productData.description || productData.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres';
  }
  
  if (!productData.price || productData.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  }
  
  if (!productData.stock || productData.stock < 0) {
    errors.stock = 'El stock no puede ser negativo';
  }
  
  if (!productData.categoryId) {
    errors.categoryId = 'Debe seleccionar una categoría';
  }
  
  if (!productData.images || productData.images.length === 0) {
    errors.images = 'Debe agregar al menos una imagen';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Función para manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Error del servidor (4xx, 5xx)
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    switch (status) {
      case 400:
        return message || 'Datos inválidos enviados al servidor';
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente';
      case 403:
        return 'No tienes permisos para realizar esta acción';
      case 404:
        return 'El recurso solicitado no fue encontrado';
      case 409:
        return message || 'Conflicto con los datos existentes';
      case 500:
        return 'Error interno del servidor. Intenta nuevamente';
      default:
        return message || 'Error del servidor';
    }
  } else if (error.request) {
    // Error de conexión
    return 'No se pudo conectar con el servidor. Verifica tu conexión';
  } else {
    // Error de configuración
    return 'Error inesperado. Intenta nuevamente';
  }
};

// Storage helpers (para cuando implementemos el backend real)
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

// Helpers para manejo de tokens JWT


// Helper para manejo de imágenes
export const imageUtils = {
  // Verificar si la URL de imagen es válida
  isValidImageUrl: (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  },
  
  // Obtener imagen por defecto si falla la carga
  getDefaultImage: (width = 400, height = 400) => {
    return `https://via.placeholder.com/${width}x${height}/E5E7EB/9CA3AF?text=Sin+Imagen`;
  },
  
  // Redimensionar imagen (para upload)
  resizeImage: (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
};

// Helper para URLs
export const urlUtils = {
  // Construir URL de imagen del producto
  getProductImageUrl: (productId, imageName) => {
    return `/images/products/${productId}/${imageName}`;
  },
  
  // Construir URL de avatar de usuario
  getUserAvatarUrl: (userId) => {
    return `/images/avatars/${userId}.jpg`;
  },
  
  // Obtener parámetros de query string
  getQueryParams: () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params) {
      result[key] = value;
    }
    return result;
  }
};

// Helper para notificaciones (para usar con toast libraries después)
export const notifications = {
  success: (message) => {
    console.log('✅ Success:', message);
    // Aquí integrarías con react-toastify o similar
  },
  
  error: (message) => {
    console.error('❌ Error:', message);
    // Aquí integrarías con react-toastify o similar
  },
  
  warning: (message) => {
    console.warn('⚠️ Warning:', message);
    // Aquí integrarías con react-toastify o similar
  },
  
  info: (message) => {
    console.info('ℹ️ Info:', message);
    // Aquí integrarías con react-toastify o similar
  }
};

// Helper para scroll suave
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    behavior
  });
};

export const scrollToElement = (elementId, behavior = 'smooth') => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior });
  }
};

// Helper para detectar dispositivo móvil
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Helper para formatear stock
export const formatStock = (stock) => {
  if (stock === 0) return 'Sin stock';
  if (stock === 1) return '1 disponible';
  if (stock <= 5) return `Solo ${stock} disponibles`;
  if (stock <= 10) return `${stock} disponibles`;
  return 'En stock';
};

// Agregar estas funciones al archivo helpers.js existente:

// ============================================
// TOKEN MANAGEMENT
// ============================================
export const token = {
  get: () => localStorage.getItem('auth_token'),
  set: (token) => localStorage.setItem('auth_token', token),
  remove: () => localStorage.removeItem('auth_token'),
  isExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = {};
  if (password.length < 6) {
    errors.length = 'debe tener al menos 6 caracteres';
  }
  if (!/[a-z]/.test(password)) {
    errors.lowercase = 'debe contener al menos una letra minúscula';
  }
  if (!/[A-Z]/.test(password)) {
    errors.uppercase = 'debe contener al menos una letra mayúscula';
  }
  if (!/\d/.test(password)) {
    errors.number = 'debe contener al menos un número';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUsername = (username) => {
  const errors = {};
  if (username.length < 3) {
    errors.minLength = 'debe tener al menos 3 caracteres';
  }
  if (username.length > 20) {
    errors.maxLength = 'no debe tener más de 20 caracteres';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.format = 'solo puede contener letras, números y guiones bajos';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// CART FUNCTIONS
// ============================================
export const calculateCartCount = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// Helper para estado de stock
export const getStockStatus = (stock) => {
  if (stock === 0) return { status: 'out-of-stock', text: 'Sin stock', color: 'error' };
  if (stock <= 5) return { status: 'low-stock', text: 'Poco stock', color: 'warning' };
  return { status: 'in-stock', text: 'En stock', color: 'success' };
};

