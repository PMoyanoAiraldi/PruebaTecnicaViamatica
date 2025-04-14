import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Login from './components/Login/Login'
import RecoverPassword from './components/RecoverPassword/RecoverPassword'
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import UserMaintenance from './components/UserMaintenance/UserMaintenance';
import EditUserForm from './components/EditUserForm.jsx/EditUserForm';

function App() {
  
  return (
    <>
      <Routes> 
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/recover' element={<RecoverPassword/>}/>
      <Route path='/welcome' element={<WelcomeScreen/>}/>
      <Route path='/user-maintenance' element={<UserMaintenance/>}/>
      <Route path='/user-edit' element={<EditUserForm/>}/>

      </Routes>
    </>
  )
}

export default App
