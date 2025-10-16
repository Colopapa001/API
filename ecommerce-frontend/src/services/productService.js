import { api, ENDPOINTS } from './apiConfig';

export const getAllProducts = async () => {
  try {
    return await api.get(ENDPOINTS.PRODUCTS + '/all', null, null, false);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    return await api.get(ENDPOINTS.PRODUCTS, id);
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const getUserProducts = async (userId) => {
  try {
    return await api.get(ENDPOINTS.PRODUCTS, null, { userId });
  } catch (error) {
    console.error(`Error fetching products for user ${userId}:`, error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const productWithTimestamp = {
      ...productData,
      createdAt: new Date().toISOString(),
    };
    return await api.post(ENDPOINTS.PRODUCTS, productWithTimestamp);
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const updatedData = {
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    return await api.put(ENDPOINTS.PRODUCTS, productId, updatedData);
  } catch (error) {
    console.error(`Error updating product with id ${productId}:`, error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    return await api.delete(ENDPOINTS.PRODUCTS, productId);
  } catch (error) {
    console.error(`Error deleting product with id ${productId}:`, error);
    throw error;
  }
};
