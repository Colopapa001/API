// Servicio simple para manejar órdenes en localStorage

const ORDERS_KEY = 'orders';

const readAll = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch {
    return false;
  }
};

export const getAllOrders = async () => {
  return readAll();
};

export const addOrder = async (order) => {
  const orders = readAll();
  orders.push(order);
  writeAll(orders);
  return order;
};

// Extraer el vendedor desde los items del carrito (product.userId)
export const getOrdersBySeller = async (sellerUserId) => {
  const id = parseInt(sellerUserId);
  const orders = readAll();
  return orders.filter(order =>
    Array.isArray(order.items) && order.items.some(it => it.product?.userId === id)
  );
};

export const getLastSaleDateBySeller = async (sellerUserId) => {
  const orders = await getOrdersBySeller(sellerUserId);
  if (orders.length === 0) return null;
  return orders
    .map(o => new Date(o.createdAt))
    .sort((a, b) => b - a)[0]
    .toISOString();
};


