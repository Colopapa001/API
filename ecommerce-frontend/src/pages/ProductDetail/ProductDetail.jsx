import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { getProductById, getAllProducts } from '../../services/Api';
import { formatPrice, formatStock, getStockStatus } from '../../utils/helpers';
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

  // Función para obtener productos relacionados
  const getRelatedProducts = (allProducts, currentId, categoryId) => {
    return allProducts
      .filter(p => p.id !== parseInt(currentId) && p.categoryId === categoryId)
      .slice(0, 4); // Muestra hasta 4 relacionados
  };

  // Cargar producto
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProduct = async () => {
      try {
        setLoading(true);
        const [productData, allProductsResponse] = await Promise.all([
          getProductById(id),
          getAllProducts()
        ]);
        
        if (!productData) {
          setError('Producto no encontrado');
          setLoading(false);
          return;
        }
        
        setProduct(productData);
        
        // Asegurar que allProductsResponse es un array
        let allProducts = [];
        if (Array.isArray(allProductsResponse)) {
          allProducts = allProductsResponse;
        } else if (allProductsResponse && Array.isArray(allProductsResponse.content)) {
          // Si es un objeto de paginación, extraer el array
          allProducts = allProductsResponse.content;
        }
        
        // Obtener categoryId del producto
        const categoryId = productData.category?.id || productData.categoryId;
        
        // Cargar productos relacionados (convertir id a número)
        const related = getRelatedProducts(
          allProducts,
          parseInt(id),
          categoryId
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
      <div className="product-detail-loading-full">
        <LoadingSpinner fullscreen={true} size="large" />
      </div>
    );
  }

  if (error || !product) {
    // Determinar el mensaje de error
    let errorMessage = 'Producto no encontrado';
    if (error) {
      if (error.includes('404') || error.includes('not found')) {
        errorMessage = 'El producto que buscas no existe o ha sido eliminado.';
      } else if (error.includes('HTTP')) {
        errorMessage = 'Error al cargar el producto. Por favor, intenta nuevamente.';
      } else {
        errorMessage = error;
      }
    }
    
    return (
      <div className="product-detail-error">
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <Button onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const cartQuantity = getItemQuantity(product.id);

  // Asegurar que images sea un array
  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image || '/images/placeholder.svg'];

  // Navegación de imágenes
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Navegación con teclado
  useEffect(() => {
    if (productImages.length <= 1) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev + 1) % productImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [productImages.length]);

  return (
    <div className="product-detail">
      {/* Galería de imágenes */}
      <div className="product-gallery">
        <div className="product-main-image-container">
          <div className="product-main-image">
            <img
              key={selectedImage}
              src={productImages[selectedImage]}
              alt={`${product.name || product.title || 'Producto'} - Vista ${selectedImage + 1}`}
              onError={(e) => {
                e.target.src = '/images/placeholder.svg';
              }}
            />
          </div>
          
          {/* Navegación con flechas (solo si hay más de 1 imagen) */}
          {productImages.length > 1 && (
            <>
              <button
                className="image-nav-btn image-nav-prev"
                onClick={prevImage}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                className="image-nav-btn image-nav-next"
                onClick={nextImage}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
              
              {/* Indicador de imagen actual */}
              <div className="image-indicator">
                {selectedImage + 1} / {productImages.length}
              </div>
            </>
          )}
        </div>
        
        {/* Thumbnails (solo si hay más de 1 imagen) */}
        {productImages.length > 1 && (
          <div className="product-thumbnails">
            {productImages.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${product.name || product.title} - miniatura ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.svg';
                  }}
                />
                {selectedImage === index && (
                  <div className="thumbnail-overlay">
                    <span className="thumbnail-check">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h1 className="product-title">{product.name || product.title}</h1>
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
            {product.description || 'Sin descripción disponible'}
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
                try {
                  // Obtener productos de sesión
                  const sessionCatalog = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
                  const exists = sessionCatalog.find(p => String(p.id) === String(product.id));
                  if (exists) {
                    alert('El producto ya existe en tu catálogo');
                  } else {
                    // Agregar a sessionStorage
                    // Normalize product before storing in session catalog
                    const normalized = {
                      ...product,
                      id: String(product.id ?? Date.now()),
                      name: product.name || product.title || '',
                      title: product.title || product.name || '',
                      price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
                      stock: typeof product.stock === 'number' ? product.stock : parseInt(product.stock) || 0,
                      images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
                      image: product.image || (Array.isArray(product.images) && product.images[0]) || null,
                      // mark server-derived catalog entries as not local
                      isLocal: false,
                      createdAt: product.createdAt || new Date().toISOString()
                    };
                    const newCatalog = [...sessionCatalog, normalized];
                    sessionStorage.setItem('myCatalog', JSON.stringify(newCatalog));
                    window.dispatchEvent(new Event('storage'));
                    alert('Producto agregado a tu catálogo');
                    navigate('/my-products');
                  }
                } catch (err) {
                  console.error('Error al agregar producto:', err);
                  alert('Error al agregar producto al catálogo');
                }
              }}
            >
              Agregar al Catálogo
            </Button>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Productos relacionados</h3>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => {
                const relatedImages = Array.isArray(relatedProduct.images) && relatedProduct.images.length > 0
                ? relatedProduct.images
                : [relatedProduct.image || '/images/placeholder.svg'];
              
              return (
                <div
                  key={relatedProduct.id}
                  className="related-product"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <img
                    src={relatedImages[0]}
                    alt={relatedProduct.name || relatedProduct.title}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.svg';
                    }}
                  />
                  <h4>{relatedProduct.name || relatedProduct.title}</h4>
                  <p>{formatPrice(relatedProduct.price)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
