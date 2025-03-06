import Elimination from "./detailComponents/elimination";
import styles from '../../styles/styles_detailPage/Detail.module.css';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Box, FormControlLabel, Button, Checkbox } from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function DetailElimination() {
    const [baby, setBaby] = useState(null);
    const user = useSelector((state) => state.user.value);
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [urine, setUrine ] = useState(false)
    const [gambling, setGambling] = useState(false)
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const formattedDate = selectedTime.toISOString();

    useEffect(() => {
        fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/elimination`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
            });
    }, [openModal]);

    if (!baby) {
        return <p>Chargement...</p>;
    }

    console.log(baby);

    const handleOpenModal = (id, date, type) => {
        setSelectedId(id);
        setOpenModal(true);
        setUrine(false)
        setGambling(false)
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSave = () => {
        let data ={
            date: formattedDate,
            urine,
            gambling
        }
        fetch(`http://localhost:3000/babyData/elimination/${selectedId}`, {
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
            const type = data.urine && data.gambling ? 'Urines & Selles' 
                        : data.urine ? 'Urine' 
                        : data.gambling ? 'Selles' 
                        : "";

            return (
                <Elimination
                    key={data._id}
                    date={new Date(data.date).toLocaleDateString('fr-FR', { 
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                    })}
                    info={type}
                    onClickSelect={() => handleOpenModal(data._id, data.date, type)}
                />
            );
        });

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" />
                <p className={styles.babyName}>{user.babies[0].name}</p>
                <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
            </div>

            {/* Body */}
            <div className={styles.dataContainer}>{data}</div>

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
                    <h2>Modifier l'élimination</h2>
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
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSave} 
                        sx={{ mt: 2 }}
                    >
                        Enregistrer
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleCloseModal} 
                        sx={{ mt: 2, ml: 2 }}
                    >
                        Annuler
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default DetailElimination;
