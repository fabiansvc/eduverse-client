export const clientId = "client_anpPYo3lziQF3PuoEXpn8FJluVj1";
export const clientSecret = "1NzP7swcHY9YgaLMF6ZPQACpf3sr9oUB";

let cachedTokenPromise = null;

/**
 * Fetches an authentication token to be used with Streamoji Avatar APIs
 * and caches the promise so multiple concurrent calls only trigger one network request.
 * 
 * @param {string} userId - The identifier of the user (e.g. email or "guest_user")
 * @param {string} userName - The name of the user
 * @returns {Promise<string|null>} The auth token, or null on error
 */
export const fetchStreamojiToken = (userId = "guest_user", userName = "Guest") => {
  if (cachedTokenPromise) {
    return cachedTokenPromise;
  }

  cachedTokenPromise = fetch("https://us-central1-streamoji-265f4.cloudfunctions.net/getAuthToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Secret": clientSecret,
      "Client-Id": clientId,
    },
    body: JSON.stringify({ userId, userName }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        return data.authToken;
      }
      throw new Error("Failed to fetch streamoji token");
    })
    .catch((error) => {
      console.error("Error fetching streamoji auth token:", error);
      cachedTokenPromise = null; // Clear cache on error to allow retrying
      return null;
    });

  return cachedTokenPromise;
};
