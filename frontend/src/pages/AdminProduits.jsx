import React, { useEffect, useState } from 'react';

const AdminProduits = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nom: '',
    prix: '',
    description: '',
    image: '',
    images: [], // images supplémentaires
    categorieId: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduits();
    fetchCategories();
  }, []);

  const fetchProduits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/produits/');
      if (!res.ok) throw new Error('Erreur de chargement des produits');
      const data = await res.json();
      setProduits(data);
    } catch (err) {
      console.error('Erreur API produits:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Erreur de chargement des catégories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Erreur API catégories:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur upload');

      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        alert('Erreur pendant l’upload');
      }
    } catch (err) {
      console.error('Erreur upload image:', err);
      alert("Échec de l'upload.");
    }
  };

  const handleMultipleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!editingId) {
      alert('Créez d’abord le produit avant d’ajouter des images supplémentaires.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images[]', files[i]);
    }

    try {
      const res = await fetch(`/api/admin/produits/${editingId}/images`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.added) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...data.added],
        }));
        fetchProduits(); // pour recharger les produits avec nouvelles images
      } else {
        alert("Erreur pendant l'ajout des images");
      }
    } catch (err) {
      console.error('Erreur upload multiple:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(form.prix) || form.prix === '') {
      alert('Le prix doit être un nombre');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `/api/admin/produits/${editingId}`
      : '/api/admin/produits/create';

    const payload = {
      ...form,
      images: undefined, // Ne pas envoyer le tableau images ici
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Échec de la soumission');

      const data = await res.json();
      const newId = data.id || editingId;

      setForm({
        nom: '',
        prix: '',
        description: '',
        image: '',
        images: [],
        categorieId: '',
      });
      setEditingId(null);
      fetchProduits();
    } catch (err) {
      console.error('Erreur soumission:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        const res = await fetch(`/api/admin/produits/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur suppression');
        fetchProduits();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (prod) => {
    setForm({
      nom: prod.nom || '',
      prix: prod.prix || '',
      description: prod.description || '',
      image: prod.image || '',
      images: prod.images || [],
      categorieId: prod.categorie?.id || '',
    });
    setEditingId(prod.id);
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Supprimer cette image ?')) return;

    try {
      const res = await fetch(`/api/admin/product-images/${imageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Suppression échouée');

      // Mise à jour locale
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));

      // Recharge tous les produits (si tu veux refléter ailleurs aussi)
      fetchProduits();
    } catch (err) {
      console.error('Erreur suppression image :', err);
      alert('Erreur lors de la suppression.');
    }
  };


  const sousCategories = categories.flatMap((cat) => cat.sousCategories || []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#000', color: '#FFC660' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>Admin Produits</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Prix"
          value={form.prix}
          onChange={(e) => setForm({ ...form, prix: e.target.value })}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          style={{ ...styles.input, height: '80px' }}
        />
        <select
          value={form.categorieId}
          onChange={(e) => setForm({ ...form, categorieId: e.target.value })}
          required
          style={styles.input}
        >
          <option value="">-- Choisir une catégorie ou sous-catégorie --</option>
          {categories.map((cat) => (
            <optgroup key={cat.id} label={cat.nom}>
              <option value={cat.id}>{cat.nom}</option>
              {(cat.sousCategories || []).map((sous) => (
                <option key={sous.id} value={sous.id}>
                  └ {sous.nom}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <label>Image principale :</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={styles.input}
        />
        {form.image && (
          <img
            src={form.image}
            alt="Aperçu"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              display: 'block',
              margin: '1rem auto',
            }}
          />
        )}

        <label>Images supplémentaires :</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultipleImageUpload}
          style={styles.input}
        />
        {form.images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={img.path || img} // img.path si c'est un objet, img si c'est juste une string
                  alt={`supp-${i}`}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                {img.id && (
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}


        <button type="submit" style={styles.button}>
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Chargement...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Description</th>
              <th>Catégorie</th>
              <th>Image</th>
              <th>Galerie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nom}</td>
                <td>{prod.prix}</td>
                <td>{prod.description}</td>
                <td>
                  {prod.categorie?.parent
                    ? `${prod.categorie.parent.nom} > ${prod.categorie.nom}`
                    : prod.categorie?.nom || '—'}
                </td>
                <td>
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.nom}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {prod.images?.length > 0
                    ? prod.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.path}
                        alt={`img-${i}`}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '4px' }}
                      />
                    ))
                    : '—'}
                </td>

                <td>
                  <button onClick={() => handleEdit(prod)} style={styles.action}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(prod.id)} style={styles.action}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  input: {
    display: 'block',
    margin: '0.7rem auto',
    padding: '0.8rem',
    width: '90%',
    borderRadius: '10px',
    border: '1px solid #FFC660',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'Poppins, sans-serif',
  },
  button: {
    backgroundColor: '#FFC660',
    color: '#000',
    padding: '0.8rem 1.5rem',
    border: '2px solid #FFC660',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'block',
    margin: '1.2rem auto',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#111',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    border: '1px solid #FFC660',
  },
  action: {
    marginRight: '0.6rem',
    background: 'none',
    border: 'none',
    color: '#FFC660',
    cursor: 'pointer',
    fontSize: '1.3rem',
    transition: 'color 0.3s ease',
  },
};

export default AdminProduits;