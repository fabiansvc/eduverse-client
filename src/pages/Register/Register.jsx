import "./styles-register.css";
import { useEffect, useState, useCallback } from "react";
import { getTeacher } from "../../db/teachers-collection";
import FormUser from "./FormUser/FormUser";
import FormTeacher from "./FormTeacher/FormTeacher";
import { useLocation } from "react-router-dom";
import Logout from "../../components/Logout/Logout";
import { useAuth } from "../../context/AuthContext";
import FormGuest from "./FormGuest/FormGuest";

/**
 * Register component
 * @returns {JSX.Element} Register component
 */
export default function Register() {
  const auth = useAuth();
  const location = useLocation();
  const [flagTypeForm, setFlagTypeForm] = useState("");
  const [loading, setLoading] = useState(true);
  const { email } = auth.userLogged;
  const type = location.state;

  /**
   * Fetches teacher information based on the provided email
   * @param {string} email - User email
   */
  const formTypeUser = useCallback(async (email) => {
    if (email) {
      const result = await getTeacher(email);
      setFlagTypeForm(result.type);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (type !== "guest") {
      formTypeUser(email);
    } else {
      setFlagTypeForm("guest");
      setLoading(false);
    }
  }, [email, type, formTypeUser]);

  if (loading) {
    return <div className="container-register">Loading...</div>;
  }

  return (
    <div className="container-register">
      <Logout />
      <div className="card-form-register">
        {flagTypeForm === "user" && <FormUser />}
        {flagTypeForm === "teacher" && <FormTeacher />}
        {flagTypeForm === "guest" && <FormGuest />}
      </div>
    </div>
  );
}
