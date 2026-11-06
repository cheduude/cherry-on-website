import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeadset, FaEnvelope, FaTelegram } from 'react-icons/fa';
import styles from './SupportPage.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SUPPORT_EMAIL = 'mainserev@cherryon.art';
const SUPPORT_BOT_URL = 'https://t.me/cherryon_support_bot';

const SupportPage: React.FC = () => {
  const [reviewRatings, setReviewRatings] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedReviews = sessionStorage.getItem('cherryon:testimonials');
      if (storedReviews) {
        const parsed: Array<{ rating?: number }> = JSON.parse(storedReviews);
        setReviewRatings(parsed
          .map(({ rating }) => rating)
          .filter((rating): rating is number => typeof rating === 'number' && Number.isFinite(rating)));
      }
    } catch {
      // Ignore malformed or unavailable session storage and keep the metric empty.
    }

    const handleTestimonialsUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ testimonials?: Array<{ rating?: number }> }>).detail;
      const ratings = detail?.testimonials
        ?.map(({ rating }) => rating)
        .filter((rating): rating is number => typeof rating === 'number' && Number.isFinite(rating));
      if (ratings) setReviewRatings(ratings);
    };

    window.addEventListener('testimonialsUpdated', handleTestimonialsUpdate);
    return () => window.removeEventListener('testimonialsUpdated', handleTestimonialsUpdate);
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(`.${styles.heroTitle}, .${styles.heroSubtitle}, .${styles.heroButtons}`,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power2.out' }
      );
      gsap.fromTo(`.${styles.statsCard}`,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: `.${styles.statsSection}`, start: 'top 85%' }
        }
      );
      gsap.fromTo(`.${styles.contactCard}`,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: `.${styles.contactSection}`, start: 'top 85%' }
        }
      );
    });

    return () => context.revert();
  }, []);

  const satisfiedPercent = reviewRatings.length
    ? `${Math.round((reviewRatings.filter((rating) => rating >= 4).length / reviewRatings.length) * 100)}%`
    : '—';

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.gradientText}>Поддержка</span> клиентов
          </h1>
          <p className={styles.heroSubtitle}>Мы всегда рядом, чтобы помочь решить любые вопросы</p>
          <div className={styles.heroButtons}>
            <Link to="/" className={styles.secondaryButton}>На главную</Link>
            <a href={SUPPORT_BOT_URL} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>

      <section className={styles.statsSection} aria-label="Статистика поддержки">
        <div className={styles.statsContainer}>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}><FaHeadset /></div>
            <div className={styles.statsValue}>24/7</div>
            <div className={styles.statsLabel}>Поддержка онлайн</div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}><FaHeadset /></div>
            <div className={styles.statsValue}>{satisfiedPercent}</div>
            <div className={styles.statsLabel}>Довольных клиентов по отзывам</div>
          </div>
        </div>
      </section>

      <section id="chat" className={styles.chatSection}>
        <div className={styles.chatContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Чат <span className={styles.gradientText}>поддержки</span></h2>
            <p className={styles.sectionSubtitle}>Чтобы написать специалисту, откройте Telegram-бота или отправьте письмо.</p>
          </div>
          <div className={styles.chatCard}>
            <div className={styles.chatMain}>
              <div className={styles.chatHeader}>
                <div className={styles.chatAvatar}><FaHeadset className={styles.chatAvatarIcon} /></div>
                <div className={styles.chatInfo}>
                  <h3 className={styles.chatName}>Поддержка CherryOn</h3>
                  <p className={styles.chatStatus}>Telegram-бот</p>
                </div>
              </div>
              <div className={styles.chatMessages}>
                <p className={styles.messageText}>Веб-чат сайта пока не подключен к серверу. Перейдите в Telegram, чтобы начать диалог с поддержкой.</p>
              </div>
              <div className={styles.contactButtons}>
                <a href={SUPPORT_BOT_URL} target="_blank" rel="noopener noreferrer" className={styles.contactButtonSecondary}>
                  <FaTelegram className={styles.buttonIcon} /> Написать боту
                </a>
                <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.contactButtonPrimary}>
                  <FaEnvelope className={styles.buttonIcon} /> {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactCard}>
          <div className={styles.contactContent}>
            <h2 className={styles.contactTitleMain}>Нужна помощь оператора?</h2>
            <p className={styles.contactText}>Свяжитесь с поддержкой удобным способом.</p>
            <div className={styles.contactButtons}>
              <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.contactButtonPrimary}>
                <FaEnvelope className={styles.buttonIcon} /> {SUPPORT_EMAIL}
              </a>
              <a href={SUPPORT_BOT_URL} target="_blank" rel="noopener noreferrer" className={styles.contactButtonSecondary}>
                <FaTelegram className={styles.buttonIcon} /> Telegram
              </a>
            </div>
          </div>
          <div className={styles.contactIllustration}>
            <div className={styles.illustrationCircle}><FaHeadset className={styles.illustrationIcon} /></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
