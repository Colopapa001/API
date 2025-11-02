import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getAllProducts } from '../../services/productService';
import { getCategories } from '../../services/Api';
import { 
  formatPrice, 
  formatStock,
  sortProducts,
  filterProductsByPriceRange,
  filterProductsInStock
} from '../../utils/helpers';

import './Home.css';


const PRODUCTS_PER_PAGE = 8;

// Iconos SVG para categorías
const categoryIcons = {
  'Electrónicos': (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M7 21h10M12 17v4" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
  'Ropa': (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M4 4l4 2 4-2 4 2 4-2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M4 4v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8m4 0v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
  'Hogar': (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="1.7"/>
      <rect x="6" y="11" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
  'Deportes': (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M4 12h16M12 4a8 8 0 0 1 0 16" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
  'Juguetes': (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
};


const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'name-asc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart, isLoading: isCartLoading } = useCart();

  // Cargar productos y categorías
  useEffect(() => {
    // Scroll al inicio al montar
    import('../../utils/helpers').then(({ scrollToTop }) => scrollToTop('auto'));
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Error cargando datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listener para actualizaciones globales de productos (p.ej. después de un checkout)
    const onProductsUpdated = (e) => {
      try {
        const updated = e && e.detail ? e.detail : [];
        if (!Array.isArray(updated) || updated.length === 0) return;
        setProducts(prev => prev.map(p => {
          const u = updated.find(x => x.id === p.id);
          return u ? { ...p, ...u } : p;
        }));
      } catch (err) {
        console.warn('Error aplicando products:updated en Home:', err);
      }
    };

    window.addEventListener('products:updated', onProductsUpdated);
    return () => {
      window.removeEventListener('products:updated', onProductsUpdated);
    };
  }, []);

  // Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Aplicar filtros
  const getFilteredProducts = () => {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    let filtered = [...products];

    // Filtrar por categoría seleccionada
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoryId === selectedCategory.id || 
        product.category?.id === selectedCategory.id
      );
    }

    // Filtrar por búsqueda
      if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        (product.name || '').toLowerCase().includes(searchTerm) ||
        (product.description || '').toLowerCase().includes(searchTerm)
      );
    }    // Filtrar por precio
    filtered = filterProductsByPriceRange(
      filtered,
      filters.minPrice,
      filters.maxPrice
    );

    // Filtrar por stock
    if (filters.inStock) {
      filtered = filterProductsInStock(filtered);
    }

    // Ordenar
    return sortProducts(filtered, filters.sortBy);
  };

  // Manejar agregar al carrito
  const handleAddToCart = async (product) => {
    const result = await addToCart(product);
    if (result.success) {
      // Aquí podrías mostrar una notificación de éxito
    }
  };

  const filteredProducts = getFilteredProducts();

  // Calcular productos a mostrar
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Generar array de páginas para mostrar en la paginación
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1,2,3,4,5,'...',totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages);
      } else {
        pages.push(1,'...',currentPage-1,currentPage,currentPage+1,'...',totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (page === '...') return;
    setCurrentPage(page);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  // Hacer scroll automático al cambiar de página
  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, loading]);

  return (
    loading ? (
      <div className="home-loading">
        <LoadingSpinner fullscreen={false} size="large" />
      </div>
    ) : error ? (
      <div className="home-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </div>
    ) : (
      <div className="home">
        {/* Categorías */}
        <section className="categories-section">
          <h2>Categorías</h2>
          {selectedCategory ? (
            <div className="selected-category">
              <div className="selected-category-header">
                <h3>Categoría: {selectedCategory.name}</h3>
                <Button onClick={() => setSelectedCategory(null)} variant="outline">
                  Ver todas las categorías
                </Button>
              </div>
              <p>{selectedCategory.description}</p>
            </div>
          ) : (
            <div className="categories-container">
              {categories.map(category => {
                // Contar cuántos productos hay en esta categoría
                const productsInCategory = products && Array.isArray(products) 
                  ? products.filter(product => 
                      product.categoryId === category.id || 
                      product.category?.id === category.id
                    ).length 
                  : 0;
                return (
                  <div key={category.id} className="category-card">
                    <div className="category-icon-container">
                      {categoryIcons[category.name] || (
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/>
                        </svg>
                      )}
                    </div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <div className="category-card-footer">
                      <span className="products-count">{productsInCategory} productos</span>
                      <Button onClick={() => setSelectedCategory(category)}>
                        Ver productos
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        
        {/* Productos */}
        <section className="products-section">
          <h2>
            {selectedCategory 
              ? `Productos en ${selectedCategory.name}` 
              : 'Todos los Productos'}
          </h2>
          
          {/* Filtros */}
          <div className="home-filters">
            <div className="filter-box">
              <Input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Buscar productos..."
                icon={
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                className="home-filter-input"
              />
            </div>
            <div className="filter-box">
              <Input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Precio mínimo"
                min="0"
                className="home-filter-input"
              />
            </div>
            <div className="filter-box">
              <Input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Precio máximo"
                min="0"
                className="home-filter-input"
              />
            </div>
            <div className="filter-box">
              <div className="stock-filter">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                  />
                  Solo productos con stock
                </label>
              </div>
            </div>
            <div className="filter-box">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="sort-select"
              >
                <option value="name-asc">A-Z</option>
                <option value="name-desc">Z-A</option>
                <option value="newest">Más recientes</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
            </div>
          </div>

          {/* Resultados de productos */}
          {currentProducts.length === 0 ? (
            <div className="no-results">
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros filtros</p>
            </div>
          ) : (
            <div className="products-grid">
              {currentProducts.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={() => handleAddToCart(product)}
                  loading={isCartLoading}
                  stockLabel={formatStock(product.stock)}
                  formattedPrice={formatPrice(product.price)}
                />
              ))}
            </div>
          )}

          {/* Controles de paginación */}
          <div className="pagination-controls custom-pagination">
            <button className="pagination-btn" onClick={handleFirstPage} disabled={currentPage === 1}>{'«'}</button>
            <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>{'<'}</button>
            {getPageNumbers().map((page, idx) => (
              page === '...'
                ? <span key={idx} className="pagination-ellipsis">...</span>
                : <button
                    key={idx}
                    className={`pagination-btn${page === currentPage ? ' active' : ''}`}
                    onClick={() => handlePageClick(page)}
                    disabled={page === currentPage}
                  >
                    {page}
                  </button>
            ))}
            <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>{'>'}</button>
            <button className="pagination-btn" onClick={handleLastPage} disabled={currentPage === totalPages}>{'»'}</button>
          </div>
        </section>
      </div>
    )
  );
};

export default Home;
