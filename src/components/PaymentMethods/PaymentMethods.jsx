import React from 'react';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const paymentMethods = [
    {
      id: 1,
      name: 'Tarjeta de Crédito/Débito',
      icon: '💳',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 2,
      name: 'Mercado Pago',
      icon: '📱',
      description: 'Paga con tu cuenta de Mercado Pago'
    },
    {
      id: 3,
      name: 'Transferencia Bancaria',
      icon: '🏦',
      description: 'Transferencia directa a nuestra cuenta'
    },
    {
      id: 4,
      name: 'Efectivo',
      icon: '💵',
      description: 'Pago en efectivo en puntos autorizados'
    }
  ];

  return (
    <div className="payment-methods-container">
      <h3>Métodos de Pago</h3>
      <div className="payment-methods-grid">
        {paymentMethods.map((method) => (
          <div key={method.id} className="payment-method-card">
            <span className="payment-method-icon">{method.icon}</span>
            <h4>{method.name}</h4>
            <p>{method.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
