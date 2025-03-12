import Weight from "./detailComponents/weight";
import styles from '../../styles/styles_detailPage/Detail.module.css';
import { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { Modal, Box, Button } from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AreaChart, XAxis, YAxis, Area, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Menu from '../Menu'

function DetailWeight() {
    const [baby, setBaby] = useState(null);
   
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const formattedDate = selectedTime.toISOString();
    const [weight, setWeight] = useState(null)
    const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false)  
   
    const user = useSelector((state) => state.user.value);
    console.log("reducer", user.babies[0])
    useEffect(() => {
        fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/weight`)
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

    const handleOpenModal = (id, weight) => {
        setSelectedId(id);
        setOpenModal(true);
        setWeight(weight)
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handelWeightMore = () => {
        let NewWeight = Number(weight)+50;
        setWeight(`${NewWeight}`)
    }

    const handelWeightLess = () => {
        let NewWeight = Number(weight)-50;
        setWeight(`${NewWeight}`)
    }

    const handleSave = () => {
        let data ={
            date: formattedDate,
            weight: weight
        }

        fetch(`http://localhost:3000/babyData/weight/${selectedId}`, {
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

    const dataChart = []
    const data = baby
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((data, i) => {
        const date = new Date(data.date).toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

      return <Weight key={i} date={date} info={data.weight} onClickSelect={() => handleOpenModal(data._id, data.weight)}/>;
    });

    const weightData = baby
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((data, i) => {
        const date = new Date(data.date).toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
         })
        const dateChart = new Date(data.date).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit'});
        dataChart.push({date : dateChart, weight : data.weight});
    })

  
    return (
        <div>
        {isBurgerMenuVisible === true ? (
          <Menu handelClose={handelClose}/>
      ) : (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" src={user.babies[0].picture ? `${user.babies[0].picture}` : "/avatarBaby.jpg" }/>
                <p className={styles.babyName}>{user.babies[0].name}</p>
                <button style={{backgroundColor: 'transparent', cursor: 'pointer', border:'none'}}  onClick={displayMenu}>
                        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
                </button>
            </div>

            {/* body */}
            <div className={styles.dataContainer}>
                {data}
                <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                    data={dataChart}
                    margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
                    >
                    <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(71, 146, 176)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="rgb(50, 115, 140)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis domain={[2000, 4500]} ticks={[2000, 2500, 3000, 3500, 4000, 4500]} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="weight"
                        name="Poids"
                        stroke="rgb(50, 115, 140)"
                        fillOpacity={1}
                        fill="url(#colorWeight)"
                    />
                    <Area
                        type="monotone"
                        dataKey={() => user.babies[0].birthWeight} // pour que la légende s'affiche avec la ligne
                        stroke="green"
                        fillOpacity={0}
                        fill="green"
                        name="Poids de naissance"
                    />
                    </AreaChart>
                </ResponsiveContainer>
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
                        justifyContent: 'center',
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
                    <h2>Modifier le poids</h2>
                        <Box sx={{ width: '100% '}}>
                            <div className={styles.addDataWeight}>
                                <button className={styles.weightBtn}
                                onClick={handelWeightLess}>-</button>
                                <p className={styles.weightValue}>{weight} g</p>
                                <button className={styles.weightBtn}
                                onClick={handelWeightMore}>+</button>
                            </div>
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

export default DetailWeight;
