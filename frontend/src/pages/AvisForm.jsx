import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AvisForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [produit, setProduit] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/produits/${id}`)
      .then(res => res.json())
      .then(data => setProduit(data))
      .catch(err => {
        console.error(err);
        setProduit(null);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          produit_id: parseInt(id),
          note,
          commentaire,
        }),
      });

      if (res.status === 409) {
        setMessage('⚠️ Vous avez déjà laissé un avis pour ce produit.');
        return;
      }

      if (!res.ok) throw new Error('Erreur lors de l’envoi de l’avis.');

      setMessage('✅ Merci pour votre avis !');
      setCommentaire('');
      setNote(5);
    } catch (err) {
      console.error(err);
      setMessage('❌ Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (!user) {
    return <p style={{ padding: '2rem', color: 'red' }}>Vous devez être connecté pour laisser un avis.</p>;
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>📝 Laisser un avis</h2>

      {produit && (
        <div style={styles.produitPreview}>
          <img src={produit.image} alt={produit.nom} style={styles.image} />
          <h3 style={{ marginTop: '0.5rem', color: '#333' }}>{produit.nom}</h3>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Note :</label>
        <select value={note} onChange={(e) => setNote(parseInt(e.target.value))} style={styles.select}>
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </select>

        <label style={styles.label}>Commentaire :</label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          required
          rows={4}
          placeholder="Votre commentaire..."
          style={styles.textarea}
        />

        {message && (
          <p style={{
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: message.startsWith('✅') ? 'green' :
                  message.startsWith('⚠️') ? '#d97706' : '#d14350'
          }}>{message}</p>
        )}

        <div style={styles.buttons}>
          <button type="submit" style={styles.submit}>Envoyer l’avis</button>
          <button type="button" onClick={() => navigate(-1)} style={styles.back}>⬅ Retour</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff0f6',
    borderRadius: '20px',
    fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.6rem',
    color: '#880e4f',
  },
  produitPreview: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  image: {
    width: '100px',
    height: 'auto',
    borderRadius: '10px',
    border: '2px solid #d14350',
    boxShadow: '0 0 8px rgba(209, 67, 80, 0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  select: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '10px',
    border: '1px solid #ccc',
    background: '#fff',
  },
  textarea: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '10px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  submit: {
    padding: '0.8rem 1.6rem',
    borderRadius: '30px',
    border: 'none',
    background: '#ffb0cd',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  back: {
    padding: '0.8rem 1.6rem',
    borderRadius: '30px',
    background: '#eee',
    color: '#444',
    border: '1px solid #ccc',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

export default AvisForm;
