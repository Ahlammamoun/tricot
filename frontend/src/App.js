// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // importe ta nouvelle page
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produit/:slug" element={<ProductPage />} />
        <Route path="/categorie/:name" element={<CategoryPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
