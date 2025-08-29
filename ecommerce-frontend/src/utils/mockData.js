// Mock Users
export const mockUsers = [
  {
    id: 1,
    username: 'juanperez',
    email: 'juan@email.com',
    password: 'Password123', // En producción esto estaría encriptado
    firstName: 'Juan',
    lastName: 'Pérez',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    username: 'mariagarcia',
    email: 'maria@email.com',
    password: 'Password123',
    firstName: 'María',
    lastName: 'García',
    createdAt: '2024-02-20T14:30:00Z'
  }
];

// Mock Categories
export const mockCategories = [
  {
    id: 1,
    name: 'Electrónicos',
    description: 'Dispositivos electrónicos, computadoras, smartphones y accesorios'
  },
  {
    id: 2,
    name: 'Ropa',
    description: 'Vestimenta para todas las edades y ocasiones'
  },
  {
    id: 3,
    name: 'Hogar',
    description: 'Artículos para el hogar, decoración y muebles'
  },
  {
    id: 4,
    name: 'Deportes',
    description: 'Equipamiento deportivo y artículos de fitness'
  },
  {
    id: 5,
    name: 'Libros',
    description: 'Literatura, educación y entretenimiento'
  },
  {
    id: 6,
    name: 'Juguetes',
    description: 'Juguetes y juegos para niños de todas las edades'
  }
];

// Mock Products
export const mockProducts = [
  {
    id: 1,
    title: 'iPhone 15 Pro',
    description: 'El iPhone más avanzado con chip A17 Pro, cámara de 48MP y titanio aerospace.',
    price: 999.99,
    stock: 15,
    categoryId: 1,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-01T09:00:00Z'
  },
  {
    id: 2,
    title: 'MacBook Air M2',
    description: 'Laptop ultraportátil con chip M2, pantalla Liquid Retina de 13.6 pulgadas.',
    price: 1199.99,
    stock: 8,
    categoryId: 1,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-28T11:30:00Z'
  },
  {
    id: 3,
    title: 'Auriculares Sony WH-1000XM5',
    description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria.',
    price: 299.99,
    stock: 25,
    categoryId: 1,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-05T16:45:00Z'
  },
  {
    id: 4,
    title: 'Camiseta Básica Premium',
    description: 'Camiseta de algodón 100% orgánico, corte regular, disponible en varios colores.',
    price: 24.99,
    stock: 50,
    categoryId: 2,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-20T12:00:00Z'
  },
  {
    id: 5,
    title: 'Jeans Levi\'s 511',
    description: 'Jeans de corte ajustado, confeccionados en denim de alta calidad.',
    price: 79.99,
    stock: 30,
    categoryId: 2,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-25T14:20:00Z'
  },
  {
    id: 6,
    title: 'Sofá Moderno 3 Plazas',
    description: 'Sofá cómodo y elegante, tapizado en tela resistente, ideal para sala de estar.',
    price: 599.99,
    stock: 5,
    categoryId: 3,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-18T08:15:00Z'
  },
  {
    id: 7,
    title: 'Set de Ollas Antiadherentes',
    description: 'Set de 5 ollas con recubrimiento antiadherente y mangos ergonómicos.',
    price: 149.99,
    stock: 12,
    categoryId: 3,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-22T10:45:00Z'
  },
  {
    id: 8,
    title: 'Zapatillas Adidas Ultraboost',
    description: 'Zapatillas de running con tecnología Boost para máximo retorno de energía.',
    price: 159.99,
    stock: 20,
    categoryId: 4,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-03T13:20:00Z'
  },
  {
    id: 9,
    title: 'Tablet Samsung Galaxy Tab S9',
    description: 'Tablet premium con pantalla AMOLED de 11 pulgadas y S Pen incluido.',
    price: 649.99,
    stock: 10,
    categoryId: 1,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-27T15:10:00Z'
  },
  {
    id: 10,
    title: 'Pelota de Fútbol Nike',
    description: 'Pelota oficial de fútbol con tecnología Nike Aerowsculpt para vuelo preciso.',
    price: 29.99,
    stock: 40,
    categoryId: 4,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-07T09:30:00Z'
  },
  {
    id: 11,
    title: 'Apple Watch Series 9',
    description: 'Smartwatch con pantalla Always-On Retina y funciones avanzadas de salud.',
    price: 399.99,
    stock: 18,
    categoryId: 1,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-02T11:15:00Z'
  },
  {
    id: 12,
    title: 'Mesa de Centro Moderna',
    description: 'Mesa de centro de madera maciza con diseño minimalista y funcional.',
    price: 199.99,
    stock: 7,
    categoryId: 3,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-19T14:00:00Z'
  },
  {
    id: 13,
    title: 'Raqueta de Tenis Wilson',
    description: 'Raqueta profesional con marco de grafito, ideal para jugadores intermedios.',
    price: 89.99,
    stock: 15,
    categoryId: 4,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-24T16:30:00Z'
  },
  {
    id: 14,
    title: 'Drone DJI Mini 3',
    description: 'Drone compacto con cámara 4K, estabilización de 3 ejes y 38 minutos de vuelo.',
    price: 449.99,
    stock: 6,
    categoryId: 1,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-04T08:45:00Z'
  },
  {
    id: 15,
    title: 'Libro: El Arte de la Guerra',
    description: 'Clásico tratado de estrategia militar y empresarial de Sun Tzu.',
    price: 15.99,
    stock: 35,
    categoryId: 5,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-21T13:40:00Z'
  },
  {
    id: 16,
    title: 'Lámpara LED Inteligente',
    description: 'Lámpara con control remoto, múltiples colores y compatible con smart home.',
    price: 45.99,
    stock: 22,
    categoryId: 3,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-26T17:20:00Z'
  },
  {
    id: 17,
    title: 'Cafetera Express Delonghi',
    description: 'Cafetera automática con molinillo integrado y sistema de leche.',
    price: 279.99,
    stock: 9,
    categoryId: 3,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-23T12:10:00Z'
  },
  {
    id: 18,
    title: 'Libro: Cien Años de Soledad',
    description: 'Obra maestra de Gabriel García Márquez, edición conmemorativa.',
    price: 18.99,
    stock: 28,
    categoryId: 5,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-02-29T11:05:00Z'
  },
  {
    id: 19,
    title: 'Puzzle 1000 Piezas',
    description: 'Puzzle de paisaje natural con 1000 piezas, perfecto para relajarse.',
    price: 12.99,
    stock: 0, // Sin stock para probar funcionalidad
    categoryId: 6,
    userId: 1,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-06T14:25:00Z'
  },
  {
    id: 20,
    title: 'Mochila Deportiva Nike',
    description: 'Mochila resistente al agua con compartimentos especializados para deporte.',
    price: 54.99,
    stock: 33,
    categoryId: 4,
    userId: 2,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=entropy'
    ],
    createdAt: '2024-03-08T10:40:00Z'
  }
];

