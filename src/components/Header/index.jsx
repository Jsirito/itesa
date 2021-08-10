import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { userState } from "../../views/Home";
import BurgerMenu from "../BurgerMenu";
import S from "./styles.module.css";

const Header = () => {
  const user = useRecoilValue(userState);

  return (
    <div className={S.header}>
      <BurgerMenu />
      <Link to="/perfil">
        <div className={S.avatar} style={{ backgroundImage: `url('${user.avatar}')` }} />
      </Link>
    </div>
  );
};

export default Header;
