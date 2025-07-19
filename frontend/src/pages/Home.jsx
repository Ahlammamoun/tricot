import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/produits/')
      .then(res => res.json())
      .then(data => {
        setProduits(data.slice(0, 15));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={styles.bodyWrapper}>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .scrolling {
          animation: scroll 40s linear infinite;
          display: flex;
          gap: 1rem;
          width: fit-content;
          padding-left: 100%;
        }

        .carousel-wrapper {
          overflow: hidden;
          width: 100%;
          margin-top: 2rem;
        }

        .carousel-wrapper:hover .scrolling {
          animation-play-state: paused;
        }

        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(255, 255, 255, 0.2);
        }

        .category-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          background-color: #FFC660;
          padding: 1rem 2rem;
          margin: 2rem 0;
          font-weight: bold;
          font-family: sans-serif;
          position: relative;
          clip-path: polygon(
            10px 0%, 
            100% 0%, 
            calc(100% - 10px) 50%, 
            100% 100%, 
            10px 100%, 
            0% 50%
          );
        }

        .category-link {
          color: #000;
          text-decoration: none;
          font-weight: bold;
          font-size: 1rem;
          white-space: nowrap;
        }

        .category-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .scrolling {
            animation-duration: 30s;
          }
        }

        @media (max-width: 480px) {
          .scrolling {
            animation-duration: 20s;
          }
        }
      `}</style>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Recherche"
          style={styles.searchInput}
        />
      </div>


      <div className="carousel-wrapper">
        <div className="scrolling">
          {[...produits, ...produits].map((prod, index) => (
            <Link key={index} to={`/produit/${prod.id}`} style={{ textDecoration: 'none' }}>
              <div style={styles.card} className="card">
                <img src={prod.image} alt={prod.nom} style={styles.cardImage} />
                <h3>{prod.nom}</h3>
                <p>{prod.prix} €</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Barre de catégories avec flèches */}
      <div className="category-bar">
        {categories.filter(cat => !cat.parent).map((cat, index) => (
          <Link key={index} to={`/categorie/${cat.id}`} className="category-link">
            {cat.nom.toUpperCase()}
          </Link>
        ))}
      </div>



      {loading && <p style={{ textAlign: 'center', color: '#fff' }}>Chargement...</p>}
    </div>
  );
};

const styles = {
  bodyWrapper: {
    background: 'radial-gradient(circle at 20% 30%, #1a1a1a, #000)',
    minHeight: '100vh',
    padding: '2rem',
    color: '#FFB0CD',
    fontFamily: 'Poppins, sans-serif',
  },
  homeBox: {
    backgroundColor: '#0f0f0f',
    color: '#fff',
    padding: '2rem',
    borderRadius: '2rem',
    maxWidth: '600px',
    margin: '1rem auto 2rem',
    textAlign: 'center',
    boxShadow: '0 0 30px rgba(255, 176, 205, 0.25)',
  },

  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },

  searchInput: {
    border: '2px dashed #FFC660', // rose clair
    borderRadius: '8px',
    padding: '0.6rem 1rem',
    fontSize: '1rem',
    background: 'transparent',
    color: '#fff',
    width: '300px',
    outline: 'none',
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    fontFamily: 'Playfair Display, serif',
    fontWeight: 600,
    color: '#FFB0CD',
    marginBottom: '1rem',
  },
  paragraph: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#ccc',
  },
  button: {
    backgroundColor: '#FFB5B0',
    color: '#000',
    padding: '0.8rem 1.6rem',
    border: '2px solid #FFB5B0',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    fontFamily: 'Playfair Display, serif',
    color: 'white',
    margin: '2rem 0 1rem',
  },
  card: {
    backgroundColor: '#111',
    color: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    minWidth: '200px',
    flex: '0 0 auto',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(176, 189, 255, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardImage: {
    width: '100%',
    height: '160px',
    objectFit: 'contain',
    borderRadius: '8px',
    background: '#B0BDFF',
    marginBottom: '0.6rem',
  },
};

export default Home;
