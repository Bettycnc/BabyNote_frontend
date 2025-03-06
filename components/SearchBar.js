import styles from "../styles/SearchBar.module.css";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");

  return (
    <div className={styles.search}>
      <input
        type="text"
        className={styles.input}
        placeholder="Rechercher une patiente"
        id="searchPatient"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <img src="/loupe.svg" alt="Menu" className={styles.icon} />
    </div>
  );
};

export default SearchBar;
