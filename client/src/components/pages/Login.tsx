import { type FormEvent, useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
// import Register from './Register.tsx';
import { signInWithEmailAndPassword, type Auth, type User, signOut } from 'firebase/auth';

interface LoginProps {
    auth: Auth;
    user: User | null;
    handleUserLogin: (user: User | null) => void;
}

function Login({auth, user, handleUserLogin}: LoginProps) {
    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then(user => handleUserLogin(user.user));  
    }

    const handleLogout = () => {
        signOut(auth);
        handleUserLogin(null);
    }

    // onAuthStateChanged(auth, user => {
    //     console.log(1);
    // })

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        user
        ? <div><p>WELCOME, {user.email}</p><button onClick={handleLogout}>Log out</button></div>
        : <div className='login-container'>
            <form onSubmit={handleLogin} className='form-container'>
                <div className='form-field'>
                    <label htmlFor="email">Email:</label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
                </div>
                <div className='form-field'>
                <label htmlFor="password">Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='form-footer'>
                    <button type="submit">Login</button>
                </div>
            </form> 
        </div>
    );
}

export default Login;