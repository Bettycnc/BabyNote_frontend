import styles from "../styles/SearchBar.module.css";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");

  const names = ["Alice", "Bob", "Charlie", "Diana"];
  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );
  console.log(search);

  return (
    <div>
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
      <ul>
        {filteredNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
