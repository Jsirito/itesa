import { useRecoilValue } from "recoil";

import { userState } from "../Home";
import { capitalize } from "../../utils";
import BurgerMenu from "../../components/BurgerMenu";
import S from "./style.module.css";

const UserProfile = () => {
  let user = useRecoilValue(userState);
  if (user.id === "") user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className={S.container}>
      <div className={S.menu}>
        <BurgerMenu />
      </div>
      <div className={S.grid_wrapper}>
        <div className={S.avatar_container}>
          <div
            className={S.avatar}
            style={{ backgroundImage: `url(${user.avatar})` }}
          />
        </div>
        <div>
          <div className={S.displayName}>{capitalize(user.name)}</div>
          <div className={S.email}>{user.email}</div>
        </div>
      </div>
      <div className={S.stats}>
        {/* <div>{user.gender === "M" ? <p>Hombre</p> : <p>Mujer</p>}</div> */}
        <div className={S.box}>
          <div className={S.title}>Puntos</div>
          <div>{user.points}</div>
        </div>
        <div className={S.box}>
          <div className={S.title}>Workouts</div>
          <div>{user.ejerciciosRealizados.length}</div>
        </div>
      </div>
      <div className={S.tabs}>
      <div className={S.workouts}>
        <ul>
          {user.ejerciciosRealizados.map((ex, i) => (
            <li key={i}>
              <b>{ex.reps}</b> × {ex.name}
              <span>{ex?.date && (new Date(ex.date).toDateString())}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
};

export default UserProfile;
