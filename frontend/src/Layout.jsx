import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Layout = () => {
  const styles = {
    pageWrapper: {
      background: 'white',
      borderTop: '6px solid #FF33BB',      // Rose vif
      borderBottom: '6px solid #33D1FF',   // Bleu
      borderLeft: '12px solid #FF3364',    // Rose-Rouge
      borderRight: '12px solid #33FF61',   // Vert
      minHeight: '100vh',
      color: '#FFB0CD',                    // Rose clair (texte global)
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      
    },
    content: {
      flex: 1,
      padding: '2rem',
      animation: 'fadeInBody 0.8s ease-out',
    },
  };

  return (
    <>
      <style>{`
        @keyframes fadeInBody {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::selection {
          background: #FFE933;   /* Jaune */
          color: #000;
        }

        a {
          color: #B0F1FF;       /* Bleu turquoise */
        }

        a:hover {
          color: #FF4233;       /* Rouge */
        }

        body {
          margin: 0;
        }
      `}</style>

      <div style={styles.pageWrapper}>
        <Navbar />
        <div style={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
