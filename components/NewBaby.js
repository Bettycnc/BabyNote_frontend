import styles from "../styles/NewBaby.module.css";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import selecteur de date MUI
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { frFR } from "@mui/x-date-pickers/locales";
// import Modal from '@mui/material/Modal';
import { Box, Modal } from "@mui/material";
import Link from "next/link";
import { setBabies } from "../reducers/user";
//import date en français
import "moment/locale/fr";
import { Camera } from "react-camera-pro";

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
  const [isTakePictureModalVisible, setIsTakePictureModalVisible] =
    useState(false);
  const [isModalGallerieVisible, setIsModalGallerieVisible] = useState(false);
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState();
  const[fileOrPhoto, setFileOrPhoto] = useState("");
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const addPhoto = () => {
    setIsModalPhotoVisible(!isModalPhotoVisible);
  };

  function handleUploadImg(e) {
    const formData = new FormData();
    formData.append('photoFromFront', e.target.files[0]
     );

     fetch('http://localhost:3000/baby/uploadfile', {
      method: 'POST',
      body: formData,
     }).then((response) => response.json())
      .then((data) => {
        setUrl(data.url);
     });
  }

 const cameraRef = useRef(null);
 
 // Fonction pour prendre une photo et l'envoyer au back
  const takePhoto = async () =>{
    console.log("photo");
    const photo = camera.current?.takePhoto();
    
    setImage(camera.current.takePhoto());
		const formData  = new FormData();
	
		formData.append('photoFromFront', photo);
		console.log(formData);
		fetch('http://localhost:3000/baby/upload', {
		 method: 'POST',
		 body: JSON.stringify({photo}),
     headers: {"content-type": "application/JSON"}
		}).then((response) => response.json())
		 .then((data) => {
      setUrl(data.url);
      console.log(data.url)
			//dispatch(addPhoto(data.url))
		});

  }

  const showTakePicture = () => {
    setIsModalPhotoVisible(!isModalPhotoVisible);
    setIsTakePictureModalVisible(!isTakePictureModalVisible);
  };

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

  //requete vers le Backend pour créer UN ou plusieurs bébé bébé dans BDD
  const addBabies = () => {
    if (displayBaby2) {
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
    } else {
      console.log(fileOrPhoto);
      fetch("http://localhost:3000/baby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: babyName,
          birthday,
          birthWeight: weight,
          user_id: user._id,
          picture: url,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("click", data);
          if (!data.result) {
            setError(data.error);
          } else {
            setError("");
            dispatch(setBabies([{
                  name: data.baby.name,
                  _id: data.baby._id,
                  birthWeight : data.baby.birthWeight,
                  picture: data.baby.picture,
                }]));
            window.location.href = "/babyTab";
          }
        });
    }
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
        onClose={addPhoto}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ width: 100, height: 100 }}>
          <button onClick={() => addPhoto()} className={styles.closeModaleBtn}>X</button>
         
          <button onClick={() => showTakePicture()} className={styles.btnModalePhoto}> 
            <img src="/cameraImg.svg" alt="camera" className={styles.cameraImg}></img>
          Prendre une photo</button>
        
           
            <label for="gallerie" id="labelGallerie" className={styles.labelGallerie}>
            <span>Ajouter depuis la gallerie</span></label>
          <input type="file"  id="gallerie" name="gallerie" className={styles.gallerieBtn} onChange={handleUploadImg}/>
          {/* <img src={file}/> */}
          
         
          
        </Box>
      </Modal>
      <Modal
        open={isTakePictureModalVisible}
        onClose={showTakePicture}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ width: 100, height: 100 }} className={styles.box}>
          <button
            className={styles.takePictureBtn}
            onClick={()=> takePhoto()}
          >
            <img src="/cameraImg.svg" alt="camera"></img>
            Take photo
          </button>
          <Camera ref={camera} className={styles.cameraFrame}></Camera>
          <img src={image} alt="Taken photo" />
        </Box>
      </Modal>


        <button className={styles.button} onClick={() => addBabies()}>
          Valider
        </button>
    </div>
  );
};

export default NewBaby;
