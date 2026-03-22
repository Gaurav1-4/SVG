import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, isMockMode } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMockMode) {
      // Auto-login or simulate logged out state for mock mode
      const storedAuth = localStorage.getItem('mockAdminAuth');
      if (storedAuth === 'true') {
        setCurrentUser({ email: 'admin@trtraders.com', uid: 'mock-uid' });
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (isMockMode) {
      // Accept any demo login or specific one
      if (email === 'admin@trtraders.com' && password === 'admin123') {
        localStorage.setItem('mockAdminAuth', 'true');
        setCurrentUser({ email, uid: 'mock-uid' });
        return;
      }
      throw new Error('Invalid mock credentials. Use admin@trtraders.com / admin123');
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (isMockMode) {
      localStorage.removeItem('mockAdminAuth');
      setCurrentUser(null);
      return;
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
