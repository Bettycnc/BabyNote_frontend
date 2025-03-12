import styles from "../styles/InscriptionPro.module.css";
import { useState } from "react";
import Link from "next/link";
import { login } from "../reducers/userPro";
import { useDispatch, useSelector } from "react-redux";

const InscriptionPro = () => {
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSignUp = () => {
    fetch("http://localhost:3000/pros/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signUpUsername,
        firstName: signUpFirstName,
        lastName: signUpLastName,
        password: signUpPassword,
        confirmPassword: signUpConfirmPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(
          login({
            token: data.token,
            username: data.username,
          })
        );
        if (data.result) {
          setSignUpLastName("");
          setSignUpFirstName("");
          setSignUpUsername("");
          setSignUpPassword("");
          setSignUpConfirmPassword("");

          console.log(data);
          window.location.href = "/listPatient";
          // Ajouter le lien vers la liste des patientes
        } else {
          setError(data.error);

          console.log("cliqué");
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.containerTitleInput}>
          <p className={styles.h4}>Inscription</p>
          <p className={styles.error}>{error}</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Nom de famille"
            id="signUpLastName"
            onChange={(e) => setSignUpLastName(e.target.value)}
            value={signUpLastName}
          />

          <input
            type="text"
            className={styles.input}
            placeholder="Prénom"
            id="signUpFirstName"
            onChange={(e) => setSignUpFirstName(e.target.value)}
            value={signUpFirstName}
          />

          <input
            type="text"
            className={styles.input}
            placeholder="Nom d'utilisateur"
            id="signUpUsername"
            onChange={(e) => setSignUpUsername(e.target.value)}
            value={signUpUsername}
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Mot de passe"
            id="signUpPassword"
            onChange={(e) => setSignUpPassword(e.target.value)}
            value={signUpPassword}
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Confirmer mot de passe"
            id="signUpConfirmPassword"
            onChange={(e) => setSignUpConfirmPassword(e.target.value)}
            value={signUpConfirmPassword}
          />
        </div>

        <button className={styles.button} onClick={handleSignUp}>
          S'enregistrer
        </button>

        <p className={styles.textSmall}>Déjà inscrit ?</p>

        <Link href={"/connexionPro"}>
          <button className={styles.buttonLight}>Me connecter</button>
        </Link>
      </div>
    </div>
  );
};

export default InscriptionPro;
