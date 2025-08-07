import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const searchRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    fetch('/api/produits')
      .then(res => res.json())
      .then(data => setProduits(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProduits([]);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredProduits(
        produits.filter(p => p.nom.toLowerCase().includes(lower)).slice(0, 5)
      );
    }
  }, [searchTerm, produits]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm('');
        setFilteredProduits([]);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const styles = {
    frameTop: {
      backgroundColor: '#FFB5B0',
      height: '4px',
      width: '100%',
    },
    wrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'white',
      color: 'black',
      fontFamily: 'Poppins, sans-serif',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 1000,
    },
    innerWrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    logo: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#d14350',
      textShadow: '0 0 10px rgba(255, 176, 205, 0.4)',
      textDecoration: 'none',
      flex: '0 0 auto',
    },
    centerSearch: {
      flex: '1 1 auto',
      display: 'flex',
      justifyContent: 'center',
    },
    navSection: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    navLinks: {
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      margin: 0,
      padding: 0,
    },
    link: {
      textDecoration: 'none',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '1rem',
      transition: 'color 0.3s',
    },
    burger: {
      fontSize: '2rem',
      cursor: 'pointer',
      color: '#FFC660',
    },
    burgerWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
    },
    adminSelect: {
      background: '#111',
      color: '#d14350',
      fontWeight: 'bold',
      fontSize: '1rem',
      border: '1px solid #d14350',
      borderRadius: '6px',
      padding: '0.3rem 0.6rem',
      fontFamily: 'Poppins, sans-serif',
      cursor: 'pointer',
    },
    logoutButton: {
      background: 'transparent',
      border: 'none',
      color: '#d14350',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    searchInput: {
      border: '2px dashed #FFC660',
      borderRadius: '8px',
      padding: '0.6rem 1rem',
      fontSize: '1rem',
      background: 'transparent',
      color: '#111',
      width: '300px',
      outline: 'none',
      textAlign: 'center',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    autocompleteList: {
      position: 'absolute',
      top: '110%',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '6px',
      zIndex: 1001,
      maxHeight: '200px',
      overflowY: 'auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      listStyle: 'none',
      padding: '0.5rem 0',
      margin: 0,
      minWidth: '111%',
    },
    autocompleteItem: {
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#333',
    },
    mobileMenu: {
      width: '100%',
      marginTop: '1rem',
      display: open ? 'flex' : 'none',
      flexDirection: 'column',
      gap: '1rem',
    },
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
        <option value="/admin/stats">Statistiques</option>
        <option value="/admin/contact">Message</option>
        <option value="/admin/avis">Avis</option>
        <option value="/admin/information">Information</option>
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
      <li><Link to="/orders" style={styles.link}>Mes commandes</Link></li>
      <li><button onClick={logout} style={styles.logoutButton}>🔓 Déconnexion</button></li>
    </>
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filteredProduits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault(); // indispensable pour éviter un submit
      const selected =
        activeIndex >= 0 ? filteredProduits[activeIndex] : filteredProduits[0];
      if (selected) {
        navigate(`/produit/${selected.id}`);
        setSearchTerm('');
        setFilteredProduits([]);
        setActiveIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setFilteredProduits([]);
      setActiveIndex(-1);
    }
  };


  return (
    <>
      <div style={styles.frameTop}></div>

      <div style={styles.wrapper}>
        {isMobile ? (
          <>
            <div style={styles.innerWrapper}>
              <Link to="/" style={styles.logo}>Stitch & Dreams</Link>
              <div style={{ marginLeft: 'auto' }}>
                <span style={styles.burger} onClick={() => setOpen(!open)}>☰</span>
              </div>
            </div>

            <div style={styles.centerSearch}>
              <input
                type="text"
                placeholder="Recherche"
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div style={styles.mobileMenu}>
              <Link to="/" style={styles.link}>Accueil</Link>
              {CartLink}
              {user?.roles?.includes('ROLE_ADMIN') && adminMenu}
              {authLinks}
            </div>
          </>
        ) : (
          <div style={styles.innerWrapper}>
            <Link to="/" style={styles.logo}>Stitch & Dreams</Link>

            <div style={styles.centerSearch}>
              <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>

                <input
                  type="text"
                  placeholder="Recherche"
                  style={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                />
                {searchTerm && (
                  <span
                    onClick={() => {
                      setSearchTerm('');
                      setFilteredProduits([]);
                      setActiveIndex(-1);
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#aaa',
                      fontWeight: 'bold',
                    }}
                  >
                    &times;
                  </span>
                )}
                {filteredProduits.length > 0 && (
                  <ul style={styles.autocompleteList}>
                    {filteredProduits.map((prod, index) => (
                      <li
                        key={prod.id}
                        onClick={() => {
                          navigate(`/produit/${prod.id}`);
                          setSearchTerm('');
                          setFilteredProduits([]);
                          setActiveIndex(-1);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        style={{
                          ...styles.autocompleteItem,
                          background: index === activeIndex ? '#FFC660' : 'transparent',
                          fontWeight: index === activeIndex ? 'bold' : 'normal',
                        }}
                      >
                        {prod.nom}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

            <div style={styles.navSection}>
              <ul style={styles.navLinks}>
                <li><Link to="/" style={styles.link}>Accueil</Link></li>
                {CartLink}
                {user?.roles?.includes('ROLE_ADMIN') && adminMenu}
                {authLinks}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
