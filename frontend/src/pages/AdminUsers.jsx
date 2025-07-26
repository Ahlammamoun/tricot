import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ email: '', nom: '', prenom: '', password: '', roles: ['ROLE_USER'] });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        const res = await fetch('/api/utilisateurs/', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('➡️ Données reçues :', data); // 👈 Ajoute ceci
        setUsers(data);
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/utilisateurs/${editingId}` : '/api/utilisateurs';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),

        });

        if (res.ok) {
            setMessage(editingId ? 'Utilisateur modifié' : 'Utilisateur créé');
            setForm({ email: '', nom: '', prenom: '', password: '', roles: ['ROLE_USER'] });
            setEditingId(null);
            fetchUsers();
        } else {
            setMessage("Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (user) => {
        setForm({ email: user.email, nom: user.nom, prenom: user.prenom, password: '', roles: user.roles });
        setEditingId(user.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;

        const res = await fetch(`/api/utilisateurs/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            fetchUsers();
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '100%', overflowX: 'auto', backgroundColor: 'black', color: '#FFC660' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gestion des utilisateurs</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <form
                onSubmit={handleSubmit}
                style={{
                    marginBottom: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    alignItems: 'center',

                }}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ flex: '1 1 200px', minWidth: '150px', padding: '0.5rem' }}
                />
                <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    style={{ flex: '1 1 200px', minWidth: '150px', padding: '0.5rem' }}
                />
                <input
                    type="text"
                    name="prenom"
                    placeholder="Prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    style={{ flex: '1 1 200px', minWidth: '150px', padding: '0.5rem' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    required={!editingId}
                    style={{ flex: '1 1 200px', minWidth: '150px', padding: '0.5rem' }}
                />
                <select
                    name="roles"
                    onChange={(e) => setForm({ ...form, roles: [e.target.value] })}
                    value={form.roles[0]}
                    style={{ flex: '1 1 150px', padding: '0.5rem' }}
                >
                    <option value="ROLE_USER">Utilisateur</option>
                    <option value="ROLE_ADMIN">Admin</option>
                </select>
                <button
                    type="submit"
                    style={{ padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {editingId ? 'Modifier' : 'Créer'}
                </button>
            </form>

            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '400px',
                    }}
                >
                    <thead style={{ backgroundColor: '#f0f0f0' }}>
                        <tr>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Rôles</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                                <td style={{ padding: '0.5rem' }}>{u.roles.join(', ')}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <button onClick={() => handleEdit(u)} style={{ marginRight: '0.5rem' }}>
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(u.id)}>🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default AdminUsers;