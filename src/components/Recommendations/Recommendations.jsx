import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockProducts } from '../../utils/mockData';
import './Recommendations.css';

const Recommendations = ({ cartItems }) => {
  const { user } = useAuth();

  console.log('Auth user:', user);
  console.log('Cart items:', cartItems);
  // Función para obtener recomendaciones basadas en los productos del carrito
  const recommendations = useMemo(() => {
    if (!cartItems?.length) return [];

    // Obtener categorías y sus frecuencias del carrito
    const categoryFrequency = cartItems.reduce((acc, item) => {
      const categoryId = item.product.categoryId;
      acc[categoryId] = (acc[categoryId] || 0) + 1;
      return acc;
    }, {});

    // Obtener rango de precios del carrito
    const cartPrices = cartItems.map(item => item.product.price);
    const avgPrice = cartPrices.reduce((a, b) => a + b, 0) / cartPrices.length;
    const priceRange = {
      min: avgPrice * 0.5,  // 50% por debajo del promedio
      max: avgPrice * 1.5   // 50% por encima del promedio
    };

    // Obtener IDs de productos que ya están en el carrito
    const cartProductIds = new Set(cartItems.map(item => item.product.id));

    // Usar el ID del usuario autenticado en lugar del ID del producto en el carrito
    const currentUserId = user?.id;
    console.log('Current user ID from Auth:', currentUserId);
    
    // Asignar puntuación a cada producto potencial
    console.log('All products before filtering:', mockProducts);
    const scoredProducts = mockProducts
      .filter(product => {
        console.log('Checking product:', product.id, 'userId:', product.userId, 'vs currentUserId:', currentUserId);
        const inCart = cartProductIds.has(product.id);
        const isCurrentUser = product.userId === currentUserId;
        console.log('In cart:', inCart, 'Is current user:', isCurrentUser);
        
        return !inCart && !isCurrentUser;
      })
      .map(product => {
        let score = 0;
        
        // Puntos por categoría (0-5 puntos)
        if (categoryFrequency[product.categoryId]) {
          score += (categoryFrequency[product.categoryId] * 2);
        }
        
        // Puntos por rango de precio (0-3 puntos)
        if (product.price >= priceRange.min && product.price <= priceRange.max) {
          score += 3;
        }
        
        // Puntos por stock disponible (0-2 puntos)
        if (product.stock > 0) {
          score += product.stock > 10 ? 2 : 1;
        }

        return { ...product, score };
      })
      .sort((a, b) => {
        // Primero ordenar por puntuación
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // Si tienen la misma puntuación, ordenar por stock
        return b.stock - a.stock;
      });

    // Si no hay suficientes productos después del filtrado, buscar más productos populares
    if (scoredProducts.length < 4) {
      const additionalProducts = mockProducts
        .filter(product => 
          !cartProductIds.has(product.id) && 
          product.userId !== currentUserId &&
          !scoredProducts.some(p => p.id === product.id)
        )
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 4 - scoredProducts.length);

      scoredProducts.push(...additionalProducts);
    }

    return scoredProducts.slice(0, 4);

    return scoredProducts;
  }, [cartItems]);

  if (!recommendations.length) return null;

  // Agrupar recomendaciones por categoría para mostrar el motivo
  const getRecommendationReason = (product) => {
    const cartProduct = cartItems.find(item => 
      item.product.categoryId === product.categoryId
    );
    if (cartProduct) {
      return `Porque compraste ${cartProduct.product.title}`;
    }
    return 'Basado en tus compras';
  }

  return (
    <div className="recommendations">
      <h3 className="recommendations__title">Productos Recomendados</h3>
      <div className="recommendations__grid">
        {recommendations.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="recommendation-card"
          >
            <div className="recommendation-card__image">
              <img 
                src={product.images?.[0] || 'https://via.placeholder.com/200x200?text=Producto'} 
                alt={product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x200?text=Imagen+no+disponible';
                }}
              />
            </div>
            <div className="recommendation-card__content">
              <h4 className="recommendation-card__title">{product.title}</h4>
              <p className="recommendation-card__price">
                ${product.price.toFixed(2)}
              </p>
              <p className="recommendation-card__reason">
                {getRecommendationReason(product)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
