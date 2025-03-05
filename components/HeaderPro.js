import { useSelector } from "react-redux";
import styles from "../styles/HeaderPro.module.css";
import React, { useEffect, useState } from "react";

const HeaderPro = () => {
  const user = useSelector((state) => state.user.value);

  return (
    <div className={styles.header}>
      <div>
        <p className={styles.h3}>Bonjour {user.username} !</p>
        <p className={styles.h4}>Suite de couche</p>
      </div>
      <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
    </div>
  );
};

export default HeaderPro;
