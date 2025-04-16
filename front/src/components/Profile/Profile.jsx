import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Profile.module.css';
import Swal from "sweetalert2";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('id');

                const userRes = await axios.get(`http://localhost:3010/usuarios/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setUser(userRes.data);
            } catch (error) {
                console.error('Error al cargar datos del usuario:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los datos.',
                });
            }
        };

        fetchUser();
    }, [navigate]);

    if (!user) return <div>Cargando...</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Mi Perfil</h2>
            <div className={styles.profileContainer}>
                <div className={styles.profileItem}>
                    <strong>Nombre:</strong> {user.person.names} {user.person.surnames}
                </div>
                
                <div className={styles.profileItem}>
                    <strong>Identificación:</strong> {user.person.identification}
                </div>
                <div className={styles.profileItem}>
                    <strong>Fecha de nacimiento:</strong> {user.person.dateBirth}
                </div>
                
                <button className={styles.button} onClick={() => navigate(`/editar-perfil/${user.person.idPerson}`)}>
                    Editar
                </button>
            </div>
        </div>
    );
};

export default Profile;
