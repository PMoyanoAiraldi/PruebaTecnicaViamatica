import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './WelcomeScreen.module.css';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        // Verificá que haya un id y un token antes de hacer las peticiones
        if (!id || !token) {
            console.warn("ID o token no encontrados en localStorage");
            return;
        }


        try {
            const [userRes, sessionRes] = await Promise.all([
            axios.get(`http://localhost:3010/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`http://localhost:3010/sessions/active/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            ]);

            setUser(userRes.data);
            setSession(sessionRes.data);
        
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
        };

        fetchData();
    }, []);


    const idPerson = JSON.parse(localStorage.getItem('user'))?.person?.idPerson;
    if (idPerson) {
    navigate(`/editar-perfil/${user.idUser}`);
    }
    if (!user || !session) return <div className={styles.loading}>Cargando...</div>;


    
    return (
        <div className={styles.container}>
        <h1 className={styles.title}>👋 Bienvenido/a, {user.username}</h1>
        <div className={styles.info}>
            <p><strong>Rol:</strong> {user.role}</p>
            <p><strong>Inicio de sesión:</strong> {" "}
            {new Date(session.entryDate).toLocaleString()}</p>
            {session.closingDate && (
            <p><strong>Último cierre de sesión:</strong> {new Date(session.closingDate).toLocaleString()}</p>
            )}
            <p><strong>Intentos fallidos:</strong> {user.failedAttempts || 0}</p>
        </div>

        <div className={styles.buttons}>
                {user.role === "Administrador" ? (
                    <button className={styles.button} onClick={() => navigate('/user-maintenance')}>
                        Mantenimiento de usuarios
                    </button>
                ) : (
                    
                    <button className={styles.button} onClick={() => {
                        
                if (user) {
                    
                navigate(`/editar-perfil/${user.idUser}`);
                } else {
                alert('No se pudo obtener el ID de la persona');
                }
            }}>
                        Editar mi perfil
                    </button>
                )}
            </div>
        </div>
        
    );
    
    }
