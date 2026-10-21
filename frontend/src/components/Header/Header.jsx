import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.svg";

function Header({ isLoggedIn, userEmail, onSignOut }) {
  const { pathname } = useLocation();

  return (
    <header className="header page__section">
      <img
        src={logo}
        alt="Around the U.S logo"
        className="logo header__logo"
      />
      <nav className="header__nav">
        {isLoggedIn ? (
          <>
            <p className="header__email">{userEmail}</p>
            <button
              type="button"
              className="header__button"
              onClick={onSignOut}
            >
              Sair
            </button>
          </>
        ) : pathname === "/signup" ? (
          <Link to="/signin" className="header__link">
            Faça o login
          </Link>
        ) : (
          <Link to="/signup" className="header__link">
            Inscrever-se
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;