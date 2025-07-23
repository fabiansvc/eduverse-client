/**
 * @fileOverview This file contains the Logout component, which allows users to log out of the application.
 * It uses the AuthContext to access the logout function.
 */

import { useAuth } from "../../context/AuthContext";
import { TbLogout } from "react-icons/tb";
import "./styles-logout.css";

/**
 * Logout component.
 * Renders a button to log out the user.
 * 
 * @component
 * @returns {JSX.Element} The JSX element containing the logout button.
 */
export default function Logout () {
  const auth = useAuth();

  /**
   * Handles the logout action.
   * Calls the logout function from the AuthContext and redirects to the home page.
   */
  const handleLogout = () => {
    auth.logout();
    window.location.href = "/"; // Redirect to the home page
  };

  return (
    <div className="container-logout">
      <button
        type="button"
        role="button"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="button-logout"
        onClick={handleLogout}
      >
        <TbLogout className="icon-logout" />
      </button>
    </div>
  );
};