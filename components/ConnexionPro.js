import { useState } from "react";
import styles from "../styles/ConnexionPro.module.css";
import Link from "next/link";


const ConnexionPro = () => {
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [error, setError] = useState("");

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
          //dispatch(login({ username: signInUsername, token: data.token })); Je ne comprends pas à quoi sert cette ligne
          setSignInUsername("");
          setSignInPassword("");

          setError("");
          console.log(data);
          window.location.href = "/listPatient";
          // Ajouter le lien vers la liste des patientes
        } else {
          setError(data.error);
        }
      });
  };

 
    

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

          <input
            type="password"
            className={styles.input}
            placeholder="Mot de passe*"
            id="signInPassword"
            onChange={(e) => setSignInPassword(e.target.value)}
            value={signInPassword}
          />
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
         <button className={styles.buttonLight}>
        Créer un compte
         </button>
        </Link>

      </div>
    </div>
  );
};

export default ConnexionPro;
