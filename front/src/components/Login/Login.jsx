import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userReducer";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Login.module.css"


const Login = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleReset = () => {
        setInput({
            identifier: '',
            password: ''
        });
    };

    const onLogin = (userData) => {
        console.log("Datos enviados al backend:", userData);
        axios.post(`http://localhost:3010/auth/login`, userData)
        .then(resp => {
            console.log("Respuesta completa del backend:", resp.data);
            if (resp.data.access_token && resp.data.id)  {
                localStorage.setItem('token', resp.data.access_token);
                localStorage.setItem('id', resp.data.id); 
            
                dispatch(login({ login: true }));
                navigate('/welcome');
            } else {
                Swal.fire('Error', 'Credenciales incorrectas', 'error');
            }
        })
        .catch(() => {
            Swal.fire('Error', 'Error al registrar los datos', 'error');
            navigate("/login")
            
        });
    };

    const [input, setInput] = useState({
        identifier: '',
        password: ''
    });
    const handleChange = (e) => { 
        setInput({ 
            ...input, 
            [e.target.name]:e.target.value 
        })

    }

    const isButtonDisabled = input.identifier === '' || input.password === '';
    return(
        <div className={styles.fondo}>
        
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div>
        <input className={styles.input} type="text" name="identifier" id="identifier"
        placeholder="Usernam1 o example@mail.com" 
        onChange={handleChange} 
        value={input.identifier}/>
        </div> 
        <div>
        <input className={styles.input} type="password" name="password" id="password"
        placeholder="Contraseña" 
        onChange={handleChange} 
        value={input.password}/>
        </div>
        {isButtonDisabled && (
            <p className={styles.error}>Debes completar todos los campos</p>
        )}
        <div>
        
        <button type="button" className={styles.button} onClick={() => onLogin(input)} disabled={isButtonDisabled}>Ingresar</button>
        <button type="button" className={styles.button} onClick={handleReset}> Cancelar</button>
        <p className={styles.link}>
        ¿Olvidaste tu contraseña? <Link to="/recover">Recupérala aquí</Link>
        </p>
        </div>
        </form>
        </div>
    )
}

export default Login;