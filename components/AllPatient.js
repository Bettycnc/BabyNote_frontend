import styles from "../styles/AllPatient.module.css";
import React, { useEffect, useState } from "react";
import HeaderPro from "./HeaderPro";
import SearchBar from "./SearchBar";
import PatientCard from "./PatientCard";

const Patient = () => {
  return (
    <div className={styles.container}>
      <HeaderPro />
      <SearchBar />
      <div className={styles.cardContainer}>
        <PatientCard />
      </div>
    </div>
  );
};

export default Patient;
