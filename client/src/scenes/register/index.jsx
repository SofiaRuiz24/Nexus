// src/Auth.js
import React, { useState } from 'react';
import {auth} from "../../firebaseConfig"
import { 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
        //CREAR USUARIOS EN LA DB
        //Redirigir al dashboard
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('Usuario registrado con éxito');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
        navigate("/auth")
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
        //PONER FUNCION EN EL APPBAR
        //Redirigir a auth
      await signOut(auth);
      setUser(null);
      alert('Sesión cerrada');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div>
        <h1>{'Regístrate'}</h1>
        {!user ? (
          <>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button className="buttonAuth" onClick={handleRegister}>Registrarse</button>
            <button className='buttonRedirect' onClick={handleLogin}>Iniciar sesión</button>
          </>
        ) : (
          <button onClick={handleLogout}>Cerrar sesión</button>
        )}
      </div>
    </div>
  );
};

export default Register;
