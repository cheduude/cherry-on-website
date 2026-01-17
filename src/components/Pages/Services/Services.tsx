// src/components/Pages/Services/Services.tsx
import purify from 'dompurify';
import styles from './Services.module.css';
import type { ServicesProps } from '../../../types/index';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';
import { 
  Shield, 
  Server, 
  HardDrive, 
  Router, 
  ShoppingCart, 
  Package,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Cloud,
  CreditCard
} from 'lucide-react';

const services = [
  { 
    name: 'Цифровые Сертификаты', 
    desc: 'Безопасное и анонимное подключение с гарантией конфиденциальности. Поддержка всех устройств.',
    icon: Shield,
    features: ['Анонимность', 'Шифрование трафика', 'Все устройства', '24/7 поддержка'],
    price: 'от 499 ₽/мес'
  },
  { 
    name: 'VPS/VDS', 
    desc: 'Виртуальные серверы с мощным железом и низкой задержкой. Полный root доступ.',
    icon: Server,
    features: ['Root доступ', 'SSD/NVMe', 'Linux/Windows', 'DDoS защита'],
    price: 'от 890 ₽/мес'
  },
  { 
    name: 'NVMe Диски', 
    desc: 'Облачное хранилище на быстрых NVMe накопителях. Аналог Google Диска с повышенной скоростью.',
    icon: HardDrive,
    features: ['Высокая скорость', 'Резервное копирование', 'Общий доступ', 'Шифрование'],
    price: 'от 299 ₽/100 ГБ'
  },
  { 
    name: 'Прошивка роутера', 
    desc: 'Кастомная прошивка + VPN сертификат на год. Оптимизация для игр и стриминга.',
    icon: Router,
    features: ['Прошивка', 'Сертификат на год', 'Настройка', 'Гарантия'],
    price: 'от 2 490 ₽'
  },
  { 
    name: 'Пополнение аккаунтов', 
    desc: 'Steam, ChatGPT, Spotify, Grok и другие сервисы. Моментальное пополнение.',
    icon: ShoppingCart,
    features: ['Моментально', 'Без комиссии', 'Поддержка', 'Безопасно'],
    price: 'курс +0%'
  },
  { 
    name: 'Заказы из-за рубежа', 
    desc: 'Поможем заказать любой товар из США, Европы, Китая. Доставка под ключ.',
    icon: Package,
    features: ['Поиск товара', 'Доставка', 'Таможня', 'Страховка'],
    price: 'услуги + доставка'
  },
];

const Services = ({ isMobile, isAuthenticated }: ServicesProps) => {
  useLenisCleanup();
  const gridClass = isMobile ? styles['grid-mobile'] : styles.grid;

  const handleOrder = (serviceName: string) => {
    // Здесь будет логика заказа
    console.log(`Заказ услуги: ${serviceName}`);
    alert(`Заказ услуги "${serviceName}" отправлен в обработку!`);
  };

  return (
    <div className={styles.services}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Наши услуги</h1>
        <p className={styles.subtitle}>Профессиональные решения для вашего комфорта в цифровом мире</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Zap className={styles.statIcon} />
            <span>Мгновенная активация</span>
          </div>
          <div className={styles.stat}>
            <Sparkles className={styles.statIcon} />
            <span>Гарантия качества</span>
          </div>
          <div className={styles.stat}>
            <Globe className={styles.statIcon} />
            <span>Поддержка 24/7</span>
          </div>
        </div>
      </div>

      <div className={gridClass}>
        {services.map((service, i) => {
          const IconComponent = service.icon;
          return (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <IconComponent className={styles.icon} />
                </div>
                <h3>{service.name}</h3>
                <div className={styles.price}>{service.price}</div>
              </div>
              
              <div className={styles.cardContent}>
                <p dangerouslySetInnerHTML={{ __html: purify.sanitize(service.desc) }} />
                
                <div className={styles.features}>
                  {service.features.map((feature, idx) => (
                    <div key={idx} className={styles.feature}>
                      <Sparkles className={styles.featureIcon} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.cardFooter}>
                {isAuthenticated ? (
                  <button 
                    className={styles.orderButton}
                    onClick={() => handleOrder(service.name)}
                  >
                    <ShoppingCart className={styles.buttonIcon} />
                    Заказать
                  </button>
                ) : (
                  <button className={styles.authButton}>
                    <Lock className={styles.buttonIcon} />
                    Войдите для заказа
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <Cloud className={styles.infoIcon} />
          <h3>Как это работает?</h3>
          <ol className={styles.steps}>
            <li>Выбираете нужную услугу</li>
            <li>Оформляете заказ (требуется авторизация)</li>
            <li>Получаете доступ в личный кабинет</li>
            <li>Активируете услугу за 1 клик</li>
          </ol>
        </div>
        
        <div className={styles.infoCard}>
          <CreditCard className={styles.infoIcon} />
          <h3>Способы оплаты</h3>
          <ul className={styles.paymentMethods}>
            <li>Банковские карты (Visa/Mastercard/Мир)</li>
            <li>Криптовалюта (BTC, USDT, ETH)</li>
            <li>СБП (Система быстрых платежей)</li>
            <li>ЮMoney (Яндекс.Деньги)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Services;