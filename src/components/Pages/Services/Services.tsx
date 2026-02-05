import { useState, useEffect, useRef } from 'react';
import purify from 'dompurify';
import styles from './Services.module.css';
import type { ServicesProps } from '../../../types';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

gsap.registerPlugin(ScrollTrigger);

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
  const isFirstRender = useRef(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Инициализация GSAP анимаций
  useEffect(() => {
    if (isFirstRender.current) {
      const timer = setTimeout(() => {
        // Анимация для героя
        const heroTl = gsap.timeline();
        heroTl
          .fromTo(`.${styles.heroTitle}`,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          )
          .fromTo(`.${styles.heroSubtitle}`,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.5'
          );

        // Анимация для статистики
        gsap.fromTo(`.${styles.stat}`,
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.2
          }
        );

        // Анимация для элементов списка
        gsap.fromTo(`.${styles.item}`,
          {
            opacity: 0,
            y: 30
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: `.${styles.list}`,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              markers: false
            }
          }
        );

        // Анимация для CTA секции - упрощенная версия
        const ctaElement = document.querySelector(`.${styles.ctaSection}`);
        if (ctaElement) {
          gsap.fromTo(ctaElement,
            {
              opacity: 0,
              y: 50
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: ctaElement,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
                markers: false
              }
            }
          );
        }

        isFirstRender.current = false;
      }, 300);
      
      return () => {
        clearTimeout(timer);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, []);

  const toggleService = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const handleOrder = (serviceName: string) => {
    console.log(`Заказ услуги: ${serviceName}`);
    alert(`Заказ услуги "${serviceName}" отправлен в обработку`);
  };

  const handleContactSupport = () => {
    window.location.href = '/support';
  };

  const handleLeaveRequest = () => {
    window.location.href = '/contact';
  };

  return (
    <div className={styles.container}>
      {/* Герой секция */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Наши <span className={styles.gradientText}>услуги</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Профессиональные решения для вашего комфорта в цифровом мире
          </p>

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
      </section>

      {/* Список услуг */}
      <section ref={listRef} className={styles.servicesListSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Все <span className={styles.gradientText}>услуги</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Выберите решение, которое подходит именно вам. Нажмите на услугу для подробностей
          </p>
        </div>

        <div className={styles.list}>
          {services.map((service, index) => {
            const Icon = service.icon;
            const isOpen = activeIndex === index;
            
            return (
              <div
                key={service.name}
                className={`${styles.item} ${isOpen ? styles.open : ''}`}
                onClick={() => !isOpen && toggleService(index)}
                style={{ 
                  '--index': index,
                  animationDelay: `${index * 0.1}s`
                } as React.CSSProperties}
              >
                {/* Заголовок */}
                <div className={styles.itemHeader}>
                  <div className={styles.left}>
                    <div className={styles.iconWrapper}>
                      <Icon className={styles.itemIcon} />
                    </div>
                    <div className={styles.itemInfo}>
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
                      aria-label="Закрыть"
                    >
                      <X className={styles.closeIcon} />
                    </button>
                  )}
                </div>

                {/* Раскрывающийся контент */}
                <div className={`${styles.expand} ${isOpen ? styles.expandOpen : ''}`}>
                  <div className={styles.expandContent}>
                    <p className={styles.serviceDescription}>
                      {service.desc}
                    </p>

                    <div className={styles.features}>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className={styles.feature}>
                          <Sparkles className={styles.featureIcon} />
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
                          <ShoppingCart className={styles.buttonIcon} />
                          Заказать
                        </button>
                      ) : (
                        <button className={styles.auth}>
                          <Lock className={styles.buttonIcon} />
                          Войдите для заказа
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA секция */}
      <section ref={ctaRef} className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Не нашли нужную услугу?
            </h2>
            <p className={styles.ctaText}>
              Свяжитесь с нами, и мы подберем индивидуальное решение для ваших задач
            </p>
            <div className={styles.ctaButtons}>
              <button
                className={styles.ctaButtonPrimary}
                onClick={handleContactSupport}
              >
                Связаться с поддержкой
              </button>
              <button
                className={styles.ctaButtonSecondary}
                onClick={handleLeaveRequest}
              >
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;