"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    return res;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, googleSignIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
