import styles from "../styles/NewData.module.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { Checkbox, Typography, FormControlLabel, Autocomplete, TextField, Slider, Box, Modal } from "@mui/material";
import {useSelector } from "react-redux";


dayjs.locale('fr')

const NewData = () => {
    const user = useSelector((state) => state.user.value);
    const [baby, setBaby] = useState(null);


    // hook d'état pour l'heure
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const [open, setOpen] = useState(false);

    // hook d'état pour l'alimentation
    const [showAlim, setShowAlim] = useState(null)
    const [activeAlim, setActiveAlim] = useState(false)
    const [valAmount, setValAmount] = useState(0);
    const [complement, setComplement] = useState(false)
    const [complementAmount, setComplementAmount] = useState(0)
    const [complementType, setComplementType] = useState('')
    const [complementMethode, setComplementMethode] = useState('')    
    const [durationAllaitement, setDurationAllaitement] = useState(0)
    const [seinChoice, setSeinChoice] = useState([])

    //hook d'état pour l'élimination
    const [showElim, setShowElim] = useState(null)
    const [urine, setUrine ] = useState(false)
    const [gambling, setGambling] = useState(false)

    //hook d'état pour le poids
    const [showWeight, setShowWeight]= useState(null)
    const [weight, setWeight] = useState('')

    //hook d'état pour la température
    const [showTemp, setShowTemp]= useState(null)
    const [temperature, setTemperature] = useState(null)

    //hook d'état pour les soins
    const [showCare, setShowCare]= useState(null)
    const [bain, setBain] = useState(false)
    const [faceCare, setFaceCare] = useState(false)
    const [cordCare, setCordCare] = useState(false)

    //Récupération des données du bébé actuel
    useEffect(() => {
        fetch(`http://localhost:3000/baby/${user.babies[0]._id}`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
                setWeight(
                    data.data.weight_id && data.data.weight_id.length > 0
                        ? `${data.data.weight_id[data.data.weight_id.length - 1].weight}` 
                        : `${Math.ceil(data.data.birthWeight / 100) * 100}`
                );
            });
    }, []);

    // Si on a pas de bébé choisi la page ne s'affiche pas
    if (!baby) {
        return <p>Chargement...</p>;
    }

    //fonction pour le choix des heures
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    //fonction pour l'alimentation
    const handelShowAlim =() => {
        setShowAlim(!showAlim)
        setComplement(false)
        setSeinChoice('')
    }  

    const handleChangeAmount = (event, newValue) => {
        setValAmount(newValue);
    };

    const handelChangeComplementAmount = (event, newValue) => {
        setComplementAmount(newValue);
    };

    const handelValDuration =(event, newValue) => {
        setDurationAllaitement(newValue)
    }

    const handleSeinChange = (value) => (event) => {
        if (event.target.checked) {
            setSeinChoice([...seinChoice, value]); // Ajoute si coché
        } else {
            setSeinChoice(seinChoice.filter(sein => sein !== value)); // Retire si décoché
        }
    };

    const optionsAlim = ['Lait artificiel', 'Pepticate', 'Lait maternel']
    const optionsMethode =['Sein paille', 'Doigt paille', 'Tétine calma', 'DAL', 'Biberon']
    
    //fonction pour l'élimination
    const handelShowElim =() => {
        setShowElim(!showElim)
        setGambling(false)
        setUrine(false)
    }

    //fonction pour le poids
    const handelShowWeight =() => {
        setShowWeight(!showWeight)
    }

    const handelWeightMore = () => {
        let NewWeight = Number(weight)+50;
        setWeight(`${NewWeight}`)
    }

    const handelWeightLess = () => {
        let NewWeight = Number(weight)-50;
        setWeight(`${NewWeight}`)
    }

    //fonction pour la température
    const handelShowTemp =() => {
        setShowTemp(!showTemp)
    }

    const handelValTemp = (event, newValue) => {
        setTemperature(newValue)
    }

    //fonction pour les soins
    const handelShowCare =() => {
        setShowCare(!showCare)
        setCordCare(false)
        setBain(false)
        setFaceCare(false)
    }
    
