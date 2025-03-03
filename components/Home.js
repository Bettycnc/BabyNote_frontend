import styles from "../styles/Home.module.css";
import React, { useState } from "react";

const HomePage = () => {
  const [page, setPage] = useState("home");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.overlay}>
          <button className={styles.button} onClick={() => setPage("auth")}>
            Je suis <span className="bold">un parent</span>
          </button>
          <button className={styles.button}>
            Je fais partie du <span className="bold">Personnel soignant</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
