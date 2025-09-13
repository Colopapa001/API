import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Input from '../../components/UI/Input';
import { getProductsByUser, deleteProduct as deleteApiProduct } from '../../services/Api';
import { formatPrice, formatDate } from '../../utils/helpers';
import './MyProducts.css';

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserProducts, deleteProduct, updateProduct, error: productError, clearError } = useProducts();
  
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    price: '',
    description: '',
    stock: ''
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const userProducts = await getProductsByUser(user.id);
      // Filtrar productos eliminados en la sesión
      const deletedIds = JSON.parse(sessionStorage.getItem('deletedMyProducts')) || [];
      const filteredProducts = userProducts.filter(p => !deletedIds.includes(p.id));
      setApiProducts(filteredProducts);
      setError(null);
    } catch (err) {
      setError('Error cargando productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    // Scroll al inicio al montar
    import('../../utils/helpers').then(({ scrollToTop }) => scrollToTop('auto'));
    loadProducts();
  }, [loadProducts]);

  // Combinar productos de la API con productos en memoria
  const allUserProducts = [...apiProducts, ...getUserProducts()];

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    setDeletingId(productId);
    
    try {
      // Verificar si es un producto en memoria
      const inMemoryProduct = getUserProducts().find(p => p.id === productId);
      
      if (inMemoryProduct) {
        // Si es un producto en memoria, usar el contexto
        const success = deleteProduct(productId);
        if (!success && productError) {
          throw new Error(productError);
        }
      } else {
        // Si es un producto de la API, usar la función de la API
        await deleteApiProduct(productId);
        
        // Guardar su ID en sessionStorage para excluirlo en la sesión
        setApiProducts(prev => prev.filter(p => p.id !== productId));
        const deletedIds = JSON.parse(sessionStorage.getItem('deletedMyProducts')) || [];
        sessionStorage.setItem('deletedMyProducts', JSON.stringify([...deletedIds, productId]));
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setError('Error al eliminar el producto. Inténtalo nuevamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString()
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    const updatedData = {
      price: parseFloat(editForm.price) || 0,
      description: editForm.description,
      stock: parseInt(editForm.stock) || 0
    };

    // Verificar si es un producto en memoria
    const inMemoryProduct = getUserProducts().find(p => p.id === editingProduct.id);
    
    if (inMemoryProduct) {
      // Si es un producto en memoria, usar el contexto
      const success = updateProduct(editingProduct.id, updatedData);
      if (!success && productError) {
        setError(productError);
        return;
      }
    } else {
      // Si es un producto de la API, actualizar en el estado local (solo para la sesión actual)
      setApiProducts(prev => 
        prev.map(p => p.id === editingProduct.id 
          ? { ...p, ...updatedData } 
          : p)
      );
    }

    // Cerrar el modal
    setEditingProduct(null);
    setEditForm({ price: '', description: '', stock: '' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ price: '', description: '', stock: '' });
  };

  if (loading) {
    return (
      <div className="my-products-loading">
        <LoadingSpinner fullscreen={false} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-products-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={loadProducts}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="my-products">
      <div className="my-products-header">
        <h1>Mis Productos</h1>
        <Button onClick={() => navigate('/add-product')}>
          Agregar Producto
        </Button>
      </div>

      {allUserProducts.length === 0 ? (
        <div className="my-products-empty">
          <h3>No tienes productos publicados</h3>
          <p>¡Comienza a vender agregando tu primer producto!</p>
          <Button onClick={() => navigate('/add-product')}>
            Agregar Producto
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {allUserProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image || (product.images && product.images[0])}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
              </div>
              <div className="product-info">
                <div className="info-top">
                  <h3>{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                </div>
                <p className="product-price">{formatPrice(product.price)}</p>
                <div className="product-status">
                  <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
                  </span>
                </div>
                <p className="product-date">
                  Publicado: {formatDate(product.createdAt)}
                </p>
              </div>
              <div className="product-actions">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(product)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id)}
                  loading={deletingId === product.id}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición */}
      {editingProduct && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h2>Editar Producto</h2>
              <button 
                className="edit-modal-close"
                onClick={handleCancelEdit}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>
            
            <div className="edit-modal-content">
              <div className="edit-form-group">
                <label htmlFor="edit-title">Título</label>
                <Input
                  id="edit-title"
                  value={editingProduct.title}
                  disabled
                  placeholder="Título del producto"
                />
                <small>El título no se puede editar</small>
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-price">Precio ($)</label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={(e) => handleEditFormChange('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-description">Descripción</label>
                <textarea
                  id="edit-description"
                  className="edit-textarea"
                  value={editForm.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  placeholder="Descripción del producto"
                  rows="4"
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-stock">Cantidad en Stock</label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={(e) => handleEditFormChange('stock', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="edit-modal-actions">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
