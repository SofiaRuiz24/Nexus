// src/Auth.js
import React, { useState } from 'react';
import {auth} from "../../firebaseConfig"
import { 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useGetUserByEmailQuery } from 'state/api';
import { searchUser } from 'lib/apiRequests';
import { useDispatch } from 'react-redux';
import { setUserId } from 'state';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      navigate("/register")
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      //REDIRIGIR A DASHBOARD
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      const data = await searchUser(userCredential.user.email);
      dispatch(setUserId(data.data._id))
      navigate("/dashboard")
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
        <h1>{'Inicia sesión'}</h1>
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
            <button className='buttonAuth' onClick={handleLogin}>Iniciar sesión</button>
            <button className="buttonRedirect" onClick={handleRegister}>Registrarse</button>
          </>
        ) : (
          <button onClick={handleLogout}>Cerrar sesión</button>
        )}
      </div>
    </div>
  );
};

export default Auth;
