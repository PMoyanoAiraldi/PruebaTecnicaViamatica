import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Login from './components/Login/Login'
import RecoverPassword from './components/RecoverPassword/RecoverPassword'
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import UserMaintenance from './components/UserMaintenance/UserMaintenance';
import EditUserForm from './components/EditUserForm.jsx/EditUserForm';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import AppLayout from './AppLayout';

function App() {
  
  return (
    <>
      <Routes> 
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/recover' element={<RecoverPassword/>}/>
      

      {/* Rutas protegidas, dentro del layout */}
      <Route element={<AppLayout />}>
      <Route path='/welcome' element={<WelcomeScreen/>}/>
      <Route path='/user-maintenance' element={<UserMaintenance/>}/>
      <Route path='/user-edit/:idPerson' element={<EditUserForm/>}/>
      <Route path='/editar-perfil/:idPerson' element={<EditUserForm/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/profile' element={<Profile/>}/>
</Route>
      </Routes>
    </>
  )
}

export default App
