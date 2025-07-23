/* eslint-disable react-refresh/only-export-components */

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

/**
 * Custom hook to access authentication context.
 * @returns {Object} Authentication context
 */

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Authentication provider component that wraps the entire application.
 * @param {Object} children The child components of the application
 * @returns {JSX.Element} JSX element representing the authentication provider
 */
export function AuthProvider({ children }) {
  const [userLogged, setUserLogged] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserLogged(currentUser || "");
    });
    return unsubscribe;
  }, []);

  /**
   * Function to log in with Google authentication provider.
   * @returns {Object} Object with success status and data (if successful)
   */
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      // Verifying that the email is @correounivalle.edu.co
      const email = res.user.email;
      if (email.endsWith("@correounivalle.edu.co")) {
        return { success: true, data: res };
      } else {
        // If the email is not @correounivalle.edu.co,
        // log out the user and return an error
        await signOut(auth);
        return { success: false };
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      return { success: false, error: error };
    }
  };

  /**
   * Function to log out the current user.
   * @returns {Object} Object with success status and error (if unsuccessful)
   */
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      return { success: false, error: error };
    }
  };

  return (
    <authContext.Provider
      value={{ loginWithGoogle, logout, userLogged, setUserLogged }}
    >
      {children}
    </authContext.Provider>
  );
}
