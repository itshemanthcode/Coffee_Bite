import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar       from './components/Navbar';
import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import SignupPage   from './pages/SignupPage';
import CartPage     from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage   from './pages/OrdersPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"        element={<HomePage />} />
            <Route path="/login"   element={<LoginPage />} />
            <Route path="/signup"  element={<SignupPage />} />
            <Route path="/cart"    element={<CartPage />} />
            <Route path="/checkout"element={<CheckoutPage />} />
            <Route path="/orders"  element={<OrdersPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
