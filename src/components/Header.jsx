// src/components/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="header">
        <nav className="main-nav">
          <div className="nav-links-center">
            <a href="/" className="nav-link">Главная</a>
            <a href="/contacts" className="nav-link">Контакты</a>
            <a href="/about" className="nav-link">О нас</a>
            <a href="/cart" className="nav-link">Корзина</a>
            <a href="/support" className="nav-link">Поддержка</a>
          </div>
          
          <div className="nav-right">
            {user && (
              <span className="nav-user-name">
                {user.name}
              </span>
            )}
            <button 
              onClick={handleAuthClick} 
              className="auth-button"
            >
              {user ? 'Выйти' : 'Войти'}
            </button>
          </div>
        </nav>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;