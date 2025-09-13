import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Estado inicial de productos
const INITIAL_STATE = {
  products: [], // Productos almacenados en memoria
  isLoading: false,
  error: null
};

// Tipos de acciones
const PRODUCT_ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer de productos
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        isLoading: false,
        error: null
      };

    case PRODUCT_ACTIONS.ADD_PRODUCT:
      const newProduct = {
        ...action.payload,
        id: `in-memory-${Date.now()}`, // ID único temporal como string
        createdAt: new Date().toISOString()
      };
      
      return {
        ...state,
        products: [...state.products, newProduct],
        error: null
      };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? { ...product, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : product
        ),
        error: null
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
        error: null
      };

    case PRODUCT_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case PRODUCT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Crear contexto
const ProductContext = createContext();

// Hook personalizado para usar el contexto
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe usarse dentro de un ProductProvider');
  }
  return context;
};

// Proveedor del contexto
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, INITIAL_STATE);
  const { user } = useAuth();

  // Cargar productos del sessionStorage al inicializar
  useEffect(() => {
    try {
      const savedProducts = sessionStorage.getItem('inMemoryProducts');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        dispatch({
          type: PRODUCT_ACTIONS.SET_PRODUCTS,
          payload: products
        });
      }
    } catch (error) {
      console.error('Error loading products from sessionStorage:', error);
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: 'Error cargando productos'
      });
    }
  }, []);

  // Guardar productos en sessionStorage cuando cambien
  useEffect(() => {
    try {
      sessionStorage.setItem('inMemoryProducts', JSON.stringify(state.products));
    } catch (error) {
      console.error('Error saving products to sessionStorage:', error);
    }
  }, [state.products]);

  // Función para agregar producto
  const addProduct = (productData) => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const productWithUser = {
        ...productData,
        userId: user.id,
        userName: user.name || user.email
      };

      dispatch({
        type: PRODUCT_ACTIONS.ADD_PRODUCT,
        payload: productWithUser
      });

      return true;
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.message
      });
      return false;
    }
  };

  // Función para actualizar producto
  const updateProduct = (productId, updates) => {
    try {
      const product = state.products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (product.userId !== user?.id) {
        throw new Error('No tienes permisos para editar este producto');
      }

      dispatch({
        type: PRODUCT_ACTIONS.UPDATE_PRODUCT,
        payload: { id: productId, updates }
      });

      return true;
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.message
      });
      return false;
    }
  };

  // Función para eliminar producto
  const deleteProduct = (productId) => {
    try {
      const product = state.products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (product.userId !== user?.id) {
        throw new Error('No tienes permisos para eliminar este producto');
      }

      dispatch({
        type: PRODUCT_ACTIONS.DELETE_PRODUCT,
        payload: productId
      });

      return true;
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.message
      });
      return false;
    }
  };

  // Función para obtener productos del usuario actual
  const getUserProducts = (userId = user?.id) => {
    if (!userId) return [];
    return state.products.filter(product => product.userId === userId);
  };

  // Función para obtener productos de otros usuarios (para mostrar en Home)
  const getOtherUsersProducts = () => {
    if (!user) return state.products;
    return state.products.filter(product => product.userId !== user.id);
  };

  // Función para obtener producto por ID
  const getProductById = (productId) => {
    return state.products.find(product => product.id === productId);
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  };

  // Valor del contexto
  const value = {
    // Estado
    products: state.products,
    isLoading: state.isLoading,
    error: state.error,

    // Funciones
    addProduct,
    updateProduct,
    deleteProduct,
    getUserProducts,
    getOtherUsersProducts,
    getProductById,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};