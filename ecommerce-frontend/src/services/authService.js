import { api, ENDPOINTS } from './apiConfig';

export const login = async (email, password) => {
  try {
    // Buscar usuarios con ese email
    const users = await api.get(ENDPOINTS.USERS, null, { email });
    
    // Verificar si existe un usuario con esas credenciales
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Verificar si ya existe un usuario con ese email
    const existingUsers = await api.get(ENDPOINTS.USERS, null, { email: userData.email });
    
    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }
    
    // Crear nuevo usuario
    const newUser = await api.post(ENDPOINTS.USERS, userData);
    
    // Devolver usuario sin contraseña
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
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
