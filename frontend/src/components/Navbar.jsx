import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const styles = {
    frameTop: {
      backgroundColor: '#FFB5B0', // Rose saumon
      height: '4px',
      width: '100%',
    },
    wrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'white',
      color: 'black', // Rose clair
      fontFamily: 'Poppins, sans-serif',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 1000,
    },
    logo: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#FFB0CD', // Rose clair
      textShadow: '0 0 10px rgba(255, 176, 205, 0.4)',
    },
    navLinks: {
      listStyle: 'none',
      display: open ? 'flex' : 'none',
      flexDirection: 'column',
      gap: '1rem',
      marginTop: '1rem',
      width: '100%',
      paddingLeft: 0,
    },
    navLinksDesktop: {
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      margin: 0,
      padding: 0,
    },
    link: {
      textDecoration: 'none',
      color: 'black', // Bleu clair
      fontWeight: 'bold',
      fontSize: '1rem',
      transition: 'color 0.3s',
    },
    burger: {
      fontSize: '2rem',
      cursor: 'pointer',
      color: '#FFFDB0', // Jaune pastel
    },
    burgerWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
    },
    adminSelect: {
      background: '#111',
      color: '#B0FFC2', // Vert clair
      fontWeight: 'bold',
      fontSize: '1rem',
      border: '1px solid #B0FFC2',
      borderRadius: '6px',
      padding: '0.3rem 0.6rem',
      fontFamily: 'Poppins, sans-serif',
      cursor: 'pointer',
    },
    logoutButton: {
      background: 'transparent',
      border: 'none',
      color: '#E8B0FF', // Violet clair
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  };


  const buttonStyle = {
    background: 'rgb(136, 14, 79)',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  };
  const CartLink = (
    <li>
      <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', color: '#ffb6c1' }}>
        🛍️
        {totalItems > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#ff69b4',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}>
            {totalItems}
          </span>
        )}
      </Link>
    </li>
  );

  const adminMenu = (
    <li>
      <select
        onChange={(e) => e.target.value && navigate(e.target.value)}
        defaultValue=""
        style={styles.adminSelect}
      >
        <option value="" disabled>Admin Menu</option>
        <option value="/admin/produits">Produits</option>
        <option value="/admin/categories">Catégories</option>
        <option value="/admin/utilisateurs">Utilisateurs</option>
        <option value="/admin/commandes">Commandes</option>
      </select>
    </li>
  );




  const authLinks = !user ? (
    <>
      <li><Link to="/login" style={styles.link}>Connexion</Link></li>
      <li><Link to="/register" style={styles.link}>Inscription</Link></li>

    </>
  ) : (
    <>
      <li>👤 {user.prenom}</li>
      <li>
        <button onClick={logout} style={styles.logoutButton}>🔓 Déconnexion</button>

      </li>
    </>
  );

  return (
    <>
      <div style={styles.frameTop}></div>
      <div style={styles.wrapper}>
        <Link to="/" style={styles.link}>
          <h1 style={styles.logo}>Stitch & Dreams</h1>
        </Link>

        {isMobile ? (
          <>
            <div style={styles.burgerWrapper}>
              <span style={styles.burger} onClick={() => setOpen(!open)}>☰</span>
            </div>
            {open && (
              <ul style={styles.navLinks}>
                <li><Link to="/" style={styles.link}>Accueil</Link></li>
                {CartLink}
                {user?.roles?.includes('ROLE_ADMIN') && adminMenu}
                {authLinks}
              </ul>
            )}
          </>
        ) : (
          <ul style={styles.navLinksDesktop}>
            <li><Link to="/" style={styles.link}>Accueil</Link></li>
            <li><Link to="/orders" style={styles.link}>Mes commandes</Link></li>
            {CartLink}
            {user?.roles?.includes('ROLE_ADMIN') && adminMenu}
            {authLinks}
          </ul>
        )}
      </div>
    </>
  );
};

export default Navbar;