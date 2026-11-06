// src/pages/Services/Services.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './Services.module.css';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  Shield,
  Server,
  HardDrive,
  Router,
  ShoppingCart,
  Sparkles,
  Zap,
  Globe,
  X,
  Code
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CERTIFICATE_PURCHASE_BOT_URL = 'https://t.me/main_cherryon_bot';

// Маппинг иконок для экспорта в OrdersPage
export const iconMap = {
  Shield,
  Server,
  HardDrive,
  Router,
  ShoppingCart,
  Code
};

const certificateTariffs = [
  { period: '1 месяц', prices: [133, 249, 345, 435, 515, 590] },
  { period: '3 месяца', prices: [366, 685, 990, 1240, 1460, 1660] },
  { period: '6 месяцев', prices: [666, 1240, 1780, 2240, 2640, 2990] },
  { period: '12 месяцев', prices: [1190, 2220, 3180, 3990, 4720, 5380] }
];

const CERTIFICATE_DEVICE_COUNTS = [1, 2, 3, 4, 5, 6] as const;

const formatDeviceLabel = (count: number) => {
  if (count === 1) return '1 устройство';
  if (count < 5) return `${count} устройства`;
  return `${count} устройств`;
};

const services = [
  {
    name: 'Цифровые Сертификаты',
    desc: 'Безопасное подключение с гарантией конфиденциальности. Поддержка всех устройств.',
    icon: Shield,
    features: ['Шифрование трафика', 'Все устройства', '24/7 поддержка'],
    price: 'по тарифам',
    status: 'active'
  },
  {
    name: 'VPS',
    desc: 'Виртуальные серверы с мощным железом и низкой задержкой. Полный root доступ.',
    icon: Server,
    features: ['Root доступ', 'SSD/NVMe', 'HDD', 'Linux/Windows', 'DDoS защита'],
    price: 'Обсуждаемая цена',
    status: 'active'
  },
  {
    name: 'NVMe Диски',
    desc: 'Облачное хранилище на быстрых NVMe накопителях. Аналог Google Диска с повышенной скоростью.',
    icon: HardDrive,
    features: ['Высокая скорость', 'Резервное копирование', 'Общий доступ', 'Шифрование'],
    price: 'Обсуждаемая цена',
    status: 'active'
  },
  {
    name: 'Настройка сетевого оборудования и сетей',
    desc: 'Настройка сетевых параметров устройства + цифровой сертификат на год. Оптимизация для игр и стриминга.',
    icon: Router,
    features: ['Сертификат на год', 'Настройка', 'Гарантия'],
    price: 'Обсуждаемая цена',
    status: 'active'
  },
  {
    name: 'Пополнение аккаунтов',
    desc: 'Steam, ChatGPT, Spotify, Grok и другие сервисы. Моментальное пополнение.',
    icon: ShoppingCart,
    features: ['Гарантия', 'Поддержка', 'Безопасно'],
    price: 'Обсуждаемая цена',
    status: 'active'
  },
  {
    name: 'Разработка под заказ',
    desc: 'Разработка ботов, сайтов, мобильных приложений и другого программного обеспечения под ваши задачи.',
    icon: Code,
    features: ['Боты', 'Сайты', 'Мобильные приложения', 'Индивидуальный подход'],
    price: 'Обсуждаемая цена',
    status: 'active'
  }
];

