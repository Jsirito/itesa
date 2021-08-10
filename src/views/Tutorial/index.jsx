import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";

import { currentExerciseState } from "../../data/currentExercise";
import S from "./styles.module.css";
import Menu from "../../components/Menu";
import Header from "../../components/Header";
import Timer from "../../components/Timer";

const Tutorial = () => {
  let [showTimer, setShowTimer] = useState(false);
  const currentExercise = useRecoilValue(currentExerciseState);

  let history = useHistory();
  let videoRef = useRef();

  useEffect(() => {
    videoRef.current.addEventListener("playing", () => {
      videoRef.current.classList.add(S.playing);
    });
    if (showTimer) videoRef.current.pause();
  }, [showTimer]);

  return (
    <>
      <Menu />
      <div className={S.grid_wrapper}>
        <div className={S.tutorial_wrapper}>
          <div className={S.header}>
            <Header />
          </div>

          <video ref={videoRef} autoPlay muted loop className={S.video}>
            <source src={currentExercise.video} type="video/mp4" />
          </video>

          <div className={`${S.description} ${showTimer ? S.timer : ""}`}>
            <h2>{currentExercise.name}</h2>
            <button className={S.back} onClick={() => history.goBack()}>
              <FontAwesomeIcon icon={faChevronCircleLeft} /> Atrás
            </button>
            <button onClick={() => setShowTimer(true)}>Empezar Ejercicio</button>
            <Timer show={showTimer} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;
