import { BASE_URL } from "./auth";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
    this._token = "";
  }

  setToken(token) {
    this._token = token;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Erro: ${res.status}`);
  }

  _headers() {
    return { authorization: `Bearer ${this._token}` };
  }

  _jsonHeaders() {
    return { ...this._headers(), "Content-Type": "application/json" };
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._jsonHeaders(),
      body: JSON.stringify({ name, about }),
    }).then(this._checkResponse);
  }

  editAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._jsonHeaders(),
      body: JSON.stringify({ avatar }),
    }).then(this._checkResponse);
  }

  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._jsonHeaders(),
      body: JSON.stringify({ name, link }),
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._headers(),
    }).then(this._checkResponse);
  }
}

const api = new Api({ baseUrl: BASE_URL });

export default api;