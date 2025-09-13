// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/variables.css';

// Performance monitoring (opcional)
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Error Boundary para capturar errores globales
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Here you could send the error to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-primary)'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '2rem',
            borderRadius: '12px',
            backgroundColor: 'var(--color-danger-50)',
            border: '1px solid var(--color-danger-200)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h1 style={{ 
              color: 'var(--color-danger)',
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              ⚠️ Oops! Algo salió mal
            </h1>
            
            <p style={{ 
              marginBottom: '1.5rem',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.6'
            }}>
              Ha ocurrido un error inesperado en la aplicación.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details style={{ 
                textAlign: 'left',
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--color-gray-100)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)'
              }}>
                <summary style={{ 
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Ver detalles del error
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.8rem',
                  color: 'var(--color-danger)'
                }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-primary-dark)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
            >
              🔄 Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring function
function sendToAnalytics(metric) {
  // En producción aquí enviarías las métricas a tu servicio de analytics
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }
}

// Get the root element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app with Error Boundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Web Vitals monitoring (opcional - para performance)
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// The service worker registration was removed because the file service-worker.js
// does not exist in the public folder. This would cause a 404 error in production.

// Dark mode detection and initialization
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    document.documentElement.classList.add('dark-mode');
  }
}

// Initialize theme immediately
initializeTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    if (e.matches) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
});

// Development tools
if (process.env.NODE_ENV === 'development') {
  // React DevTools detection
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('🔧 React DevTools detected');
  }
  
  // Performance measurement
  if (window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`📊 Page load time: ${loadTime}ms`);
      }, 0);
    });
  }
  
  // Welcome message
  console.log(`
  🚀 ShopApp Development Mode
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  React: ${React.version}
  Environment: ${process.env.NODE_ENV}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}