import { useRef, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function EditAvatar() {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    handleUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <form
      className="popup__form"
      id="avatar-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <input
        ref={avatarRef}
        className="popup__input popup__input_type_avatar"
        name="avatar"
        placeholder="https://somewebsite.com/someimage.jpg"
        required
        type="url"
      />
      <span className="popup__input-error avatar-input-error"></span>
      <button className="button popup__button" type="submit">
        Salvar
      </button>
    </form>
  );
}