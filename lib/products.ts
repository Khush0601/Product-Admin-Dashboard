export type Product = {
  id: number | string;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating?: number;
  description: string;
  thumbnail?: string;
  images?: string[];
};

export type ProductInput = Omit<Product, 'id' | 'rating' | 'images'>;

export function getProductImage(product: Product) {
  return product.thumbnail || product.images?.[0] || '';
}
