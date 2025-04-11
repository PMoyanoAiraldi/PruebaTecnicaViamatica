import React, { useState, useEffect } from 'react';
import styles from './UserMaintenance.module.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserMaintenance = () => {
    const [filters, setFilters] = useState({ names: '', surnames: '', identification: '' });
    const [users, setUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const user = useSelector((state) => state.user.user);

    const isAdmin = user.rolesUsers?.some((role) => role.name === 'Administrador');

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const fetchUsers = async () => {
        if (!isAdmin) return;
        const res = await axios.get('/person/search', { params: filters });
        setUsers(res.data);
    };

    const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('/usuarios/uploadExcel', formData);
    fetchUsers();
};

    const handleUpdate = async (id) => {
    if (!editingUser) return;
    const endpoint = isAdmin ? `/person/admin/${id}` : `/person/${id}`;
    await axios.put(endpoint, editingUser);
    fetchUsers();
    setEditingUser(null);
};

    const toggleUserState = async (id, currentState) => {
    if (!isAdmin) return;
    await axios.patch(`/auth/${id}/state`, { state: !currentState });
    fetchUsers();
};

    useEffect(() => {
        if (isAdmin) fetchUsers();
    }, []);

    console.log(users)
    return (
        <div className={styles.container}>
        <h2>Mantenimiento de Usuarios</h2>

        {isAdmin && (
            <>
            <section>
                <h3>Buscar Usuarios</h3>
                <input name="names" placeholder="Nombre" onChange={handleFilterChange} />
                <input name="surnames" placeholder="Apellido" onChange={handleFilterChange} />
                <input name="identification" placeholder="DNI" onChange={handleFilterChange} />
                <button onClick={fetchUsers}>Buscar</button>
            </section>

            <section>
                <h3>Carga Masiva (Excel/CSV)</h3>
                <input type="file" accept=".xlsx,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button onClick={handleFileUpload}>Subir Archivo</button>
            </section>
            </>
        )}

        <section>
            <h3>{isAdmin ? 'Listado de Usuarios' : 'Mis Datos'}</h3>
            <table>
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Estado</th>
                {isAdmin && <th>Acciones</th>}
                </tr>
            </thead>
            <tbody>
                {(isAdmin ? users : user?.person ? [user.person] : []).map((u) => (
                <tr key={u.idPerson}>
                    <td>
                    <input
                        defaultValue={u.names}
                        onChange={(e) => setEditingUser({ ...u, names: e.target.value })}
                    />
                    </td>
                    <td>
                    <input
                        defaultValue={u.surnames}
                        onChange={(e) => setEditingUser({ ...u, surnames: e.target.value })}
                    />
                    </td>
                    <td>{u.identification}</td>
                    <td>
                    <input
                        defaultValue={u.email}
                        onChange={(e) => setEditingUser({ ...u, email: e.target.value })}
                    />
                    </td>
                    <td>{u.state ? 'Activo' : 'Inactivo'}</td>
                    <td>
                    <button onClick={() => handleUpdate(u.idPerson)}>Guardar</button>
                    {isAdmin && u.id !== users.idUser && (
                        <button onClick={() => toggleUserState(u.idPerson, u.state)}>
                        {u.state ? 'Desactivar' : 'Activar'}
                        </button>
                    )}
                    
                    </td>
                </tr>
                ))}
                {(isAdmin ? users.length === 0 : !user?.person) && (
                    <tr>
                    <td colSpan="10" className={styles.noUsers}>
                        No hay usuarios para mostrar.
                    </td>
                    </tr>
                )}
            </tbody>
            </table>
        </section>
        </div>
    );
};

export default UserMaintenance;