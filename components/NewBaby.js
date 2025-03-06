import styles from "../styles/NewBaby.module.css";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import selecteur de date MUI
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { frFR } from "@mui/x-date-pickers/locales";
// import Modal from '@mui/material/Modal';
import { Box, Modal } from "@mui/material";
//import date en français
import "moment/locale/fr";

const NewBaby = () => {
  const [error, setError] = useState("");
  const [babyName, setBabyName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [weight, setWeight] = useState("");
  const [babyName2, setBabyName2] = useState("");
  const [birthday2, setBirthday2] = useState("");
  const [weight2, setWeight2] = useState("");
  const [displayCtaAddChild, setDisplayCtaAddChild] = useState(true);
  const [displayBaby2, setDisplayBaby2] = useState(false);

  
  const [isModalPhotoVisible, setIsModalPhotoVisible] = useState(false);

  const user = useSelector((state) => state.user.value);

  const addPhoto = () => {
    setIsModalPhotoVisible(!isModalPhotoVisible)
  };

  console.log("prénom : ", babyName, "date: ", birthday, " poids : ", weight);
  console.log(
    "prénom2 : ",
    babyName2,
    "date2: ",
    birthday2,
    " poids2 : ",
    weight2
  );

  const ctaAddChild = "";

  if (displayCtaAddChild) {
    ctaAddChild = (
      <button className={styles.delete} onClick={() => addChild()}>
        {" "}
        + ajouter un enfant
      </button>
    );
  } else {
    ctaAddChild = "";
  }

  //requete vers le Backend pour créer UN bébé dans BDD
  const addBabies = () => {
    const arrDataBaby = [
      {
        name: babyName,
        birthday,
        birthWeight: weight,
        user_id: user._id,
      },
      {
        name: babyName2,
        birthday: birthday2,
        birthWeight: weight2,
        user_id: user._id,
      },
    ];

    fetch("http://localhost:3000/baby/babies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arrDataBaby),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("click", data);
        if (!data.result) {
          setError(data.error);
        } else {
          setError("");
          console.log("changement de page");
        }
      });
  };

  const addChild = () => {
    setDisplayBaby2(true);
    setDisplayCtaAddChild(false);
  };
  // supression de la card de 2e bébé
  const deleteChild = () => {
    //supression de la card du 2e bébé
    setDisplayBaby2(false);
    //affichage du btn ajouter un enfant
    setDisplayCtaAddChild(true);
  };

  const baby2 = "";

  if (!displayBaby2) {
    baby2 = "";
  } else {
    baby2 = (
      <div className={styles.card}>
        <div className={styles.containerTitleInput}>
          <div className={styles.headerCard}>
            <p className={styles.h4}>Mon 2e bébé</p>
            <button className={styles.delete} onClick={() => deleteChild()}>
              X
            </button>
          </div>
          <p className={styles.error}>{error}</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Prénom*"
            id="BabyName2"
            onChange={(e) => setBabyName2(e.target.value)}
            value={babyName2}
          />
          <input
            type="number"
            max="9999"
            className={styles.input}
            placeholder="Poids de naissance (g)*"
            id="weight2"
            onChange={(e) => setWeight2(e.target.value)}
            value={weight2}
          />
          {/* selecteur de date */}
          <LocalizationProvider
            localeText={
              frFR.components.MuiLocalizationProvider.defaultProps.localeText
            }
            dateAdapter={AdapterMoment}
          >
            <DatePicker
              onChange={(value) => setBirthday2(value)}
              className={styles.date}
              label="Date de naissance"
            />
          </LocalizationProvider>
        </div>
        <button className={styles.button} onClick={() => addPhoto()}>
          Ajouter une photo
        </button>
      </div>
    );
  }

  // // ajout d'une 2e card bébé
  // const addChild = () => {
  //   //suppression du btn ajouter un enfant
  //   setCtaNewChild("");
  //   setChild(
  //     <div className={styles.card}>
  //       <div className={styles.containerTitleInput}>
  //         <div className={styles.headerCard}>
  //           <p className={styles.h4}>Mon 2e bébé</p>
  //           <button className={styles.delete} onClick={() => deleteChild()}>
  //             X
  //           </button>
  //         </div>
  //         <p className={styles.error}>{error}</p>
  //         <input
  //           type="text"
  //           className={styles.input}
  //           placeholder="Prénom*"
  //           id="BabyName2"
  //           onChange={(e) => setBabyName2(e.target.value)}
  //           value={babyName2}
  //         />
  //         <input
  //           type="number"
  //           max="9999"
  //           className={styles.input}
  //           placeholder="Poids de naissance (g)*"
  //           id="weight2"
  //           onChange={(e) => setWeight2(e.target.value)}
  //           value={weight2}
  //         />
  //         {/* selecteur de date */}
  //         <LocalizationProvider
  //           localeText={
  //             frFR.components.MuiLocalizationProvider.defaultProps.localeText
  //           }
  //           dateAdapter={AdapterMoment}
  //         >
  //           <DatePicker
  //             onChange={(value) => setBirthday2(value)}
  //             className={styles.date}
  //             label="Date de naissance"
  //           />
  //         </LocalizationProvider>
  //       </div>
  //       <button className={styles.button} onClick={() => addPhoto()}>
  //         Ajouter une photo
  //       </button>
  //     </div>
  //   );
  // };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.containerTitleInput}>
          <span className={styles.h4}>Mon bébé</span>
          <p className={styles.error}>{error}</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Prénom*"
            id="BabyName"
            onChange={(e) => setBabyName(e.target.value)}
            value={babyName}
          />
          <input
            type="number"
            max="9999"
            className={styles.input}
            placeholder="Poids de naissance (g)*"
            id="weight"
            onChange={(e) => setWeight(e.target.value)}
            value={weight}
          />
          {/* selecteur de date */}
          <LocalizationProvider
            localeText={
              frFR.components.MuiLocalizationProvider.defaultProps.localeText
            }
            dateAdapter={AdapterMoment}
          >
            <DatePicker
              onChange={(value) => setBirthday(value)}
              className={styles.date}
              label="Date de naissance"
            />
          </LocalizationProvider>
        </div>
        <button className={styles.button} onClick={() => addPhoto()}>
          Ajouter une photo
        </button>
      </div>
      {baby2}
      {ctaAddChild}
    {/* Ajout d'une modale pour prendre ou ajouter une photo du bébé */}
      <Modal
  open={isModalPhotoVisible}
  onClose={!isModalPhotoVisible}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box 
  sx={{width: 100, height: 100}}
  >
    <button onClick={()=>addPhoto()}>X</button>
    <button 
    //onClick={CameraCapture}
    >
    Prendre une photo
    </button>
    <button>
    Ajouter depuis la galerie
    </button>
  </Box>
</Modal>


      <p> + ajouter un enfant</p>
      <button className={styles.button} onClick={() => addBabies()}>
        Valider
      </button>
    </div>
  );
};

export default NewBaby;
