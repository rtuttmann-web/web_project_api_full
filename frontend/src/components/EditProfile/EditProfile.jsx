import { useState, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState(currentUser?.name ?? "");
  const [description, setDescription] = useState(currentUser?.about ?? "");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
  event.preventDefault();
  handleUpdateUser({ name, about: description });
};

  return (
    <form
      className="popup__form"
      id="edit-profile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_type_name"
        name="name"
        placeholder="Nome"
        type="text"
        required
        minLength="2"
        maxLength="40"
        value={name}
        onChange={handleNameChange}
      />
      <span className="popup__input-error name-input-error"></span>
      <input
        className="popup__input popup__input_type_description"
        name="description"
        placeholder="Sobre mim"
        type="text"
        required
        minLength="2"
        maxLength="200"
        value={description}
        onChange={handleDescriptionChange}
      />
      <span className="popup__input-error description-input-error"></span>
      <button className="button popup__button" type="submit">
        Salvar
      </button>
    </form>
  );
}