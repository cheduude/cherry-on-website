import { useState } from 'react';
import purify from 'dompurify';
import styles from './Services.module.css';
import type { ServicesProps } from '../../../types';
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
  CreditCard,
  X
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
    name: 'VPS',
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
    name: 'Настройка роутера',
    desc: 'Настройка сетевых параметров устройства + VPN сертификат на год. Оптимизация для игр и стриминга.',
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
  }
];

const Services = ({ isAuthenticated }: ServicesProps) => {
  useLenisCleanup();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleService = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const handleOrder = (serviceName: string) => {
    console.log(`Заказ услуги: ${serviceName}`);
    alert(`Заказ услуги "${serviceName}" отправлен в обработку`);
  };

  return (
    <div className={styles.services}>
      {/* HERO */}
      <div className={styles.hero}>
        <h1 className={styles.title}>Наши услуги</h1>
        <p className={styles.subtitle}>
          Профессиональные решения для вашего комфорта в цифровом мире
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <Zap />
            <span>Мгновенная активация</span>
          </div>
          <div className={styles.stat}>
            <Sparkles />
            <span>Гарантия качества</span>
          </div>
          <div className={styles.stat}>
            <Globe />
            <span>Поддержка 24/7</span>
          </div>
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className={styles.list}>
        {services.map((service, index) => {
          const Icon = service.icon;
          const isOpen = activeIndex === index;
          
          return (
            <div
              key={service.name}
              className={`${styles.item} ${isOpen ? styles.open : ''}`}
              onClick={() => !isOpen && toggleService(index)}
              style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
            >
              {/* HEADER */}
              <div className={styles.itemHeader}>
                <div className={styles.left}>
                  <Icon className={styles.itemIcon} />
                  <div>
                    <h3>{service.name}</h3>
                    <span className={styles.price}>{service.price}</span>
                  </div>
                </div>

                {isOpen && (
                  <button
                    className={styles.close}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleService(index);
                    }}
                  >
                    <X />
                  </button>
                )}
              </div>

              {/* EXPAND */}
              <div className={styles.expand}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: purify.sanitize(service.desc)
                  }}
                />

                <div className={styles.features}>
                  {service.features.map(feature => (
                    <div key={feature} className={styles.feature}>
                      <Sparkles />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.actions}>
                  {isAuthenticated ? (
                    <button
                      className={styles.order}
                      onClick={() => handleOrder(service.name)}
                    >
                      <ShoppingCart />
                      Заказать
                    </button>
                  ) : (
                    <button className={styles.auth}>
                      <Lock />
                      Войдите для заказа
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default Services;
