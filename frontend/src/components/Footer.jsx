// src/components/Footer.jsx
import React from 'react';

const styles = {
  footer: {
    marginTop: 'auto',
    padding: '1rem',
    backgroundColor: '#E8B0FF',
    color: '#333',
    fontWeight: 'bold',
  },
};

const Footer = () => (
  <footer style={styles.footer}>
    <p>&copy; 2025 Tricot Passion</p>
  </footer>
);

export default Footer;
