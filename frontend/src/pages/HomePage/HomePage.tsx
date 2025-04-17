// src/pages/HomePage/HomePage.tsx
import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

const devices = [
  {
    id: 'k301',
    name: 'Узел учета K301',
    description: 'Устройство контроля энергопотребления в цехе №3',
  },
  // Здесь можно добавить другие устройства в будущем
];

const HomePage = () => {
  return (
    <div className={styles['home-page']}>
      <h1 className={styles['home-page__title']}>Узлы учета энергоресурсов</h1>

      <div className={styles['devices-container']}>
        {devices.map((device) => (
          <div key={device.id} className={styles['device-card']}>
            <h2 className={styles['device-card__title']}>{device.name}</h2>
            <p className={styles['device-card__description']}>{device.description}</p>

            <div className={styles['device-card__buttons']}>
              <Link
                to={`/${device.id}`}
                className={styles['device-card__button']}
              >
                Текущие параметры
              </Link>

              <Link
                to={`/${device.id}/charts`}
                className={styles['device-card__button']}
              >
                Графики
              </Link>

              <Link
                to={`/${device.id}/reports`}
                className={styles['device-card__button']}
              >
                Отчеты
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;