// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../UI/Button';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = getTotalItems();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const handleCartClick = () => {
    navigate('/cart');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <div className="header__logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <span className="header__logo-text">ShopApp</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav desktop-nav">
          <Link 
            to="/" 
            className={`header__nav-link ${isActiveRoute('/')}`}
          >
            Inicio
          </Link>
          {user && (
            <>
              <Link 
                to="/my-products" 
                className={`header__nav-link ${isActiveRoute('/my-products')}`}
              >
                Mis Productos
              </Link>
              <Link 
                to="/profile" 
                className={`header__nav-link ${isActiveRoute('/profile')}`}
              >
                Mi Perfil
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="header__actions desktop-actions">
          {user ? (
            <>
              {/* Cart Button */}
              <button 
                className="header__cart-btn"
                onClick={handleCartClick}
                aria-label={`Carrito con ${cartItemsCount} productos`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                {cartItemsCount > 0 && (
                  <span className="header__cart-badge">{cartItemsCount}</span>
                )}
              </button>

              {/* User Menu */}
              <div className="header__user">
                <span className="header__user-name">¡Hola, {user.name}!</span>
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <div className="header__auth-buttons">
              <Button 
                variant="ghost" 
                size="small"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="primary" 
                size="small"
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="header__menu-toggle mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger ${isMenuOpen ? 'hamburger--open' : ''}`}>
            <span className="hamburger__line"></span>
            <span className="hamburger__line"></span>
            <span className="hamburger__line"></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${isMenuOpen ? 'header__mobile-menu--open' : ''}`}>
        <nav className="header__mobile-nav">
          <Link 
            to="/" 
            className={`header__mobile-link ${isActiveRoute('/')}`}
            onClick={closeMenu}
          >
            Inicio
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/my-products" 
                className={`header__mobile-link ${isActiveRoute('/my-products')}`}
                onClick={closeMenu}
              >
                Mis Productos
              </Link>
              <Link 
                to="/profile" 
                className={`header__mobile-link ${isActiveRoute('/profile')}`}
                onClick={closeMenu}
              >
                Mi Perfil
              </Link>
              
              {/* Mobile Cart */}
              <button 
                className="header__mobile-cart"
                onClick={handleCartClick}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <span>Carrito ({cartItemsCount})</span>
              </button>
              
              {/* Mobile User Info */}
              <div className="header__mobile-user">
                <span className="header__mobile-user-name">¡Hola, {user.name}!</span>
                <Button 
                  variant="danger" 
                  size="small" 
                  fullWidth
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <div className="header__mobile-auth">
              <Button 
                variant="outline" 
                size="medium" 
                fullWidth
                onClick={() => {
                  navigate('/login');
                  closeMenu();
                }}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="primary" 
                size="medium" 
                fullWidth
                onClick={() => {
                  navigate('/register');
                  closeMenu();
                }}
              >
                Registrarse
              </Button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="header__overlay"
          onClick={closeMenu}
          aria-label="Cerrar menú"
        />
      )}
    </header>
  );
};

export default Header;