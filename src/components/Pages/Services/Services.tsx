import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './Services.module.css';
import type { ServicesProps } from '../../../types';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../contexts/NotificationContext';
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
  Lock,
  X,
  Code
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Маппинг иконок для экспорта в OrdersPage
export const iconMap = {
  Shield,
  Server,
  HardDrive,
  Router,
  ShoppingCart,
  Code
};

// Интерфейс для заказа
interface Order {
  id: string;
  customer_uuid: string;
  status: 'NEW' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  shop_card: {
    uuid: string;
    name: string;
    description: string;
    category: string;
    price: number;
    visible: boolean;
    iconName: keyof typeof iconMap;
  };
  price: number;
  created_at: number;
}

// Обновленный массив услуг с UUID и price для заказов
const services = [
  {
    name: 'Цифровые Сертификаты',
    desc: 'Безопасное подключение с гарантией конфиденциальности. Поддержка всех устройств.',
    icon: Shield,
    iconName: 'Shield' as const,
    features: ['Шифрование трафика', 'Все устройства', '24/7 поддержка'],
    price: 'от 499 ₽/мес',
    priceValue: 499,
    uuid: 'cert-001',
    id: 0,
    status: 'development'
  },
  {
    name: 'VPS',
    desc: 'Виртуальные серверы с мощным железом и низкой задержкой. Полный root доступ.',
    icon: Server,
    iconName: 'Server' as const,
    features: ['Root доступ', 'SSD/NVMe', 'HDD', 'Linux/Windows', 'DDoS защита'],
    price: 'от 890 ₽/мес',
    priceValue: 890,
    uuid: 'vps-001',
    id: 1,
    status: 'test'
  },
  {
    name: 'NVMe Диски',
    desc: 'Облачное хранилище на быстрых NVMe накопителях. Аналог Google Диска с повышенной скоростью.',
    icon: HardDrive,
    iconName: 'HardDrive' as const,
    features: ['Высокая скорость', 'Резервное копирование', 'Общий доступ', 'Шифрование'],
    price: 'от 299 ₽/100 ГБ',
    priceValue: 299,
    uuid: 'nvme-001',
    id: 2,
    status: 'active'
  },
  {
    name: 'Настройка сетевого оборудования и сетей',
    desc: 'Настройка сетевых параметров устройства + цифровой сертификат на год. Оптимизация для игр и стриминга.',
    icon: Router,
    iconName: 'Router' as const,
    features: ['Сертификат на год', 'Настройка', 'Гарантия'],
    price: 'от 2 490 ₽',
    priceValue: 2490,
    uuid: 'network-001',
    id: 3,
    status: 'active'
  },
  {
    name: 'Пополнение аккаунтов',
    desc: 'Steam, ChatGPT, Spotify, Grok и другие сервисы. Моментальное пополнение.',
    icon: ShoppingCart,
    iconName: 'ShoppingCart' as const,
    features: ['Гарантия', 'Поддержка', 'Безопасно'],
    price: 'курс +1000%',
    priceValue: 0,
    uuid: 'topup-001',
    id: 4,
    status: 'active'
  },
  {
    name: 'Разработка под заказ',
    desc: 'Разработка ботов, сайтов, мобильных приложений и другого программного обеспечения под ваши задачи.',
    icon: Code,
    iconName: 'Code' as const,
    features: ['Боты', 'Сайты', 'Мобильные приложения', 'Индивидуальный подход'],
    price: 'договорная',
    priceValue: 0,
    uuid: 'dev-001',
    id: 5,
    status: 'active'
  }
];

// Ключ для хранения заказов в localStorage
const ORDERS_STORAGE_KEY = 'user_orders';

const Services = (_props: ServicesProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  useLenisCleanup();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // ХУКИ
  const { isAuthenticated, user } = useAuth();
  const { showInfo, showSuccess, showError } = useNotifications();
  
  const isFirstRender = useRef(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollTriggers = useRef<ScrollTrigger[]>([]);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastAutoOpenId = useRef<string | null>(null);

  // Функция для получения заказов из localStorage
  const getStoredOrders = useCallback((): Order[] => {
    if (!user?.id) return [];
    
    const stored = localStorage.getItem(`${ORDERS_STORAGE_KEY}_${user.id}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored orders:', e);
        return [];
      }
    }
    return [];
  }, [user?.id]);

  // Функция для сохранения заказов в localStorage
  const saveOrders = useCallback((orders: Order[]) => {
    if (!user?.id) return;
    localStorage.setItem(`${ORDERS_STORAGE_KEY}_${user.id}`, JSON.stringify(orders));
  }, [user?.id]);

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

  // Обработчик покупки - заглушка
  const handleOrder = useCallback(async (service: typeof services[0]) => {
    if (!isAuthenticated) {
      showError('Ошибка', 'Необходимо авторизоваться для покупки');
      return;
    }
    
    if (!user) {
      showError('Ошибка', 'Данные пользователя не найдены');
      return;
    }

    if (!user.id) {
      showError('Ошибка', 'ID пользователя не найден');
      return;
    }

    setIsCreatingOrder(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const existingOrders = getStoredOrders();
      
      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customer_uuid: String(user.id),
        status: 'NEW',
        shop_card: {
          uuid: service.uuid,
          name: service.name,
          description: service.desc,
          category: service.id.toString(),
          price: service.priceValue,
          visible: true,
          iconName: service.iconName
        },
        price: service.priceValue,
        created_at: Date.now()
      };

      const updatedOrders = [newOrder, ...existingOrders];
      saveOrders(updatedOrders);

      showSuccess(
        'Заказ создан',
        `Услуга "${service.name}" добавлена в ваши заказы`,
        3000
      );

      showInfo(
        'Оплата в разработке',
        'В будущем вы сможете оплатить заказ онлайн. Пока что заказ сохранен в вашем списке.',
        5000
      );

    } catch (error: any) {
      console.error('❌ Order creation error:', error);
      showError(
        'Ошибка при создании заказа',
        error.message || 'Попробуйте позже или обратитесь в поддержку'
      );
    } finally {
      setIsCreatingOrder(false);
    }
  }, [isAuthenticated, user, showSuccess, showError, showInfo, getStoredOrders, saveOrders]);

  // Обработчик перехода к заказам
  const handleGoToOrders = useCallback(() => {
    navigate('/orders');
  }, [navigate]);

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
                      <div className={styles.titleRow}>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrder(service);
                          }}
                          disabled={isCreatingOrder}
                        >
                          <ShoppingCart className={styles.buttonIcon} />
                          {isCreatingOrder ? 'Добавление...' : 'Купить'}
                        </button>
                      ) : (
                        <Link
                          to="/auth"
                          className={styles.authLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Lock className={styles.buttonIcon} />
                          Войдите для покупки
                        </Link>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;