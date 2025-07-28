import { useEffect, useState } from 'react';

const AdminAvis = () => {
  const [avisList, setAvisList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Chargement des avis
  const fetchAvis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/avis');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setAvisList(data);
    } catch (err) {
      setError("Erreur lors du chargement des avis.");
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un avis
  const deleteAvis = async (id) => {
    if (!id) return alert("ID invalide.");
    if (!window.confirm('Supprimer cet avis ?')) return;

    try {
      const res = await fetch(`/api/avis/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const result = await res.json();
      alert(result.success || 'Avis supprimé');
      setSelected(null);
      fetchAvis();
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', backgroundColor: 'black', color: '#FFC660'}}>
      <h2>Gestion des avis</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Chargement...</p>}

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Liste des avis */}
        <div style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {avisList.map((avis) => (
              <li
                key={avis.id}
                onClick={() => setSelected(avis)}
                style={{
                  padding: '0.8rem',
                  marginBottom: '0.6rem',
                  backgroundColor: 'black',
                  cursor: 'pointer',
                  borderLeft: selected?.id === avis.id ? '5px solid #FFC660' : '5px solid transparent',
                }}
              >
                <strong>{avis.auteur}</strong> - {avis.note}/5<br />
                <small>{avis.produit?.nom}</small><br />
                <small>{avis.date}</small>
              </li>
            ))}
          </ul>
        </div>

        {/* Détails de l’avis sélectionné */}
        <div style={{ flex: 2, border: '1px solid #ddd', padding: '1rem', borderRadius: '10px' }}>
          {selected ? (
            <>
              <h3>{selected.produit?.nom}</h3>
              <p><strong>Auteur :</strong> {selected.auteur}</p>
              <p><strong>Note :</strong> {selected.note}/5</p>
              <p><strong>Date :</strong> {selected.date}</p>
              <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>
                {selected.commentaire}
              </p>
              <button
                onClick={() => deleteAvis(selected.id)}
                style={{
                  marginTop: '1rem',
                  padding: '0.6rem 1rem',
                  backgroundColor: '#d14343',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Supprimer
              </button>
            </>
          ) : (
            <p>Sélectionnez un avis pour voir le détail</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAvis;
