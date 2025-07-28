import { useState } from 'react';

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
    border: '1px solid #FFC660',
  },

  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#FFC660',
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
    backgroundColor: '#FFC660',
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

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.success);
        setFormData({ nom: '', email: '', sujet: '', message: '' });
      } else {
        setError(result.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError("Une erreur s'est produite");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Contactez-nous</h2>

        {success && <p style={{ color: '#4caf50', textAlign: 'center' }}>{success}</p>}
        {error && <p style={{ color: '#f44336', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="nom"
            placeholder="Votre nom"
            value={formData.nom}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="sujet"
            placeholder="Sujet"
            value={formData.sujet}
            onChange={handleChange}
            style={styles.input}
          />
          <textarea
            name="message"
            placeholder="Votre message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            style={{ ...styles.input, resize: 'none' }}
            required
          />
          <button type="submit" style={styles.button}>Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

