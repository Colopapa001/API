let cart = [];

export const getCart = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cart);
    }, 500);
  });
};

export const addToCart = (product, quantity = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      
      resolve(cart);
    }, 500);
  });
};

export const removeFromCart = (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      cart = cart.filter(item => item.id !== productId);
      resolve(cart);
    }, 500);
  });
};

export const updateQuantity = (productId, quantity) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = cart.find(item => item.id === productId);
      if (item) {
        if (quantity <= 0) {
          cart = cart.filter(item => item.id !== productId);
        } else {
          item.quantity = quantity;
        }
        resolve(cart);
      } else {
        reject(new Error('Product not found in cart'));
      }
    }, 500);
  });
};

export const clearCart = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      cart = [];
      resolve(cart);
    }, 500);
  });
};
