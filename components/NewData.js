import styles from "../styles/NewData.module.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from "@mui/material";
import Modal from '@mui/material/Modal';

const NewData = () => {
    const [baby, setBaby] = useState(null);
    const [selectedTime, setSelectedTime] = useState(dayjs("2022-04-17T17:15"));
    const [showAlim, setShowAlim] = useState(null)
    const [showElim, setShowElim] = useState(null)
    const [showWeight, setShowWeight]= useState(null)
    const [showTemp, setShowTemp]= useState(null)
    const [showCare, setShowCare]= useState(null)
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState(0);


    useEffect(() => {
        fetch(`http://localhost:3000/baby/67c585260e52c1fcadd1a066`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
            });
    }, []);

    console.log(baby)
    if (!baby) {
        return <p>Chargement...</p>;
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handelShowAlim =() => {
        setShowAlim(!showAlim)
    }  

    const handelShowElim =() => {
        setShowElim(!showElim)
    }  

    const handelShowWeight =() => {
        setShowWeight(!showWeight)
    }

    const handelShowTemp =() => {
        setShowTemp(!showTemp)
    }

    const handelShowCare =() => {
        setShowCare(!showCare)
    }
      
    const handleChange = (_, newValue) => {
        setVal(newValue);
      };

//POUR ENREGISTRER L'ALIMENTATION
    
  return (
    <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
            <img className={styles.babyPicture} alt="Photo du bébé" />
            <p className={styles.babyName}>{baby.name}</p>
            <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
        </div>

        {/* Body */}
        <div className={styles.data}>
            <div className={styles.horaireContainer}>
                <p className={styles.titreHeure}>Sélectionner l'heure :</p>
                <div className={styles.horaireInput}>
                    <span className={styles.timePartHour} onClick={() => handleOpen("hour")}>
                    {selectedTime.format("HH")}
                    </span>
                    <span className={styles.separator}>:</span>
                    <span className={styles.timePartMinute} onClick={() => handleOpen("minute")}>
                    {selectedTime.format("mm")}
                    </span>
                </div>
                <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <div className={styles.modal} onClick={(e) => e.target === e.currentTarget && handleClose(false)}>
                        <div className={styles.modalContent}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MultiSectionDigitalClock
                                value={selectedTime}
                                ampm={false}
                                onChange={(newValue) => {
                                setSelectedTime(newValue);
                                }}
                            />
                            </LocalizationProvider>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className={styles.alimContainer}>
                <div className={styles.titreAlim} onClick={handelShowAlim}>
                    <p className={styles.titre}>Alimentation</p>
                    {showAlim !== true ? (
                        <img className={styles.logoTitre} src='/chevronRight.svg'></img>
                    ) : (
                        <img className={styles.logoTitre} src='/chevronBottom.svg'></img>
                    )}
                </div>
                {showAlim === true && (
                    <div className={styles.addDataAlim}>
                        <div className={styles.alimchoice}>
                            <img className={styles.logoAlim} src='/Biberon.svg' ></img>
                            <img className={styles.logoAlim} src='/allaitement.svg'></img>
                        </div>
                        <div >
                            <Box sx={{ width: 300, marginTop: '15px' }}>
                                <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" min={0} max={150} onChange={handleChange}/>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">
                                    0mL
                                </Typography>
                                <Typography 
                                    variant="body2"
                                    sx={{fontWeight: '800', fontSize:'18px' }}>
                                    {val} mL
                                </Typography>
                                <Typography 
                                    variant="body2">
                                    150mL
                                </Typography>
                            </Box>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.elimContainer}>
                <div className={styles.titreElim} onClick={handelShowElim}>
                    <p className={styles.titre}>Elimination</p>
                    {showElim !== true ? (
                        <img className={styles.logoTitre} src='/chevronRight.svg'></img>
                    ) : (
                        <img className={styles.logoTitre} src='/chevronBottom.svg'></img>
                    )}
                </div>
                {showElim === true && (
                    <div>ici ca s'affiche</div>
                )}
            </div>
            <div className={styles.weightContainer}>
                <div className={styles.titreWeight} onClick={handelShowWeight}>
                    <p className={styles.titre}>Poids</p>
                    {showWeight !== true ? (
                        <img className={styles.logoTitre} src='/chevronRight.svg'></img>
                    ) : (
                        <img className={styles.logoTitre} src='/chevronBottom.svg'></img>
                    )}
                </div>
                {showWeight === true && (
                    <div>ici ca s'affiche</div>
                )}
            </div>
            <div className={styles.TempContainer}>
                <div className={styles.titreTemp} onClick={handelShowTemp}>
                    <p className={styles.titre}>Température</p>
                    {showTemp !== true ? (
                        <img className={styles.logoTitre} src='/chevronRight.svg'></img>
                    ) : (
                        <img className={styles.logoTitre} src='/chevronBottom.svg'></img>
                    )}
                </div>
                {showTemp === true && (
                    <div>ici ca s'affiche</div>
                )}
            </div>
            <div className={styles.CareContainer}>
                <div className={styles.titreCare} onClick={handelShowCare}>
                    <p className={styles.titre}>Soins</p>
                    {showCare !== true ? (
                        <img className={styles.logoTitre} src='/chevronRight.svg'></img>
                    ) : (
                        <img className={styles.logoTitre} src='/chevronBottom.svg'></img>
                    )}
                </div>
                {showCare === true && (
                    <div>ici ca s'affiche</div>
                )}
            </div>
            <button className={styles.button}>Valider</button>
        </div>
    </div>
  );
};

export default NewData;
