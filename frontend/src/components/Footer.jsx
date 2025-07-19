import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const styles = {
    frameBottom: {
      backgroundColor: '#FFB5B0', // Rose saumon
      height: '5px',
      width: '100%',
    },
    footer: {
      textAlign: 'center',
      padding: '2rem 1rem',
      background: 'white',
      color: 'black', // Rose clair
      fontFamily: 'Poppins, sans-serif',
      fontSize: '0.9rem',
  
    },
    navLinks: {
      listStyle: 'none',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '2rem',
      margin: '1rem 0 0',
      padding: 0,
    },
    link: {
      textDecoration: 'none',
      color: 'black', // Bleu clair
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'color 0.3s, text-shadow 0.3s',
    },
  };


  return (
    <>
      <div style={styles.footer}>
        <p>&copy; 2025 <strong style={{ color: '#ff69b4' }}>Stitch & Dreams</strong>. Tous droits réservés.</p>
        <ul style={styles.navLinks}>
          <li>
            <Link to="/" style={styles.link} onMouseEnter={(e) => e.target.style.textShadow = '0 0 8px #ff69b4'} onMouseLeave={(e) => e.target.style.textShadow = 'none'}>
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/conditions" style={styles.link} onMouseEnter={(e) => e.target.style.textShadow = '0 0 8px #ff69b4'} onMouseLeave={(e) => e.target.style.textShadow = 'none'}>
              Mentions légales
            </Link>
          </li>
          <li>
            <Link to="/contact" style={styles.link} onMouseEnter={(e) => e.target.style.textShadow = '0 0 8px #ff69b4'} onMouseLeave={(e) => e.target.style.textShadow = 'none'}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div style={styles.frameBottom}></div>
    </>
  );
};

export default Footer;