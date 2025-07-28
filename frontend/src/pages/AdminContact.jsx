import { useEffect, useState } from 'react';

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact'); // 🟡 URL corrigée si ton API est préfixée
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Erreur lors du chargement des messages.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessage = async (id) => {
    try {
      const res = await fetch(`/api/admin/contact/${id}`);
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setSelected(data);
    } catch (err) {
      setError("Erreur lors du chargement du message.");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const result = await res.json();
      alert(result.success || 'Message supprimé');
      setSelected(null);
      fetchMessages(); // refresh list
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', backgroundColor: 'black', color: '#FFC660'}}>
      <h2>Messages de contact</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Chargement...</p>}

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Liste des messages */}
        <div style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map(msg => (
              <li
                key={msg.id}
                onClick={() => fetchMessage(msg.id)}
                style={{
                  padding: '0.7rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'black',
                  cursor: 'pointer',
                  borderLeft: selected?.id === msg.id ? '5px solid #FFC660' : '5px solid transparent'
                }}
              >
                <strong>{msg.nom}</strong><br />
                <small>{msg.email}</small><br />
                <small>{new Date(msg.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>

        {/* Message sélectionné */}
        <div style={{ flex: 2, border: '1px solid #ddd', padding: '1rem', borderRadius: '10px' }}>
          {selected ? (
            <>
              <h3>{selected.sujet || 'Sans sujet'}</h3>
              <p><strong>De :</strong> {selected.nom} ({selected.email})</p>
              <p><strong>Date :</strong> {new Date(selected.createdAt).toLocaleString()}</p>
              <p style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>{selected.message}</p>
              <button
                onClick={() => deleteMessage(selected.id)}
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
            <p>Sélectionnez un message pour le lire</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;

