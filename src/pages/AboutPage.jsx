import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>О компании</h1>

        <p className="about-intro">
          Наша компания занимается поставкой оригинальной техники Apple с официальной гарантией и полной поддержкой. Мы
          стремимся предоставить лучший сервис, выгодные цены и только оригинальные устройства — никаких копий и
          восстановленных моделей.
        </p>

        <div className="about-section">
          <h2>Почему выбирают нас?</h2>
          <div className="about-features">
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <div className="feature-content">
                <h3>Только оригинальная техника</h3>
                <p>Все устройства поставляются напрямую от производителя с официальной гарантией</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <div className="feature-content">
                <h3>Гарантия и поддержка</h3>
                <p>Полное гарантийное обслуживание и техническая поддержка по всей России</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍💼</div>
              <div className="feature-content">
                <h3>Профессиональные консультации</h3>
                <p>Наши специалисты помогут подобрать оптимальное решение для ваших задач</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <div className="feature-content">
                <h3>Удобная доставка</h3>
                <p>Быстрая доставка по всей стране и удобный самовывоз из наших магазинов</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <div className="feature-content">
                <h3>Прозрачные условия</h3>
                <p>Честные цены, понятные условия покупки и отсутствие скрытых платежей</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Наша миссия</h2>
          <p className="mission-text">
            Сделать технику Apple доступной каждому — легко, честно и удобно. Мы не просто продаем устройства, мы строим
            долгосрочные отношения с клиентами, обеспечивая полную поддержку на всех этапах использования техники.
          </p>
        </div>

        <div className="about-section">
          <h2>Наши ценности</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Качество</h3>
              <p>Мы гарантируем 100% оригинальность всей продукции и предоставляем официальную гарантию производителя</p>
            </div>
            <div className="value-item">
              <h3>Надежность</h3>
              <p>Стабильные поставки, четкое выполнение обязательств и профессиональное обслуживание</p>
            </div>
            <div className="value-item">
              <h3>Клиентоориентированность</h3>
              <p>Индивидуальный подход к каждому клиенту и решение любых вопросов в кратчайшие сроки</p>
            </div>
            <div className="value-item">
              <h3>Инновации</h3>
              <p>Постоянное обновление ассортимента и отслеживание новинок технологического рынка</p>
            </div>
          </div>
        </div>

        <div className="about-quote-section">
          <blockquote className="about-quote">
            «Мы — не просто магазин. Мы — ваш надежный партнер в мире Apple»
          </blockquote>
          <div className="quote-author">— Команда Apple Store</div>
        </div>

        <div className="about-actions">
          <Link to="/" className="btn-primary">
            Перейти к покупкам
          </Link>
          <Link to="/contacts" className="btn-secondary">
            Связаться с нами
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;