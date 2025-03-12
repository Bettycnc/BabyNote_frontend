import styles from "../styles/PatientCard.module.css";
import React from "react";
import moment from "moment";

const PatientCard = (props) => {
  //formatage de la date avec moment pour n'avoir que l'heure
  const formatedLastMaj = moment(props.date).format("dddd Do à HH:mm");
  const dateNow = moment(Date.now());
  const lastDate = moment(props.date);
  //calculer la différence de temps en minutes entre la dernière Maj et l'heure actuelle
  const passedMinutes = (dateNow - lastDate) / 1000 / 60;

  //----------conditions pour afficher les alertes-----------
  let iconAlert = "";

  let styleBorderAlert = {
    backgroundColor: "#FFFFFF",
    height: "100%",
    width: "10px",
    borderRadius: "5px 0 0 5px",
  };

  if (passedMinutes > 360) {
    styleBorderAlert.backgroundColor = "#E84A4A";
    iconAlert = <img src="/urgent.svg" alt="Alert" className={styles.icon} />;
  } else if (passedMinutes > 240) {
    styleBorderAlert.backgroundColor = "#E8B34A";
    iconAlert = <img src="/warning.svg" alt="Alert" className={styles.icon} />;
  }

  //----------afficher dernière mise à jour-------------------
  let majDate = "";
  if (formatedLastMaj === "Invalid date") {
    majDate = <p className={styles.maj}>Pas de donnée enregistrée</p>;
  } else {
    majDate = (
      <p className={styles.maj}>Dernière mise à jour : {formatedLastMaj}</p>
    );
  }
  
  return (
    <div className={styles.card}>
      <button className={styles.buttonPatient} onClick={props.selectPatient}>
        <div style={styleBorderAlert}> </div>
        <div className={styles.text}>
          <p className={styles.title}>
            Chambre {props.room} -
            <span className={styles.name}> Mme {props.lastname}</span>
          </p>
          <p className={styles.babyName}>Bébé: {props.name}</p>
          {majDate}
        </div>
        {iconAlert}
      </button>
    </div>
  );
};

export default PatientCard;
