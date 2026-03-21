import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaHeadset,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaTelegram,
  FaLightbulb,
  FaChevronRight,
  FaChevronDown,
  FaArrowDown
} from 'react-icons/fa';
import styles from './SupportPage.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../../hooks/useAuth';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface Message {
  type: 'user' | 'ai';
  content: string;
  isQuickReplies?: boolean;
  userAvatar?: string;
  userAvatarType?: 'static' | 'animated';
}

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const SupportPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
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
  const wasAtBottomRef = useRef(true); // Ref для отслеживания позиции скролла
  
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: 'Как зарегистрироваться на сайте?',
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

  // Все 6 быстрых вопросов
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

  // Контактные данные
  const contactInfo = {
    email: 'support@cherryon.art',
    telegram: 'Телеграм',
    telegramLink: 'https://t.me/cherryon_support_bot',
    phone: '+7 (XXX) XXX-XX-XX'
  };

  // Функция для проверки, является ли URL анимированным (GIF)
  const isAnimatedAvatar = (url: string): boolean => {
    if (!url) return false;
    if (url.toLowerCase().includes('.gif')) return true;
    if (url.includes('telegram') && (url.includes('animated') || url.includes('video'))) return true;
    const animatedParams = ['animated', 'gif', 'video', 'mp4'];
    return animatedParams.some(param => url.toLowerCase().includes(param));
  };

  // Функция для получения аватарки пользователя
  const getUserAvatar = (): { url: string; type: 'static' | 'animated' } => {
    if (!isAuthenticated || !user) {
      return { url: '', type: 'static' };
    }
    
    if (user.avatar) {
      return {
        url: user.avatar,
        type: isAnimatedAvatar(user.avatar) ? 'animated' : 'static'
      };
    }
    
    if (user.name) {
      const initials = user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return {
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=667eea&color=fff&size=128&bold=true`,
        type: 'static'
      };
    }
    
    if (user.email) {
      const emailName = user.email.split('@')[0];
      const initials = emailName.slice(0, 2).toUpperCase();
      return {
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=667eea&color=fff&size=128&bold=true`,
        type: 'static'
      };
    }
    
    return { url: '', type: 'static' };
  };

  // Функция для получения имени пользователя
  const getUserName = (): string => {
    if (!isAuthenticated || !user) return 'Гость';
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'Пользователь';
  };

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, []);
  
  // Инициализация GSAP ScrollTrigger
  useEffect(() => {
    const enableSmoothScroll = () => {
      const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
      
      if (supportsNativeSmoothScroll) {
        document.documentElement.style.scrollBehavior = 'smooth';
      } else {
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

    const timer = setTimeout(() => {
      if (isFirstRender.current) {
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

        isFirstRender.current = false;
      }
    }, 300);
    
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Функция для проверки, находится ли скролл внизу
  const isAtBottom = useCallback(() => {
    const messagesContainer = chatMessagesRef.current;
    if (!messagesContainer) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  // Обновляем ref при скролле
  useEffect(() => {
    const messagesContainer = chatMessagesRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      wasAtBottomRef.current = isAtBottom();
      setShowScrollButton(!wasAtBottomRef.current);
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Инициализация

    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isAtBottom]);

  // Функция прокрутки вниз
  const scrollToBottom = useCallback(() => {
    const messagesContainer = chatMessagesRef.current;
    if (!messagesContainer) return;

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });
    
    // После прокрутки обновляем состояние кнопки
    setTimeout(() => {
      setShowScrollButton(false);
      wasAtBottomRef.current = true;
    }, 300);
  }, []);

  // Эффект для прокрутки при новых сообщениях
  useEffect(() => {
    // Если пользователь был внизу перед добавлением сообщения, прокручиваем вниз
    if (wasAtBottomRef.current) {
      scrollToBottom();
    } else {
      // Если пользователь не внизу, показываем кнопку прокрутки
      setShowScrollButton(true);
    }
  }, [messages, scrollToBottom]);

  // Прокрутка при начале печатания, если пользователь был внизу
  useEffect(() => {
    if (isTyping && wasAtBottomRef.current) {
      scrollToBottom();
    }
  }, [isTyping, scrollToBottom]);

  const handleQuickReplyClick = (reply: string) => {
    if (!reply.trim() || isThinking || isTyping) return;

    const avatar = getUserAvatar();
    const newMessage: Message = { 
      type: 'user', 
      content: reply,
      userAvatar: avatar.url,
      userAvatarType: avatar.type
    };
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

    const avatar = getUserAvatar();
    const newMessage: Message = { 
      type: 'user', 
      content: inputValue,
      userAvatar: avatar.url,
      userAvatarType: avatar.type
    };
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
      return `Вы можете связаться с нами по email: ${contactInfo.email} или в Telegram: ${contactInfo.telegram}. Также доступен чат с оператором в рабочее время.`;
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

  // Анимация для FAQ
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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

      {/* Чат-бот секция */}
      <section id="chat" className={styles.chatSection}>
        <div className={styles.chatContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Чат <span className={styles.gradientText}>поддержки</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              {isAuthenticated 
                ? `${getUserName()}, задайте вопрос, и мы поможем вам` 
                : 'Задайте вопрос, и сотрудник поддержки CherryOn поможет вам'}
            </p>
          </div>
          <div className={styles.chatCard} ref={chatContainerRef}>
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
                  <div key={index} className={styles.messageWrapper}>
                    <div
                      className={`${styles.message} ${styles[`message--${msg.type}`]}`}
                    >
                      <div className={styles.messageAvatar}>
                        {msg.type === 'ai' ? (
                          <div className={`${styles.avatar} ${styles.avatarAI}`}>
                            <FaRobot />
                          </div>
                        ) : (
                          <div className={`${styles.avatar} ${styles.avatarUser}`}>
                            {msg.userAvatar ? (
                              msg.userAvatarType === 'animated' ? (
                                msg.userAvatar.toLowerCase().includes('.mp4') || 
                                msg.userAvatar.toLowerCase().includes('.webm') ? (
                                  <video
                                    src={msg.userAvatar}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className={styles.animatedAvatar}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        const img = document.createElement('img');
                                        img.src = msg.userAvatar || '';
                                        img.className = styles.userAvatarImage;
                                        img.onerror = () => {
                                          parent.innerHTML = '<FaUser />';
                                        };
                                        parent.appendChild(img);
                                      }
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={msg.userAvatar}
                                    alt={getUserName()}
                                    className={`${styles.userAvatarImage} ${styles.animatedAvatar}`}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement?.classList.add(styles.avatarFallback);
                                    }}
                                  />
                                )
                              ) : (
                                <img
                                  src={msg.userAvatar}
                                  alt={getUserName()}
                                  className={styles.userAvatarImage}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add(styles.avatarFallback);
                                  }}
                                />
                              )
                            ) : (
                              <FaUser />
                            )}
                          </div>
                        )}
                      </div>
                      <div className={styles.messageContent}>
                        <div className={styles.messageText}>{msg.content}</div>
                        <div className={styles.messageTime}>
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {msg.type === 'ai' && msg.isQuickReplies && (
                      <div className={styles.quickRepliesContainer}>
                        <div className={styles.quickRepliesGrid}>
                          {quickReplies.map((reply, replyIndex) => (
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
                {isTyping && (
                  <div className={styles.messageWrapper}>
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
                  </div>
                )}
              </div>

              {showScrollButton && (
                <button
                  className={styles.scrollToBottomButton}
                  onClick={scrollToBottom}
                  aria-label="Прокрутить к последнему сообщению"
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
                  placeholder={isAuthenticated ? "Введите ваш вопрос..." : "Войдите, чтобы задать вопрос..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!isAuthenticated || isThinking || isTyping}
                />
                <button
                  type="submit"
                  className={styles.chatSubmit}
                  disabled={!isAuthenticated || !inputValue.trim() || isThinking || isTyping}
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
              <a 
                href={`mailto:${contactInfo.email}`} 
                className={styles.mobileContactLink}
              >
                <FaEnvelope className={styles.mobileContactIcon} />
                <span className={styles.mobileContactText}>{contactInfo.email}</span>
              </a>
              <a 
                href={contactInfo.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileContactLink}
              >
                <FaTelegram className={styles.mobileContactIcon} />
                <span className={styles.mobileContactText}>{contactInfo.telegram}</span>
              </a>
            </div>
          </div>

          <div className={styles.chatHint}>
            <FaLightbulb className={styles.hintIcon} />
            <p className={styles.hintText}>
              {isAuthenticated 
                ? 'Чат поддержки работает круглосуточно. Для сложных вопросов потребуется чуть больше времени.'
                : 'Пожалуйста, войдите в аккаунт, чтобы задать вопрос в чате.'}
            </p>
          </div>
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

      {/* Контактная секция */}
      <section className={styles.contactSection}>
        <div className={styles.contactCard}>
          <div className={styles.contactContent}>
            <h2 className={styles.contactTitleMain}>Нужна помощь оператора?</h2>
            <p className={styles.contactText}>
              Наша команда поддержки доступна с 9:00 до 21:00 по московскому времени
            </p>
            <div className={styles.contactButtons}>
              <a 
                href={`mailto:${contactInfo.email}`}
                className={styles.contactButtonPrimary}
              >
                <FaEnvelope className={styles.buttonIcon} />
                {contactInfo.email}
              </a>
              <a 
                href={contactInfo.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactButtonSecondary}
              >
                <FaTelegram className={styles.buttonIcon} />
                {contactInfo.telegram}
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