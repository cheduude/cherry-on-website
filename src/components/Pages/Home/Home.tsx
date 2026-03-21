import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import type { HomeProps } from '../../../types/index';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Типы для сервисов из отзывов
type ServiceType = 'Цифровые сертификаты' | 'VPS' | 'Заказы из-за рубежа' | 'NVMe диски' | 'Настройка роутера' | 'Пополнение аккаунтов';

// Интерфейс отзыва
interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
  avatar: string;
  services?: ServiceType[];
}

// Начальные демо-отзывы (только 3)
const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Александр К.',
    role: 'IT-специалист',
    text: 'Отличный сервис! Цифровые сертификаты работают безупречно уже полгода. Поддержка отвечает быстро и помогает решить любые вопросы. Скорость подключения стабильная, задержки минимальные.',
    rating: 5,
    date: '2024-02-15',
    avatar: 'AK',
    services: ['Цифровые сертификаты', 'VPS']
  },
  {
    id: 2,
    name: 'Мария С.',
    role: 'Дизайнер',
    text: 'Настроили роутер и подключили VPN за 2 часа. Теперь могу работать с зарубежными заказчиками без проблем. Рекомендую!',
    rating: 5,
    date: '2024-02-10',
    avatar: 'МС',
    services: ['Настройка роутера', 'VPS']
  },
  {
    id: 3,
    name: 'Дмитрий П.',
    role: 'Геймер',
    text: 'Низкий пинг на игровых серверах после настройки сетевых параметров. Техподдержка помогла с оптимизацией под мой ПК.',
    rating: 4,
    date: '2024-02-05',
    avatar: 'ДП',
    services: ['Настройка роутера']
  }
];

