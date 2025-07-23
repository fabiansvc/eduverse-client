/**
 * Component for logging in as a guest user.
 * This component provides a form for logging in as a guest user, which allows limited access to the application.
 * If the guest user is new, it redirects them to the registration page; otherwise, it navigates them to the metaverse.
 */
import "./styles-guest-login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

/**
 * Functional component for logging in as a guest user.
 * @returns {JSX.Element} The guest login form.
 */
export default function GuestLogin () {
  const navigate = useNavigate();
  const { setUserLogged } = useAuth();

  /**
   * Checks if the guest user is new and redirects them to the appropriate page.
   */
  const isNewGuest = () => {
    const guest = window.localStorage.getItem("avatarUrl");
    !guest
      ? navigate("/register-user", { state: "guest" })
      : navigate("/metaverse", { state: "guest" });
  };

  /**
   * Handles the login process for a guest user.
   * @param {Event} e The click event object.
   */
  const handleLoginGuestUser = (e) => {
    e.preventDefault();
    setUserLogged("guest");
    isNewGuest();
  };

  return (
    <form className="form-login" onSubmit={(e) => handleLoginGuestUser(e)}>
      <span className="span-form-title">Accede como usuario invitado</span>
      <img
        className="user-guest-icon"
        src={"./assets/login/guest.png"}
        alt="User guest"
      />
      <button type="submit" className="button-guest-login">
        Inicia como invitado
      </button>
    </form>
  );
}
