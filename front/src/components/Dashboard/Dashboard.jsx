import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

const Dashboard = () => {

    const [stats, setStats] = useState({
        activos: 0,
        inactivos: 0,
        bloqueados: 0,
        fallidos: 0,
    });

    useEffect(() => {
        const getDashboardStats = async () => {
            try {
                const token = localStorage.getItem('token');
            
                const res = await axios.get('http://localhost:3010/usuarios/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
                });
                
                setStats(res.data); 
                
            } catch (error) {
                console.error('Error al obtener las estadísticas:', error);
            }
            };
        
            getDashboardStats();
        }, []);
        
        return (
            <div className={styles.dashboardContainer}>
            <h1 className={styles.title}>Panel de Administración</h1>
            <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                <h2>Usuarios Activos</h2>
                <p className={styles.statValue}>{stats.activos}</p>
                </div>
                <div className={styles.statCard}>
                <h2>Usuarios Inactivos</h2>
                <p className={styles.statValue}>{stats.inactivos}</p>
                </div>
                <div className={styles.statCard}>
                <h2>Usuarios Bloqueados</h2>
                <p className={styles.statValue}>{stats.bloqueados}</p>
                </div>
                <div className={styles.statCard}>
                <h2>Inicios de Sesión Fallidos</h2>
                <p className={styles.statValue}>{stats.fallidos}</p>
                </div>
            </div>
            </div>
        );
        };
        
        export default Dashboard;
