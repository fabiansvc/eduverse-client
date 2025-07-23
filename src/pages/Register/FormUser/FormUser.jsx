import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import TitleEISC from "../../../components/TitleEISC/TitleEISC";
import { createUser } from "../../../db/user-collection";

/**
 * FormUser component
 * @returns {JSX.Element} FormUser component
 */
export default function FormUser() {
  const auth = useAuth();
  const { displayName, email, photoURL } = auth.userLogged;

  const navigate = useNavigate();
  const [valuesUser, setValuesUser] = useState({});

  useEffect(() => {
    setValuesUser({
      email: email,
      name: displayName,
      photoURL: photoURL,
      nickname: "",
      biography: "",
      avatarUrl: "",
      avatarPng: "",
      isTeacher: false,
      firstTime: true,
    });
  }, [email, displayName, photoURL]);

  /**
   * Saves user data
   * @param {Event} e - Form submit event
   * @param {Object} valuesUser - User data values
   */
  const saveDataUser = async (e, valuesUser) => {
    e.preventDefault();
    const newUser = valuesUser;
    const result = await createUser(newUser);
    result.success
      ? navigate("/create-avatar", { state: "user" })
      : alert("Error al guardar los datos");
  };

  return (
    <form
      className="form-register"
      onSubmit={(e) => saveDataUser(e, valuesUser)}
    >
      <TitleEISC />
      <section className="section-form">
        <h3>Registro datos usuario</h3>
        <div>
          <label className="form-label" htmlFor="nicknameUser">
            Nickname
            <span className="required-value">*</span>
          </label>
          <input
            id="nicknameUser"
            name="nicknameUser"
            type="text"
            placeholder="Escribe tu nickname"
            className="form-input"
            required={true}
            onChange={(e) =>
              setValuesUser({ ...valuesUser, nickname: e.target.value })
            }
          />
        </div>
        <div>
          <label className="form-label" htmlFor="biography">
            Biografía
          </label>
          <input
            id="biography"
            name="biography"
            type="text"
            placeholder="Describe brevemente quién eres"
            className="form-input"
            onChange={(e) =>
              setValuesUser({ ...valuesUser, biography: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="button-submit"
          disabled={
            Object.values(valuesUser)
              .map((value) => value === "")
              .every((value) => value)
              ? true
              : false
          }
        >
          Guardar datos
        </button>
      </section>
    </form>
  );
}
