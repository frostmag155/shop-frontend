import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVER_URL } from '../utils/constants';
import '../styles/ProductPage.css';

const ProductPage = () => {
  const { model } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [countryFeatures, setCountryFeatures] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояния для выбранных опций
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMemory, setSelectedMemory] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedBand, setSelectedBand] = useState('');
  const [selectedDial, setSelectedDial] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('cn');
  const [variantId, setVariantId] = useState('');

  const isWatch = model?.toLowerCase().includes('watch');

  // Загрузка данных
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const decodedModel = decodeURIComponent(model);

        // Загружаем варианты
        const variantsRes = await fetch(`${SERVER_URL}/variants/${encodeURIComponent(decodedModel)}`);
        const variantsData = await variantsRes.json();
        setVariants(variantsData);

        // Загружаем характеристики
        const specsRes = await fetch(`${SERVER_URL}/specs/${encodeURIComponent(decodedModel)}`);
        const specsData = await specsRes.json();
        setSpecs(specsData);

        // Загружаем страновые особенности
        const featuresRes = await fetch(`${SERVER_URL}/country-features/${encodeURIComponent(decodedModel)}`);
        const featuresData = await featuresRes.json();
        const featuresMap = {};
        featuresData.forEach(item => {
          featuresMap[item.country_code] = item.description;
        });
        setCountryFeatures(featuresMap);

        // Устанавливаем начальные значения
        if (variantsData.length > 0) {
          setSelectedColor(variantsData[0].color || '');
          setSelectedMemory(variantsData[0].memory || '');
          setSelectedScreen(variantsData[0].screen_size || '');
          setSelectedRam(variantsData[0].ram || '');
          setSelectedBand(variantsData[0].band_size || '');
          setSelectedDial(variantsData[0].dial_size || '');
        }

      } catch (err) {
        setError('Ошибка загрузки данных товара');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (model) {
      fetchProductData();
    }
  }, [model]);

  // Получение variantId при изменении опций
  useEffect(() => {
    const fetchVariantId = async () => {
      if (!model || !selectedColor) return;

      try {
        const params = { model: decodeURIComponent(model), color: selectedColor };
        if (selectedMemory && !isWatch) params.memory = selectedMemory;
        if (selectedScreen) params.screen_size = selectedScreen;
        if (selectedRam) params.ram = selectedRam;
        if (isWatch && selectedBand) params.band_size = selectedBand;
        if (isWatch && selectedDial) params.dial_size = selectedDial;

        const response = await fetch(`${SERVER_URL}/get-variant-id`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });

        const data = await response.json();
        if (data.success) {
          setVariantId(data.variantId);
        }
      } catch (err) {
        console.error('Error fetching variant ID:', err);
      }
    };

    fetchVariantId();
  }, [model, selectedColor, selectedMemory, selectedScreen, selectedRam, selectedBand, selectedDial, isWatch]);

  // Получение текущего варианта
  const currentVariant = variants.find(v =>
    v.color === selectedColor &&
    (!selectedMemory || v.memory === selectedMemory) &&
    (!selectedScreen || v.screen_size === selectedScreen) &&
    (!selectedRam || v.ram === selectedRam) &&
    (!isWatch || !selectedBand || v.band_size === selectedBand) &&
    (!isWatch || !selectedDial || v.dial_size === selectedDial)
  ) || variants[0];

  // Уникальные значения для опций
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const memories = [...new Set(variants.map(v => v.memory).filter(Boolean))];
  const screens = [...new Set(variants.map(v => v.screen_size).filter(Boolean))];
  const rams = [...new Set(variants.map(v => v.ram).filter(Boolean))];
  const bands = isWatch ? [...new Set(variants.map(v => v.band_size).filter(Boolean))] : [];
  const dials = isWatch ? [...new Set(variants.map(v => v.dial_size).filter(Boolean))] : [];

  // Добавление в корзину
  const handleAddToCart = () => {
    if (!currentVariant || !variantId) {
      alert('Ошибка: не удалось определить вариант товара');
      return;
    }

    const productData = {
      variantId,
      model: decodeURIComponent(model),
      color: selectedColor,
      memory: selectedMemory,
      price: currentVariant.price,
      image: `images/products/${currentVariant.image || 'default.jpg'}`,
      quantity: 1,
      country: selectedCountry
    };

    // Сохраняем в localStorage 
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.variantId === variantId);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(productData);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Показываем уведомление
    alert('Товар добавлен в корзину!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Загрузка товара...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка загрузки</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Назад в каталог
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="product-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-container">
        <button onClick={() => navigate('/')} className="back-link">
          ← Назад в каталог
        </button>

        <motion.h1
          className="product-title"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {decodeURIComponent(model)}
        </motion.h1>

        <div className="product-layout">
          {/* Левая колонка - изображение */}
          <div className="product-left">
            <motion.div
              className="product-image-container"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={`/images/products/${currentVariant?.image || 'placeholder.jpg'}`}
                alt={decodeURIComponent(model)}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </motion.div>
          </div>

          {/* Правая колонка - информация и опции */}
          <div className="product-right">
            {/* Характеристики */}
            <motion.div
              className="specs-section"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>Характеристики</h3>
              <div className="specs-table">
                {specs.length > 0 ? (
                  specs.map((spec, index) => (
                    <div key={index} className="spec-row">
                      <span className="spec-name">{spec.name}</span>
                      <span className="spec-value">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <p>Характеристики отсутствуют</p>
                )}
              </div>
            </motion.div>

            {/* Опции товара */}
            <motion.div
              className="options-section"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Цвет */}
              {colors.length > 0 && (
                <div className="option-group">
                  <label>Цвет:</label>
                  <div className="button-group">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`option-button ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Память */}
              {!isWatch && memories.length > 0 && (
                <div className="option-group">
                  <label>Память:</label>
                  <div className="button-group">
                    {memories.map(memory => (
                      <button
                        key={memory}
                        className={`option-button ${selectedMemory === memory ? 'selected' : ''}`}
                        onClick={() => setSelectedMemory(memory)}
                      >
                        {memory}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Экран */}
              {screens.length > 0 && (
                <div className="option-group">
                  <label>Диагональ экрана:</label>
                  <div className="button-group">
                    {screens.map(screen => (
                      <button
                        key={screen}
                        className={`option-button ${selectedScreen === screen ? 'selected' : ''}`}
                        onClick={() => setSelectedScreen(screen)}
                      >
                        {screen}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Оперативная память */}
              {rams.length > 0 && (
                <div className="option-group">
                  <label>Оперативная память:</label>
                  <div className="button-group">
                    {rams.map(ram => (
                      <button
                        key={ram}
                        className={`option-button ${selectedRam === ram ? 'selected' : ''}`}
                        onClick={() => setSelectedRam(ram)}
                      >
                        {ram}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ремешок (для часов) */}
              {isWatch && bands.length > 0 && (
                <div className="option-group">
                  <label>Размер ремешка:</label>
                  <div className="button-group">
                    {bands.map(band => (
                      <button
                        key={band}
                        className={`option-button ${selectedBand === band ? 'selected' : ''}`}
                        onClick={() => setSelectedBand(band)}
                      >
                        {band}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Циферблат (для часов) */}
              {isWatch && dials.length > 0 && (
                <div className="option-group">
                  <label>Размер циферблата:</label>
                  <div className="button-group">
                    {dials.map(dial => (
                      <button
                        key={dial}
                        className={`option-button ${selectedDial === dial ? 'selected' : ''}`}
                        onClick={() => setSelectedDial(dial)}
                      >
                        {dial}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Страна производства */}
              <div className="option-group">
                <label htmlFor="country-select">Страна производства:</label>
                <div className="country-select-wrapper">
                  <select
                    id="country-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="country-select"
                  >
                    <option value="cn">Китай</option>
                    <option value="kz">Казахстан</option>
                    <option value="jn">Япония</option>
                    <option value="ae">ОАЭ</option>
                    <option value="in">Индия</option>
                  </select>
                </div>
              </div>

              {/* Особенности страны */}
              <div className="country-features">
                <h4>Особенности для вашей страны:</h4>
                <div className="feature-text">
                  {countryFeatures[selectedCountry] || 'Нет данных для выбранной страны'}
                </div>
              </div>
            </motion.div>

            {/* Цена и кнопка добавления */}
            <motion.div
              className="purchase-section"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="price-section">
                <h2 className="product-price">
                  {currentVariant?.price ? `${currentVariant.price} ₽` : 'Цена не указана'}
                </h2>
              </div>

              <button
                onClick={handleAddToCart}
                className="add-to-cart-btn"
                disabled={!variantId}
              >
                Добавить в корзину
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;
