import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // To potentially store user details later
  const [loading, setLoading] = useState(true); // Loading state for initial token check

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // TODO: Optionally fetch user details here using the token
      // For now, we'll assume a token means authenticated
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData = null) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if (userData) {
        setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // While loading, you might render a loading spinner or null
   if (loading) {
       return null; // Or a loading spinner component
   }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 