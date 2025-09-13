import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { getProductById, getAllProducts } from '../../services/Api';
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
  const { getProductById: getInMemoryProduct, products: allInMemoryProducts } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Cargar producto
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        const productId = id; // Keep ID as string to handle both numeric and string IDs
        
        // First try to find in-memory product
        const inMemoryProduct = getInMemoryProduct(productId);
        
        let productData;
        if (inMemoryProduct) {
          productData = inMemoryProduct;
        } else {
          // If not found in memory, try API (convert to number for API calls)
          try {
            const numericId = parseInt(id);
            if (!isNaN(numericId)) {
              productData = await getProductById(numericId);
            } else {
              throw new Error('ID de producto inválido');
            }
          } catch (apiError) {
            throw new Error('Producto no encontrado');
          }
        }
        
        if (!productData) {
          throw new Error('Producto no encontrado');
        }
        
        setProduct(productData);
        
        // Load related products from both API and memory
        try {
          const allProducts = await getAllProducts() || [];
          const memoryProducts = allInMemoryProducts || [];
          const combinedProducts = [...allProducts, ...memoryProducts];
          
          const related = getRelatedProducts(
            combinedProducts,
            productData.id, // Use the actual product ID from the loaded product
            productData.categoryId || 1 // Default category if not set
          );
          setRelatedProducts(related || []);
        } catch (relatedError) {
          console.warn('Error loading related products:', relatedError);
          setRelatedProducts([]);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, getInMemoryProduct, allInMemoryProducts]);

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
  
  // Handle both single image URL and array of images
  const productImages = (() => {
    if (Array.isArray(product.images)) {
      return product.images;
    } else if (product.image) {
      return [product.image];
    } else if (product.images) {
      return [product.images];
    } else {
      return ['/images/placeholder.png'];
    }
  })();
  const hasMultipleImages = productImages.length > 1;

  return (
    <div className="product-detail">
      {/* Galería de imágenes */}
      <div className="product-gallery">
        <div className="product-main-image">
          <img
            src={productImages[selectedImage] || productImages[0]}
            alt={product.title}
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
        </div>
        {hasMultipleImages && (
          <div className="product-thumbnails">
            {productImages.map((image, index) => (
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
          <div className="description-title-box">
            Descripción
          </div>
          <div className="description-info-box">
            {product.description}
          </div>
        </div>
        <div className="product-actions">
          <div className="action-column">
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
              style={{ marginTop: '1rem' }}
            >
              {cartQuantity > 0
                ? `Agregar más al Carrito (${cartQuantity} en Carrito)`
                : 'Agregar al Carrito'}
            </Button>
            <Button
              variant="primary"
              fullWidth
              style={{ marginTop: '1rem' }}
              onClick={() => {
                // Obtener productos propios y de sesión
                const userProducts = [];
                const sessionCatalog = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
                const exists = [...userProducts, ...sessionCatalog].find(p => p.id === product.id);
                if (exists) {
                  alert('El producto ya existe en el catálogo');
                } else {
                  // Agregar a sessionStorage
                  const newCatalog = [...sessionCatalog, product];
                  sessionStorage.setItem('myCatalog', JSON.stringify(newCatalog));
                  window.dispatchEvent(new Event('storage'));
                  navigate('/my-products');
                }
              }}
            >
              Agregar al Catálogo
            </Button>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
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
                  src={relatedProduct.images ? relatedProduct.images[0] : relatedProduct.image}
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
