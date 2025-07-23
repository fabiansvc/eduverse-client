import { useEffect, useRef } from "react";
import { editUser } from "../../../../../../../db/user-collection";
import { useUser } from "../../../../../../../context/UserContext";

/**
 * Component for editing user data.
 * @returns {JSX.Element} The JSX.Element for editing user data.
 */
export default function FormEditUser () {
  const { user, setUser } = useUser();
  const nicknameInputRef = useRef(null);
  const biographyInputRef = useRef(null);
  const { type } = user;

  /**
   * Function to handle editing user data.
   * @param {Event} e - The event object.
   * @param {Object} user - The user object.
   */
  const handleEdit = async (e, user) => {
    e.preventDefault();
    if (type !== "guest") {
      await editUser(user.email, user)
        .then(() => {
          alert("Datos actualizados correctamente");
        })
        .catch((error) => {
          console.log(error, "Error al actualizar los datos");
        });
    } else {
      window.localStorage.setItem("user", JSON.stringify(user));
      alert("Datos actualizados correctamente");
    }
  };

  useEffect(() => {
    nicknameInputRef.current.value = user.nickname;
    biographyInputRef.current.value = user.biography ? user.biography : "";
  }, [user.nickname, user.biography]);

  return (
    <div className="container-form-edit-user">
      <div className="card-form-edit">
        <form className="form-edit" onSubmit={(e) => handleEdit(e, user)}>
          <section className="section-form">
            <div className="container-icon-user">
              <img className="icon-user" src={user.avatarPng} alt="user" />
            </div>
            <div>
              <label className="form-label" htmlFor="nicknameUser">
                Nickname
                <span className="required-value">*</span>
              </label>
              <input
                ref={nicknameInputRef}
                id="nicknameUser"
                name="nicknameUser"
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
          </section>
          <button
            type="submit"
            className="button-edit"
            disabled={!user.nickname}
          >
            Editar datos
          </button>
        </form>
      </div>
    </div>
  );
}
