import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ajuste le chemin si besoin


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const { login } = useAuth(); // ✅ Utilisation du context
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Échec de la connexion');
      }

      const data = await res.json();
      login(data.token); // ✅ Mise à jour du contexte avec le token
      // alert('Connexion réussie !');
      navigate('/'); // ✅ Redirection après connexion
    } catch (err) {
      console.error(err);
      setErreur('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Connexion</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Se connecter</button>
          <button
            type="button"
            onClick={() => window.location.href = "/register"}
            style={styles.buttonRgister }
          >
            S'inscrire
          </button>
          {erreur && <p style={{ color: 'red', marginTop: '1rem' }}>{erreur}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    background: '#FAFAFA',
    padding: '2rem',
  },
  formBox: {
    backgroundColor: '#111',
    padding: '2.5rem',
    borderRadius: '20px',
    boxShadow: '0 0 30px rgba(255, 105, 180, 0.2)',
    width: '100%',
    maxWidth: '400px',
    border: '2px solid #d14350 ',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#d14350 ',
    fontFamily: 'Playfair Display, serif',
    fontSize: '2rem',
    textShadow: '0 0 10px rgba(255, 105, 180, 0.4)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.9rem',
    marginBottom: '1.2rem',
    borderRadius: '10px',
    border: '1px solid #d14350 ',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '1rem',
    transition: 'border 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    width: '100%',
    backgroundColor: '#d14350  ',
    color: '#000',
    padding: '0.9rem',
    borderRadius: '12px',
    fontWeight: 'bold',
    border: '2px solid #fff',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease-in-out',
  },
    buttonRgister: {
    width: '100%',
    minHeight: '5px',
    backgroundColor: '#d14350  ',
    color: '#000',
    padding: '0.9rem',
    borderRadius: '12px',
    fontWeight: 'bold',
    border: '2px solid #fff',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease-in-out',
    marginTop: '1rem',
  },
};


export default Login;