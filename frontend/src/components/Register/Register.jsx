import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister({ email, password });
  }

  return (
    <div className="auth">
      <h2 className="auth__title">Inscrever-se</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <input
          className="auth__input"
          type="password"
          name="password"
          placeholder="Senha"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button className="auth__button" type="submit">
          Inscrever-se
        </button>
      </form>
      <Link to="/signin" className="auth__link">
        Já é um membro? Faça o login aqui!
      </Link>
    </div>
  );
}