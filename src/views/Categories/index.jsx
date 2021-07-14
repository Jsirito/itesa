import { useParams } from "react-router";
import React from "react";
import { Link } from "react-router-dom";
import Menu from "../../components/Menu";
import Header from "../../components/Header";

import s from "./style.module.css";

const Categories = () => {
  let {name} = useParams()
  return (
    <>
      <Menu />
      <div className={s.grid_wrapper}>
        <Header className={s.header} />
        <div className={s.welcome}>
          <h2>Descubre todos los ejercicios de {name}</h2>
        </div>
        <div className={s.search}>
          <input type="text" placeholder="Buscá tu ejercicio" />
        </div>
        <div className={s.grid}>
        </div>
      </div>
    </>
  );
};

export default Categories;

