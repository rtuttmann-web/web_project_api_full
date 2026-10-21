import { useContext } from "react";
import ImagePopup from "../ImagePopup/ImagePopup";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Card(props) {
  const { card, handleOpenPopup, onCardLike, onCardDelete } = props;
  const { name, link } = card;
  const { currentUser } = useContext(CurrentUserContext);

  const ownerId =
    typeof card.owner === "string" ? card.owner : card.owner?._id;
  const isOwn = currentUser && ownerId === currentUser._id;
  const isLiked = card.isLiked;

  const imageComponent = { children: <ImagePopup card={card} /> };

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={() => handleOpenPopup(imageComponent)}
      />
      {isOwn && (
        <button
          aria-label="Delete card"
          className="card__delete-button"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Like card"
          type="button"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        />
      </div>
    </li>
  );
}