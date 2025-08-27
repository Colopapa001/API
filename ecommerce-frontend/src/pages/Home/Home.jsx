import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
export { default as Button } from './Button/Button';
export { default as Input } from './Input/Input';
export { default as LoadingSpinner } from './LoadingSpinner/LoadingSpinner';
import { mockProducts } from '../../utils/mockData';
import { 
  formatPrice, 
  formatStock,
  sortProducts,
  filterProductsByPriceRange,
  filterProductsInStock
} from '../../utils/helpers';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest'
  });

  const { addToCart, isLoading: isCartLoading } = useCart();

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setError(null);
      } catch (err) {
        setError('Error cargando productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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
    let filtered = [...products];

    // Filtrar por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por precio
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

  if (loading) {
    return (
      <div className="home-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  const filteredProducts = getFilteredProducts();

  return (
    <div className="home">
      {/* Filtros */}
      <div className="home-filters">
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
        />
        
        <div className="price-filters">
          <Input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Precio mínimo"
            min="0"
          />
          <Input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Precio máximo"
            min="0"
          />
        </div>

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

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="sort-select"
        >
          <option value="newest">Más recientes</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
          <option value="name-asc">A-Z</option>
          <option value="name-desc">Z-A</option>
        </select>
      </div>

      {/* Resultados */}
      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros filtros</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
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
    </div>
  );
};

export default Home;
