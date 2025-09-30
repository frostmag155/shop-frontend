import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingIndex, setRemovingIndex] = useState(null);
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  const countryNames = {
    cn: 'Китай',
    kz: 'Казахстан',
    jn: 'Япония',
    ae: 'ОАЭ',
    in: 'Индия'
  };

  // Хук для анимаций при скроллинге
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [cart]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const migratedCart = savedCart.map(item => ({
        ...item,
        image: item.image.includes('images/products/') 
          ? item.image 
          : `images/products/${item.image}`
      }));
      setCart(migratedCart);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const updateQuantity = (index, action) => {
    const newCart = [...cart];
    
    if (action === 'increase') {
      newCart[index].quantity += 1;
    } else if (action === 'decrease' && newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    saveCartToServer(newCart);
  };

  const removeFromCart = async (index) => {
    setRemovingIndex(index);
    
    // Ждем завершения анимации перед удалением
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    setRemovingIndex(null);
    localStorage.setItem('cart', JSON.stringify(newCart));
    saveCartToServer(newCart);
  };

  const saveCartToServer = async (cartData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const cartForServer = cartData.map(item => ({
        variantId: Number(item.variantId),
        model: item.model,
        color: item.color || null,
        memory: item.memory || null,
        image: item.image,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }));

      const response = await fetch('http://localhost:5000/save-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cartItems: cartForServer
        })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('lastCartSave', new Date().toISOString());
      }
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error);
    }
  };

  const handleCheckout = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Показать модальное окно авторизации
      return;
    }

    await saveCartToServer(cart);
    const total = calculateTotal();
    localStorage.setItem('checkoutAmount', total);
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="cart-page loading">
        <div className="loading-spinner"></div>
        <p>Загрузка корзины...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Ваша корзина пуста</h2>
          <p>Добавьте товары из каталога, чтобы сделать заказ</p>
          <button 
            className="continue-shopping-btn secondary"
            onClick={handleContinueShopping}
          >
            Продолжить покупки
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Корзина</h1>
        <span className="cart-count">{cart.length} товар(ов)</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((product, index) => (
            <div 
              key={`${product.variantId}-${index}`}
              className={`cart-item ${removingIndex === index ? 'cart-item-exit' : 'cart-item-enter'} ${index < 5 ? 'visible' : ''}`}
              ref={el => itemRefs.current[index] = el}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="cart-item-image">
                <img 
                  src={product.image} 
                  alt={product.model}
                  onError={(e) => {
                    e.target.src = 'images/placeholder.jpg';
                  }}
                />
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-name">{product.model || 'Модель неизвестна'}</h3>
                
                <div className="cart-item-specs">
                  {product.category && (
                    <span className="cart-item-spec">Категория: {product.category}</span>
                  )}
                  {product.color && (
                    <span className="cart-item-spec">Цвет: {product.color}</span>
                  )}
                  {product.memory && (
                    <span className="cart-item-spec">Память: {product.memory}</span>
                  )}
                  {product.ram && (
                    <span className="cart-item-spec">ОЗУ: {product.ram}</span>
                  )}
                  {product.screen && (
                    <span className="cart-item-spec">Экран: {product.screen}"</span>
                  )}
                  {product.bandSize && (
                    <span className="cart-item-spec">Ремешок: {product.bandSize}</span>
                  )}
                  {product.dialSize && (
                    <span className="cart-item-spec">Циферблат: {product.dialSize}</span>
                  )}
                  {product.country && (
                    <span className="cart-item-spec">
                      Страна: {countryNames[product.country] || product.country}
                    </span>
                  )}
                </div>

                <div className="cart-item-price">
                  {product.price > 0 ? `${(product.price * product.quantity).toLocaleString()} ₽` : '—'}
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(index, 'decrease')}
                      disabled={product.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-display">{product.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(index, 'increase')}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(index)}
                    disabled={removingIndex === index}
                  >
                    {removingIndex === index ? 'Удаление...' : 'Удалить'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">Итог заказа</h3>
            
            <div className="summary-row">
              <span>Товары ({cart.length})</span>
              <span>{calculateTotal().toLocaleString()} ₽</span>
            </div>
            
            <div className="summary-row">
              <span>Доставка</span>
              <span className="free-shipping">Бесплатно</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row summary-total">
              <span>Итого</span>
              <span>{calculateTotal().toLocaleString()} ₽</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Перейти к оформлению
            </button>

            <button 
              className="continue-shopping-btn secondary"
              onClick={handleContinueShopping}
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;