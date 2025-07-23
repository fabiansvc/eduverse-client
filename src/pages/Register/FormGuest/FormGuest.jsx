import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TitleEISC from "../../../components/TitleEISC/TitleEISC";

/**
 * FormGuest component
 * @returns {JSX.Element} FormGuest component
 */
export default function FormGuest() {
  const navigate = useNavigate();
  const [valuesGuest, setValuesGuest] = useState({
    nickname: "",
    biography: "",
  });

  /**
   * Saves guest data
   * @param {Object} e - Event object
   */
  const saveDataGuest = useCallback(
    (e) => {
      e.preventDefault();
      const { nickname, biography } = valuesGuest;
      window.localStorage.setItem("nickname", nickname);
      window.localStorage.setItem("biography", biography || "");
      window.localStorage.setItem("avatarUrl", "");
      window.localStorage.setItem("avatarPng", "");
      window.localStorage.setItem("isTeacher", false);
      window.localStorage.setItem("firstTime", true);
      navigate("/create-avatar", { state: "guest" });
    },
    [valuesGuest, navigate]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValuesGuest((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  const isSubmitDisabled = !valuesGuest.nickname;

  return (
    <form className="form-register" onSubmit={saveDataGuest}>
      <TitleEISC />
      <h3>Registro datos invitado</h3>
      <section className="section-form">
        <div>
          <label className="form-label" htmlFor="nicknameGuest">
            Nickname
            <span className="required-value">*</span>
          </label>
          <input
            id="nicknameGuest"
            name="nickname"
            type="text"
            placeholder="Escribe tu nickname"
            className="form-input"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="biographyGuest">
            Biografía
          </label>
          <input
            id="biographyGuest"
            name="biography"
            type="text"
            placeholder="Describe brevemente quién eres"
            className="form-input"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="button-submit"
          disabled={isSubmitDisabled}
        >
          Guardar datos
        </button>
      </section>
    </form>
  );
}
