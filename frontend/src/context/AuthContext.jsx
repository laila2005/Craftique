import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('craftique_token') || null);
  const [role, setRole] = useState(localStorage.getItem('craftique_role') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('craftique_user')) || null);

  const login = (userData, userToken, userRole) => {
    setToken(userToken);
    setRole(userRole);
    setUser(userData);
    localStorage.setItem('craftique_token', userToken);
    localStorage.setItem('craftique_role', userRole);
    localStorage.setItem('craftique_user', JSON.stringify(userData));
    
    // Set axios default auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('craftique_token');
    localStorage.removeItem('craftique_role');
    localStorage.removeItem('craftique_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
