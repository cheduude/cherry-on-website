// src/components/Pages/Services/Services.tsx
import purify from 'dompurify';
import styles from './Services.module.css';
import type { ServicesProps } from '../../../types/index';  // Adjust path if needed (e.g., '../../../types' based on structure)

const services = [
  { name: 'VPN', desc: 'Безопасный VPN.' },
  // ... add all
];

const Services = ({ isMobile, isAuthenticated }: ServicesProps) => {
  const gridClass = isMobile ? styles['grid-mobile'] : styles.grid;  // Use isMobile to adapt (fix unused warning)

  return (
    <div className={styles.services}>
      <h2>Наши услуги</h2>
      <div className={gridClass}>
        {services.map((service, i) => (
          <div key={i} className={styles.card}>
            <h3>{service.name}</h3>
            <p dangerouslySetInnerHTML={{ __html: purify.sanitize(service.desc) }} />
            {isAuthenticated && <button>Заказать</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;