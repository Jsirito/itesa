import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import S from "./styles.module.css";

const Search = ({ query, onChange, searchExercises }) => {
  return (
    <div className={S.search_wrapper}>
      <FontAwesomeIcon icon={faSearch} />
      <input
        onChange={onChange}
        onKeyUp={searchExercises}
        type="text"
        placeholder="Buscá tu ejercicio"
        value={query}
      />
    </div>
  );
};

export default Search;
