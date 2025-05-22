import React, { type FormEvent, useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom'
import Register from './Login.tsx'
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
    const config = {
        apiKey: "AIzaSyDc_dZZhUYuOFtU-T98JxAhs2LTxB589lA",
        authDomain: "countingstars-37254.firebaseapp.com",
        projectId: "countingstars-37254",
        storageBucket: "countingstars-37254.firebasestorage.app",
        messagingSenderId: "214635906057",
        appId: "1:214635906057:web:6e69b1045875477b85a4d8"
    }

    const app = initializeApp(config);
    const auth = getAuth(app);
    
    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Do something to login...?
        // signInWithEmailAndPassword(e.)
        console.log(username);
        console.log(password);
    }

    onAuthStateChanged(auth, user => {
        console.log(user);
    })

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className='login-container'>
            <form onSubmit={handleLogin} className='form-container'>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} /><br />
                </div>
                <div>
                <label htmlFor="password">Password:</label>
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='form-footer'>
                    <button type="submit">Login</button>
                    <Link to="/">Register</Link>
                </div>
            </form> 
        </div>
    );
}

export default Login;