import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import '../Auth/Auth.css';

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
    
    if (isBlocked) {
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    }
  };

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
          />

          <Button
            type="submit"
            loading={isLoading}
            disabled={isBlocked}
            fullWidth
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
