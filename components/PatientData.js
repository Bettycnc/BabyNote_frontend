import styles from "../styles/PatientData.module.css";
import React, { useEffect, useState } from "react";
import "moment/locale/fr";
import {
  MenuItem,
  FormControl,
  Select,
  Box,
  InputLabel,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Modal,
  TableRow,
  FormControlLabel,
  Paper,
  Checkbox
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import MenuPro from "./MenuPro";
import moment from "moment";

// Composant principal Patient
const Patient = () => {
  // Gestion de l'état pour le jour sélectionné et les données du bébé
  const [day, setDay] = useState('Jour 0');
  const [babiesData, setBabiesData] = useState([]);
  const [showAlim, setShowAlim] = useState(true);
  const [showElim, setShowElim] = useState(true);
  const [showWeight, setShowWeight] = useState(true);
  const [showBath, setShowBath] = useState(true);
  const [showCordCare, setShowCordCare] = useState(true);
  const [showFaceCare, setShowFaceCare] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [openModal, setOpenModal] = useState(false)
  const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false)
    

  // Récupération des informations utilisateur via Redux
  const userPro = useSelector((state) => state.userPro.value);

  // Utilisation de useEffect pour récupérer les données du bébé depuis l'API
  useEffect(() => {
    fetch(`http://localhost:3000/baby/${userPro.babyId}`)
      .then((response) => response.json())
      .then((data) => {
        setBabiesData(data.data);
      });
  }, [userPro.babyId]);
  
  // Variables pour stocker les informations du bébé
  let babyName = babiesData.name;
  let motherName = "";
  let room ="";

  let formatedLastMaj;

  if(babiesData.user_id){
    motherName = babiesData.user_id.lastname;
    room = babiesData.user_id.room;

     //------récupérer la date de la dernière mise à jours ---------
     const weights = babiesData.weight_id; // Liste des objets poids
     // Récupérer la date du dernier poids enregistré
     const lastWeightDate =
       weights.length > 0 ? weights[weights.length - 1].date : null;
 
     const temperatures = babiesData.temperature_id; // Liste des objets température
     // Récupérer la date de derniere température enregistré
     const lastTemperatureDate =
       temperatures.length > 0
         ? temperatures[temperatures.length - 1].date
         : null;
 
     const eliminations = babiesData.elimination_id; // Liste des objets elimination
     // Récupérer la date de derniere elimination enregistrée
     const lastEliminationDate =
       eliminations.length > 0
         ? eliminations[eliminations.length - 1].date
         : null;
 
     const cares = babiesData.care_id; // Liste des objets care
     // Récupérer la date du dernier soin enregistré
     const lastCareDate = cares.length > 0 ? cares[cares.length - 1].date : null;
 
     const alimentations = babiesData.alimentation_id; // Liste des objets alimentation
     // Récupérer la date du dernier repas enregistré
     const lastAlimentationDate =
       alimentations.length > 0
         ? alimentations[alimentations.length - 1].date
         : null;
     //tri des dernière Maj de chaque événement
     const lastHours = [];
     if (lastCareDate !== null) {
       lastHours.push(lastCareDate);
     }
     if (lastAlimentationDate !== null) {
       lastHours.push(lastAlimentationDate);
     }
     if (lastEliminationDate !== null) {
       lastHours.push(lastEliminationDate);
     }
     if (lastTemperatureDate !== null) {
       lastHours.push(lastTemperatureDate);
     }
     if (lastWeightDate !== null) {
       lastHours.push(lastWeightDate);
     }
 
     lastHours.sort(); //Tri
     // on récupère la dernière date
     let lastMaj = lastHours.length > 0 ? lastHours[lastHours.length - 1] : null;
     const date = new Date(lastMaj);

     const day = String(date.getDate()).padStart(2, '0');
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const hours = String(date.getHours()).padStart(2, '0');
     const minutes = String(date.getMinutes()).padStart(2, '0');
   
     formatedLastMaj = `${day}/${month} à ${hours}:${minutes}`;     
  }


  // Personnalisation du bouton avec MUI
  const ButtonStyle = styled(Button)(() => ({
    borderColor: "#bfbfbf",
    color: "#7f7f7f",
    fontVariantCaps: "normal",
    fontWeight: 500,
  }));

  // Gestion de la sélection du jour
  const handleChange = (event) => {
    setDay(event.target.value);
  };

  // Catégories des données pour faciliter l'accès
  const categories = ['alimentation_id', 'elimination_id', 'care_id', 'temperature_id', 'weight_id'];
  let mergedData = [];

  // Fusionner les données de toutes les catégories dans un seul tableau
  categories.forEach(category => {
    if (Array.isArray(babiesData[category])) {
      babiesData[category].forEach(item => {
        mergedData.push({ ...item, category });
      });
    }
  });

  // Trier les données par date pour garantir un affichage chronologique
  mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Regrouper les données par jour et assigner un index "Jour0", "Jour1", "Jour2", ...
  const groupedByDate = Object.values(mergedData.reduce((acc, item, index) => {
    const date = new Date(item.date).toISOString().split('T')[0]; // Extraire la date sans l'heure

    if (!acc[date]) {
      acc[date] = { label: `Jour ${Object.keys(acc).length}`, items: [] }; // Créer "Jour0", "Jour1", ...
    }
    acc[date].items.push(item);

    return acc;
  }, {})).map(group => ({ [group.label]: group.items }));


  // Regrouper les données par jour puis par heure
  const groupedByHours = groupedByDate.map(group => {
    const label = Object.keys(group)[0];
    const valeur = group[label].map(data => {
      const date = new Date(data.date);

      const options = { hour: '2-digit', minute: '2-digit' };
      const timeString = date.toLocaleTimeString('fr-FR', options);

      return { timeString, data };
    });

    // Regrouper par heure
    const groupedByTime = valeur.reduce((acc, { timeString, data }) => {
      if (!acc[timeString]) {
        acc[timeString] = [];
      }
      acc[timeString].push(data);

      return acc;
    }, {});

    // Formater les résultats finaux pour avoir la bonne structure
    const result = Object.keys(groupedByTime).map(timeString => ({
      heure : timeString,
      data: groupedByTime[timeString],
    }));

    return {
      label,
      result
    };
  }).map(group => ({ [group.label]: group.result }));

// Affichage du jour :
let affichageDay = groupedByHours[parseInt(day.replace('Jour ', ''), 10)] || {};


  // Filtrer les données pour afficher uniquement celles du jour sélectionné
  const filteredData = Object.keys(affichageDay).map(date => ({
    affichage: affichageDay[date],
  }));

  const dayKeys = groupedByHours.map(item => Object.keys(item)[0]);


  const handelOpenModal = () => {
    setOpenModal(true)
    setShowAlim(true)
    setShowElim(true)
    setShowWeight(true)
    setShowBath(true)
    setShowCordCare(true)
    setShowFaceCare(true)
    setShowTemperature(true)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const displayMenu = () => {
    setIsBurgerMenuVisible(true)
  }

  const handelClose = () => {
    setIsBurgerMenuVisible(false)
  }

  console.log(babiesData)

   

  return (
    <div>
      {isBurgerMenuVisible ? (
        <MenuPro handelClose={handelClose}/>
      ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.h3}>Mme {motherName} - {babyName}</p>
          <p className={styles.h4}>Chambre {room}</p>
        </div>
        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} onClick={displayMenu}/>
      </div>

      <div className={styles.maj}>Dernière mise à jour : {formatedLastMaj}</div>

      <div className={styles.select}>
        <Box>
          {/* Sélecteur de jour */}
          <FormControl className={styles.inputJour}>
            <InputLabel >Choisir un jour</InputLabel>
            <Select className={styles.MenuItem} value={day} onChange={handleChange}>
              {dayKeys.map((key, index) => (
                  <MenuItem className={styles.MenuItemColor} key={index} value={key}>
                    {key}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
        <Stack spacing={2}>
          <ButtonStyle sx={{ minWidth: 150, color: ' #6596a9', border: '1px solid #6596a9' }} variant="outlined" endIcon={<FilterAltIcon />} onClick={handelOpenModal}>Filtres</ButtonStyle>
        </Stack>
      </div>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table sx={{ width: '300px' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Heure</TableCell>
              {showWeight === true && <TableCell align="center" sx={{ minWidth: '100px' }}>Poids (g)</TableCell>}
              {showTemperature === true && <TableCell align="center" sx={{ minWidth: '100px' }}>Temp. (°C)</TableCell>}
              {showElim === true && <TableCell align="center" sx={{ minWidth: '130px' }}>Elimination</TableCell>}
              {showAlim === true && <TableCell align="center" sx={{ minWidth: '150px' }}>Alimentation</TableCell>}
              {showBath === true && <TableCell align="center" sx={{ minWidth: '60px' }}>Bain</TableCell>}
              {showCordCare === true && <TableCell align="center" sx={{ minWidth: '60px' }}>Soin Cordon</TableCell>}
              {showFaceCare === true && <TableCell align="center" sx={{ minWidth: '60px' }}>Soin Visage</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((data, index) => (
              data.affichage.map((item) => (
              <TableRow key={index}>
                {/* Affiche l'heure */}
                <TableCell>
                    <div>{item.heure}</div>
                </TableCell>


                {showWeight === true &&
                  <TableCell align="center" sx={{ width: '100px' }}>
                  {item.data && item.data.length > 0 ? (
                    // Filtrer uniquement les objets avec un poids défini
                    item.data.some((innerItem) => innerItem.weight) ? (
                      item.data.map((innerItem, i) => (
                        innerItem.weight ? (
                          <div key={i}>{innerItem.weight} g</div>
                        ) : null
                      ))
                    ) : (
                      <p>-</p> // Affiche "-" si aucun poids n'est trouvé dans les objets
                    )
                  ) : (
                    <p>-</p> // Affiche "-" si le tableau est vide ou inexistant
                  )}
                  </TableCell>
                }


                {/* Affiche la température uniquement si elle est définie et différente de "N/A" */}
                {showTemperature === true && 
                  <TableCell align="center" sx={{ width: '100px' }}>
                  {item.data && item.data.length > 0 ? (
                    // Filtrer uniquement les objets avec un poids défini
                    item.data.some((innerItem) => innerItem.temperature) ? (
                      item.data.map((innerItem, i) => (
                        innerItem.temperature ? (
                          <div key={i}>{innerItem.temperature} °C</div>
                        ) : null
                      ))
                    ) : (
                      <p>-</p>
                    )
                  ) : (
                    <p>-</p> // Affiche "-" si le tableau est vide ou inexistant
                  )}
                  </TableCell>
                }


                {/* Affiche l'élimination uniquement si l'une des valeurs est vraie */}
                {showElim &&
                  <TableCell align="center" sx={{ minWidth: '120px' }}>
                  {item.data && item.data.length > 0 ? (
                    // Filtrer uniquement les objets avec un poids défini
                    item.data.some((innerItem) => innerItem.urine || innerItem.gambling) ? (
                      item.data.map((innerItem, i) => (
                        innerItem.urine ? (
                          <div key={i}>
                            {innerItem.urine ? "Urines" : "Non"} {innerItem.gambling ? "/ Selles" : ""}
                          </div>
                          ) : (innerItem.gambling ? "Selles" : "")
                      ))
                    ) : (
                      <p>-</p>
                    )
                  ) : (
                    <p>-</p> 
                  )}
                 </TableCell>                
                }


                {/* Affiche l'alimentation uniquement si elle est définie */}

                {showAlim &&
                  <TableCell align="center" sx={{ minWidth: '150px' }}>

                  {item.data && item.data.length > 0 ? (
                      // Filtrer uniquement les objets avec une alimentation définie
                      item.data.some((innerItem) => innerItem.feedingBottle || innerItem.breastFeeding) ? (
                        item.data.map((innerItem, i) => (
                          innerItem.feedingBottle || innerItem.breastFeeding ? (
                            <div key={i}>
                          {innerItem.feedingBottle.length > 0
                            ? (
                            <div>
                              <p>Biberon</p>
                              <p>Quantité : {innerItem.feedingBottle[0].amount} mL</p>
                            </div>
                            ): (
                            <div>
                              <p>Allaitement</p>
                              <p>Durée : {innerItem.breastFeeding[0].duration} min</p>
                              <p>Coté : {innerItem.breastFeeding[0].breast.join(' ')}</p>
                                {innerItem.breastFeeding[0].foodSupplement.length > 0 ? (
                                  <p>{innerItem.breastFeeding[0].foodSupplement[0].nameFoodSupplement} / {innerItem.breastFeeding[0].foodSupplement[0].method} : {innerItem.breastFeeding[0].foodSupplement[0].amount} mL</p>
                                ) : (
                                  <p>Ø Complément</p>
                                )}
                            </div>
                            )}
                        </div>
                          ) : null
                        ))
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p> // Affiche "-" si le tableau est vide ou inexistant
                    )}                  
                  </TableCell>
                }



                {showBath &&
                  <TableCell align="center" sx={{ width: '60px' }}>
                  {item.data && item.data.length > 0 ? (
                      // Filtrer uniquement les objets avec un poids défini
                      item.data.some((innerItem) => innerItem.bath) ? (
                        item.data.map((innerItem, i) => (
                          innerItem.bath ? (
                            <div key={i}>
                              Oui
                            </div>
                            ) : null
                        ))
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p> 
                    )}
                  </TableCell>              
                }


                {showCordCare &&
                  <TableCell align="center" sx={{ width: '60px' }}>
                  {item.data && item.data.length > 0 ? (
                      item.data.some((innerItem) => innerItem.cordCare) ? (
                        item.data.map((innerItem, i) => (
                          innerItem.cordCare ? (
                            <div key={i}>
                              Oui
                            </div>
                            ) : null
                        ))
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p> 
                    )}
                  </TableCell>              
                }


                {showFaceCare &&
                  <TableCell align="center" sx={{ width: '60px' }}>
                  {item.data && item.data.length > 0 ? (
                      item.data.some((innerItem) => innerItem.faceCare) ? (
                        item.data.map((innerItem, i) => (
                          innerItem.faceCare ? (
                            <div key={i}>
                              Oui
                            </div>
                            ) : null
                        ))
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p> 
                    )}
                  </TableCell>              
                }

              </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Modal open={openModal} onClose={handleCloseModal}>
        <Box 
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: "rgba(0, 0, 0, 0.7)",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Bouton "Close" en haut à droite */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: '40px',
                minHeight: '40px',
                backgroundColor: 'rgba(50, 115, 140, 1)'
              }}
            >
              X
            </Button>

            {/* Checkbox centrée */}
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => setShowWeight(!showWeight)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                      '&.Mui-checked': { color: '#32738C' }
                    }}
                  />
                }
                label='Poids'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => setShowTemperature(!showTemperature)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                      '&.Mui-checked': { color: '#32738C' }
                    }}
                  />
                }
                label='Température'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => setShowElim(!showElim)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                      '&.Mui-checked': { color: '#32738C' }
                    }}
                  />
                }
                label='Elimination'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => setShowAlim(!showAlim)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                      '&.Mui-checked': { color: '#32738C' }
                    }}
                  />
                }
                label='Alimentation'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => setShowBath(!showBath)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                      '&.Mui-checked': { color: '#32738C' }
                    }}
                  />
                }
                label='Bain'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => setShowFaceCare(!showFaceCare)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                      '&.Mui-checked': { color: '#32738C' }
                    }}
                  />
                }
                label='Soin du Visage'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => setShowCordCare(!showCordCare)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                      '&.Mui-checked': { color: '#32738C' }
                    }}
                  />
                }
                label='Soin du Cordon'
              />
            </Box>

            {/* Bouton "Valider" centré */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
              sx={{
                mt: 2,
                width: '150px',
                backgroundColor: 'rgba(50, 115, 140, 1)',
                borderRadius: '25px'
              }}
            >
              Valider
            </Button>
          </Box>
        </Box>
      </Modal>



    </div>
    )}
  </div>
  );
};


export default Patient; 