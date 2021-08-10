import React, { useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import Menu, { showMenuState } from "../../components/Menu";

import { AuthContext } from "../../Auth";
import s from "./styles.module.css";

const Iframe = () => {
  let [showMenu, setShowMenu] = useRecoilState(showMenuState);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    var eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, function (e) {
      if (e.data === "menu" || e.message === "menu") setShowMenu(true);
    });
  });

  return (
    <>
      <Menu />
      <iframe
        title={"MindArJs"}
        className={s.iframe}
        src={`/mindar/index.html#id:${currentUser.uid}`}
      ></iframe>
    </>
  );
};

export default Iframe
