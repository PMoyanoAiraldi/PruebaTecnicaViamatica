import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuByUserId } from './redux/menuReducer.js';
import Navbar from './components/Navbar/Navbar';
import { Outlet, useNavigate} from 'react-router-dom';
import { startSession } from "./redux/sessionReducer.js";

const AppLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.session.activeSession.userId); 
    
    const menuItems = useSelector((state) => state.menu.items);
    console.log('MENÚ DESDE REDUX:', menuItems);

    useEffect(() => {
        const storedId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        if (token && !storedId) {
            
            navigate('/login');
        }
    
        if (!storedId && !userId) {
            navigate('/login');
        } else if (storedId && !userId) {
            // Si hay un ID en el localStorage pero no en Redux, iniciar la sesión
            dispatch(startSession({
                id: storedId,
                userId: storedId,
                entryDate: new Date().toISOString()
            }));
        }
    }, [dispatch, navigate, userId]);


    useEffect(() => {
        if (userId) {
            
            dispatch(fetchMenuByUserId(userId));
        }
    }, [userId, dispatch]);

    return (
        <>
            <Navbar />
            <main>
                {/* El Outlet renderiza las rutas hijas */}
                <Outlet />
            </main>
        </>
    );
};

export default AppLayout;
