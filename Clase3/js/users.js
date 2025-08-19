// Función asíncrona para obtener los usuarios
async function fetchUsers() {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const table = document.getElementById('usersTable');
    const tableBody = document.getElementById('tableBody');

    try {
        // Realizar la petición a la API
        const response = await fetch('https://jsonplaceholder.typicode.com/lalal');
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Convertir la respuesta a JSON
        const users = await response.json();
        
        // Crear las filas de la tabla
        const rows = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.address.city}</td>
                <td>${user.phone}</td>
                <td>${user.company.name}</td>
                <td>${user.website}</td>
            </tr>
        `).join('');
        
        // Insertar las filas en la tabla
        tableBody.innerHTML = rows;
        
        // Ocultar loading y mostrar la tabla
        loadingDiv.style.display = 'none';
        table.style.display = 'table';
        
    } catch (error) {
        // Manejar cualquier error que ocurra
        console.error('Error:', error);
        
        // Verificar específicamente si es un error de path inválido
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorDiv.textContent = 'Error: La URL de la API no es válida o no es accesible';
        } else {
            errorDiv.textContent = `Error al cargar los usuarios: ${error.message}`;
        }
        
        errorDiv.style.display = 'block';
        loadingDiv.style.display = 'none';
    }
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', fetchUsers);
