import "./styles-menu.css";
import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { useAuth } from "../../../context/AuthContext";
import Instructive from "../../../components/Instructive/Instructive";
import Profile from "./Profile/Profile";

/**
 * Component for rendering the menu with options like profile, instructive, and logout.
 * @returns {JSX.Element} The JSX.Element containing the menu.
 */
export default function Menu() {
  const auth = useAuth();
  const { user } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showInstructive, setShowInstructive] = useState(false);

  const image = useMemo(
    () => <img className="icon-avatar" src={user.avatarPng} alt="user" />,
    [user.avatarPng]
  );

  const handleMenuClick = useCallback(() => {
    setShowMenu((prev) => !prev);
    setShowProfile(false);
    setShowInstructive(false);
  }, []);

  const handleProfileClick = useCallback(() => {
    setShowProfile((prev) => !prev);
    setShowMenu(false);
    setShowInstructive(false);
  }, []);

  const handleInstructiveClick = useCallback(() => {
    setShowInstructive((prev) => !prev);
    setShowMenu(false);
    setShowProfile(false);
  }, []);

  const handleUserGuide = useCallback(() => {
    window.open(
      "https://correounivalleeduco-my.sharepoint.com/:b:/g/personal/fabian_cordoba_correounivalle_edu_co/EWxr119y8XVKhjggLAUsDGsBLdF2nx1O28pW2Y6q3kHv6g?e=7CePLE",
      "_blank"
    );
  }, []);

  const handleLogout = useCallback(() => {
    auth.logout();
    window.location.href = "/";
  }, [auth]);

  return (
    <>
      <div className="container-menu">
        <div className="menu">
          {!showProfile && !showInstructive && (
            <button
              className="button-avatar"
              type="button"
              role="button"
              onClick={handleMenuClick}
            >
              {image}
            </button>
          )}
          {(showProfile || showInstructive) && (
            <button
              className="button-exit"
              type="button"
              role="button"
              onClick={handleMenuClick}
            >
              x
            </button>
          )}
          {showMenu && !showProfile && !showInstructive && (
            <nav className="menu-nav">
              <ul>
                <li>
                  <Link onClick={handleProfileClick}>Perfil</Link>
                </li>
                <li>
                  <Link onClick={handleInstructiveClick}>Instructivo</Link>
                </li>
                <li>
                  <Link onClick={handleUserGuide}>Manual</Link>
                </li>
                <li>
                  <Link onClick={handleLogout}>Cerrar sesión</Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
      {showProfile && <Profile />}
      {showInstructive && <Instructive />}
    </>
  );
}
