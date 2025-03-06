import styles from "../styles/PatientCard.module.css";
import React from "react";
import moment from "moment";

const PatientCard = (props) => {
  //formatage de la date avec moment pour n'avoir que l'heure
  const formatedLastMaj = moment(props.date).format("HH:mm");
  const dateNow = moment(Date.now());

  let majDate = "";
  if (formatedLastMaj === "Invalid date") {
    majDate = <p className={styles.maj}>Pas d'événement pour le moment</p>;
  } else {
    majDate = (
      <p className={styles.maj}>Dernière mise à jour : {formatedLastMaj}</p>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.borderAlert}> </div>
      <div className={styles.text}>
        <p className={styles.title}>
          Chambre {props.room} -
          <span className={styles.name}> Mme {props.lastname}</span>
        </p>
        <p className={styles.babyName}>Bébé: {props.name}</p>
        {majDate}
      </div>
      <img src="/warning.png" alt="Menu" className={styles.icon} />
    </div>
  );
};

export default PatientCard;
