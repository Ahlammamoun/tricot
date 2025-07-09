import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  nav: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFB5B0',
    color: '#fff',
    padding: '1rem 2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  navTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    fontFamily: 'cursive',
    color: '#D45A76',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  searchBar: {
    border: '2px dashed black',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    width: '250px',
    background: 'transparent',
    color: '#fff',
    outline: 'none',
  },
  profileLink: {
    fontWeight: 'bold',
    textDecoration: 'underline',
    cursor: 'pointer',
    color: '#D45A76',
  },
  categoryBar: {
    width: '100%',
    backgroundColor: '#FFF2B0',
    padding: '1rem 0.5rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    fontWeight: 'bold',
    color: '#333',
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  photoCard: {
    width: '200px',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: '12px',
    marginRight: '1rem',
    borderTop: 'solid 1px black',
    borderBottom: 'solid 1px black',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    padding: '1px',
    backgroundColor: 'black',
  },
};

const Navbar = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Erreur produits:', err));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Erreur catégories:', err));
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }

          .scrolling {
            animation: scroll 50s linear infinite;
            display: flex;
            flex-direction: row;
            width: fit-content;
            gap: 1rem;
            padding-left: 100%;
          }

          .photo-cards-wrapper {
            overflow: hidden;
            width: 100%;
            margin-top: 1rem;
            position: relative;
            padding: 0 0; /* Important: pas de padding ici */
          }

          .photo-cards-wrapper:hover .scrolling {
            animation-play-state: paused;
          }

          .photo-card:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          }

          @media (max-width: 768px) {
            .photo-card {
              width: 120px !important;
              height: 120px !important;
            }
            .scrolling {
              animation-duration: 40s;
            }
          }

          @media (max-width: 480px) {
            .photo-card {
              width: 100px !important;
              height: 100px !important;
            }
            .scrolling {
              animation-duration: 30s;
            }
          }
        `}
      </style>

      <nav style={styles.nav}>
        <div style={styles.navTop}>
          <div style={styles.logo}>Stitch & Dreams</div>
          <div style={styles.navRight}>
            <input type="text" placeholder="Rechercher..." style={styles.searchBar} />
            <div style={styles.profileLink}>Profil</div>
            <Link to="/admin/products" style={{
              color: '#D45A76',
              fontWeight: 'bold',
              textDecoration: 'underline',
              marginLeft: '1rem',
              cursor: 'pointer'
            }}>
              Admin Produits
            </Link>
                <Link to="/admin/categories" style={{
              color: '#D45A76',
              fontWeight: 'bold',
              textDecoration: 'underline',
              marginLeft: '1rem',
              cursor: 'pointer'
            }}>
              Admin Categories
            </Link>
          </div>
        </div>

        <div className="photo-cards-wrapper">
          <div className="scrolling">
            {[...products, ...products].map((product, i) => (
              <Link
                key={i}
                to={`/produit/${product.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="photo-card" style={styles.photoCard}>
                  {product.images?.[0] ? (
                    <img
                      src={`/uploads/${product.images[0]}`}
                      alt={product.name}
                      style={styles.cardImage}
                    />
                  ) : (
                    <div>Aucune image</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={styles.categoryBar}>
          {categories.map((cat, i) => (
            <Link key={i} to={`/categorie/${cat.name}`} style={{ color: '#333', textDecoration: 'none' }}>
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

