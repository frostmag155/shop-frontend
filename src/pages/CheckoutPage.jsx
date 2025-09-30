import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    delivery: 'pickup'
  });
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCartData();
    if (user) {
      autoFillUserData();
    }
  }, [user]);

  const loadCartData = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    
    if (savedCart.length === 0) {
      navigate('/cart');
    }
  };

  const autoFillUserData = () => {
    if (user) {
      const names = user.name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }
  };

  const calculateTotal = () => {
    const cartTotal = cart.reduce((total, item) => {
      return total + (Number(item.price) * Number(item.quantity));
    }, 0);
    
    const deliveryCost = formData.delivery === 'courier' ? 500 : 0;
    return cartTotal + deliveryCost;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = 'Введите корректное имя (минимум 2 символа)';
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = 'Введите корректную фамилию (минимум 2 символа)';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (cart.length === 0) {
      newErrors.cart = 'Корзина пуста';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Подготавливаем данные в формате, который ожидает ваш бекенд
    const orderData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      cart: cart.map(item => ({
        variantId: item.variantId || 0,
        model: item.model || '',
        category: item.category || '',
        color: item.color || '',
        memory: item.memory || '',
        country: item.country || '',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      })),
      userId: user?.id || null,
      totalAmount: calculateTotal()
    };

    console.log('Отправляемые данные заказа:', orderData);

    try {
      const response = await fetch('http://localhost:5000/api/process-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Статус ответа:', response.status);
      
      const result = await response.json();
      console.log('Ответ сервера:', result);

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        // Очищаем корзину и сохраняем информацию о заказе
        localStorage.removeItem('cart');
        localStorage.setItem('lastOrder', JSON.stringify({
          id: result.orderId,
          date: new Date().toISOString(),
          amount: calculateTotal(),
          items: cart,
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          }
        }));

        // Если пользователь авторизован, очищаем корзину на сервере
        if (user?.id) {
          try {
            await fetch('http://localhost:5000/clear-cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user.id })
            });
          } catch (clearError) {
            console.warn('Не удалось очистить корзину на сервере:', clearError);
          }
        }

        navigate('/order-success', { 
          state: { 
            orderId: result.orderId,
            amount: calculateTotal()
          }
        });
      } else {
        throw new Error(result.message || 'Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Order error:', error);
      
      let errorMessage = 'Ошибка при оформлении заказа. Попробуйте еще раз.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Сервер недоступен. Проверьте подключение и попробуйте позже.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page empty">
        <div className="empty-message">
          <h2>Корзина пуста</h2>
          <p>Добавьте товары в корзину перед оформлением заказа</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Оформление заказа</h1>
        <div className="checkout-steps">
          <span className="step active">1. Корзина</span>
          <span className="step active">2. Оформление</span>
          <span className="step">3. Подтверждение</span>
        </div>
      </div>

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Контактная информация</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Имя *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                  required
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Фамилия *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                  required
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+7 (___) ___-__-__"
                  required
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Способ доставки</h2>
            <div className="delivery-options">
              <label className="delivery-option">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={formData.delivery === 'pickup'}
                  onChange={handleInputChange}
                />
                <div className="option-content">
                  <span className="option-title">Самовывоз</span>
                  <span className="option-price">Бесплатно</span>
                  <span className="option-description">Забрать из нашего магазина в течение 2 часов</span>
                </div>
              </label>

              <label className="delivery-option">
                <input
                  type="radio"
                  name="delivery"
                  value="courier"
                  checked={formData.delivery === 'courier'}
                  onChange={handleInputChange}
                />
                <div className="option-content">
                  <span className="option-title">Курьерская доставка</span>
                  <span className="option-price">500 ₽</span>
                  <span className="option-description">Доставка по Москве в течение дня</span>
                </div>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Оформление...' : `Оформить заказ • ${calculateTotal().toLocaleString('ru-RU')} ₽`}
          </button>
        </form>

        <div className="order-summary">
          <h3>Ваш заказ</h3>
          <div className="order-items">
            {cart.map((item, index) => (
              <div key={index} className="order-item">
                <img 
                  src={item.image} 
                  alt={item.model}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="item-details">
                  <span className="item-name">{item.model}</span>
                  <span className="item-specs">
                    {[item.color, item.memory, `${item.quantity} шт`]
                      .filter(Boolean)
                      .join(' • ')}
                  </span>
                </div>
                <span className="item-price">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="total-row">
              <span>Доставка</span>
              <span>{formData.delivery === 'courier' ? '500 ₽' : 'Бесплатно'}</span>
            </div>
            <div className="total-row final-total">
              <span>Итого</span>
              <span>{calculateTotal().toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;