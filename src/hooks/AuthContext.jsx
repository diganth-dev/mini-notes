import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, getFriendlyAuthErrorMessage } from '../services/firebase';
import { AuthContext } from './authContextDef';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => isFirebaseConfigured && Boolean(auth));

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, displayName) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase configuration missing. Please add your credentials in .env.local.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim(),
        });
        setUser({ ...userCredential.user, displayName: displayName.trim() });
      }
      return userCredential.user;
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error.code, error.message) || error.message;
      throw new Error(message, { cause: error });
    }
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase configuration missing. Please add your credentials in .env.local.');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error.code, error.message) || error.message;
      throw new Error(message, { cause: error });
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isConfigured: isFirebaseConfigured,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
