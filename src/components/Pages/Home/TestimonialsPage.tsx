import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './TestimonialsPage.module.css';
import type { Testimonial } from '../../../types/index';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomSelect from './CustomSelect';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Типы для фильтров
type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5;
type SortOption = 'date-desc' | 'date-asc' | 'rating-desc' | 'rating-asc';

// Доступные сервисы
const AVAILABLE_SERVICES = [
  'Цифровые сертификаты',
  'VPS',
  'Заказы из-за рубежа',
  'NVMe диски',
  'Настройка роутера',
  'Пополнение аккаунтов'
] as const;

const sortOptions = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'rating-desc', label: 'Высокий рейтинг' },
  { value: 'rating-asc', label: 'Низкий рейтинг' },
];

type ServiceType = typeof AVAILABLE_SERVICES[number];

// Расширяем тип Testimonial для поддержки сервисов
interface ExtendedTestimonial extends Testimonial {
  services?: ServiceType[];
}

// Начальные демо-данные
const initialTestimonials: ExtendedTestimonial[] = [
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

const TestimonialsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Состояние для отзывов (только в памяти, без localStorage)
  const [testimonials, setTestimonials] = useState<ExtendedTestimonial[]>(initialTestimonials);

  const [filteredTestimonials, setFilteredTestimonials] = useState<ExtendedTestimonial[]>([]);
  const [displayedTestimonials, setDisplayedTestimonials] = useState<ExtendedTestimonial[]>([]);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(0);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    fiveStars: 0,
    fourStars: 0
  });
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 15;

  // Состояния для формы
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 0,
    services: [] as ServiceType[]
  });
  
  // Состояние для отображения советов
  const [showTips, setShowTips] = useState(false);
  
  const [hoverRating, setHoverRating] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ratingContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // При изменении отзывов отправляем событие для обновления на Home странице
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('testimonialsUpdated', { 
      detail: { testimonials } 
    }));
  }, [testimonials]);

  // Применяем глобальный smooth scroll через CSS
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Обработка хэша при монтировании и изменении location
  useEffect(() => {
    const hash = location.hash;
    
    const timer = setTimeout(() => {
      if (hash === '#add-review' || hash === '#addTestimonial') {
        scrollToForm();
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [location]);

  // Функция для прокрутки к форме
  const scrollToForm = () => {
    if (formRef.current && !hasScrolled) {
      navigate('#addTestimonial', { replace: true });
      
      const formTop = formRef.current.offsetTop;
      
      window.scrollTo({
        top: formTop - 80,
        behavior: 'smooth'
      });
      
      setHasScrolled(true);
      
      setTimeout(() => {
        setHasScrolled(false);
      }, 1500);
    }
  };

  // Следим за заполнением формы для показа советов
  useEffect(() => {
    const isFormFieldFilled = 
      formData.name.trim() !== '' || 
      formData.role.trim() !== '' || 
      formData.text.trim() !== '' ||
      formData.services.length > 0;
    
    if (isFormFieldFilled && !showTips) {
      setShowTips(true);
    } else if (!isFormFieldFilled && showTips) {
      setShowTips(false);
    }
  }, [formData.name, formData.role, formData.text, formData.services, showTips]);

  // Анимации при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.fromTo(`.${styles.testimonialCard}`,
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.testimonialsGrid}`,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(`.${styles.statsCard}`,
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
    }, 300);
    
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Эффект для поддержки свайпа
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      isDown = false;
    };

    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchmove', handleTouchMove);
    scrollContainer.addEventListener('touchend', handleTouchEnd);

    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Фильтрация и сортировка отзывов
  useEffect(() => {
    let result = [...testimonials];

    if (ratingFilter > 0) {
      result = result.filter(t => t.rating === ratingFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.text.toLowerCase().includes(query) ||
        t.name.toLowerCase().includes(query) ||
        t.role.toLowerCase().includes(query) ||
        (t.services && t.services.some(service => service.toLowerCase().includes(query)))
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setFilteredTestimonials(result);
  }, [testimonials, ratingFilter, sortBy, searchQuery]);

  // Расчет статистики
  useEffect(() => {
    const total = testimonials.length;
    const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / total;
    const fiveStars = testimonials.filter(t => t.rating === 5).length;
    const fourStars = testimonials.filter(t => t.rating === 4).length;

    setStats({
      total,
      averageRating: Number(averageRating.toFixed(1)),
      fiveStars,
      fourStars
    });
  }, [testimonials]);

  // Пагинация
  useEffect(() => {
    const startIndex = (currentPage - 1) * testimonialsPerPage;
    const endIndex = startIndex + testimonialsPerPage;
    setDisplayedTestimonials(filteredTestimonials.slice(startIndex, endIndex));
  }, [filteredTestimonials, currentPage]);

  // Автоматическое изменение высоты textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setFormData(prev => ({ ...prev, text: textarea.value }));
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    setHoverRating(0);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleServiceChange = (service: ServiceType) => {
    setFormData(prev => {
      const currentServices = [...prev.services];
      if (currentServices.includes(service)) {
        return {
          ...prev,
          services: currentServices.filter(s => s !== service)
        };
      } else {
        if (currentServices.length < 3) {
          return {
            ...prev,
            services: [...currentServices, service]
          };
        }
        return prev;
      }
    });
  };

  const handleFormFieldChange = (field: 'name' | 'role' | 'text' | 'rating', value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={styles.star}
        style={{ 
          color: index < rating ? '#FFD700' : '#e0e0e0'
        }}
      >
        ★
      </span>
    ));
  };

  const renderInteractiveStars = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const starNumber = index + 1;
      const isActive = starNumber <= (hoverRating || formData.rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`${styles.interactiveStar} ${isActive ? styles.activeStar : ''}`}
          onMouseEnter={() => handleStarHover(starNumber)}
          onMouseLeave={handleStarLeave}
          onClick={() => handleStarClick(starNumber)}
          aria-label={`Оценить на ${starNumber} звезд`}
          title={`Оценить на ${starNumber} звезд`}
        >
          <span className={styles.starIcon}>★</span>
        </button>
      );
    });
  };

  const renderServiceTags = (services?: ServiceType[]) => {
    if (!services || services.length === 0) {
      return null;
    }
    
    return (
      <div className={styles.serviceTagsContainer}>
        {services.map((service, index) => (
          <span key={index} className={styles.serviceTag}>
            {service}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('Пожалуйста, поставьте оценку');
      return;
    }

    if (formData.services.length === 0) {
      alert('Пожалуйста, выберите хотя бы один сервис');
      return;
    }

    const newTestimonial: ExtendedTestimonial = {
      id: testimonials.length + 1,
      name: formData.name,
      role: formData.role,
      text: formData.text,
      rating: formData.rating,
      date: new Date().toISOString().split('T')[0],
      avatar: formData.name.charAt(0) + (formData.name.split(' ')[1]?.charAt(0) || ''),
      services: formData.services
    };

    // Добавляем новый отзыв в состояние
    setTestimonials(prev => [newTestimonial, ...prev]);
    
    // Сброс формы
    setFormData({
      name: '',
      role: '',
      text: '',
      rating: 0,
      services: []
    });
    
    setShowTips(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setCurrentPage(1);
    
    // Анимация добавления нового отзыва
    gsap.from(`.${styles.testimonialCard}:first-child`, {
      opacity: 0,
      y: -30,
      scale: 0.9,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });

    alert('Спасибо за ваш отзыв!');
  };

  const totalPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage);

  return (
    <div className={styles.container}>
      {/* Герой секция */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Отзывы <span className={styles.gradientText}>клиентов</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Узнайте, что говорят о нас люди, которые уже улучшили свою сеть
          </p>
          <div className={styles.heroButtons}>
            <Link to="/" className={styles.secondaryButton}>
              ← На главную
            </Link>
            <button 
              className={styles.primaryButton}
              onClick={scrollToForm}
            >
              Оставить отзыв
            </button>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statsCard}>
            <div className={styles.statsValue}>{stats.total}</div>
            <div className={styles.statsLabel}>Всего отзывов</div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsValue}>{stats.averageRating}</div>
            <div className={styles.statsLabel}>Средний рейтинг</div>
            <div className={styles.statsStars}>
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsValue}>{stats.fiveStars}</div>
            <div className={styles.statsLabel}>Оценок 5★</div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsValue}>{stats.fourStars}+</div>
            <div className={styles.statsLabel}>Оценок 4★+</div>
          </div>
        </div>
      </section>

      {/* Фильтры и поиск */}
      <section className={styles.filtersSection}>
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск по отзывам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterRating}>
              <label className={styles.filterLabel}>Фильтр по рейтингу:</label>
              <div className={styles.ratingFilter}>
                {[0, 5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    className={`${styles.ratingFilterButton} ${ratingFilter === rating ? styles.active : ''}`}
                    onClick={() => setRatingFilter(rating as RatingFilter)}
                  >
                    {rating === 0 ? 'Все' : `${rating}★`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSort}>
              <label className={styles.filterLabel}>Сортировка:</label>
              <CustomSelect
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value as SortOption)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Сетка отзывов */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {filteredTestimonials.length} {getRussianWordForm(filteredTestimonials.length, ['отзыв', 'отзыва', 'отзывов'])}
          </h2>
          <p className={styles.sectionSubtitle}>
            {ratingFilter > 0 
              ? `Показаны отзывы с рейтингом ${ratingFilter}★` 
              : 'Все отзывы наших клиентов'}
          </p>
        </div>

        {displayedTestimonials.length > 0 ? (
          <>
            {/* Десктопная сетка */}
            <div className={styles.testimonialsGrid}>
              {displayedTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.testimonialCard}>
                  <div className={styles.testimonialHeader}>
                    <div className={styles.avatar}>
                      {testimonial.avatar || testimonial.name.charAt(0)}
                    </div>
                    <div className={styles.testimonialInfo}>
                      <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                      <p className={styles.testimonialRole}>{testimonial.role}</p>
                      <div className={styles.rating}>
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  {renderServiceTags(testimonial.services)}
                  <p className={styles.testimonialText}>{testimonial.text}</p>
                  <div className={styles.testimonialFooter}>
                    <span className={styles.testimonialDate}>
                      {formatDate(testimonial.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Мобильная горизонтальная прокрутка */}
            <div 
              ref={scrollContainerRef}
              className={styles.testimonialsScrollContainer}
            >
              <div className={styles.testimonialsScrollWrapper}>
                {displayedTestimonials.map((testimonial) => (
                  <div key={`scroll-${testimonial.id}`} className={styles.scrollTestimonialCard}>
                    <div className={styles.testimonialHeader}>
                      <div className={styles.avatar}>
                        {testimonial.avatar || testimonial.name.charAt(0)}
                      </div>
                      <div className={styles.testimonialInfo}>
                        <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                        <p className={styles.testimonialRole}>{testimonial.role}</p>
                        <div className={styles.rating}>
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    {renderServiceTags(testimonial.services)}
                    <p className={styles.testimonialText}>{testimonial.text}</p>
                    <div className={styles.testimonialFooter}>
                      <span className={styles.testimonialDate}>
                        {formatDate(testimonial.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* ПАГИНАЦИЯ */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Назад
                </button>
                
                <div className={styles.paginationPages}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`${styles.paginationPage} ${currentPage === pageNum ? styles.active : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Вперед →
                </button>
              </div>
            )}
            
            <div className={styles.paginationInfo}>
              Показано {Math.min((currentPage - 1) * testimonialsPerPage + 1, filteredTestimonials.length)}-
              {Math.min(currentPage * testimonialsPerPage, filteredTestimonials.length)} из {filteredTestimonials.length} отзывов
            </div>
          </>
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>😔</div>
            <h3 className={styles.noResultsTitle}>Отзывы не найдены</h3>
            <p className={styles.noResultsText}>
              Попробуйте изменить параметры фильтрации или очистить поиск
            </p>
            <button 
              className={styles.resetFiltersButton}
              onClick={() => {
                setRatingFilter(0);
                setSearchQuery('');
                setCurrentPage(1);
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </section>

      {/* Форма добавления отзыва */}
      <section id="addTestimonial" ref={formRef} className={styles.addTestimonialSection}>
        <div className={styles.addTestimonialContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Поделитесь <span className={styles.gradientText}>своим опытом</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Ваш отзыв поможет другим сделать правильный выбор
            </p>
          </div>

          <form onSubmit={handleSubmitTestimonial} className={styles.testimonialForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Иван Иванов"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) => handleFormFieldChange('name', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="role" className={styles.formLabel}>
                  Ваша роль / профессия
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  placeholder="Например: Разработчик, Дизайнер"
                  className={styles.formInput}
                  value={formData.role}
                  onChange={(e) => handleFormFieldChange('role', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="text" className={styles.formLabel}>
                Ваш отзыв *
              </label>
              <textarea
                ref={textareaRef}
                id="text"
                name="text"
                required
                rows={1}
                placeholder="Расскажите о вашем опыте использования наших услуг..."
                className={styles.formTextarea}
                maxLength={500}
                value={formData.text}
                onChange={handleTextareaChange}
                style={{
                  minHeight: 'none',
                  resize: 'none',
                  overflow: 'hidden'
                }}
              />
              <div className={styles.charCount}>
                {formData.text.length}/500 символов
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Ваша оценка *
              </label>
              <div 
                ref={ratingContainerRef}
                className={styles.ratingInputContainer}
              >
                <div className={styles.ratingInput}>
                  {renderInteractiveStars()}
                </div>
                <div className={styles.ratingHint}>
                  <span>Плохо</span>
                  <span>Отлично</span>
                </div>
                {formData.rating > 0 && (
                  <div className={styles.selectedRating}>
                    Выбрано: {formData.rating} ★
                  </div>
                )}
              </div>
            </div>

            {/* ВЫБОР СЕРВИСОВ */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Выберите сервисы, которыми пользовались *
              </label>
              <div className={styles.servicesSelection}>
                <div className={styles.servicesGrid}>
                  {AVAILABLE_SERVICES.map((service) => (
                    <div key={service} className={styles.serviceCheckbox}>
                      <input
                        type="checkbox"
                        id={`service-${service}`}
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceChange(service)}
                        className={styles.serviceInput}
                      />
                      <label 
                        htmlFor={`service-${service}`}
                        className={`${styles.serviceLabel} ${formData.services.includes(service) ? styles.serviceLabelActive : ''}`}
                      >
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
                <div className={styles.servicesHint}>
                  <span>Можно выбрать до 3 сервисов</span>
                  <span>Выбрано: {formData.services.length}/3</span>
                </div>
                {formData.services.length > 0 && (
                  <div className={styles.selectedServicesPreview}>
                    <span className={styles.selectedServicesTitle}>Выбранные сервисы:</span>
                    <div className={styles.selectedServicesTags}>
                      {formData.services.map((service, index) => (
                        <span key={index} className={styles.selectedServiceTag}>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formFooter}>
              <p className={styles.formNote}>
                Нажимая "Отправить отзыв", вы соглашаетесь с нашими условиями использования
              </p>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={formData.rating === 0 || formData.services.length === 0}
              >
                Отправить отзыв
              </button>
            </div>
          </form>

          {/* СОВЕТЫ ДЛЯ ОТЗЫВА */}
          <div className={`${styles.testimonialTips} ${showTips ? styles.show : ''}`}>
            <h4 className={styles.tipsTitle}>Советы для хорошего отзыва:</h4>
            <ul className={styles.tipsList}>
              <li>Расскажите о конкретной услуге, которой пользовались</li>
              <li>Опишите ваш опыт и впечатления</li>
              <li>Поделитесь результатами, которых достигли</li>
              <li>Будьте честны и объективны</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Готовы улучшить свою <span className={styles.gradientText}>сеть</span>?
          </h2>
          <p className={styles.ctaText}>
            Присоединяйтесь к тысячам довольных клиентов
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/services" className={styles.ctaPrimary}>
              Смотреть услуги
            </Link>
            <Link to="/support" className={styles.ctaSecondary}>
              Задать вопрос
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Вспомогательная функция для правильного склонения слов
const getRussianWordForm = (number: number, words: [string, string, string]) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
};

export default TestimonialsPage;