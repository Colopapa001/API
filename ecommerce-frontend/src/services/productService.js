import { products } from '../utils/mockData';

export const getAllProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 1000);
  });
};

export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find(p => p.id === id);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 500);
  });
};

export const getUserProducts = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userProducts = products.filter(p => p.userId === userId);
      resolve(userProducts);
    }, 1000);
  });
};

export const addProduct = (productData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = {
        id: products.length + 1,
        ...productData,
        createdAt: new Date().toISOString(),
      };
      products.push(newProduct);
      resolve(newProduct);
    }, 1000);
  });
};

export const updateProduct = (productId, productData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products[index] = {
          ...products[index],
          ...productData,
          updatedAt: new Date().toISOString(),
        };
        resolve(products[index]);
      } else {
        reject(new Error('Product not found'));
      }
    }, 1000);
  });
};

export const deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        const deletedProduct = products.splice(index, 1)[0];
        resolve(deletedProduct);
      } else {
        reject(new Error('Product not found'));
      }
    }, 1000);
  });
};
