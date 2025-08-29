import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockProducts } from '../utils/mockData';
import { calculateCartTotal, calculateCartCount, formatPrice } from '../utils/helpers';

// Estado inicial del carrito
const INITIAL_STATE = {
  items: [], // [{ productId, quantity, product }]
  isLoading: false,
  error: null,
  lastUpdated: null
};

// Tipos de acciones
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      let newItems;
      if (existingItem) {
        // Si el producto ya existe, actualizar cantidad
        newItems = state.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es nuevo producto, agregarlo
        newItems = [...state.items, {
          productId: product.id,
          quantity,
          product,
          addedAt: new Date().toISOString()
        }];
      }

      return {
        ...state,
        items: newItems,
        lastUpdated: new Date().toISOString(),
        error: null
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      const newItems = state.items.filter(item => item.productId !== productId);

      return {
        ...state,
        items: newItems,
        lastUpdated: new Date().toISOString(),
        error: null
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        const newItems = state.items.filter(item => item.productId !== productId);
        return {
          ...state,
          items: newItems,
          lastUpdated: new Date().toISOString(),
          error: null
        };
      }

      const newItems = state.items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );

      return {
        ...state,
        items: newItems,
        lastUpdated: new Date().toISOString(),
        error: null
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Crear el contexto
const CartContext = createContext();

// Hook para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Provider del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          
          // Validar que los productos aún existen y actualizar datos
          const validatedItems = cartItems.map(item => {
            const currentProduct = mockProducts.find(p => p.id === item.productId);
            if (currentProduct) {
              return {
                ...item,
                product: currentProduct // Actualizar datos del producto
              };
            }
            return null;
          }).filter(Boolean);

          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: validatedItems });
        } else {
          dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error cargando carrito:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error cargando carrito' });
      }
    };

    loadCartFromStorage();
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (state.lastUpdated) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error guardando carrito:', error);
      }
    }
  }, [state.items, state.lastUpdated]);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    try {
      if (!product || !product.id) {
        throw new Error('Producto inválido');
      }

      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      if (product.stock === 0) {
        throw new Error('Producto sin stock');
      }

      // Verificar stock disponible
      const existingItem = state.items.find(item => item.productId === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const totalQuantity = currentQuantity + quantity;

      if (totalQuantity > product.stock) {
        throw new Error(`Stock insuficiente. Disponible: ${product.stock - currentQuantity}`);
      }

      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: { product, quantity }
      });

      return { success: true, message: 'Producto agregado al carrito' };
    } catch (error) {
      const errorMessage = error.message || 'Error agregando al carrito';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    try {
      if (!productId) {
        throw new Error('ID de producto inválido');
      }

      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM,
        payload: { productId }
      });

      return { success: true, message: 'Producto removido del carrito' };
    } catch (error) {
      const errorMessage = error.message || 'Error removiendo del carrito';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    try {
      if (!productId) {
        throw new Error('ID de producto inválido');
      }

      if (quantity < 0) {
        throw new Error('La cantidad no puede ser negativa');
      }

      // Verificar stock si se está aumentando la cantidad
      if (quantity > 0) {
        const item = state.items.find(item => item.productId === productId);
        if (item && quantity > item.product.stock) {
          throw new Error(`Stock insuficiente. Disponible: ${item.product.stock}`);
        }
      }

      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY,
        payload: { productId, quantity }
      });

      return { success: true, message: 'Cantidad actualizada' };
    } catch (error) {
      const errorMessage = error.message || 'Error actualizando cantidad';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Limpiar carrito
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    return { success: true, message: 'Carrito vaciado' };
  };

  // Limpiar errores
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return state.items.some(item => item.productId === productId);
  };

  // Obtener cantidad de un producto específico en el carrito
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Obtener item completo por productId
  const getCartItem = (productId) => {
    return state.items.find(item => item.productId === productId) || null;
  };

  // Calcular totales del carrito
  const cartTotal = calculateCartTotal(state.items);
  const cartCount = calculateCartCount(state.items);

  // Verificar si el carrito está vacío
  const isEmpty = state.items.length === 0;

  // Obtener resumen del carrito
  const getCartSummary = () => {
    return {
      itemCount: cartCount,
      totalItems: state.items.length,
      subtotal: cartTotal,
      shipping: cartTotal > 50000 ? 0 : 5, // Envío gratis por compras mayores a $50,000
      total: cartTotal + (cartTotal > 50000 ? 0 : 5),
      isEmpty,
      items: state.items
    };
  };

  // Simular proceso de checkout
  const checkout = async (shippingInfo, paymentMethod) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      // Validar que hay items
      if (isEmpty) {
        throw new Error('El carrito está vacío');
      }

      // Validar stock antes del checkout
      for (const item of state.items) {
        const currentProduct = mockProducts.find(p => p.id === item.productId);
        if (!currentProduct) {
          throw new Error(`Producto ${item.product.name} ya no está disponible`);
        }
        if (item.quantity > currentProduct.stock) {
          throw new Error(`Stock insuficiente para ${item.product.name}`);
        }
      }

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular orden exitosa
      const order = {
        id: `order-${Date.now()}`,
        items: [...state.items],
        summary: getCartSummary(),
        shippingInfo,
        paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Persistir orden en localStorage
      try {
        const existing = localStorage.getItem('orders');
        const orders = existing ? JSON.parse(existing) : [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
      } catch (e) {
        console.error('Error guardando orden:', e);
      }

      // Limpiar carrito después del checkout exitoso
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      
      return { success: true, order };
    } catch (error) {
      const errorMessage = error.message || 'Error procesando orden';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Valor del contexto
  const contextValue = {
    // Estado
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,

    // Métricas
    cartTotal,
    cartCount,
    isEmpty,

    // Funciones principales
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearError,

    // Utilidades
    isInCart,
    getItemQuantity,
    getCartItem,
    getCartSummary,
    checkout,

    // Formateo
    formatPrice
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;