import { useState, useEffect } from "react";
import { fetchStreamojiToken } from "../services/streamoji-token";

/**
 * Custom hook to obtain a fresh Streamoji session token on component mount.
 * This ensures that GLB models can be loaded without 401 Unauthorized errors 
 * due to expired tokens in the original URL.
 * 
 * @param {string} userId - Optional user identifier
 * @param {string} userName - Optional user name
 * @returns {string|null} The resolved token, or null while loading/on error
 */
export const useStreamojiToken = (userId, userName) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    fetchStreamojiToken(userId, userName).then((fetchedToken) => {
      if (mounted) {
        setToken(fetchedToken);
      }
    });

    return () => {
      mounted = false;
    };
  }, [userId, userName]);

  return token;
};
