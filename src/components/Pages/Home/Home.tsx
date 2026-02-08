import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import type { HomeProps } from '../../../types/index';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC<HomeProps> = ({ isMobile }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  
  // Избранные услуги для тизера
  const featuredServices = [
    {
      id: 'certificates',
      title: 'Цифровые Сертификаты',
      description: 'Безопасное и анонимное подключение с гарантией конфиденциальности. Поддержка всех устройств.',
      features: ['Анонимность', 'Шифрование трафика', 'Все устройства', '24/7 поддержка'],
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      delay: 0.1
    },
    {
      id: 'vps',
      title: 'VPS',
      description: 'Виртуальные серверы с мощным железом и низкой задержкой. Полный root доступ.',
      features: ['Root доступ', 'SSD/NVMe', 'Linux/Windows', 'DDoS защита'],
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      delay: 0.2
    },
    {
      id: 'router',
      title: 'Настройка роутера',
      description: 'Настройка сетевых параметров устройства + VPN сертификат на год. Оптимизация для игр и стриминга.',
      features: ['Прошивка', 'Сертификат на год', 'Настройка', 'Гарантия'],
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      delay: 0.3
    }
  ];

  // Демо отзывы
  const demoTestimonials = [
    {
      id: 1,
      name: 'Александр К.',
      role: 'IT-специалист',
      text: 'Отличный сервис! Цифровые сертификаты работают безупречно уже полгода. Поддержка отвечает быстро и помогает решить любые вопросы.',
      rating: 5
    },
    {
      id: 2,
      name: 'Мария С.',
      role: 'Дизайнер',
      text: 'Настроили роутер и подключили VPN за 2 часа. Теперь могу работать с зарубежными заказчиками без проблем. Рекомендую!',
      rating: 5
    },
    {
      id: 3,
      name: 'Дмитрий П.',
      role: 'Геймер',
      text: 'Низкий пинг на игровых серверах после настройки сетевых параметров. Техподдержка помогла с оптимизацией под мой ПК.',
      rating: 4
    }
  ];

  useEffect(() => {
    // Инициализация Lenis для плавного скролла
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Связываем Lenis с GSAP ScrollTrigger
    //@ts-ignore
    lenisRef.current?.on('scroll', ScrollTrigger.update);

    // Функция для анимации на каждом кадре
    const animate = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    // Анимации для героя
    if (!isMobile) {
      const heroTl = gsap.timeline();
      heroTl
        .fromTo('.hero-title',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
        .fromTo('.hero-subtitle',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo('.hero-cta',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.3'
        );
    }

    // Анимации для тизера услуг (scrollytelling)
    featuredServices.forEach((service, index) => {
      gsap.fromTo(`.service-card-${index}`,
        {
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          rotationY: 15
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
            markers: false
          }
        }
      );

      // Анимация появления фич услуги
      gsap.fromTo(`.feature-${index}`,
        {
          opacity: 0,
          y: 20,
          scale: 0.8
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
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Анимация для отзывов
    gsap.fromTo('.testimonial-card',
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Параллакс эффект для героя
    if (!isMobile) {
      gsap.to('.hero-background', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Анимация для контента CTA секции (только контент, не сама секция)
    if (ctaSectionRef.current) {
      // Анимация для внутреннего содержимого CTA
      gsap.fromTo(`.${styles.ctaContent} > *`,
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
            trigger: ctaSectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

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

  return (
    <div className={styles.container}>
      {/* Герой секция */}
      <section ref={heroRef} className={`${styles.hero} hero-section`}>
        <div className={`${styles.heroBackground} hero-background`} />
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} hero-title`}>
            Сетевые решения
            <span className={styles.gradientText}> нового поколения</span>
          </h1>
          <p className={`${styles.heroSubtitle} hero-subtitle`}>
            Безопасность, анонимность и высокая скорость для вашего цифрового мира
          </p>
          <div className={`${styles.heroButtons} hero-cta`}>
            <Link to="/services" className={styles.primaryButton}>
              Смотреть все услуги
            </Link>
            <Link to="/auth?form=register" className={styles.secondaryButton}>
              Начать бесплатно
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

      {/* Тизер услуг с scrollytelling */}
      <section ref={servicesRef} className={styles.services}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Популярные <span className={styles.gradientText}>услуги</span>
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
                animationDelay: `${service.delay}s`
              }}
            >
              <div className={styles.serviceCardInner}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
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
                  to={`/services#${service.id}`}
                  className={styles.serviceLink}
                >
                  Подробнее →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.seeAllContainer}>
          <Link to="/services" className={styles.seeAllButton}>
            Все услуги ({featuredServices.length}+)
          </Link>
        </div>
      </section>

      {/* Демо отзывы */}
      <section ref={testimonialRef} className={`${styles.testimonials} testimonials-section`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Что говорят <span className={styles.gradientText}>клиенты</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Наши пользователи делятся своим опытом
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {demoTestimonials.map((testimonial) => (
            <div key={testimonial.id} className={`${styles.testimonialCard} testimonial-card`}>
              <div className={styles.testimonialHeader}>
                <div className={styles.avatar}>
                  {testimonial.name.charAt(0)}
                </div>
                <div className={styles.testimonialInfo}>
                  <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                  <p className={styles.testimonialRole}>{testimonial.role}</p>
                </div>
                <div className={styles.rating}>
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        <div className={styles.testimonialsFooter}>
          <Link to="/testimonials" className={styles.allReviewsButton}>
            Читать все отзывы
          </Link>
          <Link to="/testimonials#addTestimonial" className={styles.addReviewButton}>
            Оставить отзыв
          </Link>
        </div>
      </section>

      {/* CTA секция */}
      <section 
        ref={ctaSectionRef} 
        className={`${styles.ctaSection}`}
      >
        <div className={styles.ctaDecorations}>
          <div className={styles.ctaCircle}></div>
          <div className={styles.ctaCircle}></div>
          <div className={styles.ctaCircle}></div>
        </div>
        
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Готовы улучшить свою <span className={styles.gradientText}>сеть</span>?
          </h2>
          <p className={styles.ctaText}>
            Присоединяйтесь к тысячам довольных клиентов по всему миру
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/auth" className={styles.ctaPrimary}>
              Начать сейчас
            </Link>
            <Link to="/support" className={styles.ctaSecondary}>
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;