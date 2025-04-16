import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Login/Login.module.css'; 

const RecoverPassword = () => {
    const [input, setInput] = useState({ identifier: '', password: '' });
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInput({
        ...input,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.identifier || !input.password) {
        setMensaje('Todos los campos son obligatorios');
        return;
    }

    try {
        const response = await fetch('http://localhost:3010/auth/reset-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        });

        const data = await response.json();

        if (response.ok) {
        setMensaje('¡Contraseña actualizada con éxito!');
        } else {
        setMensaje(data.message || 'Error al actualizar contraseña');
        }
    } catch (error) {
        console.error('Error:', error);
        setMensaje('Ocurrió un error inesperado');
    }
    };

    const handleCancel = () => {
        navigate('/login');  // Redirige a la página de login
    };

    return (
    <div className={styles.loginContainer}>
        <h2 className={styles.title}>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
            className={styles.input}
            type="text"
            name="identifier"
            placeholder="Nombre de usuario o identificación"
            value={input.identifier}
            onChange={handleChange}
            />
            <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Nueva contraseña"
            value={input.password}
            onChange={handleChange}
            />
            <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit">Restablecer</button>
            <button className={styles.button} onClick={handleCancel}>Cancelar</button>
            </div>
        </form>
        
        {mensaje && <p className={styles.message}>{mensaje}</p>}
        </div>
    );
    };

    export default RecoverPassword;