import React, { useEffect, useState } from 'react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [mainCatName, setMainCatName] = useState('');
  const [subCatForm, setSubCatForm] = useState({ nom: '', parentId: '' });
  const [editForm, setEditForm] = useState({ id: '', nom: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      console.log('✅ Catégories reçues :', data);
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMainCategory = async (e) => {
    e.preventDefault();
    if (!mainCatName.trim()) return;
    try {
      await fetch('/api/admin/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: mainCatName }),
      });
      setMainCatName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    const { nom, parentId } = subCatForm;
    if (!nom || !parentId) return;
    try {
      await fetch('/api/admin/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, parentId }),
      });
      setSubCatForm({ nom: '', parentId: '' });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const { id, nom } = editForm;
    if (!id || !nom.trim()) return;
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom }),
      });
      setEditForm({ id: '', nom: '' });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const getSousCategories = (parentId) =>
    categories.filter((c) => c.parent?.id === parentId);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#000', color: '#ff69b4' }}>
      <h2 style={{ textAlign: 'center' }}>Gestion des Catégories</h2>

      {/* Ajouter une catégorie principale */}
      <form onSubmit={handleAddMainCategory} style={{ marginBottom: '2rem' }}>
        <h3>Ajouter une catégorie principale</h3>
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={mainCatName}
          onChange={(e) => setMainCatName(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>+ Ajouter</button>
      </form>

      {/* Ajouter une sous-catégorie */}
      <form onSubmit={handleAddSubCategory} style={{ marginBottom: '2rem' }}>
        <h3>Ajouter une sous-catégorie</h3>
        <input
          type="text"
          placeholder="Nom de la sous-catégorie"
          value={subCatForm.nom}
          onChange={(e) => setSubCatForm({ ...subCatForm, nom: e.target.value })}
          required
          style={styles.input}
        />
        <select
          value={subCatForm.parentId}
          onChange={(e) => setSubCatForm({ ...subCatForm, parentId: e.target.value })}
          required
          style={styles.input}
        >
          <option value="">-- Sélectionner une catégorie principale --</option>
          {categories.filter((c) => !c.parent).map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        <button type="submit" style={styles.button}>+ Ajouter</button>
      </form>

      {/* Modifier une catégorie */}
      <form onSubmit={handleUpdateCategory} style={{ marginBottom: '2rem' }}>
        <h3>Modifier une catégorie existante</h3>
        <select
          value={editForm.id}
          onChange={(e) => {
            const selected = categories.find((c) => c.id === parseInt(e.target.value));
            setEditForm({
              id: e.target.value,
              nom: selected?.nom || '',
            });
          }}
          required
          style={styles.input}
        >
          <option value="">-- Sélectionner une catégorie --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nouveau nom"
          value={editForm.nom}
          onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>💾 Modifier</button>
      </form>

      {/* Affichage arborescence */}
      <h3>Catégories existantes</h3>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {categories
            .filter((cat) => !cat.parent)
            .map((cat) => (
              <li key={cat.id} style={{ marginBottom: '1.5rem' }}>
                <strong>{cat.nom}</strong>
                <button onClick={() => handleDelete(cat.id)} style={styles.action}>🗑️</button>
                {getSousCategories(cat.id).length > 0 && (
                  <ul style={{ paddingLeft: '1rem' }}>
                    {getSousCategories(cat.id).map((sub) => (
                      <li key={sub.id}>
                        ↳ {sub.nom}
                        <button onClick={() => handleDelete(sub.id)} style={styles.action}>🗑️</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  input: {
    display: 'block',
    margin: '0.6rem auto',
    padding: '0.7rem',
    width: '90%',
    borderRadius: '10px',
    border: '1px solid #ff69b4',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'Poppins, sans-serif',
  },
  button: {
    backgroundColor: '#ff69b4',
    color: '#000',
    padding: '0.8rem 1.5rem',
    border: '2px solid #ff69b4',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'block',
    margin: '1.2rem auto',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out',
  },
  action: {
    marginLeft: '0.6rem',
    background: 'none',
    border: 'none',
    color: '#ff69b4',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif',
    transition: 'color 0.3s ease',
  },
};


export default AdminCategories;