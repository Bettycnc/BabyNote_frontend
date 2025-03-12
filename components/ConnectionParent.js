import styles from "../styles/ConnectionParent.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBabies } from "../reducers/user";
import { login } from "../reducers/user";
import Link from "next/link";

const ConnectionParentPage = () => {
  const [signinUsername, setSigninUsername] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value); //test de l'affichage du reducer
  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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
          const userId = data.data._id;

          //MAJ du reducer user
          dispatch(
            login({
              token: data.data.token,
              username: data.data.username,
              motherName: data.data.motherName,
              _id: data.data._id,
            })
          );
          //si le parent est associé à un bébé dans la BDD alors redirection vers page tableau de bord sinon redirection vers ajoutter un bébé
          fetch(`http://localhost:3000/baby/redirection/${userId}`)
            .then((response) => response.json())
            .then((dataBaby) => {
              console.log("dataBaby : ", dataBaby);
              if (dataBaby.result) {
                console.log("go to baby Tab");
                dispatch(
                  setBabies([
                    {
                      name: dataBaby.name,
                      _id: dataBaby._id,
                      birthWeight: dataBaby.birthWeight,
                    },
                  ])
                );
                window.location.href = "/babyTab";
              } else {
                console.log("go to ajout bébé");
                window.location.href = "/addBaby";
              }
            });
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
          <div className={styles.inputPasswordContainer}>
            <input
              type={passwordVisible ? "text" : "password"}
              className={styles.inputPassword}
              placeholder="Mot de Passe*"
              id="signinPassword"
              onChange={(e) => setSigninPassword(e.target.value)}
              value={signinPassword}
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
        <button className={styles.button} onClick={() => handleConnect()}>
          Connexion
        </button>
      </div>
    </div>
  );
};

export default ConnectionParentPage;
