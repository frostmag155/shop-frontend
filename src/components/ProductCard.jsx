// src/components/ProductCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { normalizeProduct } from '../utils/helpers';

const ProductCard = ({ product, index }) => {
  const normalizedProduct = normalizeProduct(product);

  return (
    <motion.a
      href={`/product/${encodeURIComponent(normalizedProduct.name)}`}
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="product-image-container">
        <img 
          src={`/images/products/${normalizedProduct.image || 'placeholder.jpg'}`}
          alt={normalizedProduct.name}
          className="product-image"
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{normalizedProduct.name}</h3>
        <p className="product-price">{normalizedProduct.price} $</p>
      </div>
    </motion.a>
  );
};

export default ProductCard;