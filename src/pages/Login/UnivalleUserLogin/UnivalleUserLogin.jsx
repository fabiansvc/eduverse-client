/**
 * Component for logging in with a Univalle user account.
 * This component provides a form for logging in with a Univalle user account using Google authentication.
 * If the login is successful, it navigates the user to the appropriate page based on their account status.
 */
import "./styles-univalle-user-login.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUser } from "../../../db/user-collection";
import { useState } from "react";

/**
 * Functional component for logging in with a Univalle user account.
 * @returns {JSX.Element} The Univalle user login form.
 */
export default function UnivalleUserLogin() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(true);

  /**
   * Checks if the logged-in user is a new user and redirects them to the appropriate page.
   * @param {string} email The email address of the logged-in user.
   */
  const isNewUser = async (email) => {
    const user = await getUser(email);
    if (!user.success) {
      navigate("/register-user", { state: "user" });
    } else if (user.data[0].avatarUrl === "") {
      navigate("/create-avatar", { state: "user" });
    } else {
      navigate("/metaverse", { state: "user" });
    }
  };

  /**
   * Handles the login process for a Univalle user.
   * @param {Event} e The click event object.
   */
  const handleLoginUserUnivalle = async (e) => {
    e.preventDefault();
    const result = await auth.loginWithGoogle();

    if (result.success) {
      isNewUser(result.data.user.email);
    } else {
      setLoginSuccess(false);
    }
  };

  return (
    <form className="form-login">
      <span className="span-form-title">
        Accede usando tu cuenta institucional
      </span>
      <img
        className="institutional-card"
        src={"./assets/login/institutional_card.png"}
        alt="Institutional Card"
      />
      <button
        className="button-login"
        onClick={(e) => handleLoginUserUnivalle(e)}
      >
        <FcGoogle className="icon-google" />
      </button>
      {!loginSuccess && (
        <p className="error-login">
          {"El dominio debe ser @correounivalle.edu.co"}
        </p>
      )}
    </form>
  );
}
