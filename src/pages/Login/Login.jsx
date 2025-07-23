/**
 * Component for rendering the login page of the EISC Metaverse application.
 * This component includes subcomponents for logging in with a Univalle user or as a guest.
 */
import "./styles-login.css";
import TitleEISC from "../../components/TitleEISC/TitleEISC.jsx";
import UnivalleUserLogin from "./UnivalleUserLogin/UnivalleUserLogin.jsx";
import GuestLogin from "./GuestLogin/GuestLogin.jsx";
import Footer from "../../components/Footer/Footer.jsx";

/**
 * Login functional component.
 * @returns {JSX.Element} The login page UI elements.
 */
export default function Login () {
  return (
    // Container for the login page
    <div className="container-login">
      {/* Title of the EISC Metaverse */}
      <TitleEISC />
    
      {/* Login card containing Univalle user login and guest login options */}
      <div className="card-login">
        {/* Component for logging in with a Univalle user */}
        <UnivalleUserLogin />

        {/* Component for logging in as a guest */}
        <GuestLogin />
      </div>
      {/* Component for footer */}
      <Footer />
    </div>
  );
}