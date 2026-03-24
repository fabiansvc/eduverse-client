/**
 * Component for creating an avatar.
 * This component provides functionality to create an avatar using the Ready Player Me SDK.
 * Users can customize their avatars and save them to their profiles.
 */
import "./styles-create-avatar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState, useRef } from "react";
import { editUser, getUser } from "../../db/user-collection";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

/**
 * Functional component for creating an avatar.
 * @returns {JSX.Element} The avatar creation interface.
 */
const CreateAvatar = () => {
  const auth = useAuth();
  const { setUser } = useUser();
  const { email } = auth.userLogged || {};
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state;

  const [authToken, setAuthToken] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const iframeRef = useRef(null);

  const clientId = "client_anpPYo3lziQF3PuoEXpn8FJluVj1";
  const clientSecret = "1NzP7swcHY9YgaLMF6ZPQACpf3sr9oUB";
  const userId = email || "guest_user";
  const userName = email || "Guest";

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const response = await fetch(
          "https://us-central1-streamoji-265f4.cloudfunctions.net/getAuthToken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Client-Secret": clientSecret,
              "Client-Id": clientId,
            },
            body: JSON.stringify({ userId, userName }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setAuthToken(data.authToken);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchAuthToken();
  }, [clientId, clientSecret, userId, userName]);

  useEffect(() => {
    if (authToken) {
      setIframeUrl(
        `https://avatars.streamoji.com/createAvatar?iframe=true&bodyType=Full&token=${authToken}`
      );
    }
  }, [authToken]);

  /**
   * Saves the avatar avatarUrl to the user's profile.
   */
  const saveAvatarUser = useCallback(
    async (avatarUrl, email) => {
      const user = await getUser(email);
      if (user.success) {
        const newData = {
          ...user.data[0],
          avatarUrl: avatarUrl,
          avatarPng: avatarUrl.replace(".glb", ".png"),
        };

        const result = await editUser(email, newData);
        if (result.success) {
          setUser({
            ...user.data[0],
            avatarUrl: avatarUrl,
            avatarPng: avatarUrl.replace(".glb", ".png"),
          });
          navigate("/metaverse", { state: "user" });
        } else {
          alert("Error creating avatar, please try again.");
        }
      }
    },
    [setUser, navigate]
  );

  /**
   * Sets the guest avatar avatarUrl in local storage.
   */
  const setAvatarGuest = useCallback(
    (avatarUrl) => {

      window.localStorage.setItem("avatarUrl", avatarUrl);
      window.localStorage.setItem(
        "avatarPng",
        avatarUrl.replace(".glb", ".png")
      );
      navigate("/metaverse", { state: "guest" });
    },
    [navigate]
  );

  useEffect(() => {
    const handleOnAvatarExported = (avatarUrl) => {
      switch (type) {
        case "user":
          saveAvatarUser(avatarUrl, email);
          break;
        case "guest":
          setAvatarGuest(avatarUrl);
          break;
        default:
          break;
      }
    };

    const subscribe = (event) => {
      try {
        const json = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (json?.source !== "streamojiavatars") return;

        if (json.eventName === "v1.frame.ready" && iframeRef.current) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              target: "streamojiavatars",
              type: "subscribe",
              eventName: "v1.**",
            }),
            "*"
          );
        }
        if (json.eventName === "v1.avatar.exported") {
          const url = json.data.url;
          handleOnAvatarExported(url);
        }
      } catch (error) {
        // Ignored unparsable messages
      }
    };

    window.addEventListener("message", subscribe);
    return () => window.removeEventListener("message", subscribe);
  }, [type, email, saveAvatarUser, setAvatarGuest]);

  return (
    <div className="container-avatar-creator-viewer">
      {iframeUrl ? (
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          className="frame"
          allow="camera *; microphone *; clipboard-write"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <p style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          Loading Avatar Creator...
        </p>
      )}
    </div>
  );
};

export default CreateAvatar;
