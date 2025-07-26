import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CategoriePage = () => {
  const { id } = useParams();
  const [produits, setProduits] = useState([]);
  const [categorie, setCategorie] = useState(null);
  const [sousCategories, setSousCategories] = useState([]);
  const [selectedSousCat, setSelectedSousCat] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        const cat = data.find(c => c.id.toString() === id);
        if (cat) {
          setCategorie(cat);
          setSousCategories(cat.sousCategories || []);
        }
      });
  }, [id]);

  useEffect(() => {
    const url = `/api/categorie/${id}/produits-filtrés${selectedSousCat ? '?sousCategorie=' + selectedSousCat : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setProduits(data))
      .catch(err => console.error(err));
  }, [id, selectedSousCat]);

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      color: 'black',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <style>{`
        .card-sexy {
          background: #111;
          border: 2px solid #FFC660;
          border-radius: 12px;
          padding: 1rem;
          width: 200px;
          box-shadow: 0 0 15px #FFC660;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease;
        }

        .card-sexy:hover {
          transform: scale(1.03);
        }

        .image-sexy {
          width: 100%;
          height: 180px;
          object-fit: contain;
          border-radius: 8px;
          background: #FFC660;
          margin-bottom: 0.6rem;
        }

        .btn-panier {
          background: #FFC660;
          color: #000;
          border: none;
          padding: 0.5rem 0.9rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-panier:hover {
          background: #FFC660;
        }

        .select-style {
          background: #111;
          color: #FFC660;
          border: 1px #FFC660;
          border-radius: 25px;
          padding: 0.5rem 1rem;
          text-align: center;
          max-width: 300px;
          font-weight: bold;
        }
      `}</style>

      <h1 style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
        {categorie ? categorie.nom : 'Catégorie'}
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Link to="/" style={{ color: '#FFC660', textDecoration: 'none' }}>
          ⬅ Retour à l’accueil
        </Link>
      </div>

      {sousCategories.length > 0 && (
        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <select
            className="select-style"
            value={selectedSousCat}
            onChange={e => setSelectedSousCat(e.target.value)}
          >
            <option value="">Les filtres</option>
            {sousCategories.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.nom}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {produits.map(prod => (
          <div className="card-sexy" key={prod.id}>
            <Link to={`/produit/${prod.id}`} style={{ color: '#FFC660', fontWeight: 'bold', textDecoration: 'none' }}>
              <img src={prod.image} alt={prod.nom} className="image-sexy" />
              <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{prod.nom}</h3>
              <p style={{ margin: 0 }}>{prod.prix} €</p>
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>



              <button
                className="btn-panier"
                onClick={() => {
                  console.log('🛒 Ajouté :', prod);
                  addToCart(prod);
                }}
              >
                + Panier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriePage;
