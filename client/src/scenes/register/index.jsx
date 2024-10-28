import React, { useState } from 'react';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { postCustomer } from 'lib/apiRequests';
import { useDispatch } from 'react-redux';
import { searchUser } from 'lib/apiRequests';
import { setUserId } from 'state';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [occupation, setOccupation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        const user = {
            email,
            password,
            state: "",
            name,
            city,
            country,
            occupation,
            phoneNumber,
            role: 'admin',
        }
        await postCustomer(user);
        const data = await searchUser(userCredential.user.email);
        dispatch(setUserId(data.data._id));
        navigate('/dashboard');
    } catch (error) {
        alert(error.message);
    }
  };

  const handleLogin = () => navigate('/auth');
  const handleLogout = async () => {
    try {
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
        <h1>Regístrate</h1>
        {!user ? (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <input
              type="text"
              placeholder="Ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="País"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              type="text"
              placeholder="Ocupación"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Número de teléfono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button className='buttonAuth' onClick={handleRegister}>Registrarse</button>
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