//POUR ENREGISTRER LES DONNEES :
    const handelAddData = () => {
        const formattedDate = selectedTime.toISOString();

        // Logique pour enregistrer une alimentation si elle est rempli
        if(activeAlim !== false){
            let data = {
                date: formattedDate,
                breastFeeding: [],
                feedingBottle: []
            };
        
            if (activeAlim === "allaitement") {
        
                let foodSupplement = complement
                    ? [{
                        foodSupplementPresent: true,
                        nameFoodSupplement: complementType,
                        amount: complementAmount,
                        method: complementMethode
                    }]
                    : [];
        
                data.breastFeeding.push({
                    breastFeedingPresent: true,
                    breast: seinChoice,
                    duration: durationAllaitement,
                    foodSupplement
                });
            } 

            else if (activeAlim === "biberon") {
                data.feedingBottle.push({
                    feedingBottlePresent: true,
                    amount: valAmount
                });
            }
        
            fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/alimentation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
        }

        // Logique pour enregistrer une élimination si elle est remplie
        if(urine !== false || gambling !== false){
            let data = {
                date: formattedDate,
                urine: urine,
                gambling:gambling
            }

            fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/elimination`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
        }

        // Logique pour enregistrer le poids si il est rempli
        if( weight !== baby.birthWeight || weight !== baby.weight_id[0].weight){
            let data ={
                date: formattedDate,
                weight: Number(weight)
            }
            fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/weight`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
        }

        // Logique pour enregistrer une température si elle est remplie
        if(temperature !== null){
            let data = {
                date: formattedDate,
                temperature: temperature
            }
            fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/temperature`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
        }

        // Logique pour enregistrer les soins si ils sont remplis
        if(faceCare === true || bain === true ||cordCare=== true){
            let data = {
                date: formattedDate,
                cordCare: cordCare,
                faceCare: faceCare,
                bath: bain,
            }
            fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/care`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
        }
    }
    

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

            {/* Horaire  */}
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

            {/* Alimentation  */}
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
                            <button className={styles.buttonAlim} style={{ opacity: activeAlim === "biberon" ? 1 : 0.2 }} onClick={() => {setActiveAlim('biberon'), setComplement(false), setSeinChoice('')}}> 
                                <img className={styles.logoAlim} src='/Biberon.svg'></img>
                            </button>  
                            <button className={styles.buttonAlim} style={{ opacity: activeAlim === "allaitement" ? 1 : 0.2 }} onClick={() => setActiveAlim('allaitement')}>
                                <img className={styles.logoAlim} src='/allaitement.svg'></img>
                            </button>  
                        </div>
                        {activeAlim === 'biberon' && (
                            <div >
                                <Box sx={{ width: 300, marginTop: '15px' }}>
                                    <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" min={0} max={150} onChange={handleChangeAmount}/>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">
                                        0mL
                                    </Typography>
                                    <Typography 
                                        variant="body2"
                                        sx={{fontWeight: '800', fontSize:'18px' }}>
                                        {valAmount} mL
                                    </Typography>
                                    <Typography 
                                        variant="body2">
                                        150mL
                                    </Typography>
                                </Box>
                            </div>
                        )}
                        {activeAlim === 'allaitement' && (
                            <div>
                                <div className={styles.choixSeins}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                            onChange={handleSeinChange('Droit')}
                                            checked={seinChoice.includes('Droit')}                                            sx={{ 
                                            '& .MuiSvgIcon-root': { fontSize: 50}, 
                                            '&.Mui-checked': {color: '#32738C'}}
                                            }/>
                                        }
                                        label='Sein droit'
                                    >
                                    </FormControlLabel>
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                            onChange={handleSeinChange('Gauche')}
                                            checked={seinChoice.includes('Gauche')}
                                            sx={{ 
                                            '& .MuiSvgIcon-root': { fontSize: 50 }, 
                                            '&.Mui-checked': {color: '#32738C'},
                                            '.Mui-focusVisible &': {
                                            outline: '2px auto rgba(19,124,189,.6)'}
                                        }}/>
                                        }
                                        label='Sein gauche'
                                    ></FormControlLabel>
                                <div className={styles.duration}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                        <Slider sx={{ width: 300 }} defaultValue={0} step={1} aria-label="Default" valueLabelDisplay="auto" min={0} max={60} onChange={handelValDuration}/>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px'  }}>
                                        <Typography variant="body2">
                                            0 min
                                        </Typography>
                                        <Typography 
                                            variant="body2"
                                            sx={{fontWeight: '800', fontSize:'18px' }}>
                                            {durationAllaitement} min
                                        </Typography>
                                        <Typography 
                                            variant="body2">
                                            60 min
                                        </Typography>
                                    </Box>
                                </div>
                                </div>
                                <div className={styles.choixComplement}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                            onChange={() => setComplement(!complement)}
                                            sx={{ 
                                            '& .MuiSvgIcon-root': { fontSize: 50 }, 
                                            '&.Mui-checked': {color: '#32738C'},
                                            '.Mui-focusVisible &': {
                                            outline: '2px auto rgba(19,124,189,.6)'}
                                        }}/>
                                        }
                                        label='Complément'
                                    ></FormControlLabel>
                                {complement === true && (
                                    <div>
                                        <Autocomplete
                                            value={complementType}
                                            onChange={(event, newValue) => {
                                                setComplementType(newValue);
                                            }}
                                            disablePortal
                                            options={optionsAlim}
                                            sx={{ width: 300, marginTop: '10px' }}
                                            renderInput={(params) => <TextField {...params} label="Type de complément" />}
                                        />
                                        <Autocomplete
                                            value={complementMethode}
                                            onChange={(event, newValue) => {
                                                setComplementMethode(newValue);
                                            }}
                                            disablePortal
                                            options={optionsMethode}
                                            sx={{ width: 300, marginTop: '20px' }}
                                            renderInput={(params) => <TextField {...params} label="Méthode d'administration" />}
                                        />
                                        <Box sx={{ width: 300, marginTop: '15px' }}>
                                            <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" min={0} max={150} onChange={handelChangeComplementAmount}/>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">
                                                0mL
                                            </Typography>
                                            <Typography 
                                                variant="body2"
                                                sx={{fontWeight: '800', fontSize:'18px' }}>
                                                {complementAmount} mL
                                            </Typography>
                                            <Typography 
                                                variant="body2">
                                                150mL
                                            </Typography>
                                        </Box>
                                    </div>
                                )}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* Elimination */}
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
                    <div className={styles.addDataElim}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                onChange={() => setUrine(!urine)}
                                sx={{ 
                                '& .MuiSvgIcon-root': { fontSize: 50}, 
                                '&.Mui-checked': {color: '#32738C'}}
                                }/>
                            }
                            label='Urines'
                        >
                        </FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                onChange={() => setGambling(!gambling)}
                                sx={{ 
                                '& .MuiSvgIcon-root': { fontSize: 50 }, 
                                '&.Mui-checked': {color: '#32738C'},
                                '.Mui-focusVisible &': {
                                outline: '2px auto rgba(19,124,189,.6)'}
                            }}/>
                            }
                            label='Selles'
                        >
                        </FormControlLabel>
                    </div>
                )}
            </div>

            {/* Poids */}
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
                    <div className={styles.addDataWeight}>
                        <button className={styles.weightBtn}
                        onClick={handelWeightLess}>-</button>
                        <p className={styles.weightValue}>{weight} g</p>
                        <button className={styles.weightBtn}
                        onClick={handelWeightMore}>+</button>
                    </div>
                )}
            </div>

            {/* Temperature  */}
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
                    <div className={styles.addDataTemp}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                            <Slider sx={{ width: 300 }} defaultValue={37} step={0.1} aria-label="Default" valueLabelDisplay="auto" min={35} max={41} onChange={handelValTemp}/>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                                35°C
                            </Typography>
                            {temperature !== null && (
                                <Typography 
                                    variant="body2"
                                    sx={{fontWeight: '800', fontSize:'18px' }}>
                                    {temperature}°C
                                </Typography>
                            )}
                            <Typography 
                                variant="body2">
                                41°C
                            </Typography>
                        </Box>
                    </div>
                )}
            </div>

            {/* Soins  */}
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
                    <div className={styles.addDataCare}>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                onChange={() => setFaceCare(!faceCare)}
                                sx={{ 
                                '& .MuiSvgIcon-root': { fontSize: 50}, 
                                '&.Mui-checked': {color: '#32738C'}}
                                }/>
                            }
                            label='Soin du visage'
                        >
                        </FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                onChange={() => setBain(!bain)}
                                sx={{ 
                                '& .MuiSvgIcon-root': { fontSize: 50 }, 
                                '&.Mui-checked': {color: '#32738C'},
                                '.Mui-focusVisible &': {
                                outline: '2px auto rgba(19,124,189,.6)'}
                            }}/>
                            }
                            label='Bain'
                        >
                        </FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                onChange={() => setCordCare(!cordCare)}
                                sx={{ 
                                '& .MuiSvgIcon-root': { fontSize: 50 }, 
                                '&.Mui-checked': {color: '#32738C'},
                                '.Mui-focusVisible &': {
                                outline: '2px auto rgba(19,124,189,.6)'}
                            }}/>
                            }
                            label='Soin du cordon'
                        >
                        </FormControlLabel>
                    </div>
                )}
            </div>
            <Link href={"/babyTab"}>
                <button className={styles.button} onClick={handelAddData}>Valider</button>
            </Link>
        </div>
    </div>
  );
};

export default NewData;
