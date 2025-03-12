import { useState } from "react";
import styles from "../styles/ConnexionPro.module.css";
import Link from "next/link";
import { login } from "../reducers/userPro";
import { useDispatch, useSelector } from "react-redux";

const ConnexionPro = () => {
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConnection = () => {
    fetch("http://localhost:3000/pros/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setSignInUsername("");
          setSignInPassword("");

          setError("");
          dispatch(
            login({
              token: data.token,
              username: data.data.username,
              _id: data.data._id,
            })
          );
          window.location.href = "/listPatient";
        } else {
          setError(data.error);
        }
      });
  };

  let iconVisible = "/eye-regular.svg";
  passwordVisible
    ? (iconVisible = "/eye-slash-regular.svg")
    : (iconVisible = "/eye-regular.svg");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.containerTitleInput}>
          <p className={styles.h4}>Connexion</p>
          <p className={styles.error}>{error}</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Nom d'utilisateur*"
            id="signInUsername"
            onChange={(e) => setSignInUsername(e.target.value)}
            value={signInUsername}
          />

          <div className={styles.inputPasswordContainer}>
            <input
              type={passwordVisible ? "text" : "password"}
              className={styles.inputPassword}
              placeholder="Mot de Passe*"
              id="signinPassword"
              onChange={(e) => setSignInPassword(e.target.value)}
              value={signInPassword}
            />
            <button
              className={styles.btnVisiblePassword}
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label="Toggle password visibility"
            >
              <img src={iconVisible} alt="Alert" className={styles.icon} />
            </button>
          </div>
        </div>
        <button
          className={styles.button}
          id="connection"
          onClick={() => handleConnection()}
        >
          Connexion
        </button>

        <p className={styles.textSmall}>Pas encore de compte ?</p>

        <Link href="/inscriptionPro">
          <button className={styles.buttonLight}>Créer un compte</button>
        </Link>
      </div>
    </div>
  );
};

export default ConnexionPro;
