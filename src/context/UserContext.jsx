/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const userContext = createContext();

/**
 * Custom hook to access user context.
 * @returns {Object} User context
 */
export const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    console.error("useUser must be used within a UserProvider");
  }
  return context;
};

/**
 * User provider component to manage user state.
 * @param {Object} children The child components of the application
 * @returns {JSX.Element} JSX element representing the user provider
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
