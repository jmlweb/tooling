// This file has intentional type errors
interface Product {
  id: number;
  name: string;
  price: number;
}

export const createProduct = (name: string, price: number): Product => {
  return {
    id: 1,
    name,
    // Missing price property
  };
};

export const getPrice = (product: Product): string => {
  // Returning number instead of string
  return product.price;
};

export const updateProduct = (product: Product, updates: Partial<Product>) => {
  // Type error: can't assign string to number
  product.price = 'invalid';
};
