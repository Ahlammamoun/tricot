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
    paymentLogos: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '1.5rem',
      flexWrap: 'wrap',
    },
    paymentIcon: {
      height: '30px',
      objectFit: 'contain',
      opacity: 0.8,
      transition: 'transform 0.2s ease',
    },

  };


  return (
    <>
      <div style={styles.footer}>
     <div style={styles.paymentLogos}>
          <img src="/images/paiements/visa.png" alt="Visa" style={styles.paymentIcon} />
          <img src="/images/paiements/mastercard.png" alt="Mastercard" style={styles.paymentIcon} />
          <img src="/images/paiements/paypal.png" alt="PayPal" style={styles.paymentIcon} />
        </div>
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
   


            <p>&copy; 2025 <strong style={{ color: '#d14350' }}>Stitch & Dreams</strong>. Tous droits réservés.</p>
      </div>

          
      <div style={styles.frameBottom}></div>

      
    </>
  );
};

export default Footer;