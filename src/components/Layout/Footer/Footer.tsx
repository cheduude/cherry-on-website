import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
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
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <a href="mailto:support@domain.com" className={styles.contactLink}>
                  support@domain.com
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🕒</span>
                <span className={styles.contactText}>
                  Пн-Пт: 9:00-18:00
                </span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span className={styles.contactText}>
                  г. Москва, ул. Примерная, д. 1
                </span>
              </div>
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

          {/* Секция социальных сетей */}
          <div className={styles.socialSection}>
            <h3 className={styles.sectionTitle}>Мы в соцсетях</h3>
            <div className={styles.socialLinks}>
              <a 
                href="https://t.me/domain" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label="Telegram"
              >
                <span className={styles.socialIcon}>📱</span>
                <span className={styles.socialText}>Telegram</span>
              </a>
              <a 
                href="https://vk.com/domain" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label="ВКонтакте"
              >
                <span className={styles.socialIcon}>👥</span>
                <span className={styles.socialText}>ВКонтакте</span>
              </a>
              <a 
                href="https://youtube.com/domain" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <span className={styles.socialIcon}>▶️</span>
                <span className={styles.socialText}>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Средняя часть с разделителем */}
        <div className={styles.footerMiddle}>
          <div className={styles.divider} />
        </div>

        {/* Нижняя часть футера */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p className={styles.copyrightText}>
              © {currentYear} Мой Домен. Все права защищены.
            </p>
            <p className={styles.disclaimer}>
              Информация на сайте носит ознакомительный характер.
            </p>
          </div>

          {/* Кнопка "Наверх"
          <button 
            className={styles.scrollTopButton}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Наверх"
          >
            <span className={styles.scrollTopIcon}>⬆️</span>
            <span className={styles.scrollTopText}>Наверх</span>
          </button> 
           */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;