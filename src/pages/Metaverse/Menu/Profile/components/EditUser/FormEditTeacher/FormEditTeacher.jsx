import { useEffect, useRef, useCallback } from "react";
import { useUser } from "../../../../../../../context/UserContext";
import { editUser } from "../../../../../../../db/user-collection";
import AtentionSchedule from "../../../../../../Register/FormTeacher/AtentionSchedule/AtentionSchedule";

/**
 * Component for editing teacher's data.
 * @returns {JSX.Element} The JSX.Element for editing teacher's data.
 */
export default function FormEditTeacher() {
  const nicknameInputRef = useRef(null);
  const biographyInputRef = useRef(null);
  const moreInfoInputRef = useRef(null);
  const { user, setUser } = useUser();

  const {
    nickname,
    biography,
    more_info,
    avatarPng,
    email,
    attention_schedule,
  } = user;

  const handleEditTeacherData = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await editUser(email, user);
        alert("Datos actualizados correctamente");
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
      }
    },
    [email, user]
  );

  const handleAddNewAttentionSchedule = useCallback(() => {
    setUser((prevUser) => ({
      ...prevUser,
      attention_schedule: [
        ...prevUser.attention_schedule,
        { day: "", start: "", end: "" },
      ],
    }));
  }, [setUser]);

  useEffect(() => {
    if (nicknameInputRef.current) nicknameInputRef.current.value = nickname;
    if (biographyInputRef.current)
      biographyInputRef.current.value = biography || "";
    if (moreInfoInputRef.current)
      moreInfoInputRef.current.value = more_info || "";
  }, [nickname, biography, more_info]);

  return (
    <div className="container-form-edit-teacher">
      <div className="card-form-edit">
        <form className="form-edit" onSubmit={handleEditTeacherData}>
          <section className="section-form">
            <div className="container-icon-user">
              <img className="icon-user" src={avatarPng} alt="user" />
            </div>
            <div>
              <label className="form-label" htmlFor="nicknameTeacher">
                Nickname <span className="required-value">*</span>
              </label>
              <input
                ref={nicknameInputRef}
                id="nicknameTeacher"
                name="nicknameTeacher"
                type="text"
                className="form-input"
                required
                onChange={(e) => setUser({ ...user, nickname: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="biography">
                Biografía
              </label>
              <input
                ref={biographyInputRef}
                id="biography"
                name="biography"
                type="text"
                className="form-input"
                placeholder="Describe brevemente quién eres"
                onChange={(e) =>
                  setUser({ ...user, biography: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label" htmlFor="moreInfoTeacher">
                Más información
              </label>
              <input
                ref={moreInfoInputRef}
                id="moreInfoTeacher"
                name="moreInfoTeacher"
                type="text"
                className="form-input"
                placeholder="Ingresa más información de interés"
                onChange={(e) =>
                  setUser({ ...user, more_info: e.target.value })
                }
              />
            </div>
          </section>
          <div className="atention-schedule-container">
            <div className="atention-schedule">
              <span className="form-label">
                Ingrese sus horarios de atención:
              </span>
              {attention_schedule.map((attention, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AtentionSchedule
                    valuesTeacher={user}
                    setValuesTeacher={setUser}
                    count={index}
                  />
                  <button
                    type="button"
                    className="button-delete-atention-schedule"
                    onClick={() => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        attention_schedule: prevUser.attention_schedule.filter(
                          (_, i) => i !== index
                        ),
                      }));
                    }}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="button-add-new-atention-schedule"
              aria-label="Agregar horario de atención"
              title="Agregar un nuevo horario de atención"
              onClick={handleAddNewAttentionSchedule}
            >
              +
            </button>
          </div>
          <button type="submit" className="button-edit">
            Editar datos
          </button>
        </form>
      </div>
    </div>
  );
}
