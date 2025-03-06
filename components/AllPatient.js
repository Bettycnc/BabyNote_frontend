import styles from "../styles/AllPatient.module.css";
import React, { useEffect, useState } from "react";
import HeaderPro from "./HeaderPro";
import SearchBar from "./SearchBar";
import PatientCard from "./PatientCard";
import "moment/locale/fr";

const Patient = () => {
  const [allBabies, setAllBabies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/baby")
      .then((response) => response.json())
      .then((data) => {
        setAllBabies(data.filteredData);
      });
  }, []);

  console.log(allBabies);

  const patient = allBabies.map((data, i) => {
    //------récupérer la date de la dernière mise à jours ---------
    const weights = data.weight_id; // Liste des objets poids
    // Récupérer la date du dernier poids enregistré
    const lastWeightDate =
      weights.length > 0 ? weights[weights.length - 1].date : null;

    const temperatures = data.temperature_id; // Liste des objets température
    // Récupérer la date de derniere température enregistré
    const lastTemperatureDate =
      temperatures.length > 0
        ? temperatures[temperatures.length - 1].date
        : null;

    const eliminations = data.elimination_id; // Liste des objets elimination
    // Récupérer la date de derniere elimination enregistrée
    const lastEliminationDate =
      eliminations.length > 0
        ? eliminations[eliminations.length - 1].date
        : null;

    const cares = data.care_id; // Liste des objets care
    // Récupérer la date du dernier soin enregistré
    const lastCareDate = cares.length > 0 ? cares[cares.length - 1].date : null;

    const alimentations = data.alimentation_id; // Liste des objets alimentation
    // Récupérer la date du dernier repas enregistré
    const lastAlimentationDate =
      alimentations.length > 0
        ? alimentations[alimentations.length - 1].date
        : null;
    //tri des dernière Maj de chaque événement
    const lastHours = [];
    lastHours.push(
      lastCareDate,
      lastAlimentationDate,
      lastEliminationDate,
      lastTemperatureDate,
      lastWeightDate
    );
    lastHours.sort(); //Tri
    // on récupère la dernière date
    const lastMaj =
      lastHours.length > 0 ? lastHours[lastHours.length - 1] : null;

    return (
      <PatientCard
        key={i}
        name={data.name}
        room={data.user_id.room}
        lastname={data.user_id.lastname}
        date={lastMaj}
      />
    );
  });

  let noPatient = "";
  if (allBabies.length < 1) {
    noPatient = "Pas de patiente dans le service";
  }

  return (
    <div className={styles.container}>
      <HeaderPro />
      <SearchBar />
      <div className={styles.cardContainer}>{patient}</div>
      <p>{noPatient}</p>
    </div>
  );
};

export default Patient;
