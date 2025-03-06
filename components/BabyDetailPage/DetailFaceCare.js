import Care from "./detailComponents/Care";
import styles from '../../styles/styles_detailPage/Detail.module.css';
import { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { Modal, Box, Button } from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

dayjs.locale('fr')

function DetailFaceCare() {
    const [baby, setBaby] = useState(null);
    const user = useSelector((state) => state.user.value);
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const formattedDate = selectedTime.toISOString();
    

    useEffect(() => {
        fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/Care`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
            });
    }, [openModal]);

    if (!baby) {
        return <p>Chargement...</p>;
    }    

    const handleOpenModal = (id) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSave = () => {
        let data ={
            date: formattedDate,
        }
        console.log('temperature :',data)

        fetch(`http://localhost:3000/babyData/care/${selectedId}`, {
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
    .filter(data => data.faceCare === true)
    .map((data, i) => {
      const date = new Date(data.date).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
  
      return <Care key={i} date={date} image={'/visage.svg'} onClickSelect={() => handleOpenModal(data._id)} />;
    });
  

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" />
                <p className={styles.babyName}>{user.babies[0].name}</p>
                <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
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
    )

}

export default DetailFaceCare;
