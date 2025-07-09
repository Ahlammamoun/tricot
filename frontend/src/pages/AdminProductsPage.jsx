import React, { useEffect, useState } from 'react';

const initialFormState = {
  id: null,
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  mainCategoryId: null,
  subCategoryId: null,
  subSubCategoryId: null,
  images: [],
  removedImages: [],
  newImages: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  function fetchProducts() {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setError('Erreur chargement produits'));
  }

  function fetchCategories() {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => setError('Erreur chargement catégories'));
  }

  const getChildren = (parentId) =>
    categories.filter(cat => cat.parent === parentId || cat.parent_id === parentId);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleCategoryLevelChange(e) {
    const { name, value } = e.target;
    const val = value === '' ? null : parseInt(value, 10);

    setForm(f => {
      const updated = { ...f, [name]: val };
      if (name === 'mainCategoryId') {
        updated.subCategoryId = null;
        updated.subSubCategoryId = null;
      } else if (name === 'subCategoryId') {
        updated.subSubCategoryId = null;
      }
      return updated;
    });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setForm(f => ({ ...f, newImages: [...f.newImages, ...files] }));
  }

  function removeExistingImage(path) {
    setForm(f => ({
      ...f,
      images: f.images.filter(img => img !== path),
      removedImages: [...f.removedImages, path],
    }));
  }

  function removeNewImage(index) {
    setForm(f => {
      const newImgs = [...f.newImages];
      newImgs.splice(index, 1);
      return { ...f, newImages: newImgs };
    });
  }

  function startEdit(p) {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      mainCategoryId: p.mainCategory?.id ?? null,
      subCategoryId: p.subCategory?.id ?? null,
      subSubCategoryId: p.subSubCategory?.id ?? null,
      images: p.images || [],
      removedImages: [],
      newImages: [],
    });
    setEditing(true);
    setError(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('mainCategoryId', form.mainCategoryId ?? '');
    formData.append('subCategoryId', form.subCategoryId ?? '');
    formData.append('subSubCategoryId', form.subSubCategoryId ?? '');
    form.removedImages.forEach(path => formData.append('removedImages[]', path));
    form.newImages.forEach(file => formData.append('images[]', file));

    if (editing) formData.append('_method', 'PUT');

    const url = editing ? `/api/admin/products/${form.id}` : '/api/admin/products';

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(r => {
        if (!r.ok) throw new Error('Erreur lors de la sauvegarde');
        return r.json();
      })
      .then(() => {
        fetchProducts();
        setForm(initialFormState);
        setEditing(false);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function handleDelete(id) {
    if (!window.confirm('Confirmer suppression ?')) return;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      .then(r => {
        if (!r.ok) throw new Error('Erreur suppression');
        fetchProducts();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const selectStyle = {
    width: '100%',
    padding: '8px 10px',
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginBottom: 10,
  };

  return (
    <div style={{ maxWidth: 960, margin: 'auto', padding: 20 }}>
      <h1>Admin produits</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
        <h2>{editing ? 'Modifier un produit' : 'Créer un produit'}</h2>

        <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" required style={selectStyle} />
        <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" required style={selectStyle} />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" style={selectStyle} />
        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Prix" required style={selectStyle} />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required style={selectStyle} />

        <label>Catégorie principale</label>
        <select name="mainCategoryId" value={form.mainCategoryId ?? ''} onChange={handleCategoryLevelChange} style={selectStyle}>
          <option value="">-- Choisir --</option>
          {getChildren(null).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <label>Sous-catégorie</label>
        <select name="subCategoryId" value={form.subCategoryId ?? ''} onChange={handleCategoryLevelChange} style={selectStyle} disabled={!form.mainCategoryId}>
          <option value="">-- Choisir --</option>
          {getChildren(form.mainCategoryId).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <label>Sous-sous-catégorie</label>
        <select name="subSubCategoryId" value={form.subSubCategoryId ?? ''} onChange={handleCategoryLevelChange} style={selectStyle} disabled={!form.subCategoryId}>
          <option value="">-- Choisir --</option>
          {getChildren(form.subCategoryId).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input type="file" multiple onChange={handleFileChange} style={{ marginTop: 10 }} />

        <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
          {loading ? 'Chargement...' : editing ? 'Modifier' : 'Créer'}
        </button>
        {editing && <button type="button" onClick={() => { setForm(initialFormState); setEditing(false); }}>Annuler</button>}
      </form>

      <h2>Liste des produits</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th><th>Nom</th><th>Catégories</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>
                {[p.mainCategory?.name, p.subCategory?.name, p.subSubCategory?.name]
                  .filter(Boolean)
                  .join(' > ') || '-'}
              </td>
              <td>
                <button onClick={() => startEdit(p)}>Modifier</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
