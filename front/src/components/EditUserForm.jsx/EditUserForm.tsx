import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './EditUserForm.module.css'


const EditUserForm = () => {
    const { idPerson } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [form, setForm] = useState({
        names: '',
        surnames: '',
        identification: '',
        dateBirth: '',
        
    });

    useEffect(() => {
        const fetchPerson = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3010/person/${idPerson}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setPerson(res.data);
            setForm({
            names: res.data.names,
            surnames: res.data.surnames,
            identification: res.data.identification,
            dateBirth: res.data.dateBirth
            });
        } catch (error) {
            console.error('Error al cargar persona:', error);
        }
        };

        fetchPerson();
    }, [idPerson]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3010/usuarios/admin/${idPerson}`, form, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        alert('Usuario actualizado correctamente');
        navigate('/user-maintenance'); 
        } catch (error) {
        console.error('Error al actualizar persona:', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (!person) return <div>Cargando datos...</div>;

    return (
            <div className={styles.container}>
            <h2 className={styles.title}>Editar usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                <label className={styles.label}>Nombre</label>
                <input name="names" value={form.names} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                <label className={styles.label}>Apellido</label>
                <input name="surnames" value={form.surnames} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                <label className={styles.label}>Identificación</label>
                <input name="identification" value={form.identification} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                <label className={styles.label}>Fecha de nacimiento</label>
                <input name="dateBirth" value={form.dateBirth} onChange={handleChange} className={styles.input} />
                </div>
                <button type="submit" className={styles.button}>Guardar cambios</button>
            </form>
            </div>
        );
    };

    export default EditUserForm;
