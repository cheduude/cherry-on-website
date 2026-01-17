import { CherriesIcon } from '@phosphor-icons/react';
import styles from './CherryLogo.module.css';

const CherryLogo = () => (
  <CherriesIcon
    className={styles.cherryIcon}
    weight="thin"   // можно "light" / "regular" / "bold"
    size={55}       // размер логотипа
  />
);

export default CherryLogo;