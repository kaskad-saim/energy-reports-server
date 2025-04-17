import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

const HomePage = () => {
  return (
    <div className={styles['home-page']}>
      <h1 className={styles['home-page__title']}>Узлы учета энергоресурсов</h1>
      <nav className={styles['navigation']}>
        <Link to="/charts" className={styles['navigation__link']}>
          Графики
        </Link>
        <Link to="/reports" className={styles['navigation__link']}>
          Отчеты
        </Link>
        <Link to="/k301" className={styles['navigation__link']}>
          Устройство k301
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;