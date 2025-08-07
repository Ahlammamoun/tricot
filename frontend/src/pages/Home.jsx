import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [avis, setAvis] = useState([]);
  const [informations, setInformations] = useState([]);


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

  useEffect(() => {
    fetch('/api/avis/')
      .then(res => res.json())
      .then(setAvis)
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    fetch('/api/informations/') // Remplace par l’URL correcte si tu es en prod ou en Docker
      .then((response) => response.json())
      .then((data) => {
        setInformations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des informations :', error);
        setLoading(false);
      });
  }, []);

  const colors = [
    '#ec9898', '#e39867', '#e1da67', '#cee568', '#90e568',
    '#6ae3b1', '#6adee3', '#6aa7e3', '#b87dea', '#e386f0',
    '#f7aedc', '#f7aec5'
  ];



  return (
    <div style={styles.bodyWrapper}>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .scrolling {
          animation: scroll 60s linear infinite;
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
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .category-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          background-color: #FFC660;
          padding: 1rem 2rem;
          margin: 2rem 0;
          font-weight: bold;
          font-family: sans-serif;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 10px 100%, 0% 50%);
          flex-wrap: wrap;
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

        .avis-slider {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .scrolling {
            animation-duration: 50s;
          }
        }
      `}</style>

      <div className="carousel-wrapper">
        <div className="scrolling">
          {[...produits, ...produits].map((prod, index) => (
            <Link key={index} to={`/produit/${prod.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="card"
                style={{
                  ...styles.card,
                  backgroundColor: colors[index % colors.length],
                  color: '#111',
                }}
              >
                <img src={prod.image} alt={prod.nom} style={styles.cardImage} />
                <h3>{prod.nom}</h3>
                <p>{prod.prix} €</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="category-bar">
        {categories.filter(cat => !cat.parent).map((cat, index) => (
          <Link key={index} to={`/categorie/${cat.id}`} className="category-link">
            {cat.nom.toUpperCase()}
          </Link>
        ))}
      </div>

      <div style={styles.testimonialSection}>
        <h2 style={styles.sectionTitle}>Ce qu'en disent nos clients 💬</h2>
        <div style={styles.testimonialSliderWrapper}>
          <div className="avis-slider">
            {avis.map((avis, i) => (
              <div key={i} style={styles.testimonialCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  {avis.produit?.image && (
                    <img
                      src={avis.produit.image}
                      alt={avis.produit.nom}
                      style={styles.testimonialImage}
                    />
                  )}
                  <div>
                    <strong style={styles.testimonialProduct}>{avis.produit?.nom}</strong>
                    <div style={styles.testimonialDate}>{avis.date}</div>
                  </div>
                </div>
                <p style={styles.testimonialComment}>“{avis.commentaire}”</p>
                <p style={styles.testimonialAuthor}>👤 {avis.auteur}</p>
                <div style={styles.testimonialNote}>
                  {'⭐'.repeat(avis.note)}{'☆'.repeat(5 - avis.note)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.infoSection}>

        {informations.map((info) => (

          <div key={info.id}>
            <h2 style={styles.sectionTitle}>🛍️ {info.titre}</h2>
            <p style={styles.infoText}>{info.text}</p>
            <p style={styles.infoText}>{info.textDeux}</p>
            <p style={styles.infoText}>{info.textTrois}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  bodyWrapper: {
    background: '#FAFAFA',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif',
  },
  card: {
    padding: '1rem',
    borderRadius: '10px',
    minWidth: '200px',
    flex: '0 0 auto',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardImage: {
    width: '100%',
    height: '160px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginBottom: '0.6rem',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    fontFamily: 'Playfair Display, serif',
    color: '#222',
    margin: '2rem 0 1rem',
  },
  testimonialSection: {
    marginTop: '4rem',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '6px solid transparent',
    borderImage: 'linear-gradient(45deg, #FF3364, #FF33BB, #33D1FF, #33FF61) 1',
  },
  testimonialSliderWrapper: {
    overflowX: 'hidden',
    padding: '2rem 0',
    backgroundColor: '#FFC660',
    borderRadius: '10px',
    marginTop: '2rem',
  },
  testimonialCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '1.2rem 1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center',
    fontSize: '1rem',
    minWidth: '220px',
  },
  testimonialImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  testimonialProduct: {
    fontSize: '1rem',
    color: '#444',
  },
  testimonialDate: {
    fontSize: '0.85rem',
    color: '#999',
  },
  testimonialComment: {
    fontStyle: 'italic',
    marginBottom: '0.8rem',
    color: '#333',
  },
  testimonialAuthor: {
    fontWeight: 'bold',
    color: '#880e4f',
  },
  testimonialNote: {
    marginTop: '0.4rem',
  },
  infoSection: {
    marginTop: '4rem',
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '6px solid transparent',
    borderImage: 'linear-gradient(45deg, #FF3364, #FF33BB, #33D1FF, #33FF61) 1',
  },
  infoText: {
    fontSize: '1rem',
    color: '#333',
    lineHeight: '1.7',
    marginBottom: '1rem',
    textAlign: 'justify',
  },
};

export default Home;
