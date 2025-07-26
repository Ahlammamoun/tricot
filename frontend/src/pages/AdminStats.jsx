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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Tableau de bord administrateur</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Métrique</th>
              <th style={styles.headerCell}>Valeur</th>
            </tr>
          </thead>
          <tbody>
            <StatRow label="Produits en catalogue" value={stats.produits} />
            <StatRow label="Commandes passées" value={stats.commandes} />
            <StatRow label="Utilisateurs inscrits" value={stats.utilisateurs} />
            <StatRow label="Utilisateurs actifs (30j)" value={stats.utilisateursRecents} />
            <StatRow label="Avis clients" value={stats.avis} />
            <StatRow label="Total des ventes (€)" value={stats.totalVentes.toFixed(2)} />
            <StatRow label="Quantité totale vendue" value={stats.quantiteTotaleVendue} />
            <StatRow label="Stock total disponible" value={stats.stockTotal} />
            <StatRow label="Produit le plus vendu" value={stats.produitPlusVendu || "N/A"} />
            <StatRow label="Qté du plus vendu" value={stats.quantitePlusVendue} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatRow = ({ label, value }) => (
  <tr style={styles.row}>
    <td style={styles.cell}>{label}</td>
    <td style={styles.cellValue}>{value}</td>
  </tr>
);

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: 'black',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#FFC660',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  headerRow: {
    backgroundColor: '#ffc660',
    color: '#222',
  },
  headerCell: {
    padding: '1rem',
    fontWeight: 'bold',
    fontSize: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  row: {
    borderBottom: '1px solid #eee',
  },
  cell: {
    padding: '1rem',
    fontSize: '1rem',
    color: '#333',
  },
  cellValue: {
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#d14350',
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
