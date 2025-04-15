    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import styles from './UserMaintenance.module.css';
    import { useNavigate } from 'react-router-dom';
    import Swal from "sweetalert2";
    import { FaUpload } from "react-icons/fa";

    const UserMaintenance = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState({
        names: '',
        surnames: '',
        identification: '',
        status: '',
    });
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

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

        let newStatus;
            if (currentStatus === 'activo') {
            newStatus = 'inactivo';
            } else {
            newStatus = 'activo'; 
            }


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
                    ...(search.status && { state: search.status})
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
    const handleFileUpload = async () => {
        if (!file) {
            Swal.fire({
            icon: 'warning',
            title: 'Sin archivo seleccionado',
            text: 'Por favor seleccioná un archivo para continuar.',
            });
            return;
        }
    
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post(
            'http://localhost:3010/usuarios/uploadExcel',
            formData,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                },
            }
        );
    
        const { message, errores } = response.data;
    
        Swal.fire({
            icon: errores.length === 0 ? 'success' : 'warning',
            title: 'Carga finalizada',
            html: `
                <p><strong>${message}</strong></p>
                ${errores.length > 0 ? `<p>Errores encontrados:</p><ul style="text-align:left">${errores.map(e => `<li>${e}</li>`).join('')}</ul>` : ''}
            `,
            width: 600,
            confirmButtonText: 'Aceptar',
        });
    
          fetchUsers(); // actualiza la lista
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            Swal.fire({
            icon: 'error',
            title: 'Error al cargar el archivo',
            text: 'Hubo un problema al procesar el archivo. Intentalo de nuevo.',
        });
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
            <option value="bloqueado">Bloqueado</option>
        </select>
        <button className={styles.button} onClick={handleSearch}>
            Buscar
        </button>
        </div>

        
        
        <div className={styles.uploadRow}>
        <input
            type="file"
            accept=".xlsx, .csv"
            onChange={(e) => setFile(e.target.files[0])}
            id="fileUpload"
            className={styles.fileInput}
        />
        <button className={styles.button} onClick={handleFileUpload}>
        <FaUpload style={{ marginRight: '0.5rem' }} />
            Subir Archivo
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
                        onClick={() => navigate(`/user-edit/${user.person?.idPerson}`)}
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
