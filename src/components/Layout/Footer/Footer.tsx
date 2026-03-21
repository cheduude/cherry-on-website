import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';
import tgIcon from './tg.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Проверяем, находится ли пользователь на странице админ-панели
  const isAdminPage = location.pathname.includes('/admin') ||
                      location.pathname.includes('/server-management') || 
                      location.pathname.includes('/cabinet') || 
                      location.pathname.includes('/Tariffs') || 
                      location.pathname.includes('/Dashboard') || 
                      location.pathname.includes('/Subscriptions') || 
                      location.pathname.includes('/Referrals') || 
                      location.pathname.includes('/Profile');

  // Для админ-страниц футер изначально скрыт (false), для остальных — видим (true)
  const [isVisible, setIsVisible] = useState(!isAdminPage);

  const [showButton, setShowButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const buttonAreaRef = useRef<HTMLDivElement>(null);

  // Синхронизируем состояние при смене маршрута
  useEffect(() => {
    setIsVisible(!isAdminPage);
  }, [isAdminPage]);

  // Функция для показа кнопки
  const showButtonTemporarily = () => {
    setShowButton(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = window.setTimeout(() => {
      if (!isHovering) {
        setShowButton(false);
      }
    }, 5000);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowButton(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = window.setTimeout(() => {
      setShowButton(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Показываем кнопку при загрузке страницы или когда футер скрыт
  useEffect(() => {
    if (isAdminPage && !isVisible) {
      showButtonTemporarily();
    }
  }, [isAdminPage, isVisible]);

  const toggleFooter = () => {
    setIsVisible(!isVisible);
    if (isVisible) {
      setShowButton(true);
      showButtonTemporarily();
    } else {
      setShowButton(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  };

  // Если не админ-страница, показываем обычный футер без кнопок скрытия
  if (!isAdminPage) {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.container}>
            {/* Верхняя часть футера с навигацией */}
            <div className={styles.footerTop}>
              {/* Секция навигации */}
              <div className={styles.navigationSection}>
                <h3 className={styles.sectionTitle}>Навигация</h3>
                <ul className={styles.sitemap}>
                  <li className={styles.sitemapItem}>
                    <Link to="/" className={styles.sitemapLink}>
                      <span className={styles.linkIcon}>🏠</span>
                      Главная
                    </Link>
                  </li>
                  <li className={styles.sitemapItem}>
                    <Link to="/services" className={styles.sitemapLink}>
                      <span className={styles.linkIcon}>⚙️</span>
                      Услуги
                    </Link>
                  </li>
                  <li className={styles.sitemapItem}>
                    <Link to="/testimonials" className={styles.sitemapLink}>
                      <span className={styles.linkIcon}>⭐</span>
                      Отзывы
                    </Link>
                  </li>
                  <li className={styles.sitemapItem}>
                    <Link to="/contacts" className={styles.sitemapLink}>
                      <span className={styles.linkIcon}>📞</span>
                      Контакты
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Секция контактов */}
              <div className={styles.contactsSection}>
                <h3 className={styles.sectionTitle}>Контакты</h3>
                <div className={styles.contactInfo}>
                  <a href="mailto:support@domain.com" className={`${styles.contactItem} ${styles.contactItemLink}`}>
                    <span className={styles.contactIcon}>📧</span>
                    <span className={styles.contactText}>support@domain.com</span>
                  </a>

                  <div className={`${styles.contactItem} ${styles.timeItem}`}>
                    <span className={styles.contactIcon}>🕒</span>
                    <span className={styles.contactText}>
                      Пн-Пт: 9:00-18:00
                    </span>
                  </div>

                  <a href="https://t.me/cherryon_support_bot" target="_blank" rel="noopener noreferrer" className={`${styles.contactItem} ${styles.contactItemLink}`}>
                    <img src={tgIcon} alt="Telegram" className={styles.contactIcon} />
                    <span className={styles.contactText}>Телеграм</span>
                  </a>
                </div>
              </div>

              {/* Секция документов */}
              <div className={styles.documentsSection}>
                <h3 className={styles.sectionTitle}>Документы</h3>
                <ul className={styles.documentsList}>
                  <li className={styles.documentItem}>
                    <Link to="/privacy" className={styles.documentLink}>
                      Политика конфиденциальности
                    </Link>
                  </li>
                  <li className={styles.documentItem}>
                    <Link to="/terms" className={styles.documentLink}>
                      Пользовательское соглашение
                    </Link>
                  </li>
                  <li className={styles.documentItem}>
                    <Link to="/cookie" className={styles.documentLink}>
                      Политика использования cookie
                    </Link>
                  </li>
                  <li className={styles.documentItem}>
                    <Link to="/offers" className={styles.documentLink}>
                      Публичная оферта
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            
          </div>
        </div>
      </footer>
    );
  }

  // Для админ-страницы: если футер скрыт, показываем только кнопку
  if (!isVisible) {
    return (
      <div
        ref={buttonAreaRef}
        className={styles.showButtonArea}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`${styles.showFooterButton} ${showButton ? styles.visible : styles.hidden}`}
          onClick={toggleFooter}
          aria-label="Показать футер"
          title="Показать футер"
        >
          <svg
            className={styles.arrowIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 19V5M12 5l-6 6M12 5l6 6" />
          </svg>
        </button>
      </div>
    );
  }

  // Если футер видим, показываем его с кнопкой скрытия
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <button
          className={styles.hideFooterButton}
          onClick={toggleFooter}
          aria-label="Скрыть футер"
          title="Скрыть футер"
        >
          <svg
            className={styles.arrowIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M12 19l6-6M12 19l-6-6" />
          </svg>
        </button>

        <div className={styles.container}>
          {/* Верхняя часть футера с навигацией */}
          <div className={styles.footerTop}>
            {/* Секция навигации */}
            <div className={styles.navigationSection}>
              <h3 className={styles.sectionTitle}>Навигация</h3>
              <ul className={styles.sitemap}>
                <li className={styles.sitemapItem}>
                  <Link to="/" className={styles.sitemapLink}>
                    <span className={styles.linkIcon}>🏠</span>
                    Главная
                  </Link>
                </li>
                <li className={styles.sitemapItem}>
                  <Link to="/services" className={styles.sitemapLink}>
                    <span className={styles.linkIcon}>⚙️</span>
                    Услуги
                  </Link>
                </li>
                <li className={styles.sitemapItem}>
                  <Link to="/testimonials" className={styles.sitemapLink}>
                    <span className={styles.linkIcon}>⭐</span>
                    Отзывы
                  </Link>
                </li>
                <li className={styles.sitemapItem}>
                  <Link to="/contacts" className={styles.sitemapLink}>
                    <span className={styles.linkIcon}>📞</span>
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>

            {/* Секция контактов */}
            <div className={styles.contactsSection}>
              <h3 className={styles.sectionTitle}>Контакты</h3>
              <div className={styles.contactInfo}>
                <a href="mailto:support@domain.com" className={`${styles.contactItem} ${styles.contactItemLink}`}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.contactText}>support@domain.com</span>
                </a>

                <div className={`${styles.contactItem} ${styles.timeItem}`}>
                  <span className={styles.contactIcon}>🕒</span>
                  <span className={styles.contactText}>
                    Пн-Пт: 9:00-18:00
                  </span>
                </div>

                <a href="https://t.me/cherryon_support_bot" target="_blank" rel="noopener noreferrer" className={`${styles.contactItem} ${styles.contactItemLink}`}>
                  <img src={tgIcon} alt="Telegram" className={styles.contactIcon} />
                  <span className={styles.contactText}>Телеграм</span>
                </a>
              </div>
            </div>

            {/* Секция документов */}
            <div className={styles.documentsSection}>
              <h3 className={styles.sectionTitle}>Документы</h3>
              <ul className={styles.documentsList}>
                <li className={styles.documentItem}>
                  <Link to="/privacy" className={styles.documentLink}>
                    Политика конфиденциальности
                  </Link>
                </li>
                <li className={styles.documentItem}>
                  <Link to="/terms" className={styles.documentLink}>
                    Пользовательское соглашение
                  </Link>
                </li>
                <li className={styles.documentItem}>
                  <Link to="/cookie" className={styles.documentLink}>
                    Политика использования cookie
                  </Link>
                </li>
                <li className={styles.documentItem}>
                  <Link to="/offers" className={styles.documentLink}>
                    Публичная оферта
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Средняя часть с разделителем */}
          <div className={styles.footerMiddle}>
            <div className={styles.divider} />
          </div>

          {/* Нижняя часть футера (закомментирована для админ-страниц, как в исходном коде) */}
          {/* <div className={styles.footerBottom}>
            <div className={styles.copyright}>
              <p className={styles.copyrightText}>
                © {currentYear} Мой Домен. Все права защищены.
              </p>
              <p className={styles.disclaimer}>
                Информация на сайте носит ознакомительный характер.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;