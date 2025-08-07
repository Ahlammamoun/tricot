import React, { useEffect, useState } from 'react';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur de chargement des statistiques:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.loading}>Chargement des statistiques...</p>;
  if (!stats) return <p style={styles.error}>Aucune statistique disponible.</p>;

  const data = [
    { label: "Produits en catalogue", value: stats.produits },
    { label: "Commandes passées", value: stats.commandes },
    { label: "Utilisateurs inscrits", value: stats.utilisateurs },
    { label: "Utilisateurs actifs (30j)", value: stats.utilisateursRecents },
    { label: "Avis clients", value: stats.avis },
    { label: "Total des ventes (€)", value: stats.totalVentes.toFixed(2) },
    { label: "Quantité totale vendue", value: stats.quantiteTotaleVendue },
    { label: "Stock total disponible", value: stats.stockTotal },
    { label: "Produit le plus vendu", value: stats.produitPlusVendu || "N/A" },
    { label: "Qté du plus vendu", value: stats.quantitePlusVendue },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Tableau de bord administrateur</h2>
      <div style={styles.statsContainer}>
        {data.map((item, index) => (
          <div key={index} style={styles.statItem}>
            <div style={styles.label}>{item.label}</div>
            <div style={styles.value}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#000',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#FFC660',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#444',
  },
  value: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#D14350',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '2rem',
  },
  error: {
    textAlign: 'center',
    color: '#c00',
    fontSize: '1.2rem',
    padding: '2rem',
  },
};

export default AdminStats;
