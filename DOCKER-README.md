# 🐳 Guía de Docker para E-commerce

Esta guía explica cómo levantar la aplicación completa usando Docker Compose.

## 📋 Requisitos

- **Docker Desktop** instalado y funcionando
- **Docker Compose** v3.8 o superior
- Al menos **4GB de RAM** disponible
- Al menos **10GB de espacio** en disco

## 🚀 Inicio Rápido

### 1. Verificar Docker

Asegúrate de que Docker Desktop esté corriendo:

```bash
docker --version
docker-compose --version
```

### 2. Clonar el Repositorio

```bash
git clone <repository-url>
cd API
```

### 3. Levantar la Aplicación

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up -d
```

Este comando:
- Construye las imágenes de backend y frontend
- Crea e inicia los contenedores
- Configura la base de datos automáticamente
- Establece la red interna entre servicios

### 4. Verificar que todo está funcionando

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver los logs
docker-compose logs -f
```

Espera aproximadamente 2-3 minutos para que todo esté listo. Verás mensajes como:
- `db: healthy` - Base de datos lista
- `ecommerce-backend exited with code 0` - Backend iniciado
- `ecommerce-frontend exited with code 0` - Frontend iniciado

## 🌐 Acceso a la Aplicación

Una vez levantada, puedes acceder a:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Base de Datos**: localhost:3306

### Usuarios de Prueba

| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| admin | admin@ecommerce.com | Password123 | ADMIN |
| seller1 | seller1@ecommerce.com | Password123 | SELLER |
| user1 | user1@ecommerce.com | Password123 | USER |

## 🛠️ Comandos Útiles

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f db
```

### Detener la aplicación

```bash
# Detener los contenedores (mantiene datos)
docker-compose stop

# Detener y eliminar contenedores (mantiene volúmenes)
docker-compose down

# Detener y eliminar TODO (incluidos volúmenes - PERDIDA DE DATOS)
docker-compose down -v
```

### Reiniciar un servicio específico

```bash
# Reiniciar solo el backend
docker-compose restart backend

# Reiniciar solo el frontend
docker-compose restart frontend
```

### Reconstruir las imágenes

Si cambiaste código y necesitas reconstruir:

```bash
# Reconstruir sin caché
docker-compose build --no-cache

# Reconstruir y levantar
docker-compose up -d --build
```

### Ver el estado de los contenedores

```bash
# Estado general
docker-compose ps

# Recursos utilizados
docker stats

# Información detallada de un contenedor
docker inspect ecommerce-backend
docker inspect ecommerce-frontend
docker inspect ecommerce-db
```

## 🔍 Solución de Problemas

### Puerto ya en uso

Si obtienes un error de puerto ocupado:

```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :3306

# Cambiar los puertos en docker-compose.yml si es necesario
```

### El backend no inicia

```bash
# Ver logs del backend
docker-compose logs backend

# Verificar que la base de datos esté healthy
docker-compose ps db

# Reiniciar el backend
docker-compose restart backend
```

### La base de datos no conecta

```bash
# Verificar que MySQL esté corriendo
docker-compose logs db

# Acceder a la base de datos
docker-compose exec db mysql -uroot -prootpassword

# Recrear la base de datos desde cero
docker-compose down -v
docker-compose up -d
```

### El frontend no carga productos

1. Verifica que el backend esté respondiendo: http://localhost:8080/api/health
2. Verifica los logs del frontend: `docker-compose logs frontend`
3. Verifica la configuración de API en `ecommerce-frontend/src/services/Api.js`

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose rm -f

# Limpiar Docker completamente (CUIDADO)
docker system prune -a

# Reconstruir desde cero
docker-compose up -d --build
```

## 🗄️ Base de Datos

### Acceder a MySQL

```bash
# Desde la terminal
docker-compose exec db mysql -uroot -prootpassword ecommerce_db

# O con cliente externo
Host: localhost
Port: 3306
User: root
Password: rootpassword
Database: ecommerce_db
```

### Backup de la base de datos

