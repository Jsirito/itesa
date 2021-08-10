import React, { useState, useContext } from "react";
import base from "./../../../base";
import { Link, useHistory, Redirect } from "react-router-dom";
import { AuthContext } from "../../../Auth";
import S from "../styles.module.css";

const LogIn = () => {
  const [message, setMessage] = useState("");
  let [form, setForm] = useState({
    email: "",
    password: "",
  });

  let history = useHistory();

  // hacky but works.
  // history push / after login reidrects here, race condition
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Redirect to="/" />;
  }

  const formSubmit = (e) => {
    e.preventDefault();
    base
      .auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then((data) => {
        setMessage(`Bienvenido ${data.user.displayName}!`);
        // alert(`Bienvenido ${data.user.displayName}!`);
        history.push("/");
      })
      .catch((res) => {
        console.error(res);
        console.log(res);
        switch (res.code.split("/")[1]) {
          case "invalid-email":
            setMessage("Email o contraseña incorrectos");
            break;
          case "wrong-password":
            setMessage("Email o contraseña incorrectos");
            break;
          default:
            setMessage("Ocurrio un error, por favor intentar nuevamente");
        }
      });
  };

  const inputChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className={S.container}>
      <div className={S.h1_wrapper}>
        <h1>INICIA SESIÓN</h1>
      </div>
      <form onSubmit={formSubmit}>
        {message && <div>{message}</div>}
        <input name="email" placeholder="EMAIL" onChange={inputChange} />
        <input
          name="password"
          type="password"
          placeholder="CONTRASEÑA"
          onChange={inputChange}
        />
        <div>
          ¿Has olvidado tu contraseña?
          <a href="/">Recuperar</a>
        </div>
        <input type="submit" value="INGRESAR" />
        <div>
          ¿No tenés cuenta? <Link to="/singup">Registrate</Link>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
