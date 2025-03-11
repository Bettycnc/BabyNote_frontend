import styles from '../styles/Menu.module.css'
import { useSelector, useDispatch } from "react-redux";
import { logout, setBabies } from "../reducers/user"
import { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Popover, Typography } from "@mui/material";

function Menu(props) {

    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch()
    const [openModalUser, setOpenModalUser] = useState(false)
    const [newUsername, setNewUsername] = useState(user.username)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [anchorEl, setAnchorEl] = useState(null);
    const [babyInfo, setBabyInfo] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3000/baby/search/${user._id}`)
            .then((response) => response.json())
            .then((dataBaby) => {
                setBabyInfo(dataBaby.babies);
                console.log("dataBaby : ", dataBaby);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des bébés :", error);
            });
    }, [user._id]);

    const handelLogout = () => {
        dispatch(logout())
        window.location.href = "/"
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const showModalUser = () => {
        setOpenModalUser(true)
    }

    const handelCloseModalUser = () => {
        setOpenModalUser(false)
    }

    const handleSaveUser = () => {
        let data = {
            username: newUsername,
            password: newPassword,
            confirmPassword: confirmPassword,
        }

        fetch(`http://localhost:3000/users/${user._id}`, {
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

    const changeBabyPopover = (baby) => {
        dispatch(setBabies([{name: baby.name, _id: baby._id ,birthWeight: baby.birthWeight}]))
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.titre} >Bonjour {user.motherName},</p>
                <button className={styles.closebnt} onClick={props.handelClose}>
                    <img className={styles.closeimg} src='/CloseBtn.svg' alt="Close" />
                </button>
            </div>
            <div className={styles.compteOption}>
                <button className={styles.btn} onClick={handelLogout}>Se déconnecter</button>
                <button className={styles.btn} onClick={showModalUser}>Mon compte</button>
            </div>
            <div className={styles.babyOption}>
                <button className={styles.btnBaby} onClick={handleClick}>
                    {/* <img className={styles.imgBaby} src={babyInfo.picture ? baby.picture : "/avatarBaby.jpg"}></img> */}
                    <p className={styles.nameBaby}>{user.babies[0].name}</p>
                    <img className={styles.chevron} src='/chevronBottom.svg' alt="Dropdown" />
                </button>
                <Popover
                id="baby-popover"
                open={anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                {babyInfo.map((baby, index) => (
                    <Box>
                        <Button
                            key={index}
                            variant="outlined"
                            sx={{
                                margin: 2,
                                width: '150px',
                                color: '#8C8C8C',
                                borderColor: '#8C8C8C',
                                borderRadius: '25px',
                            }}
                            onClick={() => changeBabyPopover(baby)}>
                            {baby.name}
                        </Button>
                    </Box>
                ))}
            </Popover>
            </div>
        

            <Modal open={openModalUser} onClose={handelCloseModalUser}>
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
                    }}
                >
                    <h3>Modifier les informations du profil</h3>
                    <TextField
                        onChange={e => setNewUsername(e.target.value)}
                        value={newUsername}
                        sx={{ mt: 2 }}
                        label="Identifiant"
                        variant="outlined"
                    />
                    <TextField
                        onChange={e => setNewPassword(e.target.value)}
                        value={newPassword}
                        sx={{ mt: 1 }}
                        label="Mot de Passe"
                        variant="outlined"
                        type="password"
                    />
                    <TextField
                        onChange={e => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        sx={{ mt: 1 }}
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
        </div>
    );
}

export default Menu;
