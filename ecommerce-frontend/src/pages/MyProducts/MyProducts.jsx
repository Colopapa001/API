import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Input from '../../components/UI/Input';
import { getProductsByUser, deleteProduct, updateProduct, getProductById } from '../../services/Api';
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
  const [savingId, setSavingId] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  // Helper to compare ids that may be string or number (coerce to string)
  const sameId = (a, b) => String(a) === String(b);
  const [saveClickedCount, setSaveClickedCount] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Si no hay usuario en contexto, evitar llamar al backend con 'undefined'
      if (!user || !user.id) {
        setError('Sesión inválida o no iniciada. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      const userProducts = await getProductsByUser(user.id);
      // Filtrar productos eliminados en la sesión
  const deletedIds = JSON.parse(sessionStorage.getItem('deletedMyProducts')) || [];
  const filteredProducts = userProducts.filter(p => !deletedIds.some(did => String(did) === String(p.id)));
      setProducts(filteredProducts);
      setError(null);
      // load session products stored locally
      const stored = JSON.parse(sessionStorage.getItem('myCatalog')) || [];
      setSessionProducts(stored);
      setLoading(false);
      return;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al cargar productos');
      setLoading(false);
    }
  }, [user]);
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ price: '', description: '', stock: '' });
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEdit = (product) => {
    // Ensure we prefer the server-side product fields (e.g., name) when available.
    const serverProduct = (products || []).find(p => sameId(p.id, product.id));
    const enriched = serverProduct ? { ...serverProduct, ...product } : product;
    setEditingProduct(enriched);
    setEditForm({
      price: enriched.price ?? '',
      description: enriched.description ?? '',
      stock: enriched.stock ?? ''
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    setSaveClickedCount(c => c + 1);
    if (!editingProduct) return;
    const isSessionProduct = (sessionProducts || []).some(sp => sameId(sp.id, editingProduct.id) && sp.isLocal);
    const updatedValues = {
      ...editingProduct,
      price: editForm.price === '' ? editingProduct.price : Number(editForm.price),
      description: editForm.description === '' ? editingProduct.description : editForm.description,
      stock: editForm.stock === '' ? editingProduct.stock : Number(editForm.stock)
    };

    // Ensure 'name' is present (backend validation requires it). Fallback to title if available.
    if (!updatedValues.name) {
      updatedValues.name = updatedValues.title || editingProduct.title || 'Sin título';
    }

    try { console.debug('[MyProducts] handleSaveEdit isSessionProduct:', isSessionProduct, 'payload:', updatedValues); } catch(e) {}

    if (isSessionProduct) {
      // update locally in sessionStorage
      const newSession = (sessionProducts || []).map(sp => sameId(sp.id, editingProduct.id) ? updatedValues : sp);
      setSessionProducts(newSession);
      sessionStorage.setItem('myCatalog', JSON.stringify(newSession));
      setEditingProduct(updatedValues);
      setInfoMessage('Cambios guardados localmente en la sesión.');
      return;
    }

    // Persist to backend
    try {
      setSavingId(editingProduct.id);
      // Send the full product object required by backend validation (name, description, price, stock)
      try { console.debug('[MyProducts] calling updateProduct', editingProduct.id, updatedValues); } catch(e) {}
      // Ensure final payload always includes a name (use server value, title, or fallbacks)
      try {
        const serverProduct = (products || []).find(p => sameId(p.id, editingProduct.id));
        updatedValues.name = updatedValues.name || serverProduct?.name || serverProduct?.title || editingProduct?.name || editingProduct?.title || 'Sin título';
        console.debug('[MyProducts] final update payload', updatedValues);
      } catch (e) {}
      await updateProduct(editingProduct.id, updatedValues);
      setProducts(prev => prev.map(p => sameId(p.id, editingProduct.id) ? { ...p, ...updatedValues } : p));
      setInfoMessage('Producto actualizado en el servidor.');
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      setInfoMessage('Error al guardar los cambios en el servidor.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (productId) => {
    // mark deletingId early to prevent double-click issues and show loading
    setDeletingId(productId);
    const isSessionProduct = (sessionProducts || []).some(sp => String(sp.id) === String(productId));
    try { console.debug('[MyProducts] handleDelete called', { productId, isSessionProduct }); } catch(e) {}
    if (isSessionProduct) {
      const newSession = (sessionProducts || []).filter(sp => String(sp.id) !== String(productId));
      setSessionProducts(newSession);
      sessionStorage.setItem('myCatalog', JSON.stringify(newSession));
      setProducts(prev => prev.filter(p => String(p.id) !== String(productId)));
      setInfoMessage('Producto eliminado de la sesión.');
      setDeletingId(null);
      return;
    }

    try {
      // Debug: log delete attempt
        // Before deleting locally, check whether product exists on server. If it exists, call backend delete.
        try { console.debug('[MyProducts] checking server existence for delete', productId); } catch (e) {}
        let existsOnServer = false;
        try {
          const srv = await getProductById(productId);
          existsOnServer = !!srv;
        } catch (e) {
          // ignore errors (treat as not existing)
        }

        if (existsOnServer) {
          try { console.debug('[MyProducts] calling deleteProduct', productId); } catch (e) {}
          await deleteProduct(productId);
          setProducts(prev => prev.filter(p => String(p.id) !== String(productId)));
          setInfoMessage('Producto eliminado.');
        } else {
          // If not in server, just remove local session entry(s)
          const newSession = (sessionProducts || []).filter(sp => String(sp.id) !== String(productId));
          setSessionProducts(newSession);
          sessionStorage.setItem('myCatalog', JSON.stringify(newSession));
          setProducts(prev => prev.filter(p => String(p.id) !== String(productId)));
          setInfoMessage('Producto eliminado de la sesión.');
        }
    } catch (err) {
      console.error(err);
      setInfoMessage('Error al eliminar el producto.');
    } finally {
      setDeletingId(null);
    }
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

  // Prepare displayedProducts: merge backend products and sessionProducts, preferring session entries
  const mergedMap = new Map();
  (products || []).forEach(p => mergedMap.set(String(p.id), p));
  (sessionProducts || []).forEach(sp => mergedMap.set(String(sp.id), sp));
  const displayedProducts = Array.from(mergedMap.values());

  return (
    <div className="my-products">
      <div className="my-products-header">
        <h1>Mis Productos</h1>
        <Button onClick={() => navigate('/my-products/add')}>
          Agregar Producto
        </Button>
      </div>

      {infoMessage && (
        <div className="my-products-info">
          {infoMessage}
        </div>
      )}

      {displayedProducts.length === 0 ? (
        <div className="my-products-empty">
          <h3>No tienes productos publicados</h3>
          <p>¡Comienza a vender agregando tu primer producto!</p>
          <Button onClick={() => navigate('/my-products/add')}>
            Agregar Producto
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {displayedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={(Array.isArray(product.images) && product.images.length > 0) 
                    ? product.images[0] 
                    : product.image || '/images/placeholder.svg'}
                  alt={product.name || product.title}
                  onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                />
              </div>
              <div className="product-info">
                <div className="info-top">
                  <h3>{product.name || product.title}</h3>
                  <p className="product-description">{product.description || 'Sin descripción'}</p>
                </div>
                <p className="product-price">{formatPrice(product.price)}</p>
                <div className="product-status">
                  <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
                  </span>
                </div>
                {product.createdAt && (
                  <p className="product-date">Publicado: {formatDate(product.createdAt)}</p>
                )}
              </div>
              <div className="product-actions">
                <Button variant="outline" onClick={() => handleEdit(product)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)} loading={deletingId === product.id}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h2>Editar Producto</h2>
              <button className="edit-modal-close" onClick={handleCancelEdit} aria-label="Cerrar modal">×</button>
            </div>
            <div className="edit-modal-content">
              <div className="edit-form-group">
                <label htmlFor="edit-title">Título</label>
                <Input id="edit-title" value={editingProduct.name || editingProduct.title} disabled placeholder="Título del producto" />
                <small>El título no se puede editar</small>
              </div>
              <div className="edit-form-group">
                <label htmlFor="edit-price">Precio ($)</label>
                <Input id="edit-price" type="number" step="0.01" min="0" value={editForm.price} onChange={(e) => handleEditFormChange('price', e.target.value)} placeholder="0.00" />
              </div>
              <div className="edit-form-group">
                <label htmlFor="edit-description">Descripción</label>
                <textarea id="edit-description" className="edit-textarea" value={editForm.description} onChange={(e) => handleEditFormChange('description', e.target.value)} placeholder="Descripción del producto" rows="4" />
              </div>
              <div className="edit-form-group">
                <label htmlFor="edit-stock">Cantidad en Stock</label>
                <Input id="edit-stock" type="number" min="0" value={editForm.stock} onChange={(e) => handleEditFormChange('stock', e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="edit-modal-actions">
              <Button variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
              <Button variant="primary" onClick={handleSaveEdit} loading={savingId === editingProduct.id}>Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
