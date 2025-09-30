// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { SERVER_URL } from '../utils/constants';

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Данные форм
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    secondName: '',
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const result = await response.json();

      if (result.success) {
        login(result.user);
        onClose();
      } else {
        setError(result.message || 'Ошибка входа');
      }
    } catch (err) {
      setError('Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          second_name: registerData.secondName,
          email: registerData.email,
          password: registerData.password
        })
      });

      const result = await response.json();

      if (result.success) {
        setActiveTab('login');
        setError('Регистрация успешна! Теперь войдите в аккаунт.');
        // Очищаем форму регистрации
        setRegisterData({ name: '', secondName: '', email: '', password: '' });
      } else {
        setError(result.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-tabs">
            <button
              className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Вход
            </button>
            <button
              className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Регистрация
            </button>
          </div>

          {activeTab === 'login' && (
            <motion.form
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              onSubmit={handleLogin}
              className="auth-form"
            >
              <h3>Вход в аккаунт</h3>
              
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
              
              <input
                type="password"
                placeholder="Пароль"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />

              {error && <div className="error-message">{error}</div>}

              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? 'Вход...' : 'Войти'}
                </button>
                <button type="button" onClick={onClose}>
                  Отмена
                </button>
              </div>
            </motion.form>
          )}

          {activeTab === 'register' && (
            <motion.form
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              onSubmit={handleRegister}
              className="auth-form"
            >
              <h3>Регистрация</h3>
              
              <input
                type="text"
                placeholder="Имя"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
              
              <input
                type="text"
                placeholder="Фамилия"
                value={registerData.secondName}
                onChange={(e) => setRegisterData({ ...registerData, secondName: e.target.value })}
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
              
              <input
                type="password"
                placeholder="Пароль"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />

              {error && <div className="error-message">{error}</div>}

              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
                <button type="button" onClick={onClose}>
                  Отмена
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;