import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { mockProducts } from '../../utils/mockData';
import {
  formatPrice,
  formatStock,
  getStockStatus,
  getRelatedProducts
} from '../../utils/helpers';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity, isLoading: isCartLoading } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Cargar producto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const found = mockProducts.find(p => p.id === parseInt(id));
        
        if (!found) {
          throw new Error('Producto no encontrado');
        }
        
        setProduct(found);
        
        // Cargar productos relacionados
        const related = getRelatedProducts(
          mockProducts,
          id,
          found.categoryId
        );
        setRelatedProducts(related);
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Manejar cantidad
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Manejar agregar al carrito
  const handleAddToCart = async () => {
    const result = await addToCart(product, quantity);
    if (result.success) {
      // Aquí podrías mostrar una notificación de éxito
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Error</h2>
        <p>{error || 'Producto no encontrado'}</p>
        <Button onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="product-detail">
      {/* Galería de imágenes */}
      <div className="product-gallery">
        <div className="product-main-image">
          <img
            src={product.images[selectedImage]}
            alt={product.title}
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
        </div>
        
        {product.images.length > 1 && (
          <div className="product-thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.title} - imagen ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h1 className="product-title">{product.title}</h1>
        
        <div className="product-meta">
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className={`product-stock product-stock-${stockStatus.status}`}>
            {formatStock(product.stock)}
          </p>
        </div>

        <div className="product-description">
          <h3>Descripción</h3>
          <p>{product.description}</p>
        </div>

        {product.stock > 0 && (
          <div className="product-actions">
            <div className="quantity-controls">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="quantity-btn"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stock}
              />
              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className="quantity-btn"
              >
                +
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              loading={isCartLoading}
              fullWidth
            >
              {cartQuantity > 0
                ? `Agregar más al carrito (${cartQuantity} en carrito)`
                : 'Agregar al carrito'}
            </Button>
          </div>
        )}
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Productos relacionados</h3>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <div
                key={relatedProduct.id}
                className="related-product"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <img
                  src={relatedProduct.images[0]}
                  alt={relatedProduct.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
                <h4>{relatedProduct.title}</h4>
                <p>{formatPrice(relatedProduct.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
