import Alimentation from "./detailComponents/alimentation";
import styles from '../../styles/styles_detailPage/Detail.module.css';
import { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import {   
    Checkbox,
    Typography,
    FormControlLabel,
    Autocomplete,
    TextField,
    Slider,
    Box,
    Modal, 
    Button} from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Menu from '../Menu'

function DetailAlimentation() {
    const [baby, setBaby] = useState(null);
    const user = useSelector((state) => state.user.value);
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const formattedDate = selectedTime.toISOString();
    const [activeAlim, setActiveAlim] = useState(false);
    const [valAmount, setValAmount] = useState(0);
    const [complement, setComplement] = useState(false);
    const [complementAmount, setComplementAmount] = useState(0);
    const [complementType, setComplementType] = useState("");
    const [complementMethode, setComplementMethode] = useState("");
    const [durationAllaitement, setDurationAllaitement] = useState(0);
    const [seinChoice, setSeinChoice] = useState([]);
    const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false)  
console.log("reducer", user.babies[0])

    useEffect(() => {
        fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/alimentation`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
            });
    }, [openModal, isBurgerMenuVisible]);

    if (!baby) {
        return <p>Chargement...</p>;
    }

    const displayMenu = () => {
         setIsBurgerMenuVisible(true)
    }

    const handelClose = () => {
        setIsBurgerMenuVisible(false)
    }

    
      const handleChangeAmount = (event, newValue) => {
        setValAmount(newValue);
      };
    
      const handelChangeComplementAmount = (event, newValue) => {
        setComplementAmount(newValue);
      };
    
      const handelValDuration = (event, newValue) => {
        setDurationAllaitement(newValue);
      };
    
      const handleSeinChange = (value) => (event) => {
        if (event.target.checked) {
          setSeinChoice([...seinChoice, value]); // Ajoute si coché
        } else {
          setSeinChoice(seinChoice.filter((sein) => sein !== value)); // Retire si décoché
        }
      };
    
      const optionsAlim = ["Lait artificiel", "Pepticate", "Lait maternel"];
      const optionsMethode = [
        "Sein paille",
        "Doigt paille",
        "Tétine calma",
        "DAL",
        "Biberon",
      ];
    

    const handleOpenModal = (id, date, type) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSave = () => {
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
        fetch(`http://localhost:3000/babyData/alimentation/${selectedId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Mise à jour réussie", data);
            setOpenModal(false);
        })
        .catch(error => console.error("Erreur lors de la mise à jour:", error));
    };

    const data = baby
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((data, i) => {
        // Vérifier si c'est un biberon ou allaitement
        const hasFeedingBottle = data.feedingBottle.length > 0;
        const feedingData = hasFeedingBottle ? data.feedingBottle[0] : null;
        
        // Vérifier s'il y a une donnée d'allaitement
        const breastData = !hasFeedingBottle && data.breastFeeding.length > 0 ? data.breastFeeding[0] : null;
    
        // Vérifier si un complément alimentaire est présent
        const complement = breastData && breastData.foodSupplement && breastData.foodSupplement.length > 0 
            ? breastData.foodSupplement[0] 
            : null;
        
        return (
            <Alimentation 
                key={i} 
                image={hasFeedingBottle ? "/Biberon.svg" : "/allaitement.svg"} // Adapter l'image
                date={new Date(data.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                biberon={hasFeedingBottle} 
                amount={hasFeedingBottle ? feedingData.amount : null} 
                which={breastData ? breastData.breast[1] !== undefined ?`${breastData.breast[0]}, ${breastData.breast[1]}` : breastData.breast[0] : "N/A"}
                duration={breastData ? breastData.duration : null} 
                complement={complement ? complement.foodSupplementPresent : false}
                complementType={complement ? complement.nameFoodSupplement : null} 
                complementMethode={complement ? complement.method : null} 
                complementAmount={complement ? complement.amount : null} 
                onClickSelect={() =>handleOpenModal(data._id)} 
            />
        );
    });
    
    return (
        <div>
        {isBurgerMenuVisible === true ? (
          <Menu handelClose={handelClose}/>
      ) : (
<div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" src={user.babies[0].picture ? `${user.babies[0].picture}` : "/avatarBaby.jpg"}/>
                <p className={styles.babyName}>{user.babies[0].name}</p>
                <button style={{backgroundColor: 'transparent', cursor: 'pointer', border:'none'}}  onClick={displayMenu}>
                        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
                </button>
            </div>

            {/* body */}
            <div>
                {data}
            </div>

            {/* Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    }}
                >
                    <h2>Modifier l'heure</h2>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        value={selectedTime}
                        ampm={false}
                        onChange={(newValue) => setSelectedTime(newValue)}
                        sx={{ marginBottom: 2 }}
                    />
                    </LocalizationProvider>

                    <h2>Modifier l'alimentation</h2>
                    <Box className={styles.alimchoice}>
                    {["biberon", "allaitement"].map((type) => (
                        <button
                        key={type}
                        className={styles.buttonAlim}
                        style={{ opacity: activeAlim === type ? 1 : 0.2 }}
                        onClick={() => {
                            setActiveAlim(type);
                            if (type === "biberon") {
                            setComplement(false);
                            setSeinChoice("");
                            }
                        }}
                        >
                        <img
                            className={styles.logoAlim}
                            src={`/${type}.svg`}
                            alt={type}
                        />
                        </button>
                    ))}
                    </Box>

                    {activeAlim === "biberon" && (
                    <Box sx={{ width: 300, marginTop: "15px" }}>
                        <Slider
                        defaultValue={0}
                        aria-label="Volume de Biberon"
                        valueLabelDisplay="auto"
                        min={0}
                        max={150}
                        onChange={handleChangeAmount}
                        sx={{ color: "rgba(50, 115, 140, 1)" }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2">0 mL</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "800", fontSize: "18px" }}>
                            {valAmount} mL
                        </Typography>
                        <Typography variant="body2">150 mL</Typography>
                        </Box>
                    </Box>
                    )}

                    {activeAlim === "allaitement" && (
                    <Box>
                        <Box className={styles.choixSeins}>
                        {["Droit", "Gauche"].map((sein) => (
                            <FormControlLabel
                            key={sein}
                            control={
                                <Checkbox
                                onChange={handleSeinChange(sein)}
                                checked={seinChoice.includes(sein)}
                                sx={{
                                    "& .MuiSvgIcon-root": { fontSize: 50 },
                                    "&.Mui-checked": { color: "#32738C" },
                                }}
                                />
                            }
                            label={`Sein ${sein}`}
                            />
                        ))}
                        </Box>

                        <Box sx={{ marginTop: "20px" }}>
                        <Slider
                            sx={{ width: 300, color: "rgba(50, 115, 140, 1)" }}
                            defaultValue={0}
                            step={1}
                            valueLabelDisplay="auto"
                            min={0}
                            max={60}
                            onChange={handelValDuration}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                            <Typography variant="body2">0 min</Typography>
                            <Typography variant="body2" sx={{ fontWeight: "800", fontSize: "18px" }}>
                            {durationAllaitement} min
                            </Typography>
                            <Typography variant="body2">60 min</Typography>
                        </Box>
                        </Box>

                        <FormControlLabel
                        control={
                            <Checkbox
                            onChange={() => setComplement(!complement)}
                            checked={complement}
                            sx={{
                                "& .MuiSvgIcon-root": { fontSize: 50 },
                                "&.Mui-checked": { color: "#32738C" },
                            }}
                            />
                        }
                        label="Complément"
                        />

                        {complement && (
                        <Box sx={{ marginTop: "10px" }}>
                            <Autocomplete
                            value={complementType}
                            onChange={(event, newValue) => setComplementType(newValue)}
                            options={optionsAlim}
                            renderInput={(params) => <TextField {...params} label="Type de complément" />}
                            sx={{ width: 300, marginBottom: "10px" }}
                            />
                            <Autocomplete
                            value={complementMethode}
                            onChange={(event, newValue) => setComplementMethode(newValue)}
                            options={optionsMethode}
                            renderInput={(params) => <TextField {...params} label="Méthode d'administration" />}
                            sx={{ width: 300 }}
                            />
                            <Slider
                            defaultValue={0}
                            aria-label="Quantité de Complément"
                            valueLabelDisplay="auto"
                            min={0}
                            max={150}
                            onChange={handelChangeComplementAmount}
                            sx={{ marginTop: "15px", color: "rgba(50, 115, 140, 1)" }}
                            />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">0 mL</Typography>
                            <Typography variant="body2" sx={{ fontWeight: "800", fontSize: "18px" }}>
                                {complementAmount} mL
                            </Typography>
                            <Typography variant="body2">150 mL</Typography>
                            </Box>
                        </Box>
                        )}
                    </Box>
                    )}

                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ mt: 2, width: "150px", backgroundColor: "rgba(50, 115, 140, 1)", borderRadius: "25px" }}
                    >
                    Enregistrer
                    </Button>
                    <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    sx={{ mt: 2, width: "150px", color: "#8C8C8C", borderColor: "#8C8C8C", borderRadius: "25px" }}
                    >
                    Annuler
                    </Button>
                </Box>
                </Modal>
        </div>
      )}
        
        </div>
    )

}

export default DetailAlimentation;
