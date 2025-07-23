import "./styles-edit-avatar.css";
import { Avatar } from "@readyplayerme/rpm-react-sdk/node_modules/@readyplayerme/visage";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../../../context/UserContext";

/**
 * Component for editing the avatar.
 * @returns {JSX.Element} The JSX.Element for editing the avatar.
 */
export default function EditAvatar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { avatarUrl, gender, type } = user;

  const animationUrl = gender === "male"
    ? "https://readyplayerme.github.io/visage/male-idle.glb"
    : "https://readyplayerme.github.io/visage/female-idle.glb";

  return (
    <div className="container-edit-avatar">
      <Avatar
        className="avatar-view"
        modelSrc={avatarUrl}
        animationSrc={animationUrl}
        cameraInitialDistance={2.5}
        ambientLightColor="#fff5b6"
        ambientLightIntensity={1}
        cameraTarget={1.5}
        dirLightColor="#002aff"
        dirLightIntensity={5}
        environment="hub"
        scale={1}
        spotLightAngle={0.314}
        spotLightColor="#fff5b6"
        spotLightIntensity={0.5}
      />
      <button
        type="button"
        className="button-edit"
        onClick={() => navigate("/create-avatar", { state: type })}
      >
        Editar avatar
      </button>
    </div>
  );
}
