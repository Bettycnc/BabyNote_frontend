import styles from "../styles/Home.module.css";
import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.overlay}>
          <Link href={"/connection"}>
            <button className={styles.button}>
              <div>
                <span>Je suis </span>
              </div>
              <div>
                <span className={styles.bold}>un parent</span>
              </div>
            </button>
          </Link>
          <Link href={"/connexionPro"}>
            <button className={styles.button}>
              <div>
                <span>Je fais partie du</span>
              </div>
              <div>
                <span className={styles.bold}>personnel soignant</span>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
