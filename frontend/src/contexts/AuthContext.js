import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(
      `${API_BASE}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    await checkAuth();
    return response.data;
  };

  const register = async (email, password, role) => {
    const response = await axios.post(
      `${API_BASE}/auth/register`,
      { email, password, role },
      { withCredentials: true }
    );
    await checkAuth();
    return response.data;
  };

  const logout = async () => {
    await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
