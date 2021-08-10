import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import s from "./style.module.css";

const CategoriesCard = ({ image, name }) => {

  // super ugly aspect-ratio hack, CSS dosn't work on safari
  let card = useRef(null)
  useEffect(()=>{
    card.current.style.height = card.current.getBoundingClientRect().width + 'px'
  },[])

  return (
    <div className={s.card} ref={card} >
      <Link to={`/categories/${name.toLowerCase()}`}>
        <div style={{ backgroundImage: `url('${image}')` }}></div>
      </Link>
      <h4>{name}</h4>
    </div>
  );
};

export default CategoriesCard;
