import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Input from '../../components/UI/Input';
import { getProductsByUser, deleteProduct } from '../../utils/mockData';
import { formatPrice, formatDate } from '../../utils/helpers';
import './MyProducts.css';

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [sessionProducts, setSessionProducts] = useState([]);
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
      setProducts(filteredProducts);
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
  // Cargar productos agregados en la sesión
  const sessionCatalog = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
  setSessionProducts(sessionCatalog);
  }, [loadProducts]);

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    setDeletingId(productId);
    // Si el producto fue agregado en la sesión, eliminar de sessionStorage
    const sessionCatalog = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
    const newCatalog = sessionCatalog.filter(p => p.id !== productId);
    sessionStorage.setItem('myCatalog', JSON.stringify(newCatalog));
    setSessionProducts(newCatalog);
    // Si el producto es propio, guardar su ID en sessionStorage para excluirlo en la sesión
    if (products.some(p => p.id === productId && p.userId === user.id)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      const deletedIds = JSON.parse(sessionStorage.getItem('deletedMyProducts')) || [];
      sessionStorage.setItem('deletedMyProducts', JSON.stringify([...deletedIds, productId]));
    }
    setDeletingId(null);
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

    const updatedProduct = {
      ...editingProduct,
      price: parseFloat(editForm.price) || 0,
      description: editForm.description,
      stock: parseInt(editForm.stock) || 0
    };

    // Actualizar en el estado local (solo para la sesión actual)
    setProducts(prev => 
      prev.map(p => p.id === editingProduct.id ? updatedProduct : p)
    );

    // Si es un producto de sesión, actualizar también ahí
    setSessionProducts(prev => 
      prev.map(p => p.id === editingProduct.id ? updatedProduct : p)
    );

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
        <LoadingSpinner />
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
        <Button onClick={() => navigate('/my-products/add')}>
          Agregar Producto
        </Button>
      </div>

      {products.length === 0 && sessionProducts.length === 0 ? (
        <div className="my-products-empty">
          <h3>No tienes productos publicados</h3>
          <p>¡Comienza a vender agregando tu primer producto!</p>
          <Button onClick={() => navigate('/my-products/add')}>
            Agregar Producto
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {[...products,
            ...sessionProducts.filter(
              sp => !products.some(p => p.id === sp.id)
            )
          ].map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.images[0]}
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
