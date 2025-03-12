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
  TableRow,
  Paper,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

// Composant principal Patient
const Patient = () => {
  // Gestion de l'état pour le jour sélectionné et les données du bébé
  const [day, setDay] = useState(0);
  const [babiesData, setBabiesData] = useState([]);

  // Récupération des informations utilisateur via Redux
  const userPro = useSelector((state) => state.userPro.value);
  const user = useSelector((state) => state.user.value);

  // Utilisation de useEffect pour récupérer les données du bébé depuis l'API
  useEffect(() => {
    fetch(`http://localhost:3000/baby/${userPro.babyId}`)
      .then((response) => response.json())
      .then((data) => {
        setBabiesData(data.data);
      });
  }, [userPro.babyId]);

  console.log(babiesData);

  // Variables pour stocker les informations du bébé
  const babyName = babiesData.name;
  const motherName = babiesData.user_id.lastname;
  const room = babiesData.user_id.room;

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
  const categories = [
    "alimentation_id",
    "elimination_id",
    "care_id",
    "temperature_id",
    "weight_id",
  ];
  let mergedData = [];

  // Fusionner les données de toutes les catégories dans un seul tableau
  categories.forEach((category) => {
    if (Array.isArray(babiesData[category])) {
      babiesData[category].forEach((item) => {
        mergedData.push({ ...item, category });
      });
    }
  });

  // Trier les données par date pour garantir un affichage chronologique
  mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Regrouper les données par jour et assigner un index "Jour0", "Jour1", "Jour2", ...
  const groupedByDate = Object.values(
    mergedData.reduce((acc, item, index) => {
      const date = new Date(item.date).toISOString().split("T")[0]; // Extraire la date sans l'heure

      if (!acc[date]) {
        acc[date] = { label: `Jour ${Object.keys(acc).length}`, items: [] }; // Créer "Jour0", "Jour1", ...
      }
      acc[date].items.push(item);

      return acc;
    }, {})
  ).map((group) => ({ [group.label]: group.items }));

  // Regrouper les données par jour puis par heure
  const groupedByHours = groupedByDate
    .map((group) => {
      const label = Object.keys(group)[0];
      const valeur = group[label].map((data) => {
        const date = new Date(data.date);

        const options = { hour: "2-digit", minute: "2-digit" };
        const timeString = date.toLocaleTimeString("fr-FR", options);

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
      const result = Object.keys(groupedByTime).map((timeString) => ({
        heure: timeString,
        data: groupedByTime[timeString],
      }));

      return {
        label,
        result,
      };
    })
    .map((group) => ({ [group.label]: group.result }));

  // Affichage du jour :
  let affichageDay = {};
  // Exemple de sélection de jour (jour 0, jour 1, etc.)
  if (day === "Jour 0") {
    affichageDay = groupedByHours[0];
  } else if (day === "Jour 1") {
    affichageDay = groupedByHours[1];
  } else if (day === "Jour 2") {
    affichageDay = groupedByHours[2];
  } else if (day === "Jour 3") {
    affichageDay = groupedByHours[3];
  } else if (day === "Jour 4") {
    affichageDay = groupedByHours[4];
  }

  // Filtrer les données pour afficher uniquement celles du jour sélectionné
  const filteredData = Object.keys(affichageDay).map((date) => ({
    affichage: affichageDay[date],
  }));

  console.log(filteredData);

  const dayKeys = groupedByHours.map((item) => Object.keys(item)[0]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.h3}>
            Mme {motherName} - {babyName}
          </p>
          <p className={styles.h4}>Chambre {room}</p>
        </div>
        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
      </div>

      <div className={styles.maj}>Dernière mise à jour :</div>

      <div className={styles.select}>
        <Box>
          {/* Sélecteur de jour */}
          <FormControl>
            <InputLabel>Choisir un jour</InputLabel>
            <Select value={day} onChange={handleChange}>
              {dayKeys.map((key, index) => (
                <MenuItem key={index} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Stack spacing={2}>
          <ButtonStyle
            sx={{ minWidth: 150 }}
            variant="outlined"
            endIcon={<FilterAltIcon />}
          >
            Filtres
          </ButtonStyle>
        </Stack>
      </div>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table sx={{ minWidth: 750 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Heure</TableCell>
              <TableCell align="center" sx={{ width: "100px" }}>
                Poids (g)
              </TableCell>
              <TableCell align="center" sx={{ width: "80px" }}>
                Temp. (°C)
              </TableCell>
              <TableCell align="center" sx={{ width: "200px" }}>
                Elimination
              </TableCell>
              <TableCell align="center" sx={{ width: "100px" }}>
                Alimentation
              </TableCell>
              <TableCell align="center" sx={{ width: "60px" }}>
                Bain
              </TableCell>
              <TableCell align="center" sx={{ width: "60px" }}>
                Soin Cordon
              </TableCell>
              <TableCell align="center" sx={{ width: "60px" }}>
                Soin Visage
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((data, index) =>
              data.affichage.map((item) => (
                <TableRow key={index}>
                  {/* Affiche l'heure */}
                  <TableCell>
                    <div>{item.heure}</div>
                  </TableCell>

                  {/* Affiche le poids uniquement s'il est défini et différent de "N/A" */}
                  <TableCell align="center" sx={{ width: "100px" }}>
                    {item.data && item.data.length > 0 ? (
                      // Filtrer uniquement les objets avec un poids défini
                      item.data.some((innerItem) => innerItem.weight) ? (
                        item.data.map((innerItem, i) =>
                          innerItem.weight ? (
                            <div key={i}>{innerItem.weight} g</div>
                          ) : null
                        )
                      ) : (
                        <p>-</p> // Affiche "-" si aucun poids n'est trouvé dans les objets
                      )
                    ) : (
                      <p>-</p> // Affiche "-" si le tableau est vide ou inexistant
                    )}
                  </TableCell>

                  {/* Affiche la température uniquement si elle est définie et différente de "N/A" */}
                  <TableCell align="center" sx={{ width: "80px" }}>
                    {item.data && item.data.length > 0 ? (
                      // Filtrer uniquement les objets avec un poids défini
                      item.data.some((innerItem) => innerItem.temperature) ? (
                        item.data.map((innerItem, i) =>
                          innerItem.temperature ? (
                            <div key={i}>{innerItem.temperature} °C</div>
                          ) : null
                        )
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p> // Affiche "-" si le tableau est vide ou inexistant
                    )}
                  </TableCell>

                  {/* Affiche l'élimination uniquement si l'une des valeurs est vraie */}
                  <TableCell align="center" sx={{ width: "200px" }}>
                    {item.data && item.data.length > 0 ? (
                      // Filtrer uniquement les objets avec un poids défini
                      item.data.some(
                        (innerItem) => innerItem.urine || innerItem.gambling
                      ) ? (
                        item.data.map((innerItem, i) =>
                          innerItem.urine ? (
                            <div key={i}>
                              {innerItem.urine ? "Urines" : "Non"}{" "}
                              {innerItem.gambling ? "/ Selles" : ""}
                            </div>
                          ) : innerItem.gambling ? (
                            "Selles"
                          ) : (
                            ""
                          )
                        )
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p>
                    )}
                  </TableCell>

                  {/* Affiche l'alimentation uniquement si elle est définie */}
                  <TableCell align="center" sx={{ width: "500px" }}>
                    {item.data && item.data.length > 0 ? (
                      // Filtrer uniquement les objets avec un poids défini
                      item.data.some(
                        (innerItem) =>
                          innerItem.feedingBottle || innerItem.breastFeeding
                      ) ? (
                        item.data.map((innerItem, i) =>
                          innerItem.feedingBottle || innerItem.breastFeeding ? (
                            <div key={i}>
                              {innerItem.feedingBottle.length > 0 ? (
                                <div>
                                  <p>Biberon</p>
                                  <p>
                                    Quantité :{" "}
                                    {innerItem.feedingBottle[0].amount} mL
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p>Allaitement</p>
                                  <p>
                                    Durée :{" "}
                                    {innerItem.breastFeeding[0].duration} min
                                  </p>
                                  <p>
                                    Coté :{" "}
                                    {innerItem.breastFeeding[0].breast.join(
                                      " "
                                    )}
                                  </p>
                                  {innerItem.breastFeeding[0].foodSupplement[0]
                                    .foodSupplementPresent === true ? (
                                    <p>
                                      {
                                        innerItem.breastFeeding[0]
                                          .foodSupplement[0].nameFoodSupplement
                                      }{" "}
                                      /{" "}
                                      {
                                        innerItem.breastFeeding[0]
                                          .foodSupplement[0].method
                                      }{" "}
                                      :{" "}
                                      {
                                        innerItem.breastFeeding[0]
                                          .foodSupplement[0].amount
                                      }{" "}
                                      mL
                                    </p>
                                  ) : (
                                    <p>Ø Complément</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : null
                        )
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p> // Affiche "-" si le tableau est vide ou inexistant
                    )}
                  </TableCell>

                  {/* Affiche le bain uniquement si la valeur est vraie */}
                  <TableCell align="center" sx={{ width: "60px" }}>
                    {item.data && item.data.length > 0 ? (
                      // Filtrer uniquement les objets avec un poids défini
                      item.data.some((innerItem) => innerItem.bath) ? (
                        item.data.map((innerItem, i) =>
                          innerItem.bath ? <div key={i}>Oui</div> : null
                        )
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p>
                    )}
                  </TableCell>

                  {/* Affiche le soin du cordon uniquement si la valeur est vraie */}
                  <TableCell align="center" sx={{ width: "60px" }}>
                    {item.data && item.data.length > 0 ? (
                      item.data.some((innerItem) => innerItem.cordCare) ? (
                        item.data.map((innerItem, i) =>
                          innerItem.cordCare ? <div key={i}>Oui</div> : null
                        )
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p>
                    )}
                  </TableCell>

                  {/* Affiche le soin du visage uniquement si la valeur est vraie */}
                  <TableCell align="center" sx={{ width: "60px" }}>
                    {item.data && item.data.length > 0 ? (
                      item.data.some((innerItem) => innerItem.faceCare) ? (
                        item.data.map((innerItem, i) =>
                          innerItem.faceCare ? <div key={i}>Oui</div> : null
                        )
                      ) : (
                        <p>-</p>
                      )
                    ) : (
                      <p>-</p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Patient;
