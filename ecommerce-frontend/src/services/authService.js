import { api, ENDPOINTS } from './apiConfig';

export const login = async (usernameOrEmail, password) => {
  try {
    // Use the proper authentication endpoint
    const response = await api.post(ENDPOINTS.AUTH + '/login', {
      usernameOrEmail: usernameOrEmail, // Backend expects usernameOrEmail
      password
    }, false); // Don't require auth for login
    
    // Store JWT token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role
      }));
    }
    
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
      token: response.token,
      expiresAt: response.expiresAt
    };
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Use the proper authentication endpoint
    const response = await api.post(ENDPOINTS.AUTH + '/register', userData, false); // Don't require auth for register
    
    // Store JWT token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role
      }));
    }
    
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
      token: response.token,
      expiresAt: response.expiresAt
    };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const logout = () => {
  // Remove token and user data from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

export const updateProfile = async (userId, userData) => {
  try {
    // Actualizar usuario
    const updatedUser = await api.put(ENDPOINTS.USERS, userId, userData);
    
    // Devolver usuario sin contraseña
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    console.error(`Error updating user with id ${userId}:`, error);
    throw error;
  }
};
