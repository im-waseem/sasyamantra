interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart({ cart }: { cart: CartItem[] }) {
  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-bold">Your Cart</h2>
      <ul className="space-y-2">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name} (x{item.quantity})</span>
            <span>₹{item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
