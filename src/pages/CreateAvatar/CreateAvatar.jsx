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
import { fetchStreamojiToken } from "../../services/streamoji-token";

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

  const userId = email || "guest_user";
  const userName = email || "Guest";

  useEffect(() => {
    let mounted = true;
    fetchStreamojiToken(userId, userName).then((token) => {
      if (mounted && token) {
        setAuthToken(token);
      }
    });
    return () => {
      mounted = false;
    };
  }, [userId, userName]);

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
          let url = json.data.url;
          // Strip the token query parameter before saving to ensure URLs don't hardcode expired tokens
          try {
            if (url.includes("streamoji")) {
               const parsedUrl = new URL(url);
               parsedUrl.searchParams.delete("token");
               url = parsedUrl.toString();
            }
          } catch (error) {}
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
