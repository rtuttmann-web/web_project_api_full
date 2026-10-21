import successIcon from "../../images/success.svg";
import failIcon from "../../images/fail.svg";

export default function InfoTooltip({ isOpen, isSuccess, onClose }) {
  if (!isOpen) {
    return null;
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="popup" onClick={handleOverlayClick}>
      <div className="popup__content info-tooltip">
        <button
          aria-label="Fechar"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        <img
          className="info-tooltip__icon"
          src={isSuccess ? successIcon : failIcon}
          alt={isSuccess ? "Sucesso" : "Erro"}
        />
        <p className="info-tooltip__text">
          {isSuccess ? (
            "Vitória! Você precisa se registrar."
          ) : (
            <>
              Ops, algo saiu deu errado!
              <br />
              Por favor, tente novamente.
            </>
          )}
        </p>
      </div>
    </div>
  );
}