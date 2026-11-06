import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaHeadset,
  FaEnvelope,
  FaTelegram,
  FaLightbulb,
  FaArrowDown
} from 'react-icons/fa';
import styles from './SupportPage.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../../hooks/useAuth';
import { DEFAULT_AVATAR, isDefaultAvatar, resolveAvatarUrl } from '../../../constants/auth';
import { ResolvedAvatar } from '../../ui/ResolvedAvatar';

gsap.registerPlugin(ScrollTrigger);

const SUPPORT_EMAIL = 'mainserev@cherryon.art';
const SUPPORT_BOT_URL = 'https://t.me/cherryon_support_bot';

interface Message {
  type: 'user' | 'ai';
  content: string;
  isQuickReplies?: boolean;
  userAvatar?: string;
  userAvatarType?: 'static' | 'animated';
}

const SupportPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [reviewRatings, setReviewRatings] = useState<number[]>([]);

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
  const wasAtBottomRef = useRef(true);

  const quickReplies = [
    'Как зарегистрироваться?',
    'Проблемы с оплатой',
    'Технические вопросы',
    'Контакты поддержки',
    'Статус заказа',
    'Настройка оборудования'
  ];

  const contactInfo = {
    email: SUPPORT_EMAIL,
    telegram: 'Телеграм',
    telegramLink: SUPPORT_BOT_URL,
  };

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

  const isAnimatedAvatar = (url: string): boolean => {
    if (!url) return false;
    if (url.toLowerCase().includes('.gif')) return true;
    if (url.includes('telegram') && (url.includes('animated') || url.includes('video'))) return true;
    const animatedParams = ['animated', 'gif', 'video', 'mp4'];
    return animatedParams.some(param => url.toLowerCase().includes(param));
  };

  const getUserAvatar = (): { url: string; type: 'static' | 'animated' } => {
    if (!isAuthenticated || !user) {
      return { url: DEFAULT_AVATAR, type: 'static' };
    }

    const url = resolveAvatarUrl(user.avatar);
    return {
      url,
      type: url !== DEFAULT_AVATAR && isAnimatedAvatar(url) ? 'animated' : 'static'
    };
  };

  const getUserName = (): string => {
    if (!isAuthenticated || !user) return 'Гость';
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'Пользователь';
  };

  useEffect(() => {
    const context = gsap.context(() => {
      if (!isFirstRender.current) return;

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
      gsap.fromTo(`.${styles.chatCard}`,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: `.${styles.chatSection}`,
            start: 'top 80%',
            end: 'top 60%',
            toggleActions: 'play none none reverse'
          }
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

      isFirstRender.current = false;
    });

    return () => context.revert();
  }, []);

  const isAtBottom = useCallback(() => {
    const messagesContainer = chatMessagesRef.current;
    if (!messagesContainer) return true;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  useEffect(() => {
    const messagesContainer = chatMessagesRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      wasAtBottomRef.current = isAtBottom();
      setShowScrollButton(!wasAtBottomRef.current);
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isAtBottom]);

  const scrollToBottom = useCallback(() => {
    const messagesContainer = chatMessagesRef.current;
    if (!messagesContainer) return;

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setShowScrollButton(false);
      wasAtBottomRef.current = true;
    }, 300);
  }, []);

  useEffect(() => {
    if (wasAtBottomRef.current) {
      scrollToBottom();
    } else {
      setShowScrollButton(true);
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isTyping && wasAtBottomRef.current) {
      scrollToBottom();
    }
  }, [isTyping, scrollToBottom]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isThinking && !isTyping) {
        handleSubmit(e);
      }
    }
  };

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
          {/* <div className={styles.heroButtons}>
            <Link to="/" className={styles.secondaryButton}>На главную</Link>
            <a href={SUPPORT_BOT_URL} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
              Написать в Telegram
            </a>
          </div> */}
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
                              ) : isDefaultAvatar(msg.userAvatar) ? (
                                <ResolvedAvatar
                                  avatar={msg.userAvatar}
                                  alt={getUserName()}
                                  className={styles.userAvatarImage}
                                />
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
