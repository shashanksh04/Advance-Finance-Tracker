import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/profileApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('access_token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
