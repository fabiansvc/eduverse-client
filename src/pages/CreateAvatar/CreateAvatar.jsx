/**
 * Component for creating an avatar.
 * This component provides functionality to create an avatar using the Ready Player Me SDK.
 * Users can customize their avatars and save them to their profiles.
 */
import "./styles-create-avatar.css";
import { AvatarCreatorViewer } from "@readyplayerme/rpm-react-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
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
  const { email } = auth.userLogged;
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state;
  const readyPlayerMeSubdomain = import.meta.env.VITE_READY_PLAYER_ME_SUBDOMAIN;

  /**
   * Handles the event when the avatar is exported.
   * @param {string} avatarUrl The avatarUrl of the exported avatar.
   */
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

  const configPropertiesAvatar = {
    clearCache: true,
    bodyType: "fullbody",
    quickStart: false,
    language: "es",
    textureFormat: "webp",
  };

  return (
    <div className="container-avatar-creator-viewer">
      <AvatarCreatorViewer
        subdomain={readyPlayerMeSubdomain}
        editorConfig={configPropertiesAvatar}
        onAvatarExported={handleOnAvatarExported}
      />
    </div>
  );
};

export default CreateAvatar;
