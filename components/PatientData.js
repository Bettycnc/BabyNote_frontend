import styles from "../styles/PatientData.module.css";
import React, { useEffect, useState } from "react";
import HeaderPro from "./HeaderPro";
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

const Patient = () => {
  const [day, setDay] = useState("");
  const [babiesData, setBabiesData] = useState([]);

  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    fetch(`http://localhost:3000/baby/${user.babies[0]._id}`)
      .then((response) => response.json())
      .then((data) => {
        setBabiesData(data.data);
      });
  }, []);

  console.log(babiesData);

  //   const motherName = babiesData.user_id.lastname;
  const babyName = babiesData.name;
  //   const room = babiesData.user_id.room;

  const ButtonStyle = styled(Button)(({ theme }) => ({
    borderColor: "#bfbfbf",
    color: "#7f7f7f",
    fontVariantCaps: "normal",
    fontWeight: 500,
  }));

  //regruper les données par horaire :

  //   const combineArray = babiesData.alimentation_id
  //     .map((date1) => {
  //       const correspondance = babiesData.temperature_id.find(
  //         (date2) => date2.date === date1.date
  //       );
  //       return correspondance ? { ...date1, ...correspondance } : null;
  //     })
  //     .filter((date) => date !== null);

  const arrDetails = [
    babiesData.alimentation_id,
    babiesData.elimination_id,
    babiesData.care_id,
    babiesData.weight_id,
    babiesData.temperature_id,
  ];
  //   console.log(arrDetails.length);

  //   for (let i = 0; i < arrDetails.length; i++) {
  //     if (i > 0) {
  //       console.log("coucou");
  //     } else {
  //       combineArray = arrDetails[i - 1]
  //         .map((date1) => {
  //           const correspondance = arrDetails[i].find(
  //             (date2) => date2.date === date1.date
  //           );
  //           return correspondance ? { ...date1, ...correspondance } : null;
  //         })
  //         .filter((date) => date !== null);
  //     }
  //     console.log("combine", combineArray);
  //     }
  //   }

  function createData(
    hour,
    weight,
    temperature,
    elimination,
    alimentation,
    bath,
    faceCare,
    cordCare
  ) {
    return {
      hour,
      weight,
      temperature,
      elimination,
      alimentation,
      bath,
      faceCare,
      cordCare,
    };
  }

  const rows = [
    createData(
      "08:35",
      3000,
      36.9,
      "Urine",
      "biberon 50 mL",
      "oui",
      "non",
      "oui"
    ),
    createData(
      "08:40",
      3000,
      36.9,
      "Urine",
      "biberon 50 mL",
      "oui",
      "non",
      "oui"
    ),
  ];

  const handleChange = (event) => {
    setDay(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.h3}>Mme - {babyName}</p>
          <p className={styles.h4}>Chambre </p>
        </div>
        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
      </div>
      <div className={styles.maj}>Dernière mie à jour :</div>
      <div className={styles.select}>
        <Box sx={{ minWidth: 150 }}>
          <FormControl fullWidth>
            <InputLabel id="Jour">Jour</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              value={day}
              label="Day"
              onChange={handleChange}
            >
              <MenuItem value={0}>Jour 0</MenuItem>
              <MenuItem value={1}>Jour 1</MenuItem>
              <MenuItem value={2}>Jour 2</MenuItem>
              <MenuItem value={3}>Jour 3</MenuItem>
              <MenuItem value={4}>Jour 4</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Stack direction="row" spacing={2}>
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Heure</TableCell>
              <TableCell align="right">Poids (g)</TableCell>
              <TableCell align="right">Temp. (°C)</TableCell>
              <TableCell align="right">Elimination</TableCell>
              <TableCell align="right">Alimentation</TableCell>
              <TableCell align="right">Bain</TableCell>
              <TableCell align="right">Soin Cordon</TableCell>
              <TableCell align="right">Soin Visage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.hour}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.hour}
                </TableCell>
                <TableCell align="right">{row.weight}</TableCell>
                <TableCell align="right">{row.temperature}</TableCell>
                <TableCell align="right">{row.elimination}</TableCell>
                <TableCell align="right">{row.alimentation}</TableCell>
                <TableCell align="right">{row.bath}</TableCell>
                <TableCell align="right">{row.faceCare}</TableCell>
                <TableCell align="right">{row.cordCare}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button className={styles.button}>Modifier</button>
    </div>
  );
};

export default Patient;
