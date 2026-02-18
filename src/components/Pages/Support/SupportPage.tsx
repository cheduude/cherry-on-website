import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaHeadset,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaLightbulb,
  FaChevronRight,
  FaChevronDown,
  FaArrowDown
} from 'react-icons/fa';
import styles from './SupportPage.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface Message {
  type: 'user' | 'ai';
  content: string;
  isQuickReplies?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const SupportPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: 'Привет! Я ваш виртуальный помощник. Чем могу помочь? Выберите один из быстрых вопросов ниже:',
      isQuickReplies: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: 'Как зарегистрироваться в системе?',
      answer: 'Перейдите в раздел "Регистрация", заполните форму с email и паролем. После подтверждения email вы получите доступ ко всем функциям.',
      isOpen: false
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем банковские карты Visa/Mastercard, электронные кошельки (QIWI, ЮMoney), и банковские переводы.',
      isOpen: false
    },
    {
      question: 'Как сбросить пароль?',
      answer: 'На странице входа нажмите "Забыли пароль?" и следуйте инструкциям. Ссылка для сброса придет на вашу почту.',
      isOpen: false
    },
    {
      question: 'Какие гарантии предоставляются?',
      answer: 'Мы гарантируем 99.9% аптайм сервисов, круглосуточную поддержку и возврат средств в течение 14 дней.',
      isOpen: false
    }
  ]);

  const quickReplies = [
    'Как зарегистрироваться?',
    'Проблемы с оплатой',
    'Технические вопросы',
    'Контакты поддержки',
    'Статус заказа',
    'Настройка оборудования'
  ];

  const supportStats = [
    { icon: <FaHeadset />, value: '24/7', label: 'Поддержка онлайн' },
    { icon: <FaClock />, value: '5 мин', label: 'Среднее время ответа' },
    { icon: <FaUser />, value: '98%', label: 'Довольных клиентов' },
    { icon: <FaLightbulb />, value: '100+', label: 'Решенных проблем' }
  ];


  useEffect(() => {
  // Если в URL нет хэша, прокручиваем страницу вверх при загрузке
  if (!window.location.hash) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // будет использовать глобальное поведение, заданное ниже
      });
    }
    }, []);
  // Инициализация GSAP ScrollTrigger с нативным скроллом
  useEffect(() => {
    // Настройка плавного скролла с помощью CSS
    const enableSmoothScroll = () => {
      const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
      
      if (supportsNativeSmoothScroll) {
        // Используем нативный плавный скролл
        document.documentElement.style.scrollBehavior = 'smooth';
      } else {
        // Фолбэк для старых браузеров
        const style = document.createElement('style');
        style.textContent = `
          html {
            scroll-behavior: smooth;
          }
          * {
            -webkit-overflow-scrolling: touch;
          }
        `;
        document.head.appendChild(style);
      }
    };

    enableSmoothScroll();

    // Анимации при загрузке
    const timer = setTimeout(() => {
      if (isFirstRender.current) {
        // Анимация для статистики
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

        // Анимация для FAQ с ScrollTrigger
        gsap.fromTo(`.${styles.faqItem}`,
          {
            opacity: 0,
            x: -30
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: `.${styles.faqSection}`,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
              markers: false
            }
          }
        );

        // Анимация для чата
        gsap.fromTo(`.${styles.chatCard}`,
          {
            opacity: 0,
            scale: 0.95
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.3,
            scrollTrigger: {
              trigger: `.${styles.chatSection}`,
              start: 'top 80%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
              markers: false
            }
          }
        );

        // Анимация для героя
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
          )
          .fromTo(`.${styles.heroButtons}`,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
            '-=0.3'
          );

        isFirstRender.current = false;
      }
    }, 300);
    
    return () => {
      clearTimeout(timer);
      // Очищаем все ScrollTrigger анимации
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // Возвращаем стандартное поведение скролла
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Обработчик скролла для показа/скрытия кнопки
  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (!chatMessages) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatMessages;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

      setShowScrollButton(!isAtBottom);
    };

    chatMessages.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      chatMessages.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Прокрутка к последнему сообщению при нажатии на кнопку
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      const messagesContainer = chatMessagesRef.current;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      setTimeout(() => {
        setShowScrollButton(false);
      }, 300);
    }
  };

  // Проверяем нужно ли показать кнопку при добавлении новых сообщений
  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (!chatMessages) return;

    const { scrollTop, scrollHeight, clientHeight } = chatMessages;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (!isAtBottom) {
      setShowScrollButton(true);
    }
  }, [messages]);

  const handleQuickReplyClick = (reply: string) => {
    if (!reply.trim() || isThinking || isTyping) return;

    const newMessage: Message = { type: 'user', content: reply };
    setMessages(prev => [...prev, newMessage]);
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);

      const aiResponse = getAIResponse(reply);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          type: 'ai',
          content: aiResponse,
          isQuickReplies: true
        }]);
      }, 1500);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking || isTyping) return;

    const newMessage: Message = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);

      const aiResponse = getAIResponse(inputValue);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          type: 'ai',
          content: aiResponse,
          isQuickReplies: true
        }]);
      }, 1500);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('регистрац') || message.includes('зарегистрир')) {
      return 'Для регистрации перейдите на страницу авторизации, нажмите "Зарегистрироваться" и заполните форму. После подтверждения email вы получите полный доступ ко всем функциям.';
    } else if (message.includes('оплат') || message.includes('платёж')) {
      return 'Мы принимаем Visa/Mastercard, электронные кошельки и банковские переводы. Если возникли проблемы с оплатой, проверьте баланс карты или свяжитесь с вашим банком.';
    } else if (message.includes('техническ') || message.includes('проблем')) {
      return 'Опишите техническую проблему подробнее: какое оборудование используете, когда возникла проблема, какие ошибки видите. Это поможет решить вопрос быстрее.';
    } else if (message.includes('контакт') || message.includes('связаться')) {
      return 'Вы можете связаться с нами по email: support@example.com или телефону: +7 (XXX) XXX-XX-XX. Также доступен чат с оператором в рабочее время.';
    } else if (message.includes('статус') || message.includes('заказ')) {
      return 'Для проверки статуса заказа перейдите в личный кабинет, раздел "Мои заказы". Там вы увидите актуальную информацию по всем вашим заявкам.';
    } else if (message.includes('настройк') || message.includes('оборудован')) {
      return 'Инструкции по настройке оборудования вы найдете в разделе "Документация". Если нужна помощь, опишите модель устройства и возникшие сложности.';
    } else if (message.includes('гаранти') || message.includes('возврат')) {
      return 'Мы предоставляем гарантию 14 дней на возврат средств и техническую поддержку в течение всего срока обслуживания.';
    } else {
      return 'Спасибо за ваш вопрос! Я передам его специалисту. А пока вы можете уточнить детали или выбрать один из быстрых вопросов:';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isThinking && !isTyping) {
        handleSubmit(e);
      }
    }
  };

  const toggleFaq = (index: number) => {
    setFaqItems(prev => prev.map((item, i) => ({
      ...item,
      isOpen: i === index ? !item.isOpen : false
    })));
  };

  return (
    <div className={styles.container}>
      {/* Герой секция */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.gradientText}>Поддержка</span> клиентов
          </h1>
          <p className={styles.heroSubtitle}>
            Мы всегда рядом, чтобы помочь решить любые вопросы
          </p>
          <div className={styles.heroButtons}>
            <Link to="/" className={styles.secondaryButton}>
              ← На главную
            </Link>
            <a href="#chat" className={styles.primaryButton}>
              Начать диалог
            </a>
          </div>
        </div>
      </section>

      {/* Статистика поддержки */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {supportStats.map((stat, index) => (
            <div key={index} className={styles.statsCard}>
              <div className={styles.statsIcon}>{stat.icon}</div>
              <div className={styles.statsValue}>{stat.value}</div>
              <div className={styles.statsLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ секция */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Часто задаваемые <span className={styles.gradientText}>вопросы</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Быстрые ответы на популярные вопросы
          </p>
        </div>
        <div className={styles.faqContainer}>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${item.isOpen ? styles.faqItemOpen : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className={styles.faqQuestion}>
                <h3 className={styles.faqQuestionText}>{item.question}</h3>
                <div className={styles.faqIconWrapper}>
                  {item.isOpen ? (
                    <FaChevronDown className={styles.faqIcon} />
                  ) : (
                    <FaChevronRight className={styles.faqIcon} />
                  )}
                </div>
              </div>
              <div className={`${styles.faqAnswer} ${item.isOpen ? styles.faqAnswerOpen : ''}`}>
                <p className={styles.faqAnswerText}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Чат-бот секция */}
      <section id="chat" className={styles.chatSection}>
        <div className={styles.chatContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Чат <span className={styles.gradientText}>поддержки</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Задайте вопрос, и сотрудник поддержки CherryOn поможет вам
            </p>
          </div>
          <div className={styles.chatCard} ref={chatContainerRef}>
            {/* Боковая панель с подсказками (только на десктопе) */}
            <div className={styles.chatSidebar}>
              <div className={styles.sidebarHeader}>
                <FaRobot className={styles.sidebarIcon} />
                <h3 className={styles.sidebarTitle}>Быстрые вопросы</h3>
              </div>
              <div className={styles.suggestionsList}>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className={styles.suggestionButton}
                    onClick={() => handleQuickReplyClick(reply)}
                    disabled={isThinking || isTyping}
                  >
                    <span className={styles.suggestionText}>{reply}</span>
                  </button>
                ))}
              </div>

              {/* Контакты поддержки (только на десктопе) */}
              <div className={styles.contactInfo}>
                <h4 className={styles.contactTitle}>Контакты поддержки</h4>
                <div className={styles.contactItem}>
                  <FaPhone className={styles.contactIcon} />
                  <span>+7 (XXX) XXX-XX-XX</span>
                </div>
                <div className={styles.contactItem}>
                  <FaEnvelope className={styles.contactIcon} />
                  <span>support@example.com</span>
                </div>
              </div>
            </div>

            {/* Основной чат */}
            <div className={styles.chatMain}>
              <div className={styles.chatHeader}>
                <div className={styles.chatAvatar}>
                  <FaRobot className={styles.chatAvatarIcon} />
                </div>
                <div className={styles.chatInfo}>
                  <h3 className={styles.chatName}>Чат поддержки</h3>
                  <p className={styles.chatStatus}>
                    {isThinking ? 'Думает...' : isTyping ? 'Печатает...' : 'Онлайн'}
                  </p>
                </div>
              </div>
              <div className={styles.chatMessages} ref={chatMessagesRef}>
                {messages.map((msg, index) => (
                  <div key={index}>
                    <div
                      className={`${styles.message} ${styles[`message--${msg.type}`]}`}
                    >
                      <div className={styles.messageAvatar}>
                        <div className={`${styles.avatar} ${msg.type === 'ai' ? styles.avatarAI : styles.avatarUser}`}>
                          {msg.type === 'ai' ? <FaRobot /> : <FaUser />}
                        </div>
                      </div>
                      <div className={styles.messageContent}>
                        <div className={styles.messageText}>{msg.content}</div>
                        <div className={styles.messageTime}>
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Быстрые вопросы как часть сообщения от бота */}
                    {msg.type === 'ai' && msg.isQuickReplies && (
                      <div className={styles.quickRepliesContainer}>
                        <div className={styles.quickRepliesGrid}>
                          {quickReplies.slice(0, 4).map((reply, replyIndex) => (
                            <button
                              key={replyIndex}
                              className={styles.quickReplyButton}
                              onClick={() => handleQuickReplyClick(reply)}
                              disabled={isThinking || isTyping}
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                        <div className={styles.quickRepliesHint}>
                          <FaLightbulb className={styles.quickRepliesHintIcon} />
                          <span>Выберите вопрос или напишите свой</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Индикатор загрузки вместо текста во время набора */}
                {isTyping && (
                  <div className={`${styles.message} ${styles['message--ai']}`}>
                    <div className={styles.messageAvatar}>
                      <div className={`${styles.avatar} ${styles.avatarAI}`}>
                        <FaRobot />
                      </div>
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.typingIndicator}>
                        <span className={styles.typingDot}></span>
                        <span className={styles.typingDot}></span>
                        <span className={styles.typingDot}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Кнопка прокрутки вниз */}
              {showScrollButton && (
                <button
                  className={styles.scrollToBottomButton}
                  onClick={scrollToBottom}
                  aria-label="Прокрутить к последнему сообщению"
                  title="Прокрутить к последнему сообщению"
                >
                  <FaArrowDown className={styles.scrollToBottomIcon} />
                </button>
              )}

              <form
                ref={formRef}
                className={styles.chatInputContainer}
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  className={styles.chatInput}
                  placeholder="Введите ваш вопрос..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isThinking || isTyping}
                />
                <button
                  type="submit"
                  className={styles.chatSubmit}
                  disabled={!inputValue.trim() || isThinking || isTyping}
                  aria-label="Отправить сообщение"
                >
                  <FaPaperPlane className={styles.submitIcon} />
                </button>
              </form>
            </div>
          </div>

          {/* Контакты поддержки для мобильных */}
          <div className={styles.mobileContacts}>
            <div className={styles.mobileContactsHeader}>
              <FaHeadset className={styles.mobileContactsIcon} />
              <h4 className={styles.mobileContactsTitle}>Контакты поддержки</h4>
            </div>
            <div className={styles.mobileContactsInfo}>
              <div className={styles.mobileContactItem}>
                <FaPhone className={styles.mobileContactIcon} />
                <span className={styles.mobileContactText}>+7 (XXX) XXX-XX-XX</span>
              </div>
              <div className={styles.mobileContactItem}>
                <FaEnvelope className={styles.mobileContactIcon} />
                <span className={styles.mobileContactText}>support@example.com</span>
              </div>
            </div>
          </div>

          <div className={styles.chatHint}>
            <FaLightbulb className={styles.hintIcon} />
            <p className={styles.hintText}>
              Чат поддержки работает круглосуточно. Для сложных вопросов потребуется чуть больше времени.
            </p>
          </div>
        </div>
      </section>

      {/* Контактная секция */}
      <section className={styles.contactSection}>
        <div className={styles.contactCard}>
          <div className={styles.contactContent}>
            <h2 className={styles.contactTitleMain}>Нужна помощь оператора?</h2>
            <p className={styles.contactText}>
              Наша команда поддержки доступна с 9:00 до 21:00 по московскому времени
            </p>
            <div className={styles.contactButtons}>
              <a href="tel:+7XXXXXXXXXX" className={styles.contactButtonPrimary}>
                <FaPhone className={styles.buttonIcon} />
                Позвонить нам
              </a>
              <a href="mailto:support@example.com" className={styles.contactButtonSecondary}>
                <FaEnvelope className={styles.buttonIcon} />
                Написать на почту
              </a>
            </div>
          </div>
          <div className={styles.contactIllustration}>
            <div className={styles.illustrationCircle}>
              <FaHeadset className={styles.illustrationIcon} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;