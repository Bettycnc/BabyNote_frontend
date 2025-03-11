import styles from '../styles/Menu.module.css'
import { useSelector, useDispatch } from "react-redux";
import {logout } from "../reducers/userPro"
import { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Popover } from "@mui/material";
import NewPatientPage from './NewPatient'

function MenuPro(props) {

    const user = useSelector((state) => state.userPro.value);
    const dispatch = useDispatch();
    const [openModalUser, setOpenModalUser] = useState(false);
    const [openModalNewPatient, setOpenModalNewPatient] = useState(false);
    const [openModalDeletePatient, setOpenModalDeletePatient] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [allBabies, setAllBabies] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);


    //création d'un tableau d'objet avec lastname et _id
    const lastnameMother = allBabies.map((baby) => {
        return {
        lastname: baby.user_id.lastname,
        room: baby.user_id.room,
        _id: baby.user_id._id,
        };
    });
    
    // création d'un nouveau tableau qui supprime les doubons
    const uniqueMother = Array.from(
        new Map(lastnameMother.map((item) => [item._id, item])).values()
    );

    const handelLogout = () => {
        dispatch(logout())
        window.location.href = "/"
    }
    
    const showModalUser = () => {
        setOpenModalUser(true);
    };
    
    const handelCloseModalUser = () => {
    setOpenModalUser(false);
    };

    const handelNewPatient = () => {
    setOpenModalNewPatient(true);
    };

    const handelDeletePatient = (id) => {
        fetch(`http://localhost:3000/users/delete/${id}`, {
          //penser a mettre le chemin pour le profesionnel
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Mise à jour réussie", data);
            setOpenModalUser(false);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour:", error);
            alert("Une erreur est survenue lors de la mise à jour.");
          });
        setOpenModalDeletePatient(false);
    };

    const handelCloseDeletePatient = () => {
    setOpenModalDeletePatient(false);
    };

    const handleCloseModal = () => {
    setOpenModalNewPatient(false);
    };

    const handleClick = (event) => {
    setOpenModalDeletePatient(true);
    setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
    setAnchorEl(null);
    };
 
    const handleSaveUser = () => {
        let data = {
            username: newUsername,
            password: newPassword,
            confirmPassword: confirmPassword,
        }

        fetch(`http://localhost:3000/pros/`, { //penser a mettre le chemin pour le profesionnel
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Mise à jour réussie", data);
                setOpenModalUser(false);
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour:", error);
                alert("Une erreur est survenue lors de la mise à jour.");
            });
    }

    //je récupérer les données bébé
    useEffect(() => {
        fetch("http://localhost:3000/baby")
        .then((response) => response.json())
        .then((data) => {
            setAllBabies(data.filteredData);
        });
    }, []);

    return (
        <div className={styles.containerPro}>
            <div className={styles.header}>
                <p className={styles.titre} >Bonjour, </p>
                <button className={styles.closebnt} onClick={props.handelClose}>
                    <img className={styles.closeimg} src='/CloseBtn.svg' alt="Close" />
                </button>
            </div>
            <div className={styles.compteOption}>
                <button className={styles.btn} onClick={handelLogout}>Se déconnecter</button>
                <button className={styles.btn} onClick={showModalUser}>Mon compte</button>
            </div>
            <div className={styles.optionPatient}>
                <button className={styles.btn} onClick={handelNewPatient}>
                    Ajouter une patiente
                </button>
                <button className={styles.btn} onClick={handleClick}>
                    Supprimer une patiente
                </button>
        </div>


        <Modal open={openModalNewPatient} onClose={handleCloseModal}>
            <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80vw", // Utilise une largeur en pourcentage ou vw
                maxWidth: 600, // Limite la largeur maximale
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <NewPatientPage />
            </Box>
        </Modal>

        
            <Modal open={openModalUser} onClose={handelCloseModalUser}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80vw", 
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 2,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <h3>Modifier les informations du profil</h3>
                    <TextField
                        onChange={e => setNewUsername(e.target.value)}
                        value={newUsername}
                        sx={{ mt: 1,width: '80%' }}
                        label="Identifiant"
                        variant="outlined"
                    />
                    <TextField
                        onChange={e => setNewPassword(e.target.value)}
                        value={newPassword}
                        sx={{ mt: 1,width: '80%' }}
                        label="Mot de Passe"
                        variant="outlined"
                        type="password"
                    />
                    <TextField
                        onChange={e => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        sx={{ mt: 1, width: '80%'}}
                        label="Confirmer Mot de Passe"
                        variant="outlined"
                        type="password"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveUser}
                        sx={{ mt: 2, width: '150px', backgroundColor: 'rgba(50, 115, 140, 1)', borderRadius: '25px' }}
                    >
                        Enregistrer
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handelCloseModalUser}
                        sx={{ mt: 2, width: '150px', color: '#8C8C8C', borderColor: '#8C8C8C', borderRadius: '25px' }}
                    >
                        Annuler
                    </Button>
                </Box>
            </Modal>

            <Modal open={openModalDeletePatient} onClose={handelCloseDeletePatient}>
                <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80vw", // Utilise une largeur en pourcentage ou vw
                    maxWidth: 600, // Limite la largeur maximale
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                >
                {/* affichage des patiente du service */}
                <Popover
                    id="delete-popover"
                    open={anchorEl}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    // anchorOrigin={{
                    //   vertical: "bottom",
                    //   horizontal: "center",
                    // }}
                    // transformOrigin={{
                    //   vertical: "top",
                    //   horizontal: "center",
                    // }}
                >
                    {uniqueMother.map((mother, index) => (
                    <Box>
                        <Button
                        key={index}
                        variant="outlined"
                        sx={{
                            margin: 2,
                            width: "150px",
                            color: "#8C8C8C",
                            borderColor: "#8C8C8C",
                            borderRadius: "25px",
                        }}
                        onClick={() => handelDeletePatient(mother._id)}
                        >
                        mme. {mother.lastname}
                        </Button>
                    </Box>
                    ))}
                </Popover>
                </Box>
            </Modal>
        </div>
    );
}

export default MenuPro;