```bash
# Crear backup
docker-compose exec db mysqldump -uroot -prootpassword ecommerce_db > backup.sql

# Restaurar backup
docker-compose exec -T db mysql -uroot -prootpassword ecommerce_db < backup.sql
```

### El volumen persiste datos

Los datos se guardan en un volumen de Docker y persisten aunque detengas los contenedores. Solo se eliminan con `docker-compose down -v`.

## 📁 Estructura de Archivos Docker

```
API/
├── docker-compose.yml              # Orquestación de servicios
├── DOCKER-README.md                # Esta guía
├── ecommerce-backend/
│   ├── Dockerfile                  # Imagen del backend
│   └── .dockerignore               # Archivos a ignorar
└── ecommerce-frontend/
    ├── Dockerfile                  # Imagen del frontend
    ├── nginx.conf                  # Configuración de nginx
    └── .dockerignore               # Archivos a ignorar
```

## 🔒 Seguridad

### Variables de Entorno

Las credenciales están hardcodeadas en `docker-compose.yml` para desarrollo. **NO usar en producción**.

Para producción:
1. Crear archivo `.env`
2. Mover las credenciales allí
3. Actualizar `docker-compose.yml` para usar `${VARIABLE}`

### Ejemplo .env

```env
# Database
DB_ROOT_PASSWORD=your_secure_password
DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_256_bit_secret_key_here

# Frontend
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 🚢 Compartir con tu Equipo

### Opción 1: Compartir el código

```bash
# Tu equipo clona el repo y ejecuta
git clone <repository-url>
cd API
docker-compose up -d
```

### Opción 2: Crear imágenes Docker

```bash
# Construir y subir a Docker Hub (opcional)
docker-compose build
docker tag ecommerce-backend tu-usuario/ecommerce-backend
docker tag ecommerce-frontend tu-usuario/ecommerce-frontend
docker push tu-usuario/ecommerce-backend
docker push tu-usuario/ecommerce-frontend
```

Luego actualiza `docker-compose.yml` para usar las imágenes:

```yaml
backend:
  image: tu-usuario/ecommerce-backend:latest
  # ... resto de configuración
```

## 📊 Monitoreo

### Ver uso de recursos

```bash
docker stats
```

### Ver estado de salud

```bash
docker inspect --format='{{.State.Health.Status}}' ecommerce-backend
docker inspect --format='{{.State.Health.Status}}' ecommerce-frontend
docker inspect --format='{{.State.Health.Status}}' ecommerce-db
```

## 🎯 Próximos Pasos

1. ✅ Docker Compose funcionando
2. 🔄 Probar todas las funcionalidades
3. 🔒 Configurar variables de entorno
4. 🚀 Preparar para producción
5. 📝 Documentar para tu equipo

## 📚 Documentación Adicional

- [README.md](README.md) - Documentación general del proyecto
- [GUIA-COMPLETA.md](GUIA-COMPLETA.md) - Guía completa del sistema
- [ecommerce-backend/README.md](ecommerce-backend/README.md) - Backend
- [ecommerce-frontend/README.md](ecommerce-frontend/README.md) - Frontend

## ❓ Preguntas Frecuentes

**P: ¿Cuánto tiempo toma levantar por primera vez?**
R: Aproximadamente 5-10 minutos (descarga de imágenes + construcción). Luego, solo 1-2 minutos.

**P: ¿Los datos se pierden al reiniciar?**
R: No, los datos persisten en volúmenes de Docker. Solo se pierden con `docker-compose down -v`.

**P: ¿Puedo modificar el código y ver los cambios?**
R: No automáticamente. Necesitas reconstruir con `docker-compose up -d --build` o usar volúmenes para desarrollo.

**P: ¿Cómo agregar más usuarios o productos?**
R: Accede a la aplicación en http://localhost:3000 y regístrate, o usa los usuarios de prueba.

---

**¡Tu aplicación está lista! 🎉**

Desarrollado con ❤️ para facilitar el desarrollo en equipo.

