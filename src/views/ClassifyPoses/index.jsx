import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { Link, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { useHistory } from "react-router-dom";

import { userState } from "../Home";
import { currentExerciseState } from "../../data/currentExercise";
import { addNewExercise } from "../../data/firestoreQueries";
import BurgerMenu from "../../components/BurgerMenu";
import S from "./styles.module.css";

// poseDetection
let detector = null;
poseDetection
  .createDetector(poseDetection.SupportedModels.MoveNet)
  .then((d) => (detector = d));

let myModel = null;

const ClassifyPoses = () => {
  const history = useHistory();
  const { exerciseName } = useParams();
  const currentExercise = useRecoilValue(currentExerciseState);
  const currentUser = useRecoilValue(userState);
  let webcamRef = useRef(null);
  let canvasRef = useRef(null);
  let canvas2Ref = useRef(null);
  let jsonRef = useRef(null);
  let binRef = useRef(null);
  let timerRef = useRef(null);
  let [totalReps, setTotalReps] = useState(currentExercise.reps);

  let [prediction, setPrediction] = useState(null);

  let [currentRep, setCurrentRep] = useState([+new Date(), +new Date(), +new Date()]);
  let [posePrediction, setPosePrediction] = useState(0);
  let [reps, setReps] = useState(0);
  const poseRef = useRef(posePrediction);
  poseRef.current = posePrediction;

  useEffect(() => {
    let diff1 = currentRep[1] - currentRep[0];
    let diff2 = currentRep[2] - currentRep[1];
    if (diff1 > 500 && diff2 > 1000 && poseRef.current === 0) setReps((r) => {
      if (totalReps - reps === 1) {
        addNewExercise(currentUser, currentExercise, reps+1);
        history.push('/')
        return r
      } else {
        return r+1;
      }
    });
  }, [currentRep]);

  useEffect(() => {
    setCurrentRep((moves) => moves.slice(1).concat([+new Date()]));
  }, [posePrediction]);

  useEffect(() => {
    let ctx,
      ctxW,
      ctxH,
      ctx2,
      lastResult = 0.5;

    loadModel();

    let loop = async () => {
      let result = null;

      if (!webcamRef.current) return;

      try {
        const { keypoints } = (await detector.estimatePoses(webcamRef.current.video))[0];

        if (myModel !== null) {
          let _xs = keypoints.map(({ x, y }) => [x, y]).flat();
          let xs = tf.tensor2d([_xs]);
          result = myModel.predict(xs).dataSync()[0];
          if (Math.round(result) !== poseRef.current) {
            console.log(result);
            setPosePrediction(Math.round(result));
          }
        }

        let { x: x1, y: y1, score: s1 } = keypoints[5];
        let { x: x2, y: y2, score: s2 } = keypoints[6];
        let neck = { x: (x1 + x2) / 2, y: (y1 + y2) / 2, score: (s1 + s2) / 2 };
        let { x: x3, y: y3, score: s3 } = keypoints[3];
        let { x: x4, y: y4, score: s4 } = keypoints[4];
        let head = { x: (x3 + x4) / 2, y: (y3 + y4) / 2, score: (s3 + s4) / 2 };
        keypoints.push(neck);
        keypoints.push(head);

        draw(keypoints, ctx, result);
      } catch (e) {
        console.log(e);
      }
      requestAnimationFrame(loop);
    };

    let draw = (keypoints, ctx, result) => {
      let color =
        result === null
          ? "rgba(155,0,100,.7)"
          : `rgba(${255 * (1 - result)},0,${255 * result},.7)`;

      // little canvas
      ctx2.globalCompositeOperation = "copy";
      ctx2.drawImage(ctx2.canvas, -4, 0);
      ctx2.globalCompositeOperation = "source-over";
      ctx2.fillStyle = result === null ? "rgba(0,0,0,.3)" : color;
      if (result === null) {
        ctx2.fillRect(116, 23, 4, 4);
      } else {
        ctx2.fillRect(116, 5 + (40 * result - 2), 4, 4);
      }

      ctx.clearRect(0, 0, ctxW, ctxH);
      // ctx.fillStyle = "rgba(0,0,0,.4)";
      // ctx.fillRect(0, 0, ctxW, ctxH);

      let lines = [
        [4, 2],
        [2, 0],
        [0, 1],
        [1, 3],
        [5, 7],
        [7, 9],
        [6, 8],
        [8, 10],
        [5, 6],
        [18, 17],
        [5, 11],
        [6, 12],
        [11, 13],
        [13, 15],
        [11, 12],
        [12, 14],
        [14, 16],
      ];
      let { x: x1, y: y1, score: s1 } = keypoints[1];
      let { x: x2, y: y2, score: s2 } = keypoints[2];

      ctx.lineWidth = Math.hypot(x1 - x2, y1 - y2) * 0.2;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      lines.map((line) => {
        let treshold = true;
        ctx.beginPath();
        line.map((i, k) => {
          let { x, y, score } = keypoints[i];
          if (score < 0.3) treshold = false;
          if (k === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        if (treshold) ctx.stroke();
      });

      keypoints.map(({ x, y, score }) => {
        if (score > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    };

    webcamRef.current.video.addEventListener("loadeddata", () => {
      let { top, left, height, width } = webcamRef.current.video.getBoundingClientRect();
      canvasRef.current.height = height;
      canvasRef.current.width = width;
      ctxW = width;
      ctxH = height;
      ctx = canvasRef.current.getContext("2d");
      ctx2 = canvas2Ref.current.getContext("2d");
      loop();
    });
  }, []);

  const loadModel = async () => {
    // myModel = await tf.loadLayersModel(`/posesModels/curldebiceps/curldebiceps.json`);
    myModel = await tf.loadLayersModel(
      `/posesModels/${exerciseName}/${exerciseName}.json`
    );
  };

  const onStop = async () => {
    addNewExercise(currentUser, currentExercise, reps);
  };

  return (
    <>
      {/* <Menu/> */}
      <div className={S.header}>
        <BurgerMenu />
        <div className={S.title}>
          <h3>{currentExercise.name}</h3>
        </div>
      </div>

      <div className={S.center_container_reps}>
        <div>
          <h1>{reps}</h1>
          <h2>Quedan {totalReps - reps}</h2>
          <Link to="/">
            <button onClick={onStop}>TERMINAR</button>
          </Link>
        </div>
      </div>
      <div className={S.center_container_cv}>
        <canvas ref={canvasRef} />
      </div>
      <div className={S.center_container}>
        <Webcam ref={webcamRef} />
      </div>

      <div className={S.panel}>
        <div>
          <canvas height={50} width={120} ref={canvas2Ref} className={S.panel_canvas} />
          <div className={S.timer} ref={timerRef}>
            <div className={posePrediction === 0 ? S.red : S.blue} />
          </div>
        </div>
      </div>

      <h1>{reps}</h1>
    </>
  );
};

export default ClassifyPoses;