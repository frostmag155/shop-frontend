// src/components/Sidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const categories = [
    {
      name: 'iPhone',
      models: [
        'iPhone 15',
        'iPhone 16', 
        'iPhone 16 Plus',
        'iPhone 16 Pro',
        'iPhone 16 Pro Max'
      ]
    },
    {
      name: 'MacBook',
      models: [
        'MacBook Air M4',
        'MacBook Pro M4',
        'MacBook Pro M4 Pro',
        'MacBook Pro M4 Max'
      ]
    },
    {
      name: 'iPad',
      models: [
        'iPad Pro',
        'iPad Air',
        'iPad mini 7',
        'iPad 11'
      ]
    },
    {
      name: 'Apple Watch',
      models: [
        'Watch Ultra 2',
        'Watch Series 10',
        'Watch SE'
      ]
    }
  ];

  return (
    <motion.div 
      className="sidebar"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sidebar-content">
        <h2 className="sidebar-title">Категории</h2>
        <ul className="categories">
          {categories.map((category, index) => (
            <motion.li 
              key={category.name}
              className="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="category-name">{category.name}</span>
              <ul className="models">
                {category.models.map(model => (
                  <li key={model}>
                    <a 
                      href={`/product/${encodeURIComponent(model)}`}
                      className="model-link"
                    >
                      {model}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;