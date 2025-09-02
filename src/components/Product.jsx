import { useCart } from '../context/CartContext';

const Product = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} style={{ maxWidth: '200px' }} />
            <h3>{product.title}</h3>
            <p>{product.description.substring(0, 100)}...</p>
            <p className="price">${product.price}</p>
            <button onClick={() => addToCart(product)}>
                Add to Cart
            </button>
        </div>
    );
};

export default Product;
