import React, { useState } from 'react';
import styles from '../Login/Login.module.css'; 

const RecoverPassword = () => {
    const [input, setInput] = useState({ identifier: '', password: '' });
    const [mensaje, setMensaje] = useState('');

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
            <button className={styles.button} type="submit">Restablecer</button>
        </form>
        {mensaje && <p className={styles.message}>{mensaje}</p>}
        </div>
    );
    };

    export default RecoverPassword;