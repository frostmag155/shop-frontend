import React from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import ProductCard from '../components/ProductCard';
import { normalizeProduct, getCategoryDisplayName } from '../utils/helpers';
import '../styles/HomePage.css';

const HomePage = () => {
  const { data: products, loading, error } = useApi('/products');

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Загрузка товаров...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка загрузки</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Попробовать снова
        </button>
      </div>
    );
  }

  // Группируем товары по категориям
  const groupedProducts = {};
  if (products && Array.isArray(products)) {
    products.forEach(product => {
      const normalized = normalizeProduct(product);
      const category = normalized.category || 'Другие';
      
      if (!groupedProducts[category]) {
        groupedProducts[category] = [];
      }
      groupedProducts[category].push(normalized);
    });
  }

  const categoryOrder = ['iPhone', 'MacBook', 'iPad', 'Apple Watch'];

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <motion.h1 
          className="page-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Каталог товаров Apple
        </motion.h1>

        {!products || products.length === 0 ? (
          <div className="no-products">
            <p>Товары не найдены</p>
          </div>
        ) : (
          <div className="categories-container">
            {categoryOrder.map(category => {
              const categoryProducts = groupedProducts[category];
              if (!categoryProducts || categoryProducts.length === 0) return null;

              return (
                <motion.section 
                  key={category}
                  className="category-section"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="category-title">{getCategoryDisplayName(category)}</h2>
                  <div className="products-grid">
                    {categoryProducts.map((product, index) => (
                      <ProductCard 
                        key={product.id || product.name} 
                        product={product}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        {/* Показываем товары из других категорий */}
        {Object.keys(groupedProducts)
          .filter(category => !categoryOrder.includes(category))
          .map(category => {
            const categoryProducts = groupedProducts[category];
            return (
              <motion.section key={category} className="category-section">
                <h2 className="category-title">{getCategoryDisplayName(category)}</h2>
                <div className="products-grid">
                  {categoryProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id || product.name} 
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              </motion.section>
            );
          })}
      </div>
    </motion.div>
  );
};

export default HomePage;
