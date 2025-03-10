import { useSelector } from "react-redux";
import styles from "../styles/HeaderPro.module.css";
import React, { useEffect, useState } from "react";
import MenuPro from './MenuPro'


const HeaderPro = () => {
  // const user = useSelector((state) => state.user.value);
  const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false)  
  
  const displayMenu = () => {
    setIsBurgerMenuVisible(true)
  }

  const handelClose = () => {
    setIsBurgerMenuVisible(false)
  }

  return (
      <div className={styles.header}>
        {isBurgerMenuVisible === true && (
          <MenuPro handelClose={handelClose}/>
        )}
        <div>
          <p className={styles.h3}>Bonjour !</p>
          <p className={styles.h4}>Suite de couche</p>
        </div>
        <button style={{backgroundColor: 'transparent', cursor: 'pointer', border:'none'}}  onClick={displayMenu}>
          <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
        </button>    
      </div>
  );
};

export default HeaderPro;
