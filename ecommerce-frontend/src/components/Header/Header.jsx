// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../UI/Button';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cartCount;

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
          {/* Dark Mode Toggle */}
          <button 
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
              </svg>
            )}
          </button>

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
                <span className="header__user-name">¡Hola, {user.firstName}!</span>
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
          {/* Mobile Dark Mode Toggle */}
          <button 
            className="header__mobile-theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
              </svg>
            )}
            <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

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
                <span className="header__mobile-user-name">¡Hola, {user.firstName}!</span>
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