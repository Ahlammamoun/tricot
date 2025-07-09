import React, { useEffect, useState } from 'react';

const initialFormState = {
  id: null,
  name: '',
  parentId: null,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => setError('Erreur chargement catégories'));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value === '' ? null : name === 'parentId' ? parseInt(value, 10) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/admin/categories/${form.id}` : '/api/admin/categories';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        parentId: form.parentId,
      }),
    })
      .then(r => {
        if (!r.ok) throw new Error('Erreur lors de la sauvegarde');
        return r.json();
      })
      .then(() => {
        fetchCategories();
        setForm(initialFormState);
        setEditing(false);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function startEdit(cat) {
    setForm({
      id: cat.id,
      name: cat.name,
      parentId: cat.parent ? cat.parent.id : null,
    });
    setEditing(true);
    setError(null);
  }

  function handleDelete(id) {
    if (!window.confirm('Confirmer suppression ?')) return;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      .then(r => {
        if (!r.ok) throw new Error('Erreur suppression');
        fetchCategories();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  // Fonction récursive protégée contre les boucles pour afficher le chemin complet
  function getFullPath(cat, visited = new Set()) {
    if (visited.has(cat.id)) return '[boucle détectée]';
    visited.add(cat.id);

    const parent = categories.find(c => c.id === cat.parent?.id);
    if (!parent) return cat.name;
    return getFullPath(parent, visited) + ' > ' + cat.name;
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>Admin catégories</h1>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: 30, border: '1px solid #ccc', padding: 15, borderRadius: 8 }}
      >
        <h2>{editing ? 'Modifier une catégorie' : 'Créer une catégorie'}</h2>

        <div>
          <label>
            Nom<br />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div>
          <label>
            Catégorie parente<br />
            <select
              name="parentId"
              value={form.parentId ?? ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              <option value="">-- Aucune --</option>
              {categories
                .filter(cat => !editing || cat.id !== form.id) // exclure soi-même
                .map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {getFullPath(cat)}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? 'Chargement...' : editing ? 'Modifier' : 'Créer'}
        </button>

        {editing && (
          <button
            type="button"
            onClick={() => {
              setForm(initialFormState);
              setEditing(false);
              setError(null);
            }}
            style={{ marginLeft: 10 }}
          >
            Annuler
          </button>
        )}
      </form>

      <h2>Liste des catégories</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Chemin complet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Aucune catégorie
              </td>
            </tr>
          ) : (
            categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{getFullPath(cat)}</td>
                <td>
                  <button onClick={() => startEdit(cat)}>Modifier</button>{' '}
                  <button onClick={() => handleDelete(cat.id)} style={{ color: 'red' }}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
