import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // In-memory store for registered users. Wiped completely on page refresh.
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      role: 'volunteer',
      gcId: 'VLT123456',
      pin: '123456',
      name: 'Aniruddha',
      aadhaar: '123412341234',
      phone: '9876543210',
      email: 'volunteer@example.com',
      age: '22',
      location: 'Bangalore',
      interests: ['Environment', 'Education']
    },
    {
      role: 'ngo',
      gcId: 'NGO123456',
      pin: '123456',
      name: 'Global Green Initiative',
      ngoDarpanId: 'NGODARPAN123456789012', // 21 chars compulsorily
      email: 'contact@globalgreen.org',
      headquarters: 'Bangalore',
      website: 'https://globalgreen.org',
      domain: 'Environment',
      pocName: 'Rajesh Kumar',
      pocPhone: '9876543211',
      pocDesignation: 'Director',
      pocEmail: 'rajesh@globalgreen.org'
    },
    {
      role: 'company',
      gcId: 'CPY123456',
      pin: '123456',
      name: 'Tata CSR',
      cin: 'L27020MH1958PLC011107', // 21 chars compulsorily
      email: 'csr@tata.com',
      headquarters: 'Mumbai',
      website: 'https://tata.com',
      industrySector: 'Manufacturing',
      csrFocus: ['Education', 'Environment'],
      pocName: 'Sunita Sharma',
      pocPhone: '9876543212',
      pocDesignation: 'CSR Head',
      pocEmail: 'sunita.sharma@tata.com'
    }
  ]);

  useEffect(() => {
    // Memory-only session: clear localStorage to ensure nothing is persisted across refreshes
    localStorage.removeItem('gladiconnect_user');
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData format: { role: 'ngo' | 'volunteer' | 'company', name: '...', gcId: '...', ... }
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const registerUser = (newUserData) => {
    setRegisteredUsers((prev) => [...prev, newUserData]);
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      
      // Update in registeredUsers list too
      setRegisteredUsers((prevList) =>
        prevList.map((u) => (u.gcId === prev.gcId ? { ...u, ...updatedData } : u))
      );
      
      return nextUser;
    });
  };

  const value = {
    user,
    registeredUsers,
    login,
    logout,
    registerUser,
    updateUserProfile,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
