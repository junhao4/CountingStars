import { type FormEvent, useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
// import Register from './Register.tsx';
import { type Auth, type User, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

interface RegisterProps {
    auth: Auth;
    user: User | null;
    handleUserRegister: (user: User | null) => void;
}

function Register({auth, user, handleUserRegister}: RegisterProps) {
    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password).then(userCreds => handleUserRegister(userCreds.user));  
    }

    const handleLogout = () => {
        signOut(auth);
        handleUserRegister(null);
    }

    // onAuthStateChanged(auth, user => {
    //     console.log(1);
    // })

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        user
        ? <div><p>WELCOME, {user.email}</p><button onClick={handleLogout}>Log out</button></div>
        : <div className='register-container'>
            <form onSubmit={handleRegister} className='form-container'>
                <div className='form-field'>
                    <label htmlFor="email">Email:</label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
                </div>
                <div className='form-field'>
                <label htmlFor="password">Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='form-footer'>
                    <button type="submit">Register</button>
                </div>
            </form> 
        </div>
    );
}

export default Register;