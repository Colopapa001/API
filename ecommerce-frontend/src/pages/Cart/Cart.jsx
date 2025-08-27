import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
export { default as Button } from './Button/Button';
export { default as Input } from './Input/Input';
export { default as LoadingSpinner } from './LoadingSpinner/LoadingSpinner';
import { formatPrice } from '../../utils/helpers';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    isLoading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    getCartSummary
  } = useCart();

  if (isLoading) {
    return (
      <div className="cart-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  const { subtotal, shipping, total, isEmpty } = getCartSummary();

  if (isEmpty) {
    return (
      <div className="cart-empty">
        <svg
          className="cart-empty-icon"
          viewBox="0 0 24 24"
          width="64"
          height="64"
          stroke="currentColor"
          fill="none"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2>Tu carrito está vacío</h2>
        <p>¿Por qué no agregas algunos productos?</p>
        <Button onClick={() => navigate('/')}>
          Ir a comprar
        </Button>
      </div>
    );
  }

  const handleQuantityChange = (productId, currentQuantity, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h1>Carrito de Compras</h1>
        <Button
          variant="ghost"
          onClick={clearCart}
          disabled={isEmpty}
        >
          Vaciar carrito
        </Button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
              </div>

              <div className="cart-item-details">
                <h3 onClick={() => navigate(`/product/${item.productId}`)}>
                  {item.product.title}
                </h3>
                <p className="cart-item-price">
                  {formatPrice(item.product.price)}
                </p>
              </div>

              <div className="cart-item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.productId, item.quantity, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.productId, item.quantity, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                <p>Subtotal</p>
                <p className="subtotal-amount">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>

              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.productId)}
                aria-label="Eliminar producto"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Resumen del pedido</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="summary-row">
            <span>Envío</span>
            <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
          </div>
          
          {shipping === 0 && (
            <div className="free-shipping-message">
              ¡Felicitaciones! Tu envío es gratis
            </div>
          )}
          
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button
            onClick={handleCheckout}
            fullWidth
            size="large"
          >
            Proceder al pago
          </Button>

          <button
            className="continue-shopping"
            onClick={() => navigate('/')}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
