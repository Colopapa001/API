import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getAllProducts, getCategories } from '../../services/Api';
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

  const { addToCart, isLoading: isCartLoading } = useCart();
  const { getOtherUsersProducts } = useProducts();
  const { user } = useAuth();

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
        
        // Filtrar productos del usuario actual de los productos de la API
        const filteredApiProducts = user 
          ? productsData.filter(product => product.userId !== user.id)
          : productsData;
        
        // Obtener productos en memoria de otros usuarios
        const inMemoryProducts = getOtherUsersProducts();
        
        // Combinar productos de la API y productos en memoria
        const allProducts = [...filteredApiProducts, ...inMemoryProducts];
        
        setProducts(allProducts);
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
  }, [user, getOtherUsersProducts]);

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

    // Filtrar por categoría seleccionada
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory.id);
    }

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

  const filteredProducts = getFilteredProducts();

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
                const productsInCategory = products.filter(product => product.categoryId === category.id).length;
                
                return (
                  <div key={category.id} className="category-card">
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
        </section>
      </div>
    )
  );
};

export default Home;
