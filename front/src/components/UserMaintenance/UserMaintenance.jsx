    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import styles from './UserMaintenance.module.css';

    const UserMaintenance = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState({
        names: '',
        surnames: '',
        identification: '',
        status: '',
    });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.get('http://localhost:3010/usuarios/admin', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setUsers(response.data)
            } catch (error) {
            console.error('Error al obtener usuarios:', error);
            }
    };

    const toggleStatus = async (idUser, currentStatus) => {
        try {
        const token = localStorage.getItem('token'); 

        const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';

        const response =  await axios.patch(`http://localhost:3010/usuarios/${idUser}`,{status: newStatus},{
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
        console.log("Responde de toggle Status User", response)
        fetchUsers();
        } catch (error) {
        console.error('Error al cambiar estado:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
        
            // Si no hay ningún filtro, traemos todos los usuarios
            if (!search || Object.values(search).every(value => !value)) {
                fetchUsers();
                return;
                }
            
                const response = await axios.get('http://localhost:3010/usuarios/search', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    ...(search.names && { names: search.names }),
                    ...(search.surnames && { surnames: search.surnames }),
                    ...(search.identification && { identification: search.identification }),
                    ...(search.status && { state: search.status === 'activo' })
                },
                });
            
                console.log("Responde de handleSearch User", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Error al buscar:', error);
            }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

        const updatePerson = async (idPerson, updatedData) => {
            try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3010/personas/admin/${idPerson}`, updatedData, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            console.log("Persona actualizada:", response.data);
            } catch (error) {
            console.error("Error al actualizar persona:", error);
            }
        };

    return (
        <div className={styles.container}>
        <h2 className={styles.title}>Mantenimiento de Usuarios</h2>

        <div className={styles.searchBar}>
        <input
            type="text"
            placeholder="Nombre"
            className={styles.searchInput}
            value={search.names}
            onChange={(e) => setSearch({ ...search, names: e.target.value })}
        />
        <input
            type="text"
            placeholder="Apellido"
            className={styles.searchInput}
            value={search.surnames}
            onChange={(e) => setSearch({ ...search, surnames: e.target.value })}
        />
        <input
            type="text"
            placeholder="Identificación"
            className={styles.searchInput}
            value={search.identification}
            onChange={(e) => setSearch({ ...search, identification: e.target.value })}
        />
        <select
            className={styles.searchInput}
            value={search.status}
            onChange={(e) => setSearch({ ...search, status: e.target.value })}
        >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
        </select>
        <button className={styles.button} onClick={handleSearch}>
            Buscar
        </button>
        </div>


        <table className={styles.table}>
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Identificación</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => {
                {/* const userRole = user.rolesUsers?.[0]?.rol?.name || 'Sin rol';
                const isAdmin = userRole.toLowerCase() === 'administrador'; */}
                const isAdmin = user.rolesUsers?.[0]?.rol?.rolName === 'Administrador'
                return (
                    <tr key={user.idUser || user.idPerson}>
                    <td>{user.person?.names}</td>
                    <td>{user.person?.surnames}</td>
                    <td>{user.email}</td>
                    <td>{user.person?.identification}</td>
                    <td>{user.status}</td>
                    <td>{user.rolesUsers?.[0]?.rol?.rolName || 'Sin rol'}</td>
                    <td>
                    {!isAdmin && (
                        <>
                        <button
                        className={styles.button}
                        onClick={() => toggleStatus(user.idUser, user.status)}
                        >
                        {user.status === 'activo' ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                        className={`${styles.button} ${styles.editButton}`}
                        onClick={() => updatePerson(user.id)}
                        >
                        Editar
                        </button>
                        </>
                    )}
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    );
    };

    export default UserMaintenance;
