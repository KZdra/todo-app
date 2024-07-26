import { defineStore } from 'pinia';
import { useTodoStore } from './todoStore';
import axios from '@/utils/axios';
import { ref, computed } from 'vue';
import router from '@/router';

interface User {
  id: number;
  name: string;
  email: string;
  // Add any other properties as needed
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null);
  const token = ref<string>(localStorage.getItem('token') || '');
  const todoStore = useTodoStore();

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const clearToken = () => {
    token.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('todo');
    localStorage.removeItem('user')
  };

  const login = async (credentials: { email: string, password: string }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      setToken(response.data.access_token);
      await fetchUser();
      await todoStore.getTodos();
      router.push({ name: 'home' });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: { name: string, email: string, password: string }) => {
    try {
      await axios.post('/api/auth/register', credentials);
      await login(credentials);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      clearToken();
      user.value = null;
      router.push({ name: 'login' });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.post('/api/auth/me', {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      setUser(response.data)
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh', {}, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });
      setToken(response.data.access_token);
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return { user, token, login, register, logout, fetchUser, refreshToken, isAuthenticated };
});