const Services = () => {
  const location = useLocation();
  useLenisCleanup();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [certificatePeriodIndex, setCertificatePeriodIndex] = useState(0);
  const [certificateDeviceCount, setCertificateDeviceCount] = useState<typeof CERTIFICATE_DEVICE_COUNTS[number]>(1);

  const selectedCertificatePrice =
    certificateTariffs[certificatePeriodIndex]?.prices[certificateDeviceCount - 1] ?? null;
  
  const isFirstRender = useRef(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollTriggers = useRef<ScrollTrigger[]>([]);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastAutoOpenId = useRef<string | null>(null);

  // Инициализируем массив refs для услуг
  useEffect(() => {
    serviceRefs.current = serviceRefs.current.slice(0, services.length);
  }, []);

  // Функция для плавной прокрутки к элементу
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setTimeout(() => {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const headerHeight = document.querySelector('header')?.clientHeight || 80;
      const offset = headerHeight + 40;
      
      window.scrollTo({
        top: absoluteElementTop - offset,
        behavior: 'smooth'
      });

      setTimeout(() => {
        const checkRect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isFullyVisible = checkRect.top >= offset && 
                               checkRect.bottom <= viewportHeight;
        
        if (!isFullyVisible) {
          const centerPosition = absoluteElementTop - (viewportHeight / 2) + (checkRect.height / 2);
          window.scrollTo({
            top: centerPosition - 100,
            behavior: 'smooth'
          });
        }
      }, 300);
    }, 100);
  }, []);

  // Функция для автоматического открытия услуги
  const autoOpenService = useCallback(() => {
    if (hasAutoOpened) return;

    try {
      const serviceIdStr = sessionStorage.getItem('autoOpenServiceId');
      const timestampStr = sessionStorage.getItem('autoOpenTimestamp');
      
      if (serviceIdStr && timestampStr) {
        const serviceId = parseInt(serviceIdStr, 10);
        const timestamp = parseInt(timestampStr, 10);
        const currentTime = Date.now();
        const isRecent = currentTime - timestamp < 5000;
        const isNewRequest = lastAutoOpenId.current !== `${serviceId}-${timestamp}`;
        
        if (!isNaN(serviceId) && serviceId >= 0 && serviceId < services.length && isRecent && isNewRequest) {
          lastAutoOpenId.current = `${serviceId}-${timestamp}`;
          setActiveIndex(serviceId);
          setHasAutoOpened(true);
          sessionStorage.removeItem('autoOpenServiceId');
          sessionStorage.removeItem('autoOpenTimestamp');
          
          setTimeout(() => {
            scrollToElement(`service-${serviceId}`);
          }, 300);
          
          return true;
        }
      }
    } catch (error) {
      console.error('Ошибка при автоматическом открытии услуги:', error);
    }
    
    return false;
  }, [hasAutoOpened, scrollToElement]);

  // Функция переключения
  const toggleService = useCallback((index: number) => {
    setActiveIndex(prev => {
      const newIndex = prev === index ? null : index;
      return newIndex;
    });
  }, []);

  // Обработчик перехода к заказам
  const handleContactSupport = useCallback(() => {
    window.location.href = '/support';
  }, []);

  // Инициализация GSAP
  useEffect(() => {
    if (isFirstRender.current) {
      const initAnimations = () => {
        scrollTriggers.current.forEach(trigger => trigger.kill());
        scrollTriggers.current = [];

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

        const listTrigger = ScrollTrigger.create({
          trigger: `.${styles.list}`,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(`.${styles.item}`,
              {
                opacity: 0,
                y: 30
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                clearProps: "y"
              }
            );
          },
          once: true
        });

        scrollTriggers.current.push(listTrigger);

        const ctaTrigger = ScrollTrigger.create({
          trigger: `.${styles.ctaSection}`,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(`.${styles.ctaSection}`,
              {
                opacity: 0,
                y: 30
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: "y"
              }
            );
          },
          once: true
        });

        scrollTriggers.current.push(ctaTrigger);
      };

      const timer = setTimeout(() => {
        initAnimations();
        autoOpenService();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        scrollTriggers.current.forEach(trigger => trigger.kill());
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, [autoOpenService]);

  // Обновляем ScrollTrigger при изменении активного индекса
  useEffect(() => {
    if (activeIndex !== null) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  // Также пытаемся открыть услугу при каждом переходе на страницу
  useEffect(() => {
    if (!hasAutoOpened) {
      const timer = setTimeout(() => {
        autoOpenService();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, hasAutoOpened, autoOpenService]);

  // Обработчик изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (activeIndex !== null) {
        setTimeout(() => {
          const element = document.getElementById(`service-${activeIndex}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const headerHeight = document.querySelector('header')?.clientHeight || 80;
            const offset = headerHeight + 40;
            
            if (rect.top < offset || rect.bottom > viewportHeight) {
              scrollToElement(`service-${activeIndex}`);
            }
          }
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, scrollToElement]);

  // Функция для получения текста статуса
  const getStatusText = (status: string) => {
    switch(status) {
      case 'development':
        return 'В разработке';
      case 'test':
        return 'Тестовый режим';
      default:
        return null;
    }
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
        <div className={styles.list}>
          {services.map((service, index) => {
            const Icon = service.icon;
            const isOpen = activeIndex === index;
            const statusText = getStatusText(service.status);
            const isCertificate = service.name === 'Цифровые Сертификаты';
            
            return (
              <div
                key={service.name}
                id={`service-${index}`}
                ref={el => {
                  serviceRefs.current[index] = el;
                }}
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
                      <div className={styles.titleBlock}>
                        <h3>{service.name}</h3>
                        <span className={styles.price}>{service.price}</span>
                      </div>
                      {statusText && (
                        <div className={styles.statusContainer}>
                          <span className={`${styles.statusBadge} ${service.status === 'development' ? styles.statusDevelopment : styles.statusTest}`}>
                            {statusText}
                          </span>
                        </div>
                      )}
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

                    {/* Если это Цифровые Сертификаты — конфигуратор срока и устройств */}
                    {isCertificate ? (
                      <div
                        className={styles.certificateConfig}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={styles.configFields}>
                          <label className={styles.configField}>
                            <span className={styles.configLabel}>Срок</span>
                            <select
                              className={styles.configSelect}
                              value={certificatePeriodIndex}
                              onChange={(e) => setCertificatePeriodIndex(Number(e.target.value))}
                              aria-label="Срок сертификата"
                            >
                              {certificateTariffs.map(({ period }, index) => (
                                <option key={period} value={index}>
                                  {period}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className={styles.configField}>
                            <span className={styles.configLabel}>Устройства</span>
                            <select
                              className={styles.configSelect}
                              value={certificateDeviceCount}
                              onChange={(e) =>
                                setCertificateDeviceCount(
                                  Number(e.target.value) as typeof CERTIFICATE_DEVICE_COUNTS[number]
                                )
                              }
                              aria-label="Количество устройств"
                            >
                              {CERTIFICATE_DEVICE_COUNTS.map((count) => (
                                <option key={count} value={count}>
                                  {formatDeviceLabel(count)}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className={styles.configPriceBlock} aria-live="polite">
                          <span className={styles.configPriceLabel}>Стоимость</span>
                          <span className={styles.configPriceValue}>
                            {selectedCertificatePrice !== null
                              ? `${selectedCertificatePrice.toLocaleString('ru-RU')} ₽`
                              : '—'}
                          </span>
                        </div>

                        <p className={styles.purchaseNote}>
                          Покупка и оформление сертификата выполняются в Telegram-боте.
                        </p>
                        <a
                          className={styles.serviceAction}
                          href={CERTIFICATE_PURCHASE_BOT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Купить сертификат
                        </a>
                      </div>
                    ) : (
                      <>
                        {/* Обычные фичи для других услуг */}
                        <div className={styles.features}>
                          {service.features.map((feature, idx) => (
                            <div key={idx} className={styles.feature}>
                              <Sparkles className={styles.featureIcon} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Эти услуги оформляются по согласованию; заказа и оплаты через сайт пока нет. */}
                        <div className={styles.actions}>
                          <Link
                            to="/support"
                            className={styles.serviceAction}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Написать в техподдержку
                          </Link>
                        </div>
                      </>
                    )}
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
