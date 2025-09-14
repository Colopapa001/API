
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading, isBlocked } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) return;
    const success = await login(formData.email, formData.password);
    if (success) navigate('/');
  };

  // SVG Icons
  const EmailIcon = (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
  const LockIcon = (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="15" r="1.2" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {isBlocked && (
          <div className="auth-error">
            Demasiados intentos fallidos. Por favor, intenta más tarde.
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="email"
            name="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            disabled={isLoading || isBlocked}
            required
            icon={EmailIcon}
            iconPosition="left"
          />

          <Input
            type="password"
            name="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            disabled={isLoading || isBlocked}
            required
            icon={LockIcon}
            iconPosition="left"
          />

          <Button
            type="submit"
            loading={isLoading}
            disabled={isBlocked}
            fullWidth
            className="auth-submit"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="auth-links">
          <Link to="/register" className="auth-link">
            ¿No tienes cuenta? Regístrate
          </Link>
          <Link to="/forgot-password" className="auth-link">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
