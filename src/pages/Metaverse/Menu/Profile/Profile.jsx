import "./styles-profile.css";
import EditAvatar from "./components/EditAvatar/EditAvatar";
import EditDataUser from "./components/EditUser/EditDataUser";

/**
 * Profile Component
 * @component
 * @description Renders the user's profile information and provides options to edit the avatar and user data.
 * @returns {JSX.Element} Profile component
 */
export default function Profile () {
  return (
    <div className="container-profile">
      <div className="card-profile">
        <EditAvatar />
        <div className="vertical-separator" />
        <EditDataUser />
      </div>
    </div>
  );
}
