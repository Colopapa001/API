import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import './ProductCard.css';

const ProductCard = ({
  id,
  title,
  price,
  description,
  image,
  stockLabel,
  formattedPrice,
  images = [],
  onAddToCart,
  loading = false,
  stock
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  const primaryImage = Array.isArray(images) && images.length > 0
    ? images[0]
    : 'https://via.placeholder.com/400x400/EDF2FA/3b82f6?text=Sin+imagen';

  return (
    <div className="product-card">
      <div className="product-content">
        <div className="product-image-container">
          <img
            src={primaryImage}
            alt={title}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400/EDF2FA/3b82f6?text=Sin+imagen';
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">{title}</h3>
          <div className="product-meta-row">
            <span className="product-price">{formattedPrice || `$${price.toFixed(2)}`}</span>
            {stock !== undefined && (
              <span className={`stock-badge ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {stock > 0 ? 'En stock' : 'Sin stock'}
              </span>
            )}
          </div>
          <p className="product-description">{description}</p>
        </div>
      </div>
      <div className="product-actions">
        <Button
          variant="secondary"
          onClick={handleViewDetails}
          fullWidth
          className="btn-full-width"
        >
          Ver Detalles
        </Button>
        <Button
          variant="primary"
          onClick={onAddToCart}
          loading={loading}
          fullWidth
          className="btn-full-width"
        >
          Agregar al Carrito
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
