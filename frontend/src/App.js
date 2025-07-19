import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Produit from './pages/Produit';
import CategoriePage from './pages/CategoriePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProduits from './pages/AdminProduits';
import AdminCategories from './pages/AdminCategories';
import CartPage from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import AdminUsers from './pages/AdminUsers';
import MyOrders from './pages/MyOrders';
import AdminCommandesPage from './pages/AdminCommandesPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>


          <Routes>
            <Route element={<Layout />}>
              <Route
                path="/admin/produits"
                element={
                  <PrivateRoute adminOnly>
                    <AdminProduits />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <PrivateRoute adminOnly>
                    <AdminCategories />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/utilisateurs"
                element={
                  <PrivateRoute adminOnly>
                    <AdminUsers />
                  </PrivateRoute>
                }
              />
                  <Route
                path="/admin/commandes"
                element={
                  <PrivateRoute adminOnly>
                    <AdminCommandesPage />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Home />} />
              <Route path="/produit/:id" element={<Produit />} />
              <Route path="/categorie/:id" element={<CategoriePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;