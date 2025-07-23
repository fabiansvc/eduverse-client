/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const avatarContext = createContext();

/**
 * Custom hook to access avatar context.
 * @returns {Object} Avatar context
 */
export const useAvatar = () => {
  const context = useContext(avatarContext);
  if (!context) {
    console.error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};

/**
 * Avatar provider component to manage avatar state.
 * @param {Object} children The child components of the application
 * @returns {JSX.Element} JSX element representing the avatar provider
 */
export function AvatarProvider({ children }) {
  const [avatar, setAvatar] = useState({
    ref: null,
    body: null,
    animation: "Idle",
  });

  return (
    <avatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </avatarContext.Provider>
  );
}