// Funciones Helper para manipular datos

// Simular delay de API
export const simulateApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Obtener todos los productos
export const getProducts = async () => {
  await simulateApiDelay();
  return [...mockProducts].sort((a, b) => a.title.localeCompare(b.title));
};

// Obtener producto por ID
export const getProductById = async (id) => {
  await simulateApiDelay();
  return mockProducts.find(product => product.id === parseInt(id));
};

// Obtener productos por categoría
export const getProductsByCategory = async (categoryId) => {
  await simulateApiDelay();
  return mockProducts
    .filter(product => product.categoryId === parseInt(categoryId))
    .sort((a, b) => a.title.localeCompare(b.title));
};

// Obtener productos por usuario
export const getProductsByUser = async (userId) => {
  await simulateApiDelay();
  return mockProducts
    .filter(product => product.userId === parseInt(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Buscar productos
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm.trim()) return products;
  
  const term = searchTerm.toLowerCase().trim();
  return products.filter(product =>
    product.title.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
};

// Obtener todas las categorías
export const getCategories = async () => {
  await simulateApiDelay();
  return [...mockCategories];
};

// Obtener categoría por ID
export const getCategoryById = async (id) => {
  await simulateApiDelay();
  return mockCategories.find(category => category.id === parseInt(id));
};

// Autenticación mock
export const loginUser = async (email, password) => {
  await simulateApiDelay();
  
  const user = mockUsers.find(u => 
    u.email === email && u.password === password
  );
  
  if (user) {
    // Remover password del objeto retornado
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`
    };
  }
  
  return {
    success: false,
    error: 'Email o contraseña incorrectos'
  };
};

// Registro mock
export const registerUser = async (userData) => {
  await simulateApiDelay();
  
  // Verificar si email ya existe
  const emailExists = mockUsers.some(u => u.email === userData.email);
  if (emailExists) {
    return {
      success: false,
      error: 'El email ya está registrado'
    };
  }
  
  // Verificar si username ya existe
  const usernameExists = mockUsers.some(u => u.username === userData.username);
  if (usernameExists) {
    return {
      success: false,
      error: 'El nombre de usuario ya está en uso'
    };
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: mockUsers.length + 1,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  return {
    success: true,
    user: userWithoutPassword,
    token: `mock-jwt-token-${newUser.id}`
  };
};

// Funciones para gestión de productos (CRUD)

// Crear producto
export const createProduct = async (productData, userId) => {
  await simulateApiDelay();
  
  const newProduct = {
    id: Math.max(...mockProducts.map(p => p.id)) + 1,
    ...productData,
    userId: userId,
    createdAt: new Date().toISOString()
  };
  
  mockProducts.push(newProduct);
  return {
    success: true,
    product: newProduct
  };
};

// Actualizar producto
export const updateProduct = async (id, productData, userId) => {
  await simulateApiDelay();
  
  const productIndex = mockProducts.findIndex(p => 
    p.id === parseInt(id) && p.userId === userId
  );
  
  if (productIndex === -1) {
    return {
      success: false,
      error: 'Producto no encontrado o no tienes permisos para editarlo'
    };
  }
  
  mockProducts[productIndex] = {
    ...mockProducts[productIndex],
    ...productData
  };
  
  return {
    success: true,
    product: mockProducts[productIndex]
  };
};

// Eliminar producto
export const deleteProduct = async (id, userId) => {
  await simulateApiDelay();
  
  const productIndex = mockProducts.findIndex(p => 
    p.id === parseInt(id) && p.userId === userId
  );
  
  if (productIndex === -1) {
    return {
      success: false,
      error: 'Producto no encontrado o no tienes permisos para eliminarlo'
    };
  }
  
  mockProducts.splice(productIndex, 1);
  return {
    success: true,
    message: 'Producto eliminado correctamente'
  };
};

// Actualizar stock de producto
export const updateProductStock = async (id, newStock) => {
  await simulateApiDelay();
  
  const productIndex = mockProducts.findIndex(p => p.id === parseInt(id));
  
  if (productIndex === -1) {
    return {
      success: false,
      error: 'Producto no encontrado'
    };
  }
  
  if (newStock < 0) {
    return {
      success: false,
      error: 'El stock no puede ser negativo'
    };
  }
  
  mockProducts[productIndex].stock = newStock;
  
  return {
    success: true,
    product: mockProducts[productIndex]
  };
};