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
          window.location.href = "/listPatient"; //A MODIFIER QUAND PAGE LISTE PATIENTE SERVICE EST FAITE
        }
      });
  };

  return (
    <div className={styles.container}>
      <span className={styles.h4}>Connexion</span>
      <p className={styles.error}>{error}</p>
      <input
        type="text"
        placeholder="Nom d'utilisateur*"
        id="signinUsername"
        onChange={(e) => setSigninUsername(e.target.value)}
        value={signinUsername}
      />
      <input
        type="password"
        placeholder="Mot de Passe*"
        id="signinPassword"
        onChange={(e) => setSigninPassword(e.target.value)}
        value={signinPassword}
      />
      <button className={styles.button} onClick={() => handleConnect()}>
        Connexion
      </button>
      {/* test affichage reducer */}
      Bienvenue {user.motherName} !
    </div>
  );
};

export default ConnectionParentPage;
