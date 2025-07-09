// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CategoryPage = () => {
    const { name } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`/api/category/${name}`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(p => p.category === name);
                setProducts(filtered);
            })
            .catch(err => console.error('Erreur chargement produits:', err));
    }, [name]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fffaf6', fontFamily: 'Segoe UI, sans-serif' }}>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <h1 style={{ color: '#D45A76' }}>Catégorie : {name}</h1>
                {products.length ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem' }}>
                        {products.map((product) => (
                            <Link to={`/produit/${product.slug}`} key={product.id} style={{ textDecoration: 'none', color: '#333' }}>
                                <div style={{
                                    width: '220px',
                                    border: '1px solid #ddd',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    background: '#fff'
                                }}>
                                    <img
                                        src={`/uploads/${product.images?.[0]}`}
                                        alt={product.name}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ margin: 0 }}>{product.name}</h3>
                                        <p style={{ margin: '0.5rem 0' }}>{product.price} €</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>Aucun produit trouvé.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CategoryPage;
