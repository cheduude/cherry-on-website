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
  FaChevronRight
} from 'react-icons/fa';
import styles from './SupportPage.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  type: 'user' | 'ai';
  content: string;
}

const SupportPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: 'Привет! Я ваш виртуальный помощник. Чем могу помочь?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const suggestions = [
    'Как зарегистрироваться?',
    'Проблемы с оплатой',
    'Технические вопросы',
    'Контакты поддержки',
    'Статус заказа',
    'Настройка оборудования'
  ];

  const faqItems = [
    {
      question: 'Как зарегистрироваться в системе?',
      answer: 'Перейдите в раздел "Регистрация", заполните форму с email и паролем. После подтверждения email вы получите доступ ко всем функциям.'
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем банковские карты Visa/Mastercard, электронные кошельки (QIWI, ЮMoney), и банковские переводы.'
    },
    {
      question: 'Как сбросить пароль?',
      answer: 'На странице входа нажмите "Забыли пароль?" и следуйте инструкциям. Ссылка для сброса придет на вашу почту.'
    },
    {
      question: 'Какие гарантии предоставляются?',
      answer: 'Мы гарантируем 99.9% аптайм сервисов, круглосуточную поддержку и возврат средств в течение 14 дней.'
    }
  ];

  const supportStats = [
    { icon: <FaHeadset />, value: '24/7', label: 'Поддержка онлайн' },
    { icon: <FaClock />, value: '5 мин', label: 'Среднее время ответа' },
    { icon: <FaUser />, value: '98%', label: 'Довольных клиентов' },
    { icon: <FaLightbulb />, value: '100+', label: 'Решенных проблем' }
  ];

  // Анимации при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      // Анимация статистики
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

      // Анимация FAQ
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
            start: 'top 80%'
          }
        }
      );

      // Анимация чата
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
          delay: 0.3
        }
      );
    }, 300);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Прокрутка к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Имитация набора текста для AI
  useEffect(() => {
    if (!isTyping) return;

    const aiResponse = getAIResponse(messages[messages.length - 1]?.content || '');
    let index = 0;
    setTypingText('');

    const typingInterval = setInterval(() => {
      if (index < aiResponse.length) {
        setTypingText(prev => prev + aiResponse.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [isTyping, messages]);

  const handleSuggestionClick = (suggestion: string) => {
    if (!suggestion.trim()) return;
    
    const newMessage: Message = { type: 'user', content: suggestion };
    setMessages(prev => [...prev, newMessage]);
    setIsThinking(true);
    
    // Задержка перед ответом
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newMessage: Message = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsThinking(true);
    
    // Задержка перед ответом
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
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
      return 'Спасибо за ваш вопрос! Я передам его специалисту. А пока вы можете уточнить детали или обратиться к нам напрямую по контактам ниже.';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSubmit(e);
      }
    }
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
            <div key={index} className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <h3 className={styles.faqQuestionText}>{item.question}</h3>
                <FaChevronRight className={styles.faqIcon} />
              </div>
              <div className={styles.faqAnswer}>
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
              Виртуальный <span className={styles.gradientText}>помощник</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Задайте вопрос, и наш AI-ассистент поможет вам
            </p>
          </div>

          <div className={styles.chatCard} ref={chatContainerRef}>
            {/* Боковая панель с подсказками */}
            <div className={styles.chatSidebar}>
              <div className={styles.sidebarHeader}>
                <FaRobot className={styles.sidebarIcon} />
                <h3 className={styles.sidebarTitle}>Быстрые вопросы</h3>
              </div>
              <div className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionButton}
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isThinking || isTyping}
                  >
                    <span className={styles.suggestionText}>{suggestion}</span>
                  </button>
                ))}
              </div>
              
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
                  <h3 className={styles.chatName}>Виртуальный помощник</h3>
                  <p className={styles.chatStatus}>
                    {isThinking ? 'Думает...' : isTyping ? 'Печатает...' : 'Онлайн'}
                  </p>
                </div>
              </div>

              <div className={styles.chatMessages}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
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
                ))}

                {isTyping && (
                  <div className={`${styles.message} ${styles['message--ai']}`}>
                    <div className={styles.messageAvatar}>
                      <div className={`${styles.avatar} ${styles.avatarAI}`}>
                        <FaRobot />
                      </div>
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>{typingText}</div>
                      <div className={styles.typingIndicator}>
                        <span className={styles.typingDot}></span>
                        <span className={styles.typingDot}></span>
                        <span className={styles.typingDot}></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

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

          <div className={styles.chatHint}>
            <FaLightbulb className={styles.hintIcon} />
            <p className={styles.hintText}>
              ИИ-помощник работает круглосуточно. Для сложных вопросов доступна поддержка оператора.
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