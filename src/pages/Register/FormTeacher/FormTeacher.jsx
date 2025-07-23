import { useNavigate } from "react-router-dom";
import { createUser } from "../../../db/user-collection";
import { useState, useCallback } from "react";
import AtentionSchedule from "./AtentionSchedule/AtentionSchedule";
import { useAuth } from "../../../context/AuthContext";
import TitleEISC from "../../../components/TitleEISC/TitleEISC";

/**
 * FormTeacher component
 * @returns {JSX.Element} FormTeacher component
 */
export default function FormTeacher() {
  const auth = useAuth();
  const { displayName, email, photoURL } = auth.userLogged;
  const navigate = useNavigate();
  const [section, setSection] = useState(1);
  const [valuesTeacher, setValuesTeacher] = useState({
    email,
    name: displayName,
    photoURL,
    nickname: "",
    biography: "",
    avatarUrl: "",
    avatarPng: "",
    isTeacher: true,
    firstTime: true,
    attention_schedule: [
      {
        day: "",
        start: "",
        end: "",
      },
    ],
  });

  /**
   * Saves teacher data
   * @param {Event} e - Form submit event
   */
  const saveDataTeacher = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await createUser(valuesTeacher);
      if (result.success) {
        navigate("/create-avatar", { state: "user" });
      } else {
        alert("Error al guardar los datos");
      }
    },
    [valuesTeacher, navigate]
  );

  /**
   * Handles adding a new attention schedule
   */
  const handleAddNewAtentionSchedule = useCallback(() => {
    setValuesTeacher((prevValues) => ({
      ...prevValues,
      attention_schedule: [
        ...prevValues.attention_schedule,
        {
          day: "",
          start: "",
          end: "",
        },
      ],
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setValuesTeacher((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  const handleRemoveSchedule = useCallback((index) => {
    setValuesTeacher((prevValues) => ({
      ...prevValues,
      attention_schedule: prevValues.attention_schedule.filter(
        (_, i) => i !== index
      ),
    }));
  }, []);

  return (
    <form className="form-register" onSubmit={saveDataTeacher}>
      <TitleEISC />
      <h3 style={{ textAlign: "center" }}>Registro datos docente</h3>
      {section === 1 && (
        <section className="section-form">
          <div>
            <label className="form-label" htmlFor="nicknameTeacher">
              Nickname
              <span className="required-value">*</span>
            </label>
            <input
              id="nicknameTeacher"
              name="nickname"
              type="text"
              placeholder="Escribe tu nickname"
              className="form-input"
              required
              onChange={handleInputChange}
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
              placeholder="Describete quién eres"
              className="form-input"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="moreInfoTeacher">
              Más información
            </label>
            <input
              id="moreInfoTeacher"
              name="more_info"
              type="text"
              placeholder="Ingresa más información de interés"
              className="form-input"
              onChange={handleInputChange}
            />
          </div>
          <button
            type="button"
            role="button"
            className="button"
            onClick={() => setSection(2)}
          >
            Siguiente
          </button>
        </section>
      )}
      {section === 2 && (
        <>
          <span className="form-label">Ingrese sus horarios de atención:</span>
          <div className="atention-schedule-container">
            <div className="atention-schedule">
              {valuesTeacher.attention_schedule.map((atention, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AtentionSchedule
                    valuesTeacher={valuesTeacher}
                    setValuesTeacher={setValuesTeacher}
                    count={index}
                  />
                  <button
                    type="button"
                    className="button-delete-atention-schedule"
                    onClick={() => handleRemoveSchedule(index)}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              role="button"
              className="button-add-new-atention-schedule"
              aria-label="Agregar horario de atención"
              title="Agregar un nuevo horario de atención"
              onClick={handleAddNewAtentionSchedule}
            >
              +
            </button>
          </div>
          <div className="container-button">
            <button
              type="button"
              role="button"
              className="button"
              onClick={() => setSection(1)}
            >
              Anterior
            </button>
            <button type="submit" className="button-submit">
              Guardar datos
            </button>
          </div>
        </>
      )}
    </form>
  );
}
