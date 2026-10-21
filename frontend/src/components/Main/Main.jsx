import { useContext } from "react";
import Popup from "../Popup/Popup";
import NewCard from "../NewCard/NewCard";
import EditProfile from "../EditProfile/EditProfile";
import EditAvatar from "../EditAvatar/EditAvatar";
import Card from "../Card/Card";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Main({
  popup,
  onOpenPopup,
  onClosePopup,
  cards,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = {
    title: "Novo local",
    children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} />,
  };
  const editProfilePopup = { title: "Editar perfil", children: <EditProfile /> };
  const editAvatarPopup = { title: "Alterar a foto do perfil", children: <EditAvatar /> };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__avatar-wrapper">
          <img
            className="profile__image"
            src={currentUser?.avatar}
            alt="Avatar"
          />
          <button
            aria-label="Editar foto de perfil"
            className="profile__avatar-edit-button"
            type="button"
            onClick={() => onOpenPopup(editAvatarPopup)}
          ></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser?.name}</h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={() => onOpenPopup(editProfilePopup)}
          ></button>
          <p className="profile__description">{currentUser?.about}</p>
        </div>
        <button
          aria-label="Adicionar cartão"
          className="profile__add-button"
          type="button"
          onClick={() => onOpenPopup(newCardPopup)}
        ></button>
      </section>
      <section className="cards page__section">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              handleOpenPopup={onOpenPopup}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}