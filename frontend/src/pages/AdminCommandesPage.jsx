import React, { useEffect, useState } from 'react';

const AdminCommandesPage = () => {
  const [commandes, setCommandes] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState('');

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/commandes');
      const data = await response.json();
      setCommandes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommandeDetail = async (id) => {
    try {
      const response = await fetch(`/api/admin/commandes/${id}`);
      const data = await response.json();
      setSelectedCommande(data);
      setEditingStatus(data.status);
    } catch (error) {
      console.error('Erreur lors du chargement du détail de la commande', error);
    }
  };

  const updateStatus = async () => {
    try {
      await fetch(`/api/admin/commandes/${selectedCommande.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedCommande, status: editingStatus }),
      });
      await fetchCommandes();
      setSelectedCommande(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
    }
  };

  const deleteCommande = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await fetch(`/api/admin/commandes/${id}`, { method: 'DELETE' });
      await fetchCommandes();
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1rem' }}>📦 Gestion des commandes</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'darkgrey' }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Date</th>
              <th style={cellStyle}>Total</th>
              <th style={cellStyle}>Statut</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((c) => (
              <tr key={c.id}>
                <td style={cellStyle}>{c.id}</td>
                <td style={cellStyle}>{c.utilisateur?.email || '—'}</td>
                <td style={cellStyle}>{new Date(c.createdAt).toLocaleString()}</td>
                <td style={cellStyle}>{Number(c.total).toFixed(2)} €</td>
                <td style={cellStyle}>{c.status}</td>
                <td style={cellStyle}>
                  <button onClick={() => fetchCommandeDetail(c.id)}>Détail</button>{' '}
                  <button onClick={() => deleteCommande(c.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedCommande && (
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Commande #{selectedCommande.id}</h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={labelStyle}>Email :</td>
                <td style={cellStyle}>{selectedCommande.utilisateur?.email || '—'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Adresse :</td>
                <td style={cellStyle}>{selectedCommande.shippingAddress || '—'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Livraison :</td>
                <td style={cellStyle}>{Number(selectedCommande.shippingCost).toFixed(2)} €</td>
              </tr>
              <tr>
                <td style={labelStyle}>Total :</td>
                <td style={cellStyle}>{Number(selectedCommande.total).toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: '1rem' }}>🛍 Produits</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'darkgrey' }}>
                <th style={cellStyle}>Produit</th>
                <th style={cellStyle}>Quantité</th>
                <th style={cellStyle}>Prix unitaire</th>
                <th style={cellStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedCommande.commandeProduits.map((p) => (
                <tr key={p.id}>
                  <td style={cellStyle}>{p.produit?.nom || 'Produit supprimé'}</td>
                  <td style={cellStyle}>{p.quantite}</td>
                  <td style={cellStyle}>{Number(p.prixUnitaire).toFixed(2)} €</td>
                  <td style={cellStyle}>{(p.quantite * p.prixUnitaire).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <label>
              Modifier le statut :
              <select
                value={editingStatus}
                onChange={(e) => setEditingStatus(e.target.value)}
                style={{ marginLeft: '1rem' }}
              >
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="expédiée">Expédiée</option>
                <option value="livrée">Livrée</option>
                <option value="annulée">Annulée</option>
              </select>
            </label>
            <button style={{ marginLeft: '1rem' }} onClick={updateStatus}>
              Enregistrer
            </button>
            <button style={{ marginLeft: '1rem' }} onClick={() => setSelectedCommande(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const cellStyle = {
  padding: '8px',
  border: '1px solid #ccc',
  textAlign: 'left',
};

const labelStyle = {
  ...cellStyle,
  fontWeight: 'bold',
  backgroundColor: 'grey',
};

export default AdminCommandesPage;

