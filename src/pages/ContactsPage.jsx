// ContactsPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ContactsPage.css';

const ContactsPage = () => {
  const { user, login, logout, showAuthModal, setShowAuthModal } = useAuth();

  return (
    <div className="contacts-page">
      <div className="contact-container">
        <h1 className="contact-title">Контактная информация</h1>
        
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">Телефон:</span>
            <span className="contact-value">+7 (495) 123-45-67</span>
          </div>
          
          <div className="contact-item">
            <span className="contact-label">Email:</span>
            <span className="contact-value">support@example.com</span>
          </div>
          
          <div className="contact-item">
            <span className="contact-label">Адрес:</span>
            <span className="contact-value">г. Москва, ул. Примерная, д. 1</span>
          </div>
          
          <div className="contact-item">
            <span className="contact-label">Время работы:</span>
            <span className="contact-value">Пн–Пт: 9:00–18:00</span>
          </div>
          
          <div className="contact-item">
            <span className="contact-label">Социальные сети:</span>
            <div className="social-links">
              <a href="https://vk.com/mtroshkin3" className="social-link">VK</a>
              <a href="https://t.me/m_troshkin" className="social-link">Telegram</a>
              {/* <a href="#" className="social-link">Instagram</a> */}
            </div>
          </div>
        </div>

        <a href="/" className="back-link">← Вернуться на главную</a>
      </div>
    </div>
  );
};

export default ContactsPage;