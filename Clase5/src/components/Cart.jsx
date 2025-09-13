import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

    if (cart.length === 0) {
        return <div>Your cart is empty</div>;
    }

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {cart.map(item => (
                <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} style={{ width: '50px' }} />
                    <div>
                        <h3>{item.title}</h3>
                        <p>${item.price}</p>
                    </div>
                    <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
            ))}
            <div className="cart-total">
                <h3>Total: ${getCartTotal().toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default Cart;
