// El carrito se maneja en memoria y localStorage, no en json-server
let cart = [];

export const getCart = () => {
  try {
    // Intentar recuperar el carrito desde localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    return Promise.resolve(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return Promise.resolve([]);
  }
};

export const addToCart = (product, quantity = 1) => {
  return new Promise((resolve) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    // Guardar en localStorage
    try {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
    
    resolve(cart);
  });
};

export const removeFromCart = (productId) => {
  return new Promise((resolve) => {
    cart = cart.filter(item => item.id !== productId);
    
    // Guardar en localStorage
    try {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
    
    resolve(cart);
  });
};

export const updateQuantity = (productId, quantity) => {
  return new Promise((resolve, reject) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
      } else {
        item.quantity = quantity;
      }
      
      // Guardar en localStorage
      try {
        localStorage.setItem('cartItems', JSON.stringify(cart));
      } catch (error) {
        console.error('Error al guardar el carrito:', error);
      }
      
      resolve(cart);
    } else {
      reject(new Error('Product not found in cart'));
    }
  });
};

export const clearCart = () => {
  return new Promise((resolve) => {
    cart = [];
    
    // Guardar en localStorage
    try {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
    
    resolve(cart);
  });
};
