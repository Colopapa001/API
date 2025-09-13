import { api, ENDPOINTS } from './apiConfig';

// Función para obtener todas las órdenes
export const getAllOrders = async () => {
  try {
    return await api.get(ENDPOINTS.ORDERS);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Función para agregar una nueva orden
export const addOrder = async (order) => {
  try {
    const newOrder = {
      ...order,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    return await api.post(ENDPOINTS.ORDERS, newOrder);
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

// Extraer el vendedor desde los items del carrito (product.userId)
export const getOrdersBySeller = async (sellerUserId) => {
  try {
    const orders = await getAllOrders();
    const id = parseInt(sellerUserId);
    return orders.filter(order =>
      Array.isArray(order.items) && order.items.some(it => it.product?.userId === id)
    );
  } catch (error) {
    console.error(`Error fetching orders for seller ${sellerUserId}:`, error);
    throw error;
  }
};

export const getLastSaleDateBySeller = async (sellerUserId) => {
  try {
    const orders = await getOrdersBySeller(sellerUserId);
    if (orders.length === 0) return null;
    return orders
      .map(o => new Date(o.createdAt))
      .sort((a, b) => b - a)[0]
      .toISOString();
  } catch (error) {
    console.error(`Error getting last sale date for seller ${sellerUserId}:`, error);
    throw error;
  }
};


