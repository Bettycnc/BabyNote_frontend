import { useSelector } from "react-redux";
import styles from "../styles/HeaderPro.module.css";
import React, { useEffect, useState } from "react";
import MenuPro from "./MenuPro";

const HeaderPro = () => {
  const userPro = useSelector((state) => state.userPro.value);
  const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false);

  const displayMenu = () => {
    setIsBurgerMenuVisible(true);
  };

  const handelClose = () => {
    window.location.href = "./listPatient";
    setIsBurgerMenuVisible(false);
  };

  return (
    <div >
      {isBurgerMenuVisible === true && <MenuPro handelClose={handelClose} />}
        <div className={styles.header}>
        <div>
        <p className={styles.h3}>Bonjour {userPro.username} !</p>
        <p className={styles.h4}>Suite de couche</p>
      </div>
      <button
        style={{
          backgroundColor: "transparent",
          cursor: "pointer",
          border: "none",
        }}
        onClick={displayMenu}
      >
        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
      </button>
        </div>
    </div>
  );
};

export default HeaderPro;
