/* 

Reconocimiento de poses usando Teachable Machine, 
Ahora esta todo en el componente ClassifyPoses usando tensorflow pose detection con Movenet

import React, { useState, useRef, useEffect } from "react";
import FastAverageColor from "fast-average-color";
import S from "./styles.module.css";
import { useRecoilValue } from "recoil";
import { currentExerciseState } from "../../data/currentExercise";
import BurgerMenu from "../../components/BurgerMenu";
import { userState } from "../Home";
import { db } from "../../../src/base";

const fac = new FastAverageColor();

const Poses = () => {
  let excercises = [
    { name: "curl", model: "9DHjJje2y" },
    { name: "circulito", model: "GnNXiBIym" },
    { name: "sentadillas", model: "Bh8JyU6Vu" },
  ];

  let modelId = excercises[0].model;

  const URL = `https://teachablemachine.withgoogle.com/models/${modelId}/`;
  let [model, setModel] = useState(null);
  let [webcam, setWebcam] = useState(null);
  let [class1, setClass1] = useState(0);
  let [class2, setClass2] = useState(0);
  let [avgColor, setAvgColor] = useState("#000");
  const [reps, setReps] = useState(0);
  const currentExercise = useRecoilValue(currentExerciseState);
  const currentUser = useRecoilValue(userState);
  let [running, setRunning] = useState(false);
  let countdown = useRef();
  let startBtn = useRef();
  let counterRef = useRef();

  let w = window.innerWidth;
  // let h = window.innerHeight;

  let canvasRef = useRef();

  useEffect(() => {
    console.log(">>>");
    if (currentExercise.reps - reps < 1) {
      finished();
    }
  }, [reps]);

  let init = async () => {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    let _model = await window.tmPose.load(modelURL, metadataURL);
    let _maxPredictions = _model.getTotalClasses();
    setModel(_model);

    const flip = true;
    let _webcam = new window.tmPose.Webcam(w, w, flip);
    // let _webcam = new window.tmPose.Webcam(w, h, flip);
    await _webcam.setup();
    await _webcam.play();
    let { height, width } = _webcam.webcam;
    console.log(height, width);
    setWebcam(_webcam);

    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = (height / width) * w;
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(async () => {
    if (!webcam?.update) return;

    let bgColorTimer = setInterval(() => {
      fac.getColorAsync(canvasRef.current).then((c) => setAvgColor(c.rgba));
    }, 1000);

    let ctx = canvasRef.current?.getContext("2d");

    let loop = async () => {
      try {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        webcam.update();
        await predict();
      } catch (e) {
        console.log(e);
      }
      window.requestAnimationFrame(loop);
    };

    loop();

    return () => clearInterval(bgColorTimer);
  }, [webcam?.update]);

  let up = false;
  let down = true;

  let predict = async () => {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    // Voy bajando (down es class1)
    if (prediction[0].probability > 0.8 && !down) {
      setReps((reps) => ++reps);
      down = true;
      up = false;
    }

    // Voy subiendo (up es class2)
    if (prediction[1].probability > 0.8 && !up) {
      up = true;
      down = false;
    }

    setClass1(prediction[0].probability.toFixed(2));
    setClass2(prediction[1].probability.toFixed(2));

    // finally draw the poses
    drawPose(pose);
  };

  let drawPose = async (pose) => {
    let ctx = canvasRef.current?.getContext("2d");

    ctx.drawImage(webcam?.canvas, 0, 0);

    if (pose) {
      const minPartConfidence = 0.5;
      window.tmPose.drawKeypoints(
        pose.keypoints,
        minPartConfidence,
        ctx,
        undefined,
        "red",
        "red"
      );
      window.tmPose.drawSkeleton(
        pose.keypoints,
        minPartConfidence,
        ctx,
        undefined,
        "#6e8afa"
      );
    }
  };

  let finished = () => {
    counterRef.current.style.opacity = '0';
    if (reps === 0) {window.location="/"; return}
    db.collection("users").doc(currentUser.id).update({
      ejerciciosRealizados: [...currentUser.ejerciciosRealizados, {name: currentExercise.name, reps: reps, date: (+new Date())}],
  })
  .then(() => {
      window.location="/";
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
  };

  let startTimer = () => {
    startBtn.current.style.display = "none";
    countdown.current.style.display = "block";
    let cd = countdown.current;
    setTimeout(() => {
      cd.innerText = "2";
    }, 1000);
    setTimeout(() => {
      cd.innerText = "1";
    }, 2000);
    setTimeout(() => {
      cd.innerText = "0";
    }, 3000);
    setTimeout(() => {
      setRunning(true);
    }, 3200);
  };

  return (
    <>
      <div>
        <div className={`${S.ui_container}  ${running ? S.running : ""} `}>
          <div className={S.header}>
            <BurgerMenu />
            <p>{currentExercise.name}</p>
          </div>

          <div className={S.counter}>
            {running ? (
              <div ref={counterRef}>
                <h2>{reps}</h2>
                <h3>Quedan {currentExercise.reps - reps}</h3>
              </div>
            ) : (
              <div className={S.countdown}>
                <h2 ref={countdown}>3</h2>
                <button ref={startBtn} onClick={() => startTimer()}>
                  Empezar
                </button>
              </div>
            )}
          </div>

          {running && (
            <div className={S.buttons}>
              <button onClick={() => finished()}>Terminar</button>
            </div>
          )}
        </div>

        <div className={S.canvas_container} style={{ backgroundColor: avgColor }}>
          <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
      </div>
    </>
  );
};

export default Poses;
 */
