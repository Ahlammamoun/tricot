import React, { useEffect, useState } from 'react';

const AdminInformation = () => {
  const [informations, setInformations] = useState([]);
  const [form, setForm] = useState({ titre: '', text: '' });
  const [editingId, setEditingId] = useState(null);

  // Charger les informations depuis l'API
  const fetchInformations = () => {
    fetch('/api/informations/')
      .then(res => res.json())
      .then(data => setInformations(data))
      .catch(err => console.error('Erreur chargement :', err));
  };

  useEffect(() => {
    fetchInformations();
  }, []);

  // Gérer les changements dans les inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ajouter ou mettre à jour une information
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `/api/informations/${editingId}`
      : `/api/informations`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(() => {
        fetchInformations();
        setForm({ titre: '', text: '' });
        setEditingId(null);
      })
      .catch(err => console.error('Erreur envoi :', err));
  };

  // Supprimer une information
  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cette information ?')) return;

    fetch(`/api/informations/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchInformations())
      .catch(err => console.error('Erreur suppression :', err));
  };

  // Pré-remplir le formulaire pour modification
  const handleEdit = (info) => {
    setForm({ titre: info.titre, text: info.text, textDeux: info.textDeux, textTrois: info.textTrois });
    setEditingId(info.id);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛠️ Gestion des Informations</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          required
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          name="text"
          placeholder="Texte"
          value={form.text}
          onChange={handleChange}
          required
          style={{ marginRight: '1rem', padding: '0.5rem', width: '300px' }}
        />
          <input
          type="text"
          name="textDeux"
          placeholder="TexteDeux"
          value={form.textDeux}
          onChange={handleChange}
          required
          style={{ marginRight: '1rem', padding: '0.5rem', width: '300px' }}
        />
          <input
          type="text"
          name="textTrois"
          placeholder="TexteTrois"
          value={form.textTrois}
          onChange={handleChange}
          required
          style={{ marginRight: '1rem', padding: '0.5rem', width: '300px' }}
        />
        <button type="submit">
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      <ul>
        {informations.map((info) => (
          <li key={info.id} style={{ marginBottom: '1rem' }}>
            <strong>{info.titre}:</strong> {info.text} {info.textDeux} {info.textTrois}
            <br />
            <button onClick={() => handleEdit(info)} style={{ marginRight: '1rem' }}>✏️ Modifier</button>
            <button onClick={() => handleDelete(info.id)}>🗑️ Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminInformation;
