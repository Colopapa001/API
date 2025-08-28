import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loginUser, registerUser, mockUsers } from '../utils/mockData';
import { validateEmail, validatePassword, token } from '../utils/helpers';

// Estados de autenticación
const INITIAL_STATE = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  loginAttempts: 0
};

// Tipos de acciones
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  RESTORE_SESSION: 'RESTORE_SESSION',
  INCREMENT_LOGIN_ATTEMPTS: 'INCREMENT_LOGIN_ATTEMPTS'
};

// Reducer de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
    case AUTH_ACTIONS.REGISTER_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        loginAttempts: action.type === AUTH_ACTIONS.LOGIN_ERROR ? state.loginAttempts + 1 : state.loginAttempts
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        loginAttempts: 0
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.INCREMENT_LOGIN_ATTEMPTS:
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1
      };

    default:
      return state;
  }
};

// Crear el contexto
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  // Restaurar sesión al cargar la aplicación
  useEffect(() => {
    const restoreSession = () => {
      try {
        const sessionToken = token.get();
        if (sessionToken && !token.isExpired(sessionToken)) {
          // En una app real, verificarías el token con el backend
          // Aquí simulamos encontrar el usuario por token
          const userData = JSON.parse(localStorage.getItem('userData'));
          if (userData) {
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: { user: userData }
            });
            return;
          }
        }
        
        // Si no hay token válido, cerrar sesión
        token.remove();
        localStorage.removeItem('userData');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      } catch (error) {
        console.error('Error restaurando sesión:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    restoreSession();
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      // Validar email y password
      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(`Contraseña inválida: ${passwordValidation.errors}`);
      }

      // Intentar login con datos mock
      const result = await loginUser(email, password);
      
      if (result.success) {
        // Generar token mock (en producción vendría del backend)
        const mockToken = `mock-jwt-token-${Date.now()}-${result.user.id}`;
        
        // Guardar token y datos del usuario
        token.set(mockToken);
        localStorage.setItem('userData', JSON.stringify(result.user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user }
        });

        return { success: true, user: result.user };
      } else {
       throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      // Validar datos del usuario
      const { username, email, password, confirmPassword, firstName, lastName } = userData;

      if (!username || username.length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
      }

      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(`Contraseña inválida: ${passwordValidation.errors}`);
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (!firstName || !lastName) {
        throw new Error('Nombre y apellido son requeridos');
      }

      // Intentar registro con datos mock
      const result = await registerUser(userData);
      
      if (result.success) {
        // Generar token mock
        const mockToken = `mock-jwt-token-${Date.now()}-${result.user.id}`;
        
        // Guardar token y datos del usuario
        token.set(mockToken);
        localStorage.setItem('userData', JSON.stringify(result.user));

        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: { user: result.user }
        });

        return { success: true, user: result.user };
      } else {
       throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar usuario';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = () => {
    token.remove();
    localStorage.removeItem('userData');
    localStorage.removeItem('cartItems'); // Limpiar carrito también
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Login rápido para desarrollo (usuarios mock)
  const quickLogin = async (userType = 'juan') => {
    const users = {
      juan: { email: 'juan@email.com', password: 'Password123' },
      maria: { email: 'maria@email.com', password: 'Password123' }
    };

    const user = users[userType];
    if (user) {
      return await login(user.email, user.password);
    }
    return { success: false, error: 'Usuario mock no encontrado' };
  };

  // Verificar si el usuario está bloqueado por intentos fallidos
  const isBlocked = () => {
    return state.loginAttempts >= 5;
  };

  // Actualizar perfil de usuario
  const updateProfile = (updatedData) => {
    try {
      const updatedUser = { ...state.user, ...updatedData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      dispatch({
        type: AUTH_ACTIONS.RESTORE_SESSION,
        payload: { user: updatedUser }
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Error actualizando perfil' };
    }
  };

  // Valor del contexto
  const contextValue = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    loginAttempts: state.loginAttempts,

    // Funciones
    login,
    register,
    logout,
    clearError,
    quickLogin,
    updateProfile,

    // Utilidades
    isBlocked: isBlocked(),
    mockUsers, // Para desarrollo
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;