const Home: React.FC<HomeProps> = ({ isMobile }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  
  // Состояние для отзывов (начинаем с демо-данных)
  const [realTestimonials, setRealTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // Избранные услуги для тизера
  const featuredServices = [
    {
      id: 'certificates',
      title: 'Цифровой сертификат',
      description:
        'Цифровой сертификат для защиты сети. Безопасное и анонимное подключение с гарантией конфиденциальности. Поддержка всех устройств.',
      features: ['Шифрование трафика', 'Все устройства', '24/7 поддержка'],
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      delay: 0.1,
      serviceId: 0,
    },
    {
      id: 'vps',
      title: 'VPS',
      description:
        'Виртуальные серверы с мощным железом и низкой задержкой. Полный root доступ. В тестовом режиме.',
      features: ['Root доступ', 'SSD/NVMe', 'HDD', 'Linux/Windows', 'DDoS защита'],
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      delay: 0.2,
      serviceId: 1,
    },
    {
      id: 'router',
      title: 'Настройка сетевого оборудования и сетей',
      description:
        'Настройка сетевых параметров устройства + VPN сертификат на год. Оптимизация для игр и стриминга.',
      features: ['Сертификат на год', 'Настройка', 'Гарантия'],
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      delay: 0.3,
      serviceId: 3,
    },
  ];

  // Функция для загрузки отзывов из события
  const loadTestimonials = (data?: any) => {
    if (data && data.detail?.testimonials) {
      // Если получили данные через событие
      setRealTestimonials(data.detail.testimonials);
    }
    // Если нет события, оставляем текущие отзывы
  };

  // Загружаем отзывы при монтировании компонента
  useEffect(() => {
    // Слушаем событие обновления отзывов с данными
    const handleTestimonialsUpdate = (event: CustomEvent) => {
      loadTestimonials(event);
    };

    window.addEventListener('testimonialsUpdated', handleTestimonialsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('testimonialsUpdated', handleTestimonialsUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    // Сбрасываем возможные блокировки скролла
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Анимации для героя
    if (!isMobile) {
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(
          '.hero-title',
          { 
            opacity: 0, 
            y: 50 
          },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: 'power3.out' 
          }
        )
        .fromTo(
          '.hero-subtitle',
          { 
            opacity: 0, 
            y: 30 
          },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
          },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta',
          { 
            opacity: 0, 
            scale: 0.9 
          },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.6, 
            ease: 'back.out(1.7)' 
          },
          '-=0.3'
        );
    }

    // Анимации для тизера услуг
    featuredServices.forEach((service, index) => {
      gsap.fromTo(
        `.service-card-${index}`,
        {
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          rotationY: 15,
        },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.service-card-${index}`,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
        }
      );

      gsap.fromTo(
        `.feature-${index}`,
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: `.service-card-${index}`,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Анимация для отзывов (если они есть)
    if (realTestimonials.length > 0) {
      gsap.fromTo(
        `.${styles.testimonialCard}`,
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.testimonials}`,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Параллакс эффект для героя
    if (!isMobile) {
      gsap.to('.hero-background', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Обновляем ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile, realTestimonials.length]);

  // Функция для отображения звезд рейтинга
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={styles.star}
        style={{ color: index < rating ? '#FFD700' : '#e0e0e0' }}
      >
        ★
      </span>
    ));
  };

  // Обработчик клика по услуге
  const handleServiceClick = (serviceId: number) => {
    sessionStorage.setItem('autoOpenServiceId', serviceId.toString());
    sessionStorage.setItem('autoOpenTimestamp', Date.now().toString());
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  // Рендер тегов сервисов
  const renderServiceTags = (services?: ServiceType[]) => {
    if (!services || services.length === 0) {
      return null;
    }
    
    return (
      <div className={styles.serviceTagsContainer}>
        {services.slice(0, 2).map((service, index) => (
          <span key={index} className={styles.serviceTag}>
            {service}
          </span>
        ))}
        {services.length > 2 && (
          <span className={styles.serviceTag}>
            +{services.length - 2}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Герой секция */}
      <section 
        ref={heroRef} 
        className={`${styles.hero} hero-section`}
      >
        <div className={`${styles.heroBackground} hero-background`} />
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} hero-title`}>
            Начинающая команда
            <span className={styles.gradientText}> разработчиков</span>
          </h1>
          <p className={`${styles.heroSubtitle} hero-subtitle`}>
            Безопасность, анонимность и высокая скорость для вашего цифрового
            мира
          </p>
          <div className={`${styles.heroButtons} hero-cta`}>
            <Link 
              to="/services" 
              className={styles.primaryButton}
            >
              Ознакомиться с услугами
            </Link>
          </div>
        </div>

        {/* Анимированные элементы */}
        {!isMobile && (
          <>
            <div className={styles.floatingCircle1} />
            <div className={styles.floatingCircle2} />
            <div className={styles.floatingCircle3} />
          </>
        )}
      </section>

      {/* Тизер услуг */}
      <section 
        ref={servicesRef} 
        className={styles.services}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Наши <span className={styles.gradientText}>услуги</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Выберите решение, которое подходит именно вам
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {featuredServices.map((service, index) => (
            <div
              key={service.id}
              className={`${styles.serviceCard} service-card-${index}`}
              style={{
                background: service.color,
                animationDelay: `${service.delay}s`,
              }}
            >
              <div className={styles.serviceCardInner}>
                {/* Бейджи статуса */}
                {service.id === 'certificates' && (
                  <div className={styles.statusBadge}>
                    <span className={styles.statusBadgeText}>В разработке</span>
                  </div>
                )}
                
                {service.id === 'vps' && (
                  <div className={styles.testModeBadge}>
                    <span className={styles.statusBadgeText}>Тестовый режим</span>
                  </div>
                )}
                
                <h3 className={styles.serviceTitle}>
                  {service.title}
                </h3>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
                <div className={styles.features}>
                  {service.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className={`${styles.feature} feature-${index}`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <Link
                  to="/services"
                  onClick={() => handleServiceClick(service.serviceId)}
                  className={styles.serviceLink}
                >
                  Подробнее →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.seeAllContainer}>
          <Link 
            to="/services" 
            className={styles.seeAllButton}
          >
            Все услуги
          </Link>
        </div>
      </section>

      {/* Секция отзывов - с реальными отзывами из TestimonialsPage */}
      <section
        ref={testimonialRef}
        className={`${styles.testimonials} testimonials-section`}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Что говорят <span className={styles.gradientText}>клиенты</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Наши пользователи делятся своим опытом
          </p>
        </div>

        {realTestimonials.length > 0 ? (
          <>
            <div className={styles.testimonialsGrid}>
              {realTestimonials.slice(0, 3).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`${styles.testimonialCard} testimonial-card`}
                >
                  <div className={styles.testimonialHeader}>
                    <div className={styles.avatar}>
                      {testimonial.avatar || testimonial.name.charAt(0)}
                    </div>
                    <div className={styles.testimonialInfo}>
                      <h4 className={styles.testimonialName}>
                        {testimonial.name}
                      </h4>
                      <p className={styles.testimonialRole}>
                        {testimonial.role}
                      </p>
                    </div>
                    <div className={styles.rating}>
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  
                  {renderServiceTags(testimonial.services)}
                  
                  <p className={styles.testimonialText}>
                    "{testimonial.text}"
                  </p>
                  
                  <div className={styles.testimonialFooter}>
                    <span className={styles.testimonialDate}>
                      {formatDate(testimonial.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.testimonialsFooter}>
              <Link 
                to="/testimonials" 
                className={styles.allReviewsButton}
              >
                Читать все отзывы ({realTestimonials.length})
              </Link>
              <Link
                to="/testimonials#addTestimonial"
                className={styles.addReviewButton}
              >
                Оставить отзыв
              </Link>
            </div>
          </>
        ) : (
          // Показываем заглушку, если нет отзывов
          <div className={styles.noTestimonials}>
            <div className={styles.noTestimonialsIcon}>
              💬
            </div>
            <h3 className={styles.noTestimonialsTitle}>
              Пока нет отзывов
            </h3>
            <p className={styles.noTestimonialsText}>
              Будьте первым, кто оставит отзыв о наших услугах!
            </p>
            <Link
              to="/testimonials#addTestimonial"
              className={styles.addFirstReviewButton}
            >
              Оставить отзыв
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;