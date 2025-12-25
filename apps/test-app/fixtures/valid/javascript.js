export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

export const filterActiveItems = (items) => {
  return items.filter((item) => item.active);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const sortByName = (items) => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
};
