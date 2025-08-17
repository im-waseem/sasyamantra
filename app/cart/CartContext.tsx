// Example component using the cart
'use client';

import { useCart,useCartItem } from '../hooks/useCart';
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const cartItem = useCartItem(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      maxQuantity: product.stock,
    });
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      {cartItem.isInCart ? (
        <div>
          <button onClick={() => cartItem.updateQuantity(cartItem.quantity - 1)}>
            -
          </button>
          <span>{cartItem.quantity}</span>
          <button onClick={() => cartItem.updateQuantity(cartItem.quantity + 1)}>
            +
          </button>
        </div>
      ) : (
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
}