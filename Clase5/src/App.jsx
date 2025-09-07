import { CartProvider } from './context/CartContext'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import './App.css'

function App() {
  return (
    <CartProvider>
      <div className="app">
        <header>
          <h1>Online Store</h1>
        </header>
        <main>
          <div className="content">
            <ProductList />
          </div>
          <aside className="cart-sidebar">
            <Cart />
          </aside>
        </main>
      </div>
    </CartProvider>
  )
}

export default App
