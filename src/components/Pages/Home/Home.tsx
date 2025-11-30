// src/components/Pages/Home/Home.tsx (Главная страница — плейсхолдер для услуг, готов к модернизации)
import styles from './Home.module.css';
import CoolButtons from '../../Pages/Home/CoolButtons/CoolButtons';
import ScrollBackground from '../../ScrollBackground/ScrollBackground';
interface HomeProps {
  isMobile: boolean;
}

const Home: React.FC<HomeProps> = ({ isMobile }) => {
  
  return (
    <div className={styles.home}>
      
      <h2>Добро пожаловать на наш домен!</h2>
      <p>Мы предоставляем услуги: VPN, прошивка роутеров, заказы из-за рубежа, подписки (Steam, ChatGPT, Grok, Spotify), сетевые диски NVMe.</p>
      <a href="/services">Посмотреть услуги</a>
      <CoolButtons />
      
    </div>
  );
};

export default Home;