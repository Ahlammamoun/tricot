import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const token = user?.token || null;

  useEffect(() => {
    if (token) {
      fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async res => {
          if (!res.ok) {
            throw new Error(`Échec auth : ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          const fullUser = { ...data, token };
          setUser(fullUser);
          localStorage.setItem('user', JSON.stringify(fullUser));
        })
        .catch(err => {
          console.error('❌ Erreur auth auto:', err);
          logout();
        });
    }
  }, [token]);


  const login = (newToken) => {
    fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    })
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Échec auth après login: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const fullUser = { ...data, token: newToken }; // ✅ ajoute le token dans l’objet user
        setUser(fullUser);
        localStorage.setItem('user', JSON.stringify(fullUser));
        console.log('✅ Login réussi :', fullUser);
      })
      .catch(err => {
        console.error('❌ Login échec:', err);
        logout();
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };


  const secureFetch = async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        // 🔒 Token expiré ou invalide
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        logout();
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('❌ Erreur dans secureFetch :', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, secureFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);