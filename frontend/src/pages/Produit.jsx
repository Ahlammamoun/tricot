import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Produit = () => {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/produits/${id}`)
      .then((res) => res.json())
      .then(setProduit)
      .catch(console.error);
  }, [id]);

  if (!produit) return <p style={{ padding: '2rem', color: '#e37b26' }}>Chargement...</p>;

  return (
    <>
      <style>{`
        .produit-container {
          padding: 2rem;
          background: linear-gradient(160deg, #0c0c0c, #1a1a1a);
          color: #ff69b4;
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
          border: 3px solid #ff69b4;
          box-shadow: 0 0 18px rgba(255, 105, 180, 0.4);
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
          color: #ffc0cb;
        }

        .produit-back {
          margin-top: 2rem;
          text-align: center;
        }

        .produit-back a {
          background-color: #ff69b4;
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
          background-color: #ff85c1;
          transform: scale(1.05);
        }

        .btn-panier {
          background: linear-gradient(145deg, #ff69b4, #d94884);
          color: #000;
          border: 2px solid #000;
          padding: 0.9rem 1.6rem;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 14px;
          cursor: pointer;
          margin-top: 1rem;
          box-shadow: 0 0 12px rgba(255, 105, 180, 0.4);
          transition: all 0.3s ease-in-out;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.03em;
        }

        .btn-panier:hover {
          background: linear-gradient(145deg, #ff85c1, #e94e90);
          transform: scale(1.05);
          box-shadow: 0 0 18px rgba(255, 105, 180, 0.6);
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
        <h1>{produit.nom}</h1>

        <div className="produit-wrapper">
          <div className="produit-img-wrapper">
            <img
              src={produit.image}
              alt={produit.nom}
              className="produit-img"
              onClick={() => setSelectedImage(produit.image)}
            />
            {produit.images && produit.images.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {produit.images.map((imgObj, i) => (
                  <img
                    key={i}
                    src={imgObj.path || imgObj} // support object or string path
                    alt={`supp-${i}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #ff69b4',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedImage(imgObj.path || imgObj)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="produit-details">
            <p><strong>Prix :</strong> {produit.prix} €</p>
            <p><strong>Description :</strong> {produit.description}</p>
            <p><strong>Catégorie :</strong> {produit.categorie}</p>

            <button className="btn-panier" onClick={() => addToCart(produit)}>
              + Panier
            </button>
          </div>
        </div>

        <div className="produit-back">
          <Link to="/">Retour à l'accueil</Link>
        </div>
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
            cursor: 'pointer',
          }}
        >
          <img
            src={selectedImage}
            alt="Zoom"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px',
              border: '3px solid #ff69b4',
              boxShadow: '0 0 20px rgba(255,255,255,0.4)',
            }}
          />
        </div>
      )}
    </>
  );
};

export default Produit;