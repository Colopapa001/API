import { users } from '../utils/mockData';

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const register = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        reject(new Error('User already exists'));
      } else {
        const newUser = {
          id: users.length + 1,
          ...userData,
        };
        users.push(newUser);
        const { password, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }
    }, 1000);
  });
};

export const updateProfile = (userId, userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...userData,
        };
        const { password, ...userWithoutPassword } = users[userIndex];
        resolve(userWithoutPassword);
      } else {
        reject(new Error('User not found'));
      }
    }, 1000);
  });
};
