    import React, { useState } from 'react';
    import styles from './Navbar.module.css';
    import { useSelector } from 'react-redux';
    import { Link, useLocation } from 'react-router-dom';
    import { useDispatch } from 'react-redux';
    import { clearSession } from '../../redux/sessionReducer';
    import { useNavigate } from 'react-router-dom';
    import axios from "axios";

    const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const menuItems = useSelector((state) => state.menu.items);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
    
        try {
            const token = localStorage.getItem('token');
    
            if (token) {
                await axios.post(
                    'http://localhost:3010/auth/logout',
                    {}, // el body va vacío
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
        } catch (error) {
            console.error("Error al cerrar sesión en el backend:", error);
        }
    
        // Limpiar Redux y localStorage
        dispatch(clearSession());
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('user');
    
        navigate('/login');
    };


    return (
        <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
            MiApp
        </Link>

        <button className={styles.menuToggle} onClick={toggleMenu}>
            ☰
        </button>

        <ul className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
    {menuItems.length === 0 ? (
        <li className={styles.menuItem}>Sin menús disponibles</li>
    ) : (
        <>
            {menuItems.map((item) => (
                <li key={item.label} className={styles.menuItem}>
                    <Link
                        to={item.path}
                        className={location.pathname === item.path ? styles.activeLink : ''}
                    >
                        {item.label}
                    </Link>
                </li>
            ))}

            <li className={styles.menuItem}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Cerrar sesión
                </button>
            </li>
        </>
    )}
    </ul>
        </nav>
    );
    };

    

export default Navbar;
