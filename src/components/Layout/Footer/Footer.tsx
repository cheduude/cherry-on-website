import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';
import {
  Home,
  Wrench,
  Star,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  Cookie,
  Receipt
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Проверяем, находится ли пользователь на странице, где футер должен быть скрыт
  const isHiddenPage =
    location.pathname.includes('/admin') ||
    location.pathname.includes('/server-management') ||
    location.pathname.startsWith('/cabinet') || location.pathname.startsWith('/editor');

  // Для скрытых страниц футер изначально скрыт (false), для остальных — видим (true)
  const [isVisible, setIsVisible] = useState(!isHiddenPage);
  const [showButton, setShowButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const hideTimeoutRef = useRef<number | null>(null);
  const buttonAreaRef = useRef<HTMLDivElement>(null);

  // Синхронизируем состояние при смене маршрута
  useEffect(() => {
    setIsVisible(!isHiddenPage);
  }, [isHiddenPage]);

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
    if (isHiddenPage && !isVisible) {
      showButtonTemporarily();
    }
  }, [isHiddenPage, isVisible]);

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

  // Рендер иконки
  const renderIcon = (IconComponent: any, size: number = 18) => {
    return <IconComponent size={size} strokeWidth={1.5} />;
  };

  // Если не скрытая страница, показываем обычный футер без кнопок скрытия
  if (!isHiddenPage) {
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
                      <span className={styles.linkIcon}>{renderIcon(Home)}</span>
                      <span className={styles.linkText}>Главная</span>
                    </Link>
                  </li>
                  <li className={styles.sitemapItem}>
                    <Link to="/services" className={styles.sitemapLink}>
                      <span className={styles.linkIcon}>{renderIcon(Wrench)}</span>
                      <span className={styles.linkText}>Услуги</span>
                    </Link>
                  </li>
                  <li className={styles.sitemapItem}>
                    <Link to="/testimonials" className={styles.sitemapLink}>
                      <span className={styles.linkIcon}>{renderIcon(Star)}</span>
                      <span className={styles.linkText}>Отзывы</span>
                    </Link>
                  </li>
                  <li className={styles.sitemapItem}>
                    <Link to="/contacts" className={styles.sitemapLink}>
                      <span className={styles.linkIcon}>{renderIcon(Phone)}</span>
                      <span className={styles.linkText}>Контакты</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Секция контактов */}
              <div className={styles.contactsSection}>
                <h3 className={styles.sectionTitle}>Контакты</h3>
                <div className={styles.contactInfo}>
                  <a
                    href="mailto:support@domain.com"
                    className={`${styles.contactItem} ${styles.contactItemLink}`}
                  >
                    <span className={styles.contactIcon}>{renderIcon(Mail)}</span>
                    <span className={styles.contactText}>support@domain.com</span>
                  </a>
                  <div className={`${styles.contactItem} ${styles.timeItem}`}>
                    <span className={styles.contactIcon}>{renderIcon(Clock)}</span>
                    <span className={styles.contactText}>Пн-Пт: 9:00-18:00</span>
                  </div>
                  <a
                    href="https://t.me/cherryon_support_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.contactItem} ${styles.contactItemLink}`}
                  >
                    <span className={styles.contactIcon}>{renderIcon(MessageCircle)}</span>
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
                      <span className={styles.docIcon}>{renderIcon(Shield)}</span>
                      <span className={styles.docText}>Политика конфиденциальности</span>
                    </Link>
                  </li>
                  <li className={styles.documentItem}>
                    <Link to="/terms" className={styles.documentLink}>
                      <span className={styles.docIcon}>{renderIcon(FileText)}</span>
                      <span className={styles.docText}>Пользовательское соглашение</span>
                    </Link>
                  </li>
                  <li className={styles.documentItem}>
                    <Link to="/cookie" className={styles.documentLink}>
                      <span className={styles.docIcon}>{renderIcon(Cookie)}</span>
                      <span className={styles.docText}>Политика использования cookie</span>
                    </Link>
                  </li>
                  <li className={styles.documentItem}>
                    <Link to="/offers" className={styles.documentLink}>
                      <span className={styles.docIcon}>{renderIcon(Receipt)}</span>
                      <span className={styles.docText}>Публичная оферта</span>
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

  // Для скрытых страниц: если футер скрыт, показываем только кнопку
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
          <ChevronUp size={24} strokeWidth={2} className={styles.arrowIcon} />
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
          <ChevronDown size={24} strokeWidth={2} className={styles.arrowIcon} />
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
                    <span className={styles.linkIcon}>{renderIcon(Home)}</span>
                    <span className={styles.linkText}>Главная</span>
                  </Link>
                </li>
                <li className={styles.sitemapItem}>
                  <Link to="/services" className={styles.sitemapLink}>
                    <span className={styles.linkIcon}>{renderIcon(Wrench)}</span>
                    <span className={styles.linkText}>Услуги</span>
                  </Link>
                </li>
                <li className={styles.sitemapItem}>
                  <Link to="/testimonials" className={styles.sitemapLink}>
                    <span className={styles.linkIcon}>{renderIcon(Star)}</span>
                    <span className={styles.linkText}>Отзывы</span>
                  </Link>
                </li>
                <li className={styles.sitemapItem}>
                  <Link to="/contacts" className={styles.sitemapLink}>
                    <span className={styles.linkIcon}>{renderIcon(Phone)}</span>
                    <span className={styles.linkText}>Контакты</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Секция контактов */}
            <div className={styles.contactsSection}>
              <h3 className={styles.sectionTitle}>Контакты</h3>
              <div className={styles.contactInfo}>
                <a
                  href="mailto:support@domain.com"
                  className={`${styles.contactItem} ${styles.contactItemLink}`}
                >
                  <span className={styles.contactIcon}>{renderIcon(Mail)}</span>
                  <span className={styles.contactText}>support@domain.com</span>
                </a>
                <div className={`${styles.contactItem} ${styles.timeItem}`}>
                  <span className={styles.contactIcon}>{renderIcon(Clock)}</span>
                  <span className={styles.contactText}>Пн-Пт: 9:00-18:00</span>
                </div>
                <a
                  href="https://t.me/cherryon_support_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contactItem} ${styles.contactItemLink}`}
                >
                  <span className={styles.contactIcon}>{renderIcon(MessageCircle)}</span>
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
                    <span className={styles.docIcon}>{renderIcon(Shield)}</span>
                    <span className={styles.docText}>Политика конфиденциальности</span>
                  </Link>
                </li>
                <li className={styles.documentItem}>
                  <Link to="/terms" className={styles.documentLink}>
                    <span className={styles.docIcon}>{renderIcon(FileText)}</span>
                    <span className={styles.docText}>Пользовательское соглашение</span>
                  </Link>
                </li>
                <li className={styles.documentItem}>
                  <Link to="/cookie" className={styles.documentLink}>
                    <span className={styles.docIcon}>{renderIcon(Cookie)}</span>
                    <span className={styles.docText}>Политика использования cookie</span>
                  </Link>
                </li>
                <li className={styles.documentItem}>
                  <Link to="/offers" className={styles.documentLink}>
                    <span className={styles.docIcon}>{renderIcon(Receipt)}</span>
                    <span className={styles.docText}>Публичная оферта</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Средняя часть с разделителем */}
          <div className={styles.footerMiddle}>
            <div className={styles.divider} />
          </div>

          {/* Копирайт */}
          <div className={styles.copyright}>
            <p className={styles.copyrightText}>
              © {currentYear} CherryOn Services. Все права защищены.
            </p>
            <p className={styles.disclaimer}>
              Информация на сайте носит ознакомительный характер.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;