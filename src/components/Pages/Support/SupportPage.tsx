// src/pages/SupportPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
import styles from './SupportPage.module.css';
interface Message {
  type: 'user' | 'ai';
  content: string;
}
const SupportPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestions = [
    'Как зарегистрироваться?',
    'Проблемы с оплатой',
    'Технические вопросы',
    'Другое'
  ];
  const handleSuggestionClick = (suggestion: string) => {
    if (!suggestion.trim()) return;
    const newMessage: Message = { type: 'user', content: suggestion };
    setMessages([...messages, newMessage]);
    setIsThinking(true);
    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = getAIResponse(newMessage.content);
      setMessages((prev) => [...prev, { type: 'ai', content: aiResponse }]);
      setIsThinking(false);
    }, 1500);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newMessage: Message = { type: 'user', content: inputValue };
    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsThinking(true);
    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = getAIResponse(newMessage.content);
      setMessages((prev) => [...prev, { type: 'ai', content: aiResponse }]);
      setIsThinking(false);
    }, 1500);
  };
  const getAIResponse = (userMessage: string) => {
    // Simple simulated responses
    if (userMessage.includes('зарегистрироваться')) {
      return 'Чтобы зарегистрироваться, перейдите в раздел авторизации и выберите "Регистрация". Заполните форму.';
    } else if (userMessage.includes('оплат')) {
      return 'Для проблем с оплатой, проверьте баланс карты или свяжитесь с банком. Если проблема persists, напишите детали.';
    } else if (userMessage.includes('техническ')) {
      return 'Опишите вашу техническую проблему подробнее, и мы поможем.';
    } else {
      return 'Спасибо за ваш вопрос. Наш специалист свяжется с вами в ближайшее время.';
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className={styles.chatbot}>
      <div className={styles.chatbot__container}>
        {messages.length === 0 ? (
          <div className={styles.chatbot__welcome}>
            <div className={styles.chatbot__iconWrapper}>
              <div className={`${styles.chatbot__icon} ${styles['chatbot__icon--gradient']}`}>
                <FaRobot className={styles['chatbot__icon-svg']} />
              </div>
            </div>
            <h2 className={styles.chatbot__title}>Добро пожаловать в поддержку!</h2>
            <div className={styles['chatbot__suggestions-box']}>
              {suggestions.map((sug, index) => (
                <button
                  key={index}
                  className={styles.chatbot__suggestion}
                  onClick={() => handleSuggestionClick(sug)}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.chatbot__conversation}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.chatbot__message} ${styles[`chatbot__message--${msg.type}`]}`}>
                <div className={styles['chatbot__message-icon']}>
                  <div className={`${styles.chatbot__icon} ${styles['chatbot__icon--small']}`}>
                    {msg.type === 'ai' ? <FaRobot /> : <FaUser />}
                  </div>
                </div>
                <div className={styles['chatbot__message-content']}>
                  <p className={styles['chatbot__message-text']}>{msg.content}</p>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className={`${styles.chatbot__message} ${styles['chatbot__message--ai']}`}>
                <div className={styles['chatbot__message-icon']}>
                  <div className={`${styles.chatbot__icon} ${styles['chatbot__icon--small']}`}>
                    <FaRobot />
                  </div>
                </div>
                <div className={styles['chatbot__message-content']}>
                  <div className={styles.chatbot__loader}>
                    <div className={styles['chatbot__loader-line']}></div>
                    <div className={styles['chatbot__loader-line']}></div>
                    <div className={styles['chatbot__loader-line']}></div>
                    <div className={styles['chatbot__loader-line']}></div>
                    <div className={styles['chatbot__loader-line']}></div>
                    <div className={styles['chatbot__loader-line']}></div>
                    <div className={styles['chatbot__loader-line']}></div>
                    <div className={styles['chatbot__loader-line']}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <form className={styles['chatbot__input-wrapper']} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.chatbot__input}
            placeholder="Введите ваше сообщение..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className={styles.chatbot__submit}
            disabled={!inputValue.trim()}
            aria-label="Отправить сообщение"
          >
            <FaPaperPlane className={styles['chatbot__submit-icon']} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default SupportPage;