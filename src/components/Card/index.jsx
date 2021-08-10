import React from "react";
import { Link } from "react-router-dom";
import s from "./style.module.css";

const Card = ({ exercise, setCurrentExercise }) => {
  return (
    <div className={s.card}>
      <div className={s.title}>{exercise.name}</div>
      <div className={s.features}>
        <ul>
          <li>Necesitas...</li>
          {exercise.needs && <li>{exercise.needs.join(", ")}</li>}
        </ul>
      </div>
      <div className={s.image_container}
        style={{ backgroundImage: `url('${exercise.image}')` }}
      >
        {/* <img className={s.image} src={exercise.image} alt={exercise.name} /> */}
      </div>
      <div className={s.btn_wrapper}>
        <Link
          to={`/tutorial/`}
          className={s.btn}
          onClick={() => setCurrentExercise(exercise)}
        >
          Ver Tutorial
        </Link>
      </div>
    </div>
  );
};

export default Card;
