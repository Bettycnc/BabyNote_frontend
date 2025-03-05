import styles from "../styles/PatientCard.module.css";
import { useState } from "react";

const PatientCard = () => {
  const [search, setSearch] = useState("");

  return <div className={styles.card}>Carte patiente</div>;
};

export default PatientCard;
