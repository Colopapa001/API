// Using the free Fake Store API for demonstration
const API_URL = 'https://fakestoreapi.com';

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
