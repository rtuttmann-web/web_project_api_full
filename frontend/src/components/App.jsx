import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import InfoTooltip from "./InfoTooltip/InfoTooltip";
import api from "../utils/api";
import * as auth from "../utils/auth";
import { setToken, getToken, removeToken } from "../utils/token";
import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  const navigate = useNavigate();

  // Verifica se há um JWT ao montar o App
  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      setIsTokenChecked(true);
      return;
    }

    auth
      .checkToken(jwt)
      .then(({ data }) => {
        setUserEmail(data.email);
        setIsLoggedIn(true);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsTokenChecked(true));
  }, []);

  // Dados do usuário e cartões: carregados quando o usuário entra
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((error) => console.error(error));

    api
      .getInitialCards()
      .then((cardsData) => {
        setCards(cardsData);
      })
      .catch((error) => console.error(error));
  }, [isLoggedIn]);

  function handleRegister({ email, password }) {
    auth
      .register(email, password)
      .then(() => {
        setIsSuccess(true);
        setIsInfoTooltipOpen(true);
        navigate("/signin");
      })
      .catch((error) => {
        console.error(error);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleLogin({ email, password }) {
    if (!email || !password) {
      return;
    }

    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          setUserEmail(email);
          setIsLoggedIn(true);
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleSignOut() {
    removeToken();
    setIsLoggedIn(false);
    setUserEmail("");
    setCurrentUser(null);
    setCards([]);
    navigate("/signin");
  }

  function handleCloseInfoTooltip() {
    setIsInfoTooltipOpen(false);
  }

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  const handleUpdateUser = (data) => {
    api
      .editUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateAvatar = (data) => {
    api
      .editAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  async function handleCardLike(card) {
    const isLiked = card.isLiked;

    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((error) => console.error(error));
  }

  async function handleCardDelete(card) {
    await api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })
      .catch((error) => console.error(error));
  }

  function handleAddPlaceSubmit(data) {
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  }

  if (!isTokenChecked) {
    return null;
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="page__content">
        <Header
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onSignOut={handleSignOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <>
                  <Main
                    popup={popup}
                    onOpenPopup={handleOpenPopup}
                    onClosePopup={handleClosePopup}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    onAddPlaceSubmit={handleAddPlaceSubmit}
                  />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
        </Routes>
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          isSuccess={isSuccess}
          onClose={handleCloseInfoTooltip}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;