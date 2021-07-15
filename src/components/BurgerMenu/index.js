import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";

import { showMenuState } from "../../components/Menu";
import S from "./styles.module.css";

const BurgerMenu = () => {
  let [showMenu, setShowMenu] = useRecoilState(showMenuState);
  console.log("showMenu en BurgerMenu", showMenu);

  return (
    <div>
      <FontAwesomeIcon
        className={S.icon}
        icon={faBars}
        onClick={() => {
          console.log("hola");
          setShowMenu(true);
        }}
      />
    </div>
  );
};

export default BurgerMenu;
