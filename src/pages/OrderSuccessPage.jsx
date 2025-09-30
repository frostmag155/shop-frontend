import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const [orderData, setOrderData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const orderFromState = location.state;
    const orderFromStorage = JSON.parse(localStorage.getItem('lastOrder'));

    if (orderFromState) {
      setOrderData(orderFromState);
    } else if (orderFromStorage) {
      setOrderData({
        orderId: orderFromStorage.id,
        amount: orderFromStorage.amount
      });
    } else {
      // Если нет данных о заказе, перенаправляем на главную
      navigate('/');
    }
  }, [location, navigate]);

  if (!orderData) {
    return (
      <div className="order-success-page loading">
        <div className="loading-spinner"></div>
        <p>Загрузка информации о заказе...</p>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">🎉</div>
        <h1>Заказ успешно оформлен!</h1>
        <p className="success-message">
          Спасибо за ваш заказ! Мы уже начали его обработку и скоро свяжемся с вами для подтверждения.
        </p>

        <div className="order-details">
          <h2>Детали заказа</h2>
          <div className="detail-row">
            <span className="detail-label">Номер заказа:</span>
            <span className="detail-value">#{orderData.orderId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Сумма заказа:</span>
            <span className="detail-value">{orderData.amount.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Статус:</span>
            <span className="detail-value status-processing">Ожидает обработки</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Дата оформления:</span>
            <span className="detail-value">{new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        <div className="next-steps">
          <h3>Что дальше?</h3>
          <ul>
            <li>📧 В течение часа вам на почту придет подтверждение заказа</li>
            <li>📞 Наш менеджер свяжется с вами для уточнения деталей</li>
            <li>🚚 Вы получите уведомление о готовности заказа к выдаче</li>
          </ul>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn-primary">
            Продолжить покупки
          </Link>
          <button 
            className="btn-secondary"
            onClick={() => window.print()}
          >
            Распечатать заказ
          </button>
        </div>

        <div className="support-info">
          <p>Есть вопросы по заказу?</p>
          <p>Звоните: <strong>8 (111) 222-33-44</strong> или пишите на <strong>maximtroshkin12@yandex.ru</strong></p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;