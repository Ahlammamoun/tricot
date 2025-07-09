import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setCurrentImageIndex(0);
      })
      .catch((err) => console.error('Erreur chargement produit :', err));
  }, [slug]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Erreur chargement navbar produits :', err));
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      (prev + 1) % (product?.images?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1)
    );
  };

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  if (!product) return <div style={{ padding: '2rem' }}>Chargement...</div>;

  const currentImage = product.images?.[currentImageIndex];

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: 'ghostwhite', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar products={products} />

      <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '16px',
          maxWidth: '900px',
          width: '100%',
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <button onClick={prevImage} style={navBtnStyle('left')}>‹</button>
            <img
              src={`/uploads/${currentImage}`}
              alt={product.name}
              onClick={openLightbox}
              style={{ width: '100%', maxHeight: '400px', padding: '1px', borderRadius: '12px', cursor: 'pointer' }}
            />
            <button onClick={nextImage} style={navBtnStyle('right')}>›</button>
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#D45A76', marginBottom: '1rem' }}>{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>Prix :</strong> {product.price} €</p>
            <p><strong>Stock :</strong> {product.stock}</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div onClick={closeLightbox} style={lightboxStyle}>
          <img
            src={`/uploads/${currentImage}`}
            alt={`Zoom ${product.name}`}
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px' }}
          />
          <button onClick={e => { e.stopPropagation(); closeLightbox(); }} style={closeBtnStyle}>✕</button>
        </div>
      )}

      <Footer />
    </div>
  );
};

// Styles des flèches de navigation
const navBtnStyle = (position) => ({
  position: 'absolute',
  top: '50%',
  [position]: '10px',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.4)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  fontSize: '1.5rem',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  zIndex: 2,
});

// Lightbox styles
const lightboxStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.85)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const closeBtnStyle = {
  position: 'absolute',
  top: '2%',
  right: '2%',
  fontSize: '2rem',
  color: '#fff',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
};

export default ProductPage;
