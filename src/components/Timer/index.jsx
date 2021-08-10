import React, { useEffect, useRef } from "react";
import S from "./styles.module.css";
import { Link } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { currentExerciseState } from "../../data/currentExercise";

const debounce = (fn, timeout = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
};

const Timer = ({ show }) => {
  const currentExercise = useRecoilValue(currentExerciseState);
  const currentExerciseName = currentExercise.name.replace(/\s/g, "").toLocaleLowerCase();
  return (
    show && (
      <div className={S.timer_wrapper}>
        <h3>Cuántas repeticiones?</h3>
        <Dial />
        <Link to={`/poses/${currentExerciseName}`}>
          <button>Empezar</button>
        </Link>
      </div>
    )
  );
};

/*
 dialRef.current
          .getElementsByClassName(S.selected)[0]
          ?.classList.remove(S.selected);
        document.elementFromPoint(x_, y_)?.classList.add(S.selected);
*/

const Dial = () => {
  let dialRef = useRef();
  // const [reps, setReps] = useState(0);
  // const [selectedNum, setSelectedNum] = useState("");
  const setCurrentExercise = useSetRecoilState(currentExerciseState);

  useEffect(() => {
    setCurrentExercise((exc) => ({ ...exc, reps: 1 }));
    dialRef.current.addEventListener(
      "scroll",
      debounce(() => {
        let { top, height } = dialRef.current.querySelector("li").getBoundingClientRect();

        let x_ = dialRef.current.getBoundingClientRect().width / 2;
        let y_ = top + height / 2;

        dialRef.current
          .getElementsByClassName(S.selected)[0]
          ?.classList.remove(S.selected);

        let middle = document.elementFromPoint(x_, y_);
        if (middle) {
          setCurrentExercise((exc) => ({ ...exc, reps: middle.innerText }));
          middle.classList.add(S.selected);
        }
      })
    );
  }, []); // [window.innerWidth]);

  return (
    <div className={S.dial} ref={dialRef}>
      <ul>
        {[...Array(51).keys()].slice(1).map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
    </div>
  );
};

export default Timer;
