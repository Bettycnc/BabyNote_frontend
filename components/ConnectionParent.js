import styles from "../styles/ConnectionParent.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";

const ConnectionParentPage = () => {
  const [signinUsername, setSigninUsername] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value); //test de l'affichage du reducer

  const handleConnect = () => {
    // console.log("Utilisateur : ", signinUsername, "MdP : ", signinPassword);
    fetch("http://localhost:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signinUsername,
        password: signinPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("click", data);
        if (!data.result) {
          setError(data.error);
        } else {
          setError("");
          console.log("Ulilisateur connecté !");
          //MAJ du reducer user
          dispatch(
            login({
              token: data.data.token,
              username: data.data.username,
              motherName: data.data.motherName,
            })
          );
          window.location.href = "/"; //A MODIFIER QUAND PAGE ajouter bébé ou tableau de bord bébé SERVICE EST FAITE
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.containerTitleInput}>
          <span className={styles.h4}>Connexion</span>
          <p className={styles.error}>{error}</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Nom d'utilisateur*"
            id="signinUsername"
            onChange={(e) => setSigninUsername(e.target.value)}
            value={signinUsername}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Mot de Passe*"
            id="signinPassword"
            onChange={(e) => setSigninPassword(e.target.value)}
            value={signinPassword}
          />
        </div>
        <button className={styles.button} onClick={() => handleConnect()}>
          Connexion
        </button>
      </div>
    </div>
  );
};

export default ConnectionParentPage;
