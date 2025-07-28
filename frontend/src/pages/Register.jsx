import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setMessage("Les mots de passe ne correspondent pas");
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nom: form.nom,
          prenom: form.prenom,
          // Tu peux aussi envoyer le nom complet si le backend le gère
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        return setMessage(err.error || 'Erreur lors de l’inscription');
      }

      setMessage('✅ Inscription réussie ! Vous pouvez vous connecter.');
      setForm({ nom: '', prenom: '', email: '', password: '', confirmPassword: '' });
      // TODO 'redirection vers le formulaire login'
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);


    } catch (err) {
      setMessage('❌ Erreur serveur.');
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Inscription</h2>
        {message && <p style={{ color: '#e37b26', textAlign: 'center' }}>{message}</p>}
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

// Styles comme avant
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
    boxShadow: '0 0 20px rgba(255, 105, 180, 0.3)',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #FFC660 ',
  },

  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#FFC660 ',
    fontFamily: 'Playfair Display, serif',
    fontSize: '2rem',
    textShadow: '0 0 10px rgba(255, 105, 180, 0.3)',
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
    border: '1px solid #FFC660',
    fontSize: '1rem',
    backgroundColor: '#000',
    color: '#fff',
    outline: 'none',
    transition: 'border 0.3s ease-in-out',
  },

  button: {
    width: '100%',
    backgroundColor: '#FFC660 ',
    color: '#000',
    padding: '0.9rem',
    borderRadius: '12px',
    fontWeight: 'bold',
    border: '2px solid #fff',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease-in-out',
  },
};

export default Register;