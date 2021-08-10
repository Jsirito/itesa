import { useParams } from "react-router";
import React, { useEffect } from "react";
import { atom, useSetRecoilState, useRecoilState } from "recoil";

import { capitalize } from "../../utils";
import { getExercisesInCategory } from "../../data/firestoreQueries";
import useSearch from "../../hooks/useSearch";
import Menu from "../../components/Menu";
import Header from "../../components/Header";
import Card from "../../components/Card";
import Search from "../../components/Search";
import s from "./style.module.css";
import { currentExerciseState } from '../../data/currentExercise';

export const exercisesState = atom({
  key: "exercisesState",
  default: [],
});

const Categories = () => {
  const { query, searching, setSearching, found, searchExercises, onChange, message } =
    useSearch();
  const setCurrentExercise = useSetRecoilState(currentExerciseState);
  const [exercises, setExercises] = useRecoilState(exercisesState);

  let { name } = useParams();

  useEffect(() => {
    getExercisesInCategory(name).then((exercises) => {
      setExercises(exercises);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Menu />
      <div className={s.grid_wrapper}>
        <Header className={s.header} />
        <div className={s.search}>
          <Search query={query} searchExercises={searchExercises} onChange={onChange} />
        </div>
        <div className={s.title}>
          <h2>Descubre todos los ejercicios de {capitalize(name)}</h2>
        </div>
        {!searching && (
          <div className={s.grid}>
            <div className={s.carroussel}>
              {exercises.map((exercise, index) => (
                <div key={index} className={s.item}>
                  <Card exercise={exercise} setCurrentExercise={setCurrentExercise} />
                </div>
              ))}
            </div>
          </div>
        )}
        {searching && (
          <div className={s.search_results_container}>
            {message ? (
              message
            ) : (
              <Card setCurrentExercise={setCurrentExercise} exercise={found} />
            )}
            <div className={s.btn_wrapper}>
              <button className={s.btn} onClick={() => setSearching(false)}>
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;
