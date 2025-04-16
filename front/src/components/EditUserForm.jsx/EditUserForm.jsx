import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './EditUserForm.module.css'
import Swal from "sweetalert2";


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
            const userId = localStorage.getItem('id');

            const [personRes, userRes] = await Promise.all([
                axios.get(`http://localhost:3010/person/${idPerson}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:3010/usuarios/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                ]);

                
                const isAdmin = userRes.data.role === 'Administrador';

                if (userRes.data.person.idPerson !== parseInt(idPerson) && !isAdmin) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso denegado',
                        text: 'No tienes permiso para editar otros perfiles.',
                        confirmButtonText: 'Volver',
                        }).then(() => navigate('/'));
                        return;
                    }

            setPerson(personRes.data);
            setForm({
            names: personRes.data.names,
            surnames: personRes.data.surnames,
            identification: personRes.data.identification,
            dateBirth: personRes.data.dateBirth
            });
            
        } catch (error) {
            console.error('Error al cargar persona:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los datos.',
            });
        }
        };

        fetchPerson();
    }, [idPerson, navigate]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user')); 
        
        const isAdmin = user?.role?.[0]?.rol?.rolName === 'Administrador';

    

        const url = isAdmin
            ? `http://localhost:3010/person/admin/${idPerson}`
            : `http://localhost:3010/person/${idPerson}`;

        await axios.put(url, form, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
            Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado correctamente',
            confirmButtonText: 'Aceptar'
            }).then(() => {
                
                if (isAdmin) {
                    
                    navigate('/user-maintenance'); 
                } else {
                    navigate('/profile'); 
                } 
            });
            } catch (error) {
            console.error('Error al actualizar usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar usuario',
                text: error.response?.data?.message || 'Ocurrió un error inesperado'
            });
            }
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
