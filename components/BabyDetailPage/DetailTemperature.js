import Temperature from "./detailComponents/temperature";
import styles from '../../styles/styles_detailPage/Detail.module.css';
import { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { Modal, Box, Slider, Typography, Button } from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Menu from '../Menu'


dayjs.locale('fr')

function DetailTemperature() {
    const [baby, setBaby] = useState(null);
    const user = useSelector((state) => state.user.value);
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [temperature, setTemperature] = useState(null)
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const formattedDate = selectedTime.toISOString();
    const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false)  
    

    useEffect(() => {
        fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/temperature`)
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

    const handleOpenModal = (id) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handelValTemp = (event, newValue) => {
        setTemperature(newValue)
    }

    const handleSave = () => {
        let data ={
            date: formattedDate,
            temperature: temperature
        }
        console.log('temperature :',data)

        fetch(`http://localhost:3000/babyData/temperature/${selectedId}`, {
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
        return (
            <Temperature 
            date={new Date(data.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            info={data.temperature}
            onClickSelect={() => handleOpenModal(data._id)}
        />
        )
    })
    return (
        <div>
        {isBurgerMenuVisible === true ? (
          <Menu handelClose={handelClose}/>
      ) : (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" />
                <p className={styles.babyName}>{user.babies[0].name}</p>
                <button style={{backgroundColor: 'transparent', cursor: 'pointer', border:'none'}}  onClick={displayMenu}>
                        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
                </button>
            </div>

            {/* body */}
            <div className={styles.dataContainer}>
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
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                    <h2>Modifier l'heure</h2>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                value={selectedTime}
                                ampm={false}
                                onChange={(newValue) => {
                                setSelectedTime(newValue);
                                }}
                            />
                        </LocalizationProvider>
                    <h2>Modifier la température</h2>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                            <Slider sx={{ width: 300, color:"rgba(50, 115, 140, 1)" }} defaultValue={37} step={0.1} aria-label="Default" valueLabelDisplay="auto" min={35} max={41} onChange={handelValTemp}/>
                        </Box>
                        <Box sx={{ width:'100%' ,display: 'flex', justifyContent: 'space-between' }}>
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
                        <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSave} 
                        sx={{ mt: 2, width: '150px', backgroundColor: 'rgba(50, 115, 140, 1)', borderRadius: '25px'}}
                    >
                        Enregistrer
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleCloseModal} 
                        sx={{ mt: 2, width: '150px', color: '#8C8C8C', borderColor: '#8C8C8C', borderRadius: '25px'}}
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




export default DetailTemperature;
