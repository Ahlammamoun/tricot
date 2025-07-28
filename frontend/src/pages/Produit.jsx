import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Produit = () => {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { addToCart } = useCart();
  const [avis, setAvis] = useState([]);
  const [showAvis, setShowAvis] = useState(false);


  const moyenneNote =
    avis.length > 0
      ? (avis.reduce((acc, avisItem) => acc + avisItem.note, 0) / avis.length).toFixed(1)
      : null;

  useEffect(() => {
    fetch(`/api/avis/produit/${id}`)
      .then(res => res.json())
      .then(data => setAvis(data))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    fetch(`/api/produits/${id}`)
      .then((res) => res.json())
      .then(setProduit)
      .catch(console.error);
  }, [id]);

  if (!produit) return <p style={{ padding: '2rem', color: '#e37b26' }}>Chargement...</p>;

  const allImages = [produit.image, ...(produit.images || []).map(img => img.path || img)];

  return (
    <>
      <style>{`
        .produit-container {
          padding: 2rem;
          background: #FAFAFA;
          color: black;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.03em;
          min-height: 100vh;
        }

        .produit-wrapper {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          align-items: flex-start;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeIn 0.8s ease-in-out;
        }

        .produit-img {
          width: 100%;
          max-width: 320px;
          border-radius: 14px;
          border: 3px solid #FFC660;
          box-shadow: 0 0 18px #FFC660;
          display: block;
          cursor: pointer;
        }

        .produit-img-wrapper {
          flex-shrink: 0;
          text-align: center;
          width: 100%;
        }

        .produit-details {
          flex: 1;
          min-width: 250px;
          max-width: 520px;
        }

        .produit-details p {
          margin-bottom: 1.2rem;
          font-size: 1.05rem;
          line-height: 1.6;
          color: black;
        }

        .produit-back {
          margin-top: 2rem;
          text-align: center;
        }

        .produit-back a {
          background-color: #FFC660;
          color: #000;
          padding: 0.9rem 1.6rem;
          border-radius: 14px;
          font-weight: bold;
          border: 2px solid #000;
          text-decoration: none;
          transition: background 0.3s ease, transform 0.2s;
          display: inline-block;
        }

        .produit-back a:hover {
          background-color: #FFC660;
          transform: scale(1.05);
        }

        .btn-panier {
          background: linear-gradient(145deg, #FFC660, #FFC660);
          color: #000;
          border: 2px solid #000;
          padding: 0.9rem 1.6rem;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 14px;
          cursor: pointer;
          margin-top: 1rem;
          box-shadow: 0 0 12px #FFC660;
          transition: all 0.3s ease-in-out;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.03em;
        }

        .btn-panier:hover {
          transform: scale(1.05);
          box-shadow: 0 0 18px #dFFC66014350;
        }

        @media (min-width: 769px) {
          .produit-img-wrapper {
            width: auto;
            text-align: left;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="produit-container">
        <h1 style={{ textAlign: 'center' }}>{produit.nom}</h1>

        <div className="produit-wrapper">
          <div className="produit-img-wrapper">
            <img
              src={produit.image}
              alt={produit.nom}
              className="produit-img"
              onClick={() => {
                setSelectedIndex(0);
                setSelectedImage(allImages[0]);
              }}
            />
            {produit.images && produit.images.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {produit.images.map((imgObj, i) => {
                  const imagePath = imgObj.path || imgObj;
                  const index = i + 1; // +1 because produit.image is at index 0
                  return (
                    <img
                      key={i}
                      src={imagePath}
                      alt={`supp-${i}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #FFC660',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedIndex(index);
                        setSelectedImage(allImages[index]);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="produit-details">
            {moyenneNote && (
              <p>
                ⭐ {moyenneNote} / 5
                {' '}
                <button
                  onClick={() => setShowAvis((prev) => !prev)}
                  style={{
                    background: 'none',
                    color: '#FFC660',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    marginLeft: '8px'
                  }}
                >
                  {showAvis ? 'Masquer les avis' : `Voir les avis (${avis.length})`}
                </button>
              </p>
            )}




            <p>{produit.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.5em' }}>{produit.prix} €</p>
            {/* <p> {produit.categorie}</p> */}
            <p><strong>Stock :</strong> {produit.stock}</p>

            <button className="btn-panier" onClick={() => addToCart(produit)}>
              + Panier
            </button>
          </div>
        </div>

        <div className="produit-back">
          <Link to="/">Retour à l'accueil</Link>
        </div>


        {showAvis && (
          <div style={{ marginTop: '2rem', maxWidth: '800px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Avis clients</h3>
            {avis.length === 0 ? (
              <p>Aucun avis pour ce produit.</p>
            ) : (
              avis.map((a, i) => (
                <div key={i} style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#f3f3f3',
                  borderLeft: '4px solid #FFC660',
                  borderRadius: '6px',
                }}>
                  <p><strong>{a.auteur}</strong> – ⭐ {a.note}/5</p>
                  <p style={{ marginTop: '0.5rem' }}>{a.commentaire}</p>
                </div>
              ))
            )}
          </div>
        )}




      </div>


      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newIndex = selectedIndex - 1;
                setSelectedIndex(newIndex);
                setSelectedImage(allImages[newIndex]);
              }}
              style={{
                position: 'absolute',
                left: '5%',
                fontSize: '3rem',
                color: 'white',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ‹
            </button>
          )}

          <img
            src={selectedImage}
            alt="Zoom"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px',
              border: '3px solid #FFC660',
              boxShadow: '0 0 20px rgba(255,255,255,0.4)',
            }}
          />

          {selectedIndex < allImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newIndex = selectedIndex + 1;
                setSelectedIndex(newIndex);
                setSelectedImage(allImages[newIndex]);
              }}
              style={{
                position: 'absolute',
                right: '5%',
                fontSize: '3rem',
                color: 'white',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Produit;
