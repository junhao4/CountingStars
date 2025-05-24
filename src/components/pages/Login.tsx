import { type FormEvent, use, useEffect, useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
// import Register from './Register.tsx';
import supabase from '../../helper/supabaseClient.ts';
import type { User } from '@supabase/auth-js';

interface LoginProps {
    setPageTitle: (arg0: string) => void;
}

function Login({ setPageTitle }: LoginProps) {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password
        });
        if (error) {
            setMessage(error.message);
            return;
        }
        if (data) {
            setAuthenticated(true);
        }
    }

    const handleLogout = () => {
        supabase.auth.signOut();
        setAuthenticated(false);
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setPageTitle("Login")
        supabase.auth.getSession().then(session => {setAuthenticated(!!session.data);setUser(session.data.session?.user || null);})
    }, []);

    return (
        authenticated
        ? <div><p>WELCOME, {user?.email}</p><button onClick={handleLogout}>Log out</button></div>
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