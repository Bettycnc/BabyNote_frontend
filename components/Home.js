import styles from '../styles/Home.module.css';
import React, { useState, Link } from "react";
//import Authentification from "./Login/Authentification";
import InscriptionPro from "./InscriptionPro";

const HomePage = () => {
  const [page, setPage] = useState("home");
  
  return (
    <div className={styles.container}>
      {
      //page === "home" ? (
        <div className={styles.card}>
          <div className={styles.overlay}>
            <button 
              className={styles.button} 
              onClick={() => setPage("auth")}
            >
              Je suis <span className="bold">un parent</span>
            </button>
            <button className={styles.button} onclick={()=>setPage("")}>
              Je fais partie du <span className="bold">Personnel soignant</span>
            </button>

          


          </div>
        </div>
     // ) 
      
     // : 
      // (
      //   <Authentification /> // Affiche le composant sans changer de page
      // )


      }
    </div>
  );
};

export default HomePage;
