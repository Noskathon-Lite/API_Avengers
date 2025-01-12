import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContextType, User } from '../types';
// Set base URL for Axios

axios.defaults.baseURL = 'http://127.0.0.1:5000/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Function to fetch authenticated user info
  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get<User>('/api/auth/me');
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      // Store token and set user
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err: any) {
      console.error(err.response?.data?.message || 'Login failed');
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/signup', { name, email, password });
      const { token, user } = response.data;

      // Store token and set user
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err: any) {
      console.error(err.response?.data?.message || 'Signup failed');
      throw new Error(err.response?.data?.message || 'Signup failed');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      localStorage.removeItem('token'); // Remove token from storage
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
