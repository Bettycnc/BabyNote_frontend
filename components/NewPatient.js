import styles from "../styles/NewPatient.module.css";
import { useEffect, useState } from "react";

const NewPatientPage = () => {
  const [signUpLastname, setSignUpLastname] = useState("");
  const [signUpMotherName, setSignUpMotherName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpRoom, setSignUpRoom] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastname: signUpLastname,
        motherName: signUpMotherName,
        username: signUpUsername,
        room: signUpRoom,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("click", data);
        if (!data.result) {
          setError(data.error);
        } else {
          setError("");
          console.log("changement de page");
          window.location.href = "/"; //A MODIFIER QUAND PAGE LISTE PATIENTE SERVICE EST FAITE
        }
      });
  };

  return (
    <div className={styles.container}>
      <span className={styles.h4}>Ajouter un patiente</span>
      <p className={styles.error}>{error}</p>
      <input
        type="text"
        placeholder="Nom de famille*"
        id="signUpLastname"
        onChange={(e) => setSignUpLastname(e.target.value)}
        value={signUpLastname}
      />
      <input
        type="text"
        placeholder="Prénom de la mère*"
        id="signUpMotherName"
        onChange={(e) => setSignUpMotherName(e.target.value)}
        value={signUpMotherName}
      />
      <input
        type="text"
        placeholder="Nom d'utilisateur*"
        id="signUpUsername"
        onChange={(e) => setSignUpUsername(e.target.value)}
        value={signUpUsername}
      />
      <input
        type="text"
        placeholder="Numéro de chambre*"
        id="signUpRoom"
        onChange={(e) => setSignUpRoom(e.target.value)}
        value={signUpRoom}
      />
      <button className={styles.button} onClick={() => handleAdd()}>
        Ajouter la patiente
      </button>
    </div>
  );
};

export default NewPatientPage;
