export const normalizeProduct = (product) => ({
  id: product.id,
  name: product.Name || product.name,
  price: product.price,
  image: product.image,
  category: product.category
});

export const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'iPhone': 'iPhone',
    'MacBook': 'MacBook',
    'iPad': 'iPad',
    'Apple Watch': 'Apple Watch'
  };
  return categoryMap[category] || category;
};
