import { mockProducts } from '../utils/mockData';

export const getAllProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 1000);
  });
};

export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const product = mockProducts.find(p => p.id === numericId);
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
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      const userProducts = mockProducts.filter(p => p.userId === numericUserId);
      resolve(userProducts);
    }, 1000);
  });
};

export const addProduct = (productData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = {
        id: mockProducts.length + 1,
        ...productData,
        createdAt: new Date().toISOString(),
      };
      mockProducts.push(newProduct);
      resolve(newProduct);
    }, 1000);
  });
};

export const updateProduct = (productId, productData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      const index = mockProducts.findIndex(p => p.id === numericProductId);
      if (index !== -1) {
        mockProducts[index] = {
          ...mockProducts[index],
          ...productData,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockProducts[index]);
      } else {
        reject(new Error('Product not found'));
      }
    }, 1000);
  });
};

export const deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      const index = mockProducts.findIndex(p => p.id === numericProductId);
      if (index !== -1) {
        const deletedProduct = mockProducts.splice(index, 1)[0];
        resolve(deletedProduct);
      } else {
        reject(new Error('Product not found'));
      }
    }, 1000);
  });
};
