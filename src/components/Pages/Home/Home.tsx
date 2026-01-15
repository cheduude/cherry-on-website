import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import CoolButtons from './CoolButtons/CoolButtons'; // Импорт компонента
import type { HomeProps } from '../../../types/index';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

const Home: React.FC<HomeProps> = ({ isMobile }) => {
  const imageMotionRef = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) return;
  
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1,
      gestureDirection: 'vertical',
    });

    // Сохраняем экземпляр Lenis в window для использования в ScrollToTop
    (window as any).lenis = lenis;
    gsap.registerPlugin(ScrollTrigger);

 if (imageMotionRef.current) {
  // Начальное состояние - нормальное
  gsap.set(imageMotionRef.current, {
    transform: 'rotateX(90deg)',  // Начинаем с 0 градусов
  });

  // Анимация вращения при скролле
  gsap.to(imageMotionRef.current, {
    transform: 'rotateX(0deg)',  // Полный оборот на 360 градусов
    scrollTrigger: {
      trigger: `.${styles.section2}`,
      start: 'top bottom',     // Когда верх секции достигнет низа экрана
      end: 'bottom top',       // Когда низ секции достигнет верха экрана
      scrub: true,               // Плавное следование за скроллом (2 секунды)
      markers: false,
    },
  });
}

    // Анимации для секции 3
    const titleElement = section3Ref.current?.querySelector(`.${styles.title}`);
    const subtitleElement = section3Ref.current?.querySelector(`.${styles.subtitle}`);
    const textElements = section3Ref.current?.querySelectorAll(`.${styles.text}`);
    const featureElements = section3Ref.current?.querySelectorAll(`.${styles.feature}`);

    if (titleElement) {
      gsap.fromTo(titleElement, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.section3}`,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    if (subtitleElement) {
      gsap.fromTo(subtitleElement, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.section3}`,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    if (textElements) {
      gsap.fromTo(textElements, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.textContent}`,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    if (featureElements) {
      gsap.fromTo(featureElements, 
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.features}`,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // Интеграция Lenis с GSAP
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    
    requestAnimationFrame(raf);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      delete (window as any).lenis; // Очищаем при размонтировании
      // Восстанавливаем нормальный скролл
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.body.style.position = 'static';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.ticker.remove(raf);
      // Дополнительная очистка
      if (document.body.classList.contains('lenis')) {
        document.body.classList.remove('lenis');
      }
      if (document.body.classList.contains('lenis-smooth')) {
        document.body.classList.remove('lenis-smooth');
      }
    };
  }, [isMobile]);

  return (
    <div className={`${styles.homeContainer} ${isMobile ? styles.mobile : ''}`}>
      {/* СЕКЦИЯ 1: Вступительная с заголовком и кнопками */}
      <section 
        className={styles.section1} 
        style={{ '--bg': 'black' } as React.CSSProperties}
      >
        <div className={styles.section1Container}>
          <h1 className={styles.mainTitle}>
            П0ПКИ
          </h1>
          <p className={styles.heroSubtitle}>
            Ваш портал в цифровую свободу
          </p>
          
          {/* CoolButtons прямо на вступительной секции */}
          <div className={styles.coolButtonsWrapper}>
            <CoolButtons />
          </div>
          
          <div className={styles.scrollIndicator}>
            
            
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ 2: Анимированное изображение */}
      <section className={styles.section2} style={{ '--bg': 'black' } as React.CSSProperties}>
        <div ref={imageMotionRef} className={styles.imageMotion}>
          <picture>
            <img 
              src="https://i.postimg.cc/1ztkf4hX/moveimage.png" 
              alt="Technology background"
              loading="lazy"
            />
          </picture>
        </div>
      </section>

      {/* СЕКЦИЯ 3: Текст и фичи */}
      <section 
        ref={section3Ref} 
        style={{ '--bg': 'black' } as React.CSSProperties} 
        className={styles.section3}
      >
        <div className={styles.container}>
          <h1 className={styles.title}>Наши услуги</h1>
          <p className={styles.subtitle}>Digital Freedom Zone</p>
          
          <div className={styles.textContent}>
            <p className={styles.text}>
              Откройте мир безграничных возможностей с нашими премиум услугами. 
              Мы предоставляем доступ к лучшим технологиям и сервисам со всего мира.
            </p>
            <p className={styles.text}>
              Наша платформа объединяет все необходимые инструменты для современной цифровой жизни:
              от <strong>защищённого доступа</strong> на основе цифровых сертификатов до эксклюзивных подписок и облачных решений.
            </p>
            <p className={styles.text}>
              Присоединяйтесь к тысячам довольных клиентов, которые уже выбрали свободу 
              и безопасность в цифровом мире.
            </p>
          </div>

          <div className={styles.features}>
            {[
              {
              title: "Защищенный доступ",
              description: "Легальное шифрование трафика цифровым сертификатом",
              icon: "🛡️"
              },
              {
                title: 'Прошивка роутеров',
                description: 'Максимальная производительность вашей сети',
                icon: '📶'
              },
              {
                title: 'Международные заказы',
                description: 'Товары со всего мира с доставкой к вам',
                icon: '🌍'
              }
            ].map((feature, index) => (
              <div key={index} className={styles.feature}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <div className={styles.ctaSection}>
            <Link to="/services">
              <button className={styles.ctaButton}>
                Посмотреть все услуги
              </button>
            </Link>
            <button className={styles.secondaryButton}>
              Получить консультацию
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;