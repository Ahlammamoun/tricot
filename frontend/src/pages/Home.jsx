import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    textAlign: 'center',
    background: 'ghostwhite',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
};

const Home = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <Footer />
    </div>
  );
};

export default Home;
