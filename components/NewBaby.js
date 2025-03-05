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
  const [isModalPhotoVisible, setIsModalPhotoVisible] = useState(false);

  const user = useSelector((state) => state.user.value);

  const addPhoto = () => {
    setIsModalPhotoVisible(!isModalPhotoVisible)
  };
  const addBabies = () => {
    console.log("prénom : ", babyName, "date: ", birthday, " poids : ", weight);

    fetch("http://localhost:3000/baby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: babyName,
        birthday,
        birthWeight: weight,
        user_id: user._id,
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
        }
      });
  };

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
            // min="1000"
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
          {/* <input
            type="text"
            className={styles.input}
            placeholder="Date de naissance*"
            id="birthday"
            onChange={(e) => setBirthday(e.target.value)}
            value={birthday}
          /> */}
        </div>
        <button className={styles.button} onClick={() => addPhoto()}>
          Ajouter une photo
        </button>
      </div>
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
