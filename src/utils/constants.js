// Configuración del carrito
export const CART_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 50000,
  SHIPPING_COST: 5000,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99
};

// Estados de la orden
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Variantes de botones
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DANGER: 'danger'
};

// Tamaños de componentes
export const COMPONENT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  INVALID_PRODUCT: 'Producto inválido',
  NO_STOCK: 'Producto sin stock',
  INSUFFICIENT_STOCK: 'Stock insuficiente',
  CART_EMPTY: 'El carrito está vacío',
  INVALID_QUANTITY: 'La cantidad debe ser mayor a 0',
  PRODUCT_UNAVAILABLE: 'El producto ya no está disponible'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'Producto agregado al carrito',
  REMOVED_FROM_CART: 'Producto removido del carrito',
  QUANTITY_UPDATED: 'Cantidad actualizada',
  CART_CLEARED: 'Carrito vaciado'
};